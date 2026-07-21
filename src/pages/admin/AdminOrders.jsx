import { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "../../lib/adminOrders";
import { generateShippingLabel } from "../../lib/adminShipping";

const STATUSES = ["completed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [labelLoadingId, setLabelLoadingId] = useState(null);
  const [labelError, setLabelError] = useState("");

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

  async function handleGenerateLabel(orderId) {
    setLabelLoadingId(orderId);
    setLabelError("");
    try {
      const result = await generateShippingLabel(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                tracking_number: result.trackingNumber,
                tracking_carrier: result.carrier,
                label_url: result.labelUrl,
                shipping_status: "label_created",
              }
            : o
        )
      );
    } catch (err) {
      // Expected failure mode right now: EasyPost isn't connected yet
      // (503 from generate-shipping-label). Surfaced inline per-order
      // rather than the page-level error banner, since it's specific
      // to this action, not a data-loading failure.
      setLabelError(err.message);
    } finally {
      setLabelLoadingId(null);
    }
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
              <th className="py-3 pr-4">Shipping</th>
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
                  <td className="py-3 pr-4 font-mono text-xs">
                    {order.tracking_number ? (
                      <span className="text-brass-light">
                        {order.tracking_carrier} &middot; {order.tracking_number}
                      </span>
                    ) : (
                      <span className="text-bone-dim/40 uppercase tracking-widest">
                        No label
                      </span>
                    )}
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
                    <td colSpan={7} className="bg-bone-dim/5 px-4 py-4">
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

                      <div className="mt-4 flex items-center gap-4 border-t border-bone-dim/10 pt-4">
                        {order.label_url ? (
                          <a
                            href={order.label_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs uppercase tracking-widest text-brass-light hover:text-brass"
                          >
                            View Label
                          </a>
                        ) : (
                          <button
                            onClick={() => handleGenerateLabel(order.id)}
                            disabled={labelLoadingId === order.id}
                            className="border border-brass px-4 py-2 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {labelLoadingId === order.id ? "Generating..." : "Generate Label"}
                          </button>
                        )}
                        {labelError && expandedId === order.id && (
                          <p className="font-mono text-xs text-clay">{labelError}</p>
                        )}
                      </div>
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