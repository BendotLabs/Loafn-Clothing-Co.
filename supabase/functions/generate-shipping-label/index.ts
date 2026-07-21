// supabase/functions/generate-shipping-label/index.ts
import { createClient } from "npm:@supabase/supabase-js@2";

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
    const { orderId } = await req.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("EASYPOST_API_KEY");
    if (!apiKey) {
      // Unlike shipping-rate quotes, there's no safe placeholder for a real
      // label/tracking number — a fake one would actively mislead a
      // customer. Refuse clearly instead of faking success.
      return new Response(
        JSON.stringify({ error: "Label generation isn't available yet — EasyPost isn't connected." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: origin, error: originError } = await supabaseAdmin
      .from("shipping_origin")
      .select("*")
      .eq("id", 1)
      .single();

    if (originError || !origin) {
      return new Response(JSON.stringify({ error: "No shipping origin configured." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const addr = order.shipping_address || {};

    const response = await fetch("https://api.easypost.com/v2/shipments", {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${apiKey}:`),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shipment: {
          from_address: {
            name: origin.name,
            street1: origin.street1,
            street2: origin.street2 || undefined,
            city: origin.city,
            state: origin.state,
            zip: origin.zip,
            country: origin.country,
            phone: origin.phone || undefined,
          },
          to_address: {
            name: order.customer_email,
            street1: addr.line1,
            street2: addr.line2 || undefined,
            city: addr.city,
            state: addr.state,
            zip: addr.postal_code,
            country: addr.country || "US",
          },
          parcel: { length: 12, width: 9, height: 3, weight: 16 },
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("EasyPost shipment creation failed:", response.status, errBody);
      return new Response(JSON.stringify({ error: "Failed to create shipment with carrier." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const shipment = await response.json();
    const cheapestRate = (shipment.rates || []).sort(
      (a: any, b: any) => parseFloat(a.rate) - parseFloat(b.rate)
    )[0];

    if (!cheapestRate) {
      return new Response(JSON.stringify({ error: "No rates available to purchase a label." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Buying the label is what actually deducts from your EasyPost wallet
    // balance — everything before this point (rate quotes, shipment
    // creation) is free.
    const buyResponse = await fetch(
      `https://api.easypost.com/v2/shipments/${shipment.id}/buy`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${apiKey}:`),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rate: { id: cheapestRate.id } }),
      }
    );

    if (!buyResponse.ok) {
      const errBody = await buyResponse.text();
      console.error("EasyPost label purchase failed:", buyResponse.status, errBody);
      return new Response(JSON.stringify({ error: "Failed to purchase label." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const purchased = await buyResponse.json();

    const { error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        tracking_number: purchased.tracking_code,
        tracking_carrier: purchased.selected_rate?.carrier,
        label_url: purchased.postage_label?.label_url,
        shipping_status: "label_created",
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Failed to save label info to order:", updateError);
    }

    return new Response(
      JSON.stringify({
        trackingNumber: purchased.tracking_code,
        carrier: purchased.selected_rate?.carrier,
        labelUrl: purchased.postage_label?.label_url,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});