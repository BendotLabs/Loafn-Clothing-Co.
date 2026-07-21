// supabase/functions/calculate-shipping-rates/index.ts
import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Used whenever EasyPost isn't available yet (no key configured, account
// not fully set up, or the API call fails for any reason). Keeps checkout
// functional throughout Phase 13 development instead of hard-depending on
// EasyPost being live. Matches the flat rate already in
// create-checkout-session/index.ts today.
const FALLBACK_RATE = {
  carrier: "Standard",
  service: "Standard Shipping",
  rate: 8.0,
  estimated_days: null,
  fallback: true,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { destination } = await req.json();

    if (!destination?.street1 || !destination?.city || !destination?.state || !destination?.zip) {
      return new Response(JSON.stringify({ error: "Incomplete destination address." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("EASYPOST_API_KEY");
    if (!apiKey) {
      console.warn("EASYPOST_API_KEY not set — returning fallback rate.");
      return new Response(JSON.stringify({ rates: [FALLBACK_RATE], usedFallback: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: origin, error: originError } = await supabaseAdmin
      .from("shipping_origin")
      .select("*")
      .eq("id", 1)
      .single();

    if (originError || !origin) {
      console.error("No shipping origin configured:", originError);
      return new Response(JSON.stringify({ rates: [FALLBACK_RATE], usedFallback: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Real EasyPost call. Wrapped in try/catch so any failure here —
    // wallet not set up, network issue, malformed address — degrades to
    // the fallback rate rather than blocking checkout entirely.
    try {
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
              name: destination.name || "Customer",
              street1: destination.street1,
              street2: destination.street2 || undefined,
              city: destination.city,
              state: destination.state,
              zip: destination.zip,
              country: destination.country || "US",
            },
            // Placeholder parcel dimensions — a typical clothing package.
            // Revisit once real product weights/sizes are known; for now
            // this is representative enough to get realistic rate ranges.
            parcel: {
              length: 12,
              width: 9,
              height: 3,
              weight: 16, // ounces
            },
          },
        }),
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error("EasyPost API error:", response.status, errBody);
        return new Response(JSON.stringify({ rates: [FALLBACK_RATE], usedFallback: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const shipment = await response.json();
      const rates = (shipment.rates || [])
        .map((r: any) => ({
          carrier: r.carrier,
          service: r.service,
          rate: parseFloat(r.rate),
          estimated_days: r.delivery_days,
          easypost_shipment_id: shipment.id,
          easypost_rate_id: r.id,
          fallback: false,
        }))
        .sort((a: any, b: any) => a.rate - b.rate);

      if (rates.length === 0) {
        console.warn("EasyPost returned zero rates — using fallback.");
        return new Response(JSON.stringify({ rates: [FALLBACK_RATE], usedFallback: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ rates, usedFallback: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("EasyPost call threw:", err);
      return new Response(JSON.stringify({ rates: [FALLBACK_RATE], usedFallback: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});