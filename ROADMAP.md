# Clothing Brand Storefront Roadmap

## Goal

Build a modern clothing storefront using:

- React
- Vite
- Tailwind CSS
- React Router

No backend initially. All products, collections, and content are stored in
local JSON files.

Progress is tracked with checkboxes below. See `README.md` for where things
stand right now and pointers for picking up each phase.

---

## PHASE 1 — Project Setup

- [x] **Step 1** — Create project (React + Vite + Tailwind + React Router),
      folder structure, commit to GitHub.
- [x] **Step 2** — Global layout (Navbar, Footer, main content area) and
      routes: Home, Collections, Product, About, Contact.

## PHASE 2 — Homepage

- [x] **Step 3** — Hero section: logo, headline, subheadline, CTA.
- [x] **Step 4** — Featured Collection section (3 product cards).
- [x] **Step 5** — Brand Philosophy section.

## PHASE 3 — Product System

- [x] **Step 6** — Product JSON (`src/data/products.json`).
- [x] **Step 7** — `ProductCard` component.
- [x] **Step 8** — Collection page, `map()` over JSON.
- [x] **Step 9** — Category filtering.

## PHASE 4 — Product Detail Pages

- [x] **Step 10** — Dynamic product routes (`/product/:slug`).
- [x] **Step 11** — Product detail layout (image, title, description, price,
      size selector, color selector, Add to Cart button) — UI only.

## PHASE 5 — Shopping Cart

- [ ] **Step 12** — Cart Context (product ID + quantity).
- [ ] **Step 13** — Cart Drawer (products, quantities, total).
- [ ] **Step 14** — Connect Add to Cart button (add / remove / update qty).

## PHASE 6 — Checkout Experience

- [ ] **Step 15** — Checkout page form (name, email, address, city, state,
      ZIP) — no backend, no payment, UI only.
- [ ] **Step 16** — Order Summary (items, quantities, shipping, total).

## PHASE 7 — Polish

- [ ] **Step 17** — Responsive design check (mobile, tablet, desktop).
- [ ] **Step 18** — Animations (hover effects, fade-ins, page transitions).
- [ ] **Step 19** — Loading states (skeleton cards, spinners).
- [ ] **Step 20** — Error states (product not found, empty cart).

## PHASE 8 — Portfolio Upgrades

- [ ] **Step 21** — Wishlist system.
- [ ] **Step 22** — Search bar (search products by name).
- [ ] **Step 23** — Sort products (price low–high, high–low, newest).
- [ ] **Step 24** — Journal page (design philosophy, fabric choices,
      collection inspiration).
- [ ] **Step 25** — Deploy on Vercel, add to portfolio, GitHub README,
      screenshots.

---

**Success condition:** a visitor can browse products, view product details,
add items to a cart, and complete a mock checkout experience.
