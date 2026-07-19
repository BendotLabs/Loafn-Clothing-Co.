import Stripe from "https://esm.sh/stripe@17.7.0?target=denonext";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

// Service-role client: bypasses RLS, so this must NEVER be exposed to the client.
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret);
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${err.message}`, {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: session.client_reference_id || null,
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total / 100,
        currency: session.currency,
        status: "completed",
        shipping_address: session.customer_details?.address || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Failed to insert order:", orderError);
      return new Response(JSON.stringify({ error: orderError.message }), { status: 500 });
    }

    const items = JSON.parse(session.metadata?.items || "[]");
    let orderItems: any[] = [];
    if (items.length > 0) {
      orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_slug: item.slug,
        name: item.name,
        image: item.image,
        color: item.color,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems);
      if (itemsError) console.error("Failed to insert order items:", itemsError);
    }

    // Fire the order confirmation email. Wrapped so a Resend/email failure
    // never causes this webhook to return non-200 to Stripe — a non-200
    // triggers a Stripe retry, which would attempt to insert this order again.
    try {
      const { error: emailError } = await supabaseAdmin.functions.invoke(
        "send-order-confirmation",
        {
          body: {
            to: session.customer_details?.email,
            orderId: order.id,
            customerName: session.customer_details?.name || "there",
            items: orderItems.map((item) => ({
              name: item.name,
              qty: item.quantity,
              price: item.price,
            })),
            total: order.amount_total,
          },
        }
      );
      if (emailError) console.error("Failed to send order confirmation email:", emailError);
    } catch (err) {
      console.error("Order confirmation email threw:", err);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});