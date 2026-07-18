import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      navigate("/", { replace: true });
      return;
    }
    // Payment succeeded (Stripe only redirects here on success) — safe to
    // clear the cart now. Verifying the session server-side and persisting
    // the order comes in Phase 9 via the webhook.
    clearCart();
    setCleared(true);
  }, [sessionId, clearCart, navigate]);

  if (!sessionId) return null;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Order Confirmed
      </p>
      <h1 className="font-display text-4xl text-bone">Thank you.</h1>
      <p className="text-sm text-bone-dim">
        Your payment was successful. A confirmation email is on its way from
        Stripe.
      </p>

      <div className="mt-6 border border-bone-dim/10 bg-ink-soft/50 px-8 py-5">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
          Stripe Session
        </p>
        <p className="mt-1 break-all font-mono text-xs text-brass-light">
          {sessionId}
        </p>
      </div>

      <Link
        to="/products"
        className="mt-8 border border-brass px-7 py-3 font-mono text-xs uppercase tracking-widest text-bone hover:bg-brass hover:text-ink transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}