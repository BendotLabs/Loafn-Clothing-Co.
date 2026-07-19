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


***IMPORTANT***

**once you reach the production-oriented phases, consider switching from local JSON to a real database (for example, Supabase or PostgreSQL) before building orders and inventory. Those features become much more realistic when they're backed by persistent data rather than static files.**

**Services to implement: Supabase, Stripe, Clerk/Auth.js, Resend, Cloudinary, PostHog Analytics, Shippo/EasyPost**


## PHASE 5 — Shopping Cart

- [x] **Step 12** — Create Cart Context (state, add/remove/update quantity).
- [x] **Step 13** — Connect "Add to Cart" button.
- [x] **Step 14** — Build Cart Drawer.
- [x] **Step 15** — Cart badge in navbar.
- [x] **Step 16** — Persist cart using Local Storage.
- [x] **Step 17** — Empty cart state.

**Success Condition:** Cart behaves exactly like a real online store.

## PHASE 6 — Checkout

- [x] **Step 18** — Create Checkout page.
- [x] **Step 19** — Order Summary component.
- [x] **Step 20** — Shipping information form.
- [x] **Step 21** — Form validation.
- [x] **Step 22** — Success page.
- [x] **Step 23** — Cancelled checkout page.

**Success Condition:** Users can proceed from cart to a complete checkout flow.

## PHASE 7 — Authentication

- [x] **Step 24** — User registration.
- [x] **Step 25** — Login.
- [x] **Step 26** — Logout.
- [x] **Step 27** — Protected account page.
- [x] **Step 28** — Password reset email.

**Success Condition:** Users have real accounts.

## PHASE 8 — Stripe

- [x] **Step 29** — Create Stripe account.
- [x] **Step 30** — Install Stripe SDK.
- [x] **Step 31** — Stripe test mode checkout.
- [x] **Step 32** — Success redirect.
- [x] **Step 33** — Cancel redirect.
- [x] **Step 34** — Learn Stripe webhooks.
- [x] **Step 35** — Store completed orders.

**Success Condition:** Fake purchases complete exactly like a production store.

## PHASE 9 — Orders

- [x] **Step 36** — Orders database.
- [x] **Step 37** — Order model.
- [x] **Step 38** — Order history page.
- [x] **Step 39** — Individual order details.
- [x] **Step 40** — Purchase confirmation screen.

**Success Condition:** Orders permanently exist.

## PHASE 10 — Emails

- [x] **Step 41** — Email service integration.
- [x] **Step 42** — Order confirmation email. (built, needs wiring to the real checkout flow)
- [x] **Step 43** — Password reset email.
- [ ] **Step 44** — Shipping notification email. *deffered to phase 13*

**Success Condition:** Every important action generates a real email.

## PHASE 11 — Admin Dashboard

- [ ] **Step 45** — Dashboard layout.
- [ ] **Step 46** — Product management.
- [ ] **Step 47** — Order management.
- [ ] **Step 48** — Inventory management.
- [ ] **Step 49** — Customer list.

**Success Condition:** Store owner can manage the business.

## PHASE 12 — Inventory

- [ ] **Step 50** — Product variants.
- [ ] **Step 51** — Size inventory.
- [ ] **Step 52** — Color inventory.
- [ ] **Step 53** — Out-of-stock handling.
- [ ] **Step 54** — Low-stock indicators.

**Success Condition:** Inventory behaves like a real clothing business.

## PHASE 13 — Shipping

- [ ] **Step 55** — Shipping zones.
- [ ] **Step 56** — Shipping rate calculation.
- [ ] **Step 57** — Shipping API integration.
- [ ] **Step 58** — Generate shipping labels
- [ ] **Step 59** — Tracking numbers.

**RETURN TO STEP 44**

**Success Condition:** Orders are ready to ship.

## PHASE 14 — Customer Experience

- [ ] **Step 60** — Wishlist.
- [ ] **Step 61** — Search.
- [ ] **Step 62** — Sorting.
- [ ] **Step 63** — Filtering improvements.
- [ ] **Step 64** — Product recommendations.
- [ ] **Step 65** — Recently viewed products.

## PHASE 15 — Production Polish

- [ ] **Step 66** — Mobile optimization.
- [ ] **Step 67** — Loading states.
- [ ] **Step 68** — Error pages.
- [ ] **Step 69** — Animations.
- [ ] **Step 70** — Accessibility improvements.
- [ ] **Step 71** — SEO metadata.
- [ ] **Step 72** — Analytics integration.
- [ ] **Step 73** — Deploy production version.
- [ ] **Step 74** — Portfolio case study.

---

**Success condition:** a visitor can browse products, view product details,
add items to a cart, and complete a mock checkout experience.

**Email uses Resend in sandbox mode for demo purposes; A verified domain would be swapped in for production.**