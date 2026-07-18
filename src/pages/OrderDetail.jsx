import { Link, useParams } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";

export default function OrderDetail() {
  const { orderId } = useParams();
  const { orders, loading } = useOrders();
  const order = orders.find((o) => o.id === orderId);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim">
          Loading...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-bone">Order not found.</h1>
        <Link
          to="/account"
          className="mt-4 border border-brass px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone hover:bg-brass hover:text-ink transition-colors"
        >
          Back to Account
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link
        to="/account"
        className="font-mono text-xs uppercase tracking-widest text-bone-dim/60 hover:text-bone"
      >
        &larr; Back to Account
      </Link>

      <header className="mt-6 mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
          Order
        </p>
        <h1 className="mt-2 font-display text-3xl text-bone">
          {new Date(order.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h1>
        <p className="mt-1 font-mono text-xs text-bone-dim/60 break-all">
          {order.stripe_session_id}
        </p>
      </header>

      <ul className="flex flex-col gap-6">
        {order.order_items.map((item) => (
          <li key={item.id} className="flex gap-4">
            <div className="h-20 w-16 flex-shrink-0 overflow-hidden bg-ink-soft">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="font-display text-base text-bone">{item.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-bone-dim/60">
                {item.color} &middot; {item.size} &middot; Qty {item.quantity}
              </p>
            </div>
            <span className="font-mono text-sm text-brass-light">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t border-bone-dim/10 pt-6">
        <div className="flex items-center justify-between font-mono text-base text-bone">
          <span className="uppercase tracking-widest">Total</span>
          <span className="text-brass-light">${order.amount_total.toFixed(2)}</span>
        </div>
      </div>

      {order.shipping_address && (
        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
            Shipped To
          </p>
          <p className="mt-2 text-sm text-bone">
            {order.shipping_address.line1}
            {order.shipping_address.line2 && <>, {order.shipping_address.line2}</>}
            <br />
            {order.shipping_address.city}, {order.shipping_address.state}{" "}
            {order.shipping_address.postal_code}
          </p>
        </div>
      )}
    </div>
  );
}