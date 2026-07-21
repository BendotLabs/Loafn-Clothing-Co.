const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-shipping-label`;

export async function generateShippingLabel(orderId) {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate label.");
  }

  return data; // { trackingNumber, carrier, labelUrl }
}