// supabase/functions/send-order-confirmation/index.ts
// Sends a branded order confirmation email via Resend.
// Deploy: supabase functions deploy send-order-confirmation

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = "orders@yourdomain.com"; // update once your domain is verified

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationPayload {
  to: string;
  orderId: string;
  customerName: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
}

function renderOrderEmail(payload: OrderConfirmationPayload): string {
  const rows = payload.items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e7e1d8;font-family:Inter,sans-serif;color:#2b2b28;">${item.name} × ${item.qty}</td>
          <td style="padding:12px 0;border-bottom:1px solid #e7e1d8;text-align:right;font-family:'IBM Plex Mono',monospace;color:#2b2b28;">$${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return `
  <div style="background:#f6f3ec;padding:40px 0;font-family:Inter,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e7e1d8;">
      <div style="padding:32px 32px 0;">
        <p style="font-family:'Fraunces',serif;font-size:26px;color:#2b2b28;margin:0 0 4px;">Loafn'</p>
        <p style="font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:1px;color:#b08d57;text-transform:uppercase;margin:0 0 24px;">Order Confirmed</p>
      </div>
      <div style="padding:0 32px;">
        <p style="color:#2b2b28;">Hi ${payload.customerName}, thanks for your order — here's what's coming your way.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          ${rows}
          <tr>
            <td style="padding:16px 0 0;font-family:'IBM Plex Mono',monospace;font-weight:600;color:#2b2b28;">Total</td>
            <td style="padding:16px 0 0;text-align:right;font-family:'IBM Plex Mono',monospace;font-weight:600;color:#2b2b28;">$${payload.total.toFixed(2)}</td>
          </tr>
        </table>
        <p style="font-family:'IBM Plex Mono',monospace;font-size:12px;color:#8a8477;">Order #${payload.orderId}</p>
      </div>
      <div style="padding:32px;">
        <p style="font-size:12px;color:#8a8477;">Questions? Just reply to this email.</p>
      </div>
    </div>
  </div>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: OrderConfirmationPayload = await req.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Loafn' <${FROM_EMAIL}>`,
        to: payload.to,
        subject: `Your Loafn' order #${payload.orderId} is confirmed`,
        html: renderOrderEmail(payload),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend API error:", res.status, errText);
      return new Response(JSON.stringify({ error: errText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});