import Stripe from "https://esm.sh/stripe@17.7.0?target=denonext";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

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
    const { items, successUrl, cancelUrl, userId, shippingRate } = await req.json();

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

    const itemsSnapshot = items.map((i: any) => ({
      slug: i.slug,
      name: i.name,
      image: i.image,
      color: i.color,
      size: i.size,
      price: i.price,
      quantity: i.quantity,
    }));

    let customerEmail: string | undefined;
    if (userId) {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (error) {
        console.error("Failed to look up user for checkout email lock:", error);
      } else {
        customerEmail = data.user?.email;
      }
    }

    // Falls back to the original flat $8 if this session was somehow
    // created without going through the rate-quote step (e.g. an older
    // client, or a direct API call) — keeps this function safe on its own.
    const shippingLabel = shippingRate?.service
      ? `${shippingRate.carrier} ${shippingRate.service}`
      : "Standard Shipping";
    const shippingAmount = Math.round((shippingRate?.rate ?? 8) * 100);

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
            fixed_amount: { amount: shippingAmount, currency: "usd" },
            display_name: shippingLabel,
          },
        },
      ],
      client_reference_id: userId || undefined,
      customer_email: customerEmail,
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