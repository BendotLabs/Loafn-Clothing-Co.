import Stripe from "https://esm.sh/stripe@17.7.0?target=denonext";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

// Service-role client used only to look up the logged-in user's email server-side.
// Never trust an email passed from the client for an authenticated session.
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { items, successUrl, cancelUrl, userId } = await req.json();

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Cart is empty." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `${item.color} / ${item.size}`,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Compact cart snapshot so the webhook can rebuild order_items without
    // a second database round trip. Metadata values are capped at 500
    // characters each — fine for a handful of items, but a very large
    // cart could exceed it. Revisit if that becomes a real constraint.
    const itemsSnapshot = items.map((i: any) => ({
      slug: i.slug,
      name: i.name,
      image: i.image,
      color: i.color,
      size: i.size,
      price: i.price,
      quantity: i.quantity,
    }));

    // Logged-in users get their email locked to their account (looked up
    // server-side, never trusted from the client). Guests get an editable
    // email field on the Stripe Checkout page — customer_email is simply
    // omitted, so Stripe collects it themselves.
    let customerEmail: string | undefined;
    if (userId) {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (error) {
        console.error("Failed to look up user for checkout email lock:", error);
      } else {
        customerEmail = data.user?.email;
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 800, currency: "usd" },
            display_name: "Standard Shipping",
          },
        },
      ],
      client_reference_id: userId || undefined, // links session to a logged-in user, omitted for guests
      customer_email: customerEmail, // locked for logged-in users, editable for guests
      metadata: {
        items: JSON.stringify(itemsSnapshot),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});