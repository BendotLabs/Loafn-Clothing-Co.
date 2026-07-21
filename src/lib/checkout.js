const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;

export async function createCheckoutSession(items, userId, shippingRate) {
  const successUrl = `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${window.location.origin}/checkout/cancelled`;

  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, successUrl, cancelUrl, userId, shippingRate }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to start checkout.");
  }

  return data.url;
}