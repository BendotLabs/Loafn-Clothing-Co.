import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createCheckoutSession } from "../lib/checkout";
import OrderSummary from "../components/OrderSummary";

export default function Checkout() {
  const { items } = useCart();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  async function handleCheckout() {
    setError("");
    setSubmitting(true);
    try {
      const url = await createCheckoutSession(items, user?.id);
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
        <h1 className="mt-2 font-display text-4xl text-bone">Almost there.</h1>
        <p className="mt-4 text-sm text-bone-dim">
          Shipping and payment are handled securely on Stripe's checkout page.
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

      <OrderSummary />

      {error && <p className="mt-6 font-mono text-xs text-clay">{error}</p>}

      <button
        onClick={handleCheckout}
        disabled={submitting}
        className="mt-8 w-full border border-brass py-4 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Redirecting to Payment..." : "Proceed to Payment"}
      </button>

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