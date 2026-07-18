import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../hooks/useOrders";

export default function Account() {
  const { user, signOut } = useAuth();
  const { orders, loading } = useOrders();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Account
      </p>
      <h1 className="mt-3 font-display text-4xl text-bone">Your account.</h1>

      <div className="mt-10 border border-bone-dim/10 bg-ink-soft/50 px-6 py-6">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
          Signed in as
        </p>
        <p className="mt-1 text-bone">{user?.email}</p>
      </div>

      <div className="mt-10">
        <p className="font-mono text-xs uppercase tracking-widest text-bone-dim/60">
          Order History
        </p>

        {loading ? (
          <p className="mt-3 text-sm text-bone-dim">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="mt-3 text-sm text-bone-dim">
            No orders yet &mdash;{" "}
            <Link to="/products" className="text-brass-light hover:text-brass">
              go find something
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 flex flex-col divide-y divide-bone-dim/10 border-t border-bone-dim/10">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/account/orders/${order.id}`}
                  className="flex items-center justify-between py-4 hover:text-bone"
                >
                  <div>
                    <p className="text-sm text-bone">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-widest text-bone-dim/60">
                      {order.order_items.length} item
                      {order.order_items.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="font-mono text-sm text-brass-light">
                    ${order.amount_total.toFixed(2)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleSignOut}
        className="mt-10 border border-brass px-7 py-3 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink"
      >
        Sign Out
      </button>
    </div>
  );
}