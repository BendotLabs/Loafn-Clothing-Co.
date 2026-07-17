import { Link } from "react-router-dom";

export default function CheckoutCancelled() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Checkout Cancelled
      </p>
      <h1 className="font-display text-3xl text-bone">No charge was made.</h1>
      <p className="text-sm text-bone-dim">
        Your checkout was cancelled. Your cart is still saved if you'd like to
        pick up where you left off.
      </p>
      <Link
        to="/checkout"
        className="mt-4 border border-brass px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone hover:bg-brass hover:text-ink transition-colors"
      >
        Return to Checkout
      </Link>
      <Link
        to="/products"
        className="font-mono text-xs uppercase tracking-widest text-bone-dim/60 hover:text-bone"
      >
        Continue Shopping
      </Link>
    </div>
  );
}