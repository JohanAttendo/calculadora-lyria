import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-STRIPE-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Helper function to create or get Stripe product and price
const createOrGetStripeProduct = async (stripe: Stripe, productData: any, supabaseClient: any) => {
  logStep("Creating or getting Stripe product", { name: productData.name, woocommerce_id: productData.woocommerce_id });

  try {
    // First try to retrieve the existing product
    if (productData.stripe_product_id) {
      try {
        const existingProduct = await stripe.products.retrieve(productData.stripe_product_id);
        logStep("Found existing Stripe product", { productId: existingProduct.id });
        
        // Try to retrieve the existing price
        if (productData.stripe_price_id) {
          try {
            const existingPrice = await stripe.prices.retrieve(productData.stripe_price_id);
            logStep("Found existing Stripe price", { priceId: existingPrice.id });
            return { productId: existingProduct.id, priceId: existingPrice.id };
          } catch (priceError) {
            logStep("Existing price not found, will create new one", { priceId: productData.stripe_price_id });
          }
        }
        
        // Create new price for existing product
        const newPrice = await stripe.prices.create({
          product: existingProduct.id,
          unit_amount: Math.round(productData.price * 100), // Convert to cents
          currency: 'eur',
          recurring: productData.period === 'month' ? { interval: 'month' } : { interval: 'year' },
          metadata: {
            woocommerce_id: productData.woocommerce_id || '',
            category: productData.category || '',
          },
        });
        
        logStep("Created new price for existing product", { priceId: newPrice.id });

        // Update database with new price ID
        await supabaseClient
          .from("products")
          .update({ 
            stripe_price_id: newPrice.id,
            updated_at: new Date().toISOString()
          })
          .eq("id", productData.id);

        logStep("Updated database with new price ID", { productId: productData.id, priceId: newPrice.id });
        
        return { productId: existingProduct.id, priceId: newPrice.id };
        
      } catch (productError) {
        logStep("Existing product not found, will create new one", { productId: productData.stripe_product_id });
      }
    }

    // Create new product
    const newProduct = await stripe.products.create({
      name: productData.name,
      description: productData.description || productData.name,
      metadata: {
        woocommerce_id: productData.woocommerce_id || '',
        category: productData.category || '',
        sku: productData.sku || '',
      },
    });

    logStep("Created new Stripe product", { productId: newProduct.id, name: newProduct.name });

    // Create new price for the new product
    const newPrice = await stripe.prices.create({
      product: newProduct.id,
      unit_amount: Math.round(productData.price * 100), // Convert to cents
      currency: 'eur',
      recurring: productData.period === 'month' ? { interval: 'month' } : { interval: 'year' },
      metadata: {
        woocommerce_id: productData.woocommerce_id || '',
        category: productData.category || '',
      },
    });

    logStep("Created new Stripe price", { priceId: newPrice.id, amount: newPrice.unit_amount });

    // Update database with both new product and price IDs
    await supabaseClient
      .from("products")
      .update({ 
        stripe_product_id: newProduct.id,
        stripe_price_id: newPrice.id,
        updated_at: new Date().toISOString()
      })
      .eq("id", productData.id);

    logStep("Updated database with new product and price IDs", { 
      productDataId: productData.id, 
      stripeProductId: newProduct.id, 
      stripePriceId: newPrice.id 
    });

    return { productId: newProduct.id, priceId: newPrice.id };

  } catch (error) {
    logStep("ERROR creating Stripe product/price", { error: error.message, productData });
    throw new Error(`Failed to create product "${productData.name}": ${error.message}`);
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    // Force test mode if test key exists
    const testKey = Deno.env.get("STRIPE_TEST_SECRET_KEY");
    const prodKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    let stripeKey: string;
    let isTestMode: boolean;
    
    // ALWAYS use test mode if test key is available
    if (testKey) {
      stripeKey = testKey;
      isTestMode = true;
      logStep("FORCED TEST MODE - Using Stripe TEST key", { keyPrefix: testKey.substring(0, 12) + "..." });
    } else if (prodKey) {
      stripeKey = prodKey;
      isTestMode = false;
      logStep("Using Stripe PRODUCTION mode", { keyPrefix: prodKey.substring(0, 12) + "..." });
    } else {
      throw new Error("Neither STRIPE_TEST_SECRET_KEY nor STRIPE_SECRET_KEY is set");
    }

    const requestBody = await req.json();
    logStep("Received request", requestBody);

    const { customerData, config, planType, totalAmount } = requestBody;

    // Validate customerData is a valid object
    if (!customerData || typeof customerData !== 'object') {
      throw new Error("customerData must be a valid object with customer information");
    }

    if (!customerData.email) {
      throw new Error("customerData must include an email address");
    }

    logStep("Validated customer data", { email: customerData.email, planType, testMode: isTestMode });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Create or update customer in Supabase
    const { data: existingCustomer, error: selectError } = await supabaseClient
      .from("customers")
      .select("*")
      .eq("email", customerData.email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      logStep("Error checking existing customer", { error: selectError });
      throw new Error(`Database error: ${selectError.message}`);
    }

    let customerId;
    if (existingCustomer) {
      // Update existing customer
      const { data: updatedCustomer, error: updateError } = await supabaseClient
        .from("customers")
        .update({ ...customerData, updated_at: new Date().toISOString() })
        .eq("id", existingCustomer.id)
        .select()
        .single();
      
      if (updateError) {
        logStep("Error updating customer", { error: updateError });
        throw new Error(`Failed to update customer: ${updateError.message}`);
      }
      
      customerId = updatedCustomer.id;
      logStep("Updated existing customer", { customerId });
    } else {
      // Create new customer
      const { data: newCustomer, error: insertError } = await supabaseClient
        .from("customers")
        .insert(customerData)
        .select()
        .single();
      
      if (insertError) {
        logStep("Error creating customer", { error: insertError });
        throw new Error(`Failed to create customer: ${insertError.message}`);
      }
      
      customerId = newCustomer.id;
      logStep("Created new customer", { customerId });
    }

    // Create or get Stripe customer
    const customers = await stripe.customers.list({ email: customerData.email, limit: 1 });
    let stripeCustomerId;
    
    if (customers.data.length > 0) {
      stripeCustomerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { stripeCustomerId });
    } else {
      const stripeCustomer = await stripe.customers.create({
        email: customerData.email,
        name: customerData.company_legal_name || `${customerData.first_name} ${customerData.last_name}`,
        address: {
          line1: customerData.address_line_1,
          line2: customerData.address_line_2 || undefined,
          city: customerData.city,
          state: customerData.state,
          postal_code: customerData.postal_code,
          country: customerData.country,
        },
        phone: customerData.company_phone || customerData.phone || undefined,
        metadata: {
          cif: customerData.cif || undefined,
          company_commercial_name: customerData.company_commercial_name || undefined,
          contact_person: `${customerData.first_name} ${customerData.last_name}`,
          contact_mobile: customerData.mobile || undefined,
          test_mode: isTestMode.toString(),
        },
      });
      stripeCustomerId = stripeCustomer.id;
      logStep("Created new Stripe customer", { stripeCustomerId });

      // Update customer with Stripe ID
      await supabaseClient
        .from("customers")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", customerId);
    }

    // Fetch all products from Supabase
    const { data: products, error: productsError } = await supabaseClient
      .from("products")
      .select("*")
      .eq("active", true);

    if (productsError) {
      logStep("Error fetching products", { error: productsError });
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    if (!products || products.length === 0) {
      throw new Error("No products found in database");
    }

    logStep("Fetched products from database", { productsCount: products.length });

    // Build line items array using real price IDs or creating them
    const lineItems = [];

    // VoIP Products
    if (config.voip && config.voip.enabled) {
      // Extensions
      if (config.voip.extensions > 0) {
        const skuId = planType === 'monthly' ? '165' : '179';
        const productData = products.find(p => p.woocommerce_id === skuId);
        if (productData) {
          try {
            const { priceId } = await createOrGetStripeProduct(stripe, productData, supabaseClient);
            lineItems.push({
              price: priceId,
              quantity: config.voip.extensions,
            });
            logStep("Added VoIP extensions", { 
              skuId, 
              quantity: config.voip.extensions, 
              priceId, 
              planType 
            });
          } catch (error) {
            logStep("ERROR: Failed to create VoIP extensions product", { skuId, error: error.message });
            throw new Error(`Error configurando extensiones VoIP: ${error.message}`);
          }
        } else {
          logStep("WARNING: Product not found for VoIP extensions", { skuId });
          throw new Error(`El producto con SKU ${skuId} no está en la base de datos.`);
        }
      }

      // Free regional number (always add one if regional numbers > 0)
      if (config.voip.regionalNumbers > 0) {
        const skuId = planType === 'monthly' ? '635' : '636';
        const productData = products.find(p => p.woocommerce_id === skuId);
        if (productData) {
          try {
            const { priceId } = await createOrGetStripeProduct(stripe, productData, supabaseClient);
            lineItems.push({
              price: priceId,
              quantity: 1,
            });
            logStep("Added free regional number", { 
              skuId, 
              quantity: 1, 
              priceId, 
              planType 
            });
          } catch (error) {
            logStep("ERROR: Failed to create free regional number product", { skuId, error: error.message });
            throw new Error(`Error configurando número regional gratuito: ${error.message}`);
          }
        } else {
          logStep("WARNING: Product not found for free regional number", { skuId });
          throw new Error(`El producto con SKU ${skuId} no está en la base de datos.`);
        }
      }

      // Regional numbers (first one is free, additional ones are charged)
      if (config.voip.regionalNumbers > 1) {
        const additionalNumbers = config.voip.regionalNumbers - 1;
        const skuId = planType === 'monthly' ? '164' : '178';
        const productData = products.find(p => p.woocommerce_id === skuId);
        if (productData) {
          try {
            const { priceId } = await createOrGetStripeProduct(stripe, productData, supabaseClient);
            lineItems.push({
              price: priceId,
              quantity: additionalNumbers,
            });
            logStep("Added additional regional numbers", { 
              skuId, 
              quantity: additionalNumbers, 
              priceId, 
              planType 
            });
          } catch (error) {
            logStep("ERROR: Failed to create additional regional numbers product", { skuId, error: error.message });
            throw new Error(`Error configurando números regionales adicionales: ${error.message}`);
          }
        } else {
          logStep("WARNING: Product not found for additional regional numbers", { skuId });
          throw new Error(`El producto con SKU ${skuId} no está en la base de datos.`);
        }
      }
    }

    // Call Bonuses
    if (config.callBonuses && config.callBonuses.enabled) {
      const bonusMapping = {
        combo1500: { monthly: '1209', annual: '1208' },
        combo2000: { monthly: '173', annual: '187' },
        combo10000: { monthly: '174', annual: '188' },
        combo20000: { monthly: '175', annual: '189' },
        landline1000: { monthly: '167', annual: '181' },
        landline5000: { monthly: '168', annual: '182' },
        landline10000: { monthly: '169', annual: '183' },
        mobile1000: { monthly: '170', annual: '184' },
        mobile5000: { monthly: '171', annual: '185' },
        mobile10000: { monthly: '172', annual: '186' },
        internationalZonaA: { monthly: '176', annual: '190' },
        internationalHispano: { monthly: '177', annual: '191' }
      };

      for (const [key, quantity] of Object.entries(config.callBonuses)) {
        if (key !== 'enabled' && typeof quantity === 'number' && quantity > 0) {
          const skuMapping = bonusMapping[key as keyof typeof bonusMapping];
          if (skuMapping) {
            const skuId = skuMapping[planType as 'monthly' | 'annual'];
            const productData = products.find(p => p.woocommerce_id === skuId);
            if (productData) {
              try {
                const { priceId } = await createOrGetStripeProduct(stripe, productData, supabaseClient);
                lineItems.push({
                  price: priceId,
                  quantity,
                });
                logStep("Added call bonus", { 
                  type: key, 
                  skuId, 
                  quantity, 
                  priceId, 
                  planType 
                });
              } catch (error) {
                logStep("ERROR: Failed to create call bonus product", { type: key, skuId, error: error.message });
                throw new Error(`Error configurando bono de llamadas ${key}: ${error.message}`);
              }
            } else {
              logStep("WARNING: Product not found for call bonus", { type: key, skuId });
              throw new Error(`El producto ${key} con SKU ${skuId} no está en la base de datos.`);
            }
          }
        }
      }
    }

    // Mobile Lines
    if (config.mobileLines && config.mobileLines.enabled) {
      const mobileMapping = {
        standard10GB: { monthly: '1211', annual: '1210' },
        standard70GB: { monthly: '1213', annual: '1211' },
        lyriaON5GB: { monthly: '1215', annual: '1214' },
        lyriaON150GB: { monthly: '1217', annual: '1216' },
        lyriaON200GB: { monthly: '1219', annual: '1218' },
        lyriaONHeader: { monthly: '1221', annual: '1220' }
      };

      for (const [key, quantity] of Object.entries(config.mobileLines)) {
        if (key !== 'enabled' && typeof quantity === 'number' && quantity > 0) {
          const skuMapping = mobileMapping[key as keyof typeof mobileMapping];
          if (skuMapping) {
            const skuId = skuMapping[planType as 'monthly' | 'annual'];
            const productData = products.find(p => p.woocommerce_id === skuId);
            if (productData) {
              try {
                const { priceId } = await createOrGetStripeProduct(stripe, productData, supabaseClient);
                lineItems.push({
                  price: priceId,
                  quantity,
                });
                logStep("Added mobile line", { 
                  type: key, 
                  skuId, 
                  quantity, 
                  priceId, 
                  planType 
                });
              } catch (error) {
                logStep("ERROR: Failed to create mobile line product", { type: key, skuId, error: error.message });
                throw new Error(`Error configurando línea móvil ${key}: ${error.message}`);
              }
            } else {
              logStep("WARNING: Product not found for mobile line", { type: key, skuId });
              throw new Error(`El producto ${key} con SKU ${skuId} no está en la base de datos.`);
            }
          }
        }
      }
    }

    // Fiber Services
    if (config.fiber && config.fiber.enabled) {
      const fiberMapping = {
        fiber300MB: { monthly: '1223', annual: '1222' },
        fiber600MB: { monthly: '1225', annual: '1224' },
        fiber1GB: { monthly: '1227', annual: '1226' },
        backup4G: { monthly: '1229', annual: '1228' },
        vpn: { monthly: '1231', annual: '1230' }
      };

      for (const [key, quantity] of Object.entries(config.fiber)) {
        if (key !== 'enabled' && typeof quantity === 'number' && quantity > 0) {
          const skuMapping = fiberMapping[key as keyof typeof fiberMapping];
          if (skuMapping) {
            const skuId = skuMapping[planType as 'monthly' | 'annual'];
            const productData = products.find(p => p.woocommerce_id === skuId);
            if (productData) {
              try {
                const { priceId } = await createOrGetStripeProduct(stripe, productData, supabaseClient);
                lineItems.push({
                  price: priceId,
                  quantity,
                });
                logStep("Added fiber product", { 
                  type: key, 
                  skuId, 
                  quantity, 
                  priceId, 
                  planType 
                });
              } catch (error) {
                logStep("ERROR: Failed to create fiber product", { type: key, skuId, error: error.message });
                throw new Error(`Error configurando producto de fibra ${key}: ${error.message}`);
              }
            } else {
              logStep("WARNING: Product not found for fiber product", { type: key, skuId });
              throw new Error(`El producto ${key} con SKU ${skuId} no está en la base de datos.`);
            }
          }
        }
      }
    }

    // CHECK FOR STRIPE'S 20 LINE ITEM LIMIT
    if (lineItems.length > 20) {
      logStep("ERROR: Too many line items", { lineItemsCount: lineItems.length, limit: 20 });
      throw new Error(`Tu configuración incluye ${lineItems.length} productos individuales, pero Stripe solo permite un máximo de 20 productos por pedido. Por favor, reduce la cantidad de productos o divide tu compra en dos pedidos separados.`);
    }

    if (lineItems.length === 0) {
      throw new Error("No se encontraron productos válidos para crear la suscripción");
    }

    logStep("Creating Stripe checkout session", { 
      lineItemsCount: lineItems.length, 
      testMode: isTestMode,
      planType,
      expectedTotalFromFrontend: totalAmount
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${req.headers.get("origin") || Deno.env.get("VITE_BASE_URL")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin") || Deno.env.get("VITE_BASE_URL")}/`,
      subscription_data: {
        metadata: {
          customer_id: customerId,
          plan_type: planType,
          test_mode: isTestMode.toString(),
        },
      },
      metadata: {
        customer_id: customerId,
        plan_type: planType,
        test_mode: isTestMode.toString(),
      },
    });

    logStep("Stripe checkout session created successfully", { 
      sessionId: session.id, 
      url: session.url 
    });

    // Create order record for tracking - FIXED: using only valid status values
    const { data: newOrder, error: orderError } = await supabaseClient.from("orders").insert({
      customer_id: customerId,
      config: config,
      plan_type: planType,
      total_amount: totalAmount,
      status: 'pending', // FIXED: Changed from 'pending_payment' to 'pending'
      stripe_checkout_session_id: session.id,
    }).select().single();

    if (orderError || !newOrder) {
      logStep("Error creating order", { error: orderError });
      throw new Error(`Failed to create order record: ${orderError?.message}`);
    }

    logStep("Created order record", { orderId: newOrder.id });

    return new Response(JSON.stringify({ url: session.url, testMode: isTestMode }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
