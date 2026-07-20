import { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "../../lib/adminOrders";

// "completed" reflects payment success (set by the Stripe webhook) —
// everything after that is fulfillment state, which is manual until
// Phase 13 wires up real shipping/tracking.
const STATUSES = ["completed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await fetchAllOrders();
    if (error) setError(error.message);
    else setOrders(data);
    setLoading(false);
  }

  async function handleStatusChange(orderId, status) {
    setSavingId(orderId);
    const { error } = await updateOrderStatus(orderId, status);
    setSavingId(null);
    if (error) {
      setError(error.message);
      return;
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  }

  if (loading) {
    return <p className="font-mono text-xs text-bone-dim">Loading orders...</p>;
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-brass-light">
        Step 47
      </p>
      <h1 className="mt-3 font-display text-3xl text-bone">Orders</h1>

      {error && <p className="mt-4 font-mono text-xs text-clay">{error}</p>}

      {orders.length === 0 ? (
        <p className="mt-8 font-mono text-xs text-bone-dim">No orders yet.</p>
      ) : (
        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-bone-dim/20 font-mono text-xs uppercase tracking-widest text-bone-dim/60">
              <th className="py-3 pr-4">Order</th>
              <th className="py-3 pr-4">Customer</th>
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <>
                <tr key={order.id} className="border-b border-bone-dim/10 text-bone-dim">
                  <td className="py-3 pr-4 font-mono text-xs text-bone">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="py-3 pr-4">{order.customer_email}</td>
                  <td className="py-3 pr-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 pr-4 font-mono">
                    ${Number(order.amount_total).toFixed(2)}
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={order.status}
                      disabled={savingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="border border-bone-dim/30 bg-transparent px-2 py-1 font-mono text-xs uppercase tracking-widest text-bone outline-none focus:border-brass disabled:opacity-50"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-ink">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-4 text-right">
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === order.id ? null : order.id)
                      }
                      className="font-mono text-xs uppercase tracking-widest text-brass-light hover:text-brass"
                    >
                      {expandedId === order.id ? "Hide" : "View"} Items
                    </button>
                  </td>
                </tr>
                {expandedId === order.id && (
                  <tr className="border-b border-bone-dim/10">
                    <td colSpan={6} className="bg-bone-dim/5 px-4 py-4">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="font-mono uppercase tracking-widest text-bone-dim/60">
                            <th className="pb-2 pr-4">Item</th>
                            <th className="pb-2 pr-4">Color</th>
                            <th className="pb-2 pr-4">Size</th>
                            <th className="pb-2 pr-4">Qty</th>
                            <th className="pb-2 pr-4">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.order_items.map((item) => (
                            <tr key={item.id} className="text-bone-dim">
                              <td className="py-1 pr-4 text-bone">{item.name}</td>
                              <td className="py-1 pr-4">{item.color}</td>
                              <td className="py-1 pr-4">{item.size}</td>
                              <td className="py-1 pr-4">{item.quantity}</td>
                              <td className="py-1 pr-4 font-mono">
                                ${Number(item.price).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}