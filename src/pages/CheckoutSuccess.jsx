import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderNumber = location.state?.orderNumber;
  const shippingInfo = location.state?.shippingInfo;

  // Guard against landing here directly (refresh, bookmark, back button after
  // cart was cleared) with no order context.
  useEffect(() => {
    if (!orderNumber) navigate("/", { replace: true });
  }, [orderNumber, navigate]);

  if (!orderNumber) return null;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Order Confirmed
      </p>
      <h1 className="font-display text-4xl text-bone">Thank you.</h1>
      <p className="text-sm text-bone-dim">
        Your order has been placed. A confirmation would normally be on its
        way to {shippingInfo?.email || "your inbox"}.
      </p>

      <div className="mt-6 border border-bone-dim/10 bg-ink-soft/50 px-8 py-5">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
          Order Number
        </p>
        <p className="mt-1 font-mono text-lg text-brass-light">{orderNumber}</p>
      </div>

      {shippingInfo && (
        <div className="mt-2 text-sm text-bone-dim">
          <p>Shipping to:</p>
          <p className="mt-1 text-bone">
            {shippingInfo.fullName}
            <br />
            {shippingInfo.address1}
            {shippingInfo.address2 && <>, {shippingInfo.address2}</>}
            <br />
            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}
          </p>
        </div>
      )}

      <Link
        to="/products"
        className="mt-8 border border-brass px-7 py-3 font-mono text-xs uppercase tracking-widest text-bone hover:bg-brass hover:text-ink transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}