import { useCart } from "../context/CartContext";

const TAX_RATE = 0.0825; // placeholder rate — swap for real tax calc later

// `shippingCost` is optional — before a rate is calculated, OrderSummary
// still renders with shipping omitted from the total, so it can be reused
// unchanged as the address-collection step's cart preview.
export default function OrderSummary({ shippingCost = null }) {
  const { items, totalPrice } = useCart();

  const shipping = shippingCost ?? 0;
  const tax = totalPrice * TAX_RATE;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <div className="border border-bone-dim/10 bg-ink-soft/50 p-6">
      <h2 className="font-display text-xl text-bone">Order Summary</h2>

      <ul className="mt-6 flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.cartItemId} className="flex gap-3">
            <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-ink">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brass font-mono text-[10px] text-ink">
                {item.quantity}
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="font-display text-sm text-bone">{item.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-bone-dim/60">
                {item.color} &middot; {item.size}
              </p>
            </div>
            <span className="font-mono text-sm text-brass-light">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-2 border-t border-bone-dim/10 pt-4 font-mono text-sm">
        <Row label="Subtotal" value={totalPrice} />
        {shippingCost !== null && <Row label="Shipping" value={shipping} />}
        <Row label="Tax" value={tax} />
        <div className="mt-2 flex items-center justify-between border-t border-bone-dim/10 pt-3 text-base text-bone">
          <span className="uppercase tracking-widest">Total</span>
          <span className="text-brass-light">${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-bone-dim">
      <span className="uppercase tracking-widest">{label}</span>
      <span>${value.toFixed(2)}</span>
    </div>
  );
}