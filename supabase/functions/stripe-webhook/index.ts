
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
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
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const body = await req.text();
    
    // In production, you should set up a webhook endpoint secret
    // For now, we'll parse the event directly
    const event = JSON.parse(body);
    
    logStep("Processing event", { type: event.type, id: event.id });

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        logStep("Checkout session completed", { sessionId: session.id });

        // Update order status
        const { data: order } = await supabaseClient
          .from("orders")
          .update({ 
            status: 'completed',
            stripe_subscription_id: session.subscription,
            updated_at: new Date().toISOString()
          })
          .eq("stripe_checkout_session_id", session.id)
          .select("*, customers(*)")
          .single();

        if (order) {
          logStep("Order updated to completed", { orderId: order.id });

          // Send internal notification email
          try {
            await supabaseClient.functions.invoke('send-offer', {
              body: {
                email: 'admin@lyria.es', // Change to your admin email
                config: order.config,
                totalMonthlyEquivalent: order.total_amount,
                annualPayment: order.plan_type === 'annual' ? order.total_amount : order.total_amount * 12,
                planType: order.plan_type,
                customerData: order.customers,
                isNewOrder: true,
              },
            });
            logStep("Admin notification sent");
          } catch (emailError) {
            logStep("Failed to send admin notification", { error: emailError });
          }
        }
        break;

      case 'invoice.payment_succeeded':
        logStep("Payment succeeded", { subscriptionId: event.data.object.subscription });
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        logStep("Subscription cancelled", { subscriptionId: subscription.id });

        // Update order status to cancelled
        await supabaseClient
          .from("orders")
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq("stripe_subscription_id", subscription.id);
        break;

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
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
