import { createContext, useContext, useEffect, useReducer, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "loafn-cart";

function makeCartItemId(slug, color, size) {
  return `${slug}__${color}__${size}`;
}

function loadInitialCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item } = action;
      const existing = state.find((i) => i.cartItemId === item.cartItemId);
      if (existing) {
        return state.map((i) =>
          i.cartItemId === item.cartItemId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...state, item];
    }
    case "REMOVE_ITEM":
      return state.filter((i) => i.cartItemId !== action.cartItemId);
    case "UPDATE_QUANTITY":
      return state
        .map((i) =>
          i.cartItemId === action.cartItemId
            ? { ...i, quantity: action.quantity }
            : i
        )
        .filter((i) => i.quantity > 0);
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist on every change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // private browsing / storage disabled — fail silently
    }
  }, [items]);

  function addToCart(product, { color, size, quantity = 1 }) {
    const cartItemId = makeCartItemId(product.slug, color, size);
    dispatch({
      type: "ADD_ITEM",
      item: {
        cartItemId,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        color,
        size,
        quantity,
      },
    });
    setIsCartOpen(true); // open the drawer so adding feels confirmed
  }

  function removeFromCart(cartItemId) {
    dispatch({ type: "REMOVE_ITEM", cartItemId });
  }

  function updateQuantity(cartItemId, quantity) {
    dispatch({ type: "UPDATE_QUANTITY", cartItemId, quantity });
  }

  function clearCart() {
    dispatch({ type: "CLEAR_CART" });
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    toggleCart: () => setIsCartOpen((v) => !v),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}