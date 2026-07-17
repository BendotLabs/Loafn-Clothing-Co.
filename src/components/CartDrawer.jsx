import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity, totalPrice } =
    useCart();

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-50 bg-ink/70 transition-opacity duration-300 ${
          isCartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-hidden={!isCartOpen}
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col bg-ink-soft shadow-xl transition-transform duration-300 ease-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-bone-dim/10 px-6 py-6">
          <h2 className="font-display text-2xl text-bone">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center text-bone-dim hover:text-bone"
          >
            <span className="relative block h-4 w-4">
              <span className="absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded bg-current" />
              <span className="absolute left-1/2 top-1/2 h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded bg-current" />
            </span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-display text-xl text-bone">Your cart is empty.</p>
            <p className="text-sm text-bone-dim">Find something worth loafing in.</p>
            <Link
              to="/products"
              onClick={closeCart}
              className="mt-4 border border-brass px-6 py-3 font-mono text-xs uppercase tracking-widest text-bone hover:bg-brass hover:text-ink transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="flex flex-col gap-6">
                {items.map((item) => (
                  <li key={item.cartItemId} className="flex gap-4">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="h-24 w-20 flex-shrink-0 overflow-hidden bg-ink"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.slug}`}
                          onClick={closeCart}
                          className="font-display text-base text-bone hover:text-brass-light"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          aria-label={`Remove ${item.name}`}
                          className="font-mono text-[10px] uppercase tracking-widest text-bone-dim/60 hover:text-bone"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-bone-dim/60">
                        {item.color} &middot; {item.size}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-bone-dim/30">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="flex h-8 w-8 items-center justify-center text-bone-dim hover:text-bone"
                          >
                            &minus;
                          </button>
                          <span className="w-8 text-center font-mono text-xs text-bone">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="flex h-8 w-8 items-center justify-center text-bone-dim hover:text-bone"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono text-sm text-brass-light">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-bone-dim/10 px-6 py-6">
              <div className="flex items-center justify-between font-mono text-sm text-bone">
                <span className="uppercase tracking-widest text-bone-dim">Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-[11px] text-bone-dim/60">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="mt-5 flex w-full items-center justify-center border border-brass py-4 font-mono text-xs uppercase tracking-widest text-bone transition-colors hover:bg-brass hover:text-ink"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}