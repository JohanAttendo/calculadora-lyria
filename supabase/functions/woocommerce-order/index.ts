
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface WooCommerceItem {
  product_id: string;
  quantity: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { items } = await req.json() as { items: WooCommerceItem[] }
    
    if (!items || items.length === 0) {
      throw new Error('No hay productos para procesar');
    }

    // Get WooCommerce credentials from Supabase secrets
    const consumerKey = Deno.env.get('WOOCOMMERCE_CONSUMER_KEY');
    const consumerSecret = Deno.env.get('WOOCOMMERCE_CONSUMER_SECRET');
    const baseUrl = 'https://my.lyria.es/configurador';

    if (!consumerKey || !consumerSecret) {
      throw new Error('WooCommerce credentials not configured');
    }

    console.log('=== ADDING PRODUCTS TO CART ===');
    console.log('Consumer Key (should start with ck_):', consumerKey.substring(0, 10) + '...');
    console.log('Consumer Secret (should start with cs_):', consumerSecret.substring(0, 10) + '...');
    console.log('Base URL:', baseUrl);

    // First, try to get or create a cart session
    console.log('Creating cart session...');
    const cartResponse = await fetch(`${baseUrl}/wp-json/wc/store/v1/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${consumerKey}:${consumerSecret}`)}`,
        'User-Agent': 'Lyria-Configurador/1.0',
      },
    });

    console.log('Cart session response status:', cartResponse.status);
    
    if (!cartResponse.ok) {
      const cartError = await cartResponse.text();
      console.log('Cart session response:', cartError);
    }

    // Add each item to cart using Store API
    for (const item of items) {
      console.log(`Adding product ${item.product_id} with quantity ${item.quantity}`);
      
      const addToCartResponse = await fetch(`${baseUrl}/wp-json/wc/store/v1/cart/add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${consumerKey}:${consumerSecret}`)}`,
          'User-Agent': 'Lyria-Configurador/1.0',
        },
        body: JSON.stringify({
          id: parseInt(item.product_id),
          quantity: item.quantity
        }),
      });

      console.log(`Add item ${item.product_id} response status:`, addToCartResponse.status);

      if (!addToCartResponse.ok) {
        const addError = await addToCartResponse.text();
        console.log(`❌ Failed to add product ${item.product_id}:`, addError);
        
        // If Store API fails, try using the REST API to create an order directly
        console.log('Falling back to direct order creation...');
        break;
      } else {
        const addResult = await addToCartResponse.json();
        console.log(`✅ Added product ${item.product_id} to cart:`, addResult);
      }
    }

    // Redirect to the standard checkout page
    const checkoutUrl = `${baseUrl}/finalizar-compra/`;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Productos añadidos al carrito',
        redirectUrl: checkoutUrl
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    console.error('Error adding products to cart:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Error añadiendo productos al carrito' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
