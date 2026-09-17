# LuxeCart

LuxeCart is a responsive Next.js e-commerce storefront with product browsing, filtering, product details, cart and wishlist state, demo authentication, checkout, and an admin overview.

## Run locally

PowerShell may require a process-scoped execution-policy bypass in this environment:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
npm install
npm run dev
```

Open http://localhost:3000. If that port is busy, Next.js will choose the next available port.

## Demo credentials

- Email: `alex@example.com`
- Password: `password123`

## Available routes

- `/` storefront home
- `/shop` catalog, search, category, price, and sort filters
- `/product/[slug]` product detail and add-to-cart flow
- `/cart` cart quantities and totals
- `/wishlist` saved products
- `/checkout` shipping form and demo order creation
- `/login`, `/register`, `/dashboard` account flows
- `/admin` admin overview

## API routes

- `GET /api/products`
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/checkout`
- `GET /api/orders`

To enable Stripe Checkout, copy `.env.example` to `.env.local` and add a Stripe test secret key:

```powershell
Copy-Item .env.example .env.local
```

Then set `STRIPE_SECRET_KEY=sk_test_...` in `.env.local` and restart the dev server. Without the key, checkout uses the local demo order fallback. Never commit `.env.local` or secret keys.

The API currently uses the catalog in `lib/data.ts` and a process-local order store in `lib/api-store.ts`. It is suitable for local demos and flow testing, but orders reset when the server restarts. Production deployment should replace this store with MongoDB, add signed session or JWT cookies, and connect checkout to Stripe using server-side secrets.

## Verify

```powershell
npm run build
```

The build validates the App Router pages, client flows, and route handlers.
