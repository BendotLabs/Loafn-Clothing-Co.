# Loafn' — Clothing Storefront (Portfolio Project)

An ecommerce storefront built with React, Vite, Tailwind CSS v4,
and React Router. All product data comes from a local JSON file — there's no
backend yet. This is a practice project, following the roadmap in
`ROADMAP.md`.

## Stack

- **React 19** + **Vite** — app shell and dev server
- **Tailwind CSS v4** — styling, wired in via `@tailwindcss/vite` (no
  `tailwind.config.js` needed — theme tokens live in `src/index.css`)
- **React Router v7** — client-side routing

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  components/   # reusable UI: Navbar, Footer, ProductCard
  layouts/      # MainLayout wraps every page with Navbar/Footer
  pages/        # one file per route
  data/         # products.json — the "database" for now
  hooks/        # useProducts / useProduct / useCategories
  context/      # (empty — this is where CartContext goes next, see below)
  assets/       # local images/icons, if you add any beyond Unsplash URLs
```

## Design direction

Brand: **Loafn'**, a small clothing label for "slower moments" — Shells,
Loafwear, accessories.

- **Palette**: warm charcoal ground (`--color-ink`), bone text
  (`--color-bone`), a brass accent (`--color-brass`) for CTAs and price
  highlights, plus sage and clay as secondary tones. Defined as CSS variables
  in `src/index.css` under `@theme`, so they're usable as Tailwind classes
  like `bg-ink`, `text-bone-dim`, `border-brass`.
- **Type**: Courgette (display serif, headlines) + Inter (body/UI) + IBM Plex
  Mono (prices, labels, category tags) — loaded via Google Fonts in
  `index.html`.
- **Signature detail**: a subtle grain texture on hero/dividers (`.grain` /
  `.stitch` classes in `index.css`) as a nod to fabric, instead of leaning on
  drop shadows or gradients.

Product photography currently points at Unsplash URLs as placeholders —
swap `image` fields in `src/data/products.json` for your own photos in
`src/assets/` when you have them.

## What's built so far (roadmap Phases 1–4)

- Global layout, routing, and navigation (Home, Collections, Product, About,
  Contact, 404)
- Homepage: hero, featured products, brand philosophy section
- Product data model in `src/data/products.json`
- `ProductCard` component reused on Home and Collections
- Collections page with category filtering (via `?category=` query param)
  and an empty state when a filter has no matches
- Dynamic product detail route (`/product/:slug`) with a 404 state, color
  and size selectors — UI only, nothing is wired to a cart yet

## What's next (roadmap Phases 5–8)

The roadmap in `ROADMAP.md` covers the rest in order. Rough pointers for
picking it back up:

- **Cart (Phase 5)**: create `src/context/CartContext.jsx` with a
  `useReducer` holding `{ productId, quantity }[]`, wrap `<App />` in it from
  `main.jsx`, then wire the "Add to Cart" button in `src/pages/Product.jsx`.
  A `CartDrawer` component and a cart icon badge in `Navbar.jsx` come next.
- **Checkout (Phase 6)**: a form-only page (name/email/address/city/state/
  zip) plus an order summary reading from cart context — no payment, no
  backend.
- **Polish (Phase 7)**: most spacing is already responsive (mobile-first
  Tailwind), but re-check at `sm`/`md`/`lg` breakpoints; add loading
  skeletons even though data is local, since a real backend would have
  latency; the `Product` page already has an empty/not-found state to model
  the cart's empty state on.
- **Portfolio upgrades (Phase 8)**: wishlist can reuse the cart context
  pattern; search and sort both operate on the same `useProducts()` hook in
  `src/hooks/useProducts.js`; a Journal page is just more routes and static
  content, same shape as `About.jsx`.

## Deploying

This is a static Vite build, so Vercel (or Netlify/GitHub Pages) works with
zero config: connect the repo, framework preset "Vite", and it'll pick up
`npm run build` → `dist/` automatically.
