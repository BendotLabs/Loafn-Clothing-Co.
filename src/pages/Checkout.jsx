import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createCheckoutSession } from "../lib/checkout";
import { getShippingRates } from "../lib/shipping";
import { validateCartStock } from "../lib/stockValidation";
import OrderSummary from "../components/OrderSummary";
import ShippingForm from "../components/ShippingForm";

export default function Checkout() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();

  // "address" — collecting shipping info to quote a rate
  // "review"  — rate quoted, ready to proceed to Stripe
  const [step, setStep] = useState("address");
  const [address, setAddress] = useState(null);
  const [rates, setRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);

  const [ratesLoading, setRatesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [stockNotice, setStockNotice] = useState(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-32 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
          Checkout
        </p>
        <h1 className="font-display text-3xl text-bone">Your cart is empty.</h1>
        <p className="text-sm text-bone-dim">
          Add something to your cart before checking out.
        </p>
        <Link
          to="/products"
          className="mt-4 border border-brass px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone hover:bg-brass hover:text-ink transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  async function handleAddressSubmit(form) {
    setError("");
    setRatesLoading(true);
    try {
      const { rates, usedFallback } = await getShippingRates({
        name: form.fullName,
        street1: form.address1,
        street2: form.address2,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country: form.country === "United States" ? "US" : form.country,
      });

      setAddress(form);
      setRates(rates);
      setSelectedRate(rates[0]); // cheapest first, per calculate-shipping-rates sort order
      setUsedFallback(usedFallback);
      setStep("review");
    } catch (err) {
      setError(err.message);
    } finally {
      setRatesLoading(false);
    }
  }

  async function handleCheckout() {
    setError("");
    setStockNotice(null);
    setSubmitting(true);

    try {
      const { valid, adjustments } = await validateCartStock(items);

      if (!valid) {
        for (const adj of adjustments) {
          if (adj.availableQty === 0) {
            removeFromCart(adj.cartItemId);
          } else {
            updateQuantity(adj.cartItemId, adj.availableQty);
          }
        }
        setStockNotice(adjustments);
        setSubmitting(false);
        return;
      }

      const url = await createCheckoutSession(items, user?.id, selectedRate);
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
          Checkout
        </p>
        <h1 className="mt-2 font-display text-4xl text-bone">
          {step === "address" ? "Where's this headed?" : "Almost there."}
        </h1>
        <p className="mt-4 text-sm text-bone-dim">
          {step === "address"
            ? "We'll use this to calculate shipping. You'll confirm your final address on the next screen."
            : "Payment is handled securely on Stripe's checkout page."}
        </p>

        {!user && (
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-bone-dim/60">
            Have an account?{" "}
            <Link to="/login" className="text-brass-light hover:text-brass">
              Sign in
            </Link>{" "}
            or{" "}
            <Link to="/register" className="text-brass-light hover:text-brass">
              create one
            </Link>{" "}
            to track this order &mdash; totally optional.
          </p>
        )}
      </header>

      {step === "address" && (
        <>
          <ShippingForm
            onSubmit={handleAddressSubmit}
            submitting={ratesLoading}
            submitLabel="Calculate Shipping"
            initialValues={address}
          />
          {error && <p className="mt-6 font-mono text-xs text-clay">{error}</p>}
        </>
      )}

      {step === "review" && (
        <>
          <div className="mb-6 border border-bone-dim/20 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
                Shipping to
              </p>
              <button
                onClick={() => setStep("address")}
                className="font-mono text-xs uppercase tracking-widest text-brass-light hover:text-brass"
              >
                Edit
              </button>
            </div>
            <p className="mt-2 text-sm text-bone">
              {address.fullName} &middot; {address.address1}, {address.city}, {address.state}{" "}
              {address.zip}
            </p>
          </div>

          {rates.length > 1 && (
            <div className="mb-6 flex flex-col gap-2">
              <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
                Choose a shipping speed
              </p>
              {rates.map((rate) => (
                <label
                  key={`${rate.carrier}-${rate.service}`}
                  className={`flex cursor-pointer items-center justify-between border px-4 py-3 text-sm transition-colors ${
                    selectedRate === rate
                      ? "border-brass bg-ink-soft"
                      : "border-bone-dim/20 text-bone-dim hover:border-bone-dim/40"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={selectedRate === rate}
                      onChange={() => setSelectedRate(rate)}
                      className="accent-brass"
                    />
                    {rate.carrier} {rate.service}
                    {rate.estimated_days && (
                      <span className="font-mono text-xs text-bone-dim/60">
                        ({rate.estimated_days} days)
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-brass-light">${rate.rate.toFixed(2)}</span>
                </label>
              ))}
            </div>
          )}

          {usedFallback && (
            <p className="mb-6 font-mono text-[11px] uppercase tracking-widest text-bone-dim/40">
              Live carrier rates aren't connected yet — using standard flat-rate shipping.
            </p>
          )}

          <OrderSummary shippingCost={selectedRate?.rate ?? 0} />

          {stockNotice && (
            <div className="mt-6 border border-brass-light/40 bg-ink-soft px-4 py-3">
              <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
                Cart updated
              </p>
              <ul className="mt-2 flex flex-col gap-1 text-sm text-bone-dim">
                {stockNotice.map((adj) => (
                  <li key={adj.cartItemId}>
                    {adj.reason === "removed" || adj.availableQty === 0
                      ? `${adj.name} (${adj.color}, ${adj.size}) is no longer available and was removed.`
                      : `${adj.name} (${adj.color}, ${adj.size}) only had ${adj.availableQty} left — quantity adjusted from ${adj.requestedQty}.`}
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-mono text-xs text-bone-dim/60">
                Review your cart and try again when you're ready.
              </p>
            </div>
          )}

          {error && <p className="mt-6 font-mono text-xs text-clay">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={submitting}
            className="mt-8 w-full border border-brass py-4 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Checking stock..." : "Proceed to Payment"}
          </button>
        </>
      )}

      <div className="mt-6">
        <Link
          to="/products"
          className="font-mono text-xs uppercase tracking-widest text-bone-dim/60 hover:text-bone"
        >
          &larr; Continue Shopping
        </Link>
      </div>
    </div>
  );
}