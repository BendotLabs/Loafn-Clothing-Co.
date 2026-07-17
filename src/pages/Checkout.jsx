import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ShippingForm from "../components/ShippingForm";
import OrderSummary from "../components/OrderSummary";

export default function Checkout() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

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

  function handlePlaceOrder(shippingInfo) {
    setSubmitting(true);

    // Mock order creation — Phase 8 swaps this for a real Stripe + backend flow.
    const orderNumber = `LFN-${Date.now().toString().slice(-6)}`;

    setTimeout(() => {
      clearCart();
      navigate("/checkout/success", {
        state: { orderNumber, shippingInfo },
      });
    }, 600); // brief delay so "Placing Order..." reads as real feedback
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
      <header className="mb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
          Checkout
        </p>
        <h1 className="mt-2 font-display text-4xl text-bone">
          Almost there.
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_1fr]">
        <ShippingForm onSubmit={handlePlaceOrder} submitting={submitting} />
        <OrderSummary />
      </div>

      <div className="mt-10">
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