const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-shipping-rates`;

export async function getShippingRates(destination) {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ destination }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to calculate shipping.");
  }

  return data; // { rates: [...], usedFallback: bool }
}