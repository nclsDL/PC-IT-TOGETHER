# PC-IT-TOGETHER

A full-stack PC e-commerce web application built as a final project for E-Commerce w/ Digital Marketing. Users can browse PC components, view detailed product specifications, build custom PCs with real-time compatibility checking, manage a shopping cart with promo codes, and check out via PayPal.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 + Shadcn UI |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma v6 |
| Auth | Supabase Auth (Email/Password + Google OAuth) |
| Payment | PayPal Sandbox via `@paypal/react-paypal-js` |
| State Management | Zustand with localStorage persistence |
| Icons | Lucide React |
| Notifications | Sonner (toast) |

## Features

- **Product Catalog** — Browse 38 products across 8 categories (CPUs, GPUs, Motherboards, RAM, Storage, PSUs, Cases, Coolers) with filtering, sorting, and search
- **Product Detail** — Image gallery, key specs, tabbed Product Details & Specifications views, related products
- **PC Builder** — Step-by-step configurator with real-time compatibility checking (socket, memory type, form factor), prebuilt build templates, and one-click add-all-to-cart
- **Shopping Cart** — Add/remove items, adjust quantities, apply promo codes with percentage discounts
- **Checkout** — PayPal sandbox integration with PHP currency, free order flow for 100% discount coupons
- **Order History** — View past orders with status badges, itemized details, and coupon usage
- **Wishlist** — Save products for later with localStorage persistence
- **Authentication** — Email/password signup & login, Google OAuth, protected routes
- **Admin Panel** — CRUD operations for products, categories, orders, and coupons (accessible at `/admin`)
- **Responsive Design** — Mobile-friendly layout across all pages

## Prerequisites

- Node.js 18+
- npm
- A Supabase project (for database and auth)
- PayPal Developer account (optional, for payment testing)

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root with the following:

```env
DATABASE_URL=your_supabase_direct_connection_string

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_paypal_sandbox_secret
PAYPAL_API_URL=https://api-m.sandbox.paypal.com
```

> **Note:** The `DATABASE_URL` must use the direct connection (port 5432), not the transaction pooler (port 6543), for Prisma migrations to work.

### 3. Set up the database

```bash
npm run db:push      # Push the Prisma schema to the database
npm run db:seed      # Seed 38 products, 8 categories, coupons, and prebuilt configs
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run db:push` | Push Prisma schema to the database |
| `npm run db:seed` | Seed the database with sample data |
| `npm run db:studio` | Open Prisma Studio (visual DB editor) |
| `npm run db:generate` | Regenerate the Prisma client |

## Test Accounts & Data

- **Promo Codes:** Seeded coupons are available in the database (check via Prisma Studio with `npm run db:studio`)
- **PayPal:** Uses sandbox mode — use [PayPal sandbox test accounts](https://developer.paypal.com/tools/sandbox/accounts/) for payment testing
- **Admin Access:** Set a user's role to `ADMIN` in the database to access the admin panel at `/admin`

## Project Structure

```
prisma/
  schema.prisma             # Database models
  seed.ts                   # Seed script (products, categories, coupons, prebuilts)
src/
  app/
    (store)/                # Customer-facing pages
      products/             # Product listing & detail pages
      cart/                 # Shopping cart
      checkout/             # PayPal checkout & success page
      build/                # PC Builder configurator
      orders/               # Order history
      wishlist/             # Wishlist
      contact/              # Contact page
      about/                # About page
      (auth)/login/         # Login page
      (auth)/signup/        # Signup page
    (admin)/admin/          # Admin panel (products, orders, coupons CRUD)
    api/                    # API routes (auth, PayPal, coupons, orders)
  components/
    layout/                 # Navbar, Footer, AnnouncementBar
    home/                   # Homepage sections
    products/               # ProductCard, ProductDetail
    builder/                # BuilderClient, compatibility checker
    ui/                     # Shared UI components
  store/                    # Zustand stores (cart, wishlist, builder)
  lib/                      # Utilities (Supabase client, Prisma, PayPal helpers)
public/
  products/                 # Product images organized by category
```

## Authors

Built by the PC-IT-TOGETHER TnC (Thiam n' Classmates) team as a final project for E-Commerce w/ Digital Marketing.

De Leon, Pocholo Nicolas
Baldemoro, Genro
Santos, Jericho G.
Sorrera, Lance Arthur J.
Thiam, Jose Gabriel C.

