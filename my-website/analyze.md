# JHOM FOODS Website Analysis

> **Document Created:** 2026-01-29 @ 17:44 IST  
> **Last Updated:** 2026-02-09 @ 14:43 IST

---

## ⚠️ Rules

1. Do not generate sample data or mock data, only if it is necessary.
2. Update `analyze.md` file if you make any changes in the website.
3. If you want to make changes in backend, ask permission from the user.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Pages & Routes](#pages--routes)
5. [Components](#components)
6. [Hooks](#hooks)
7. [State Management](#state-management)
8. [API Layer](#api-layer)
9. [Types & Interfaces](#types--interfaces)
10. [Styling System](#styling-system)
11. [Statistics](#statistics)
12. [Change Log](#change-log)

---

## 🎯 Project Overview

**JHOM FOODS** is a premium quality meat and seafood e-commerce website built with Next.js. The website offers:

- Premium quality meat and seafood products
- E-commerce shopping cart functionality
- Checkout system with backend integration
- User authentication (login, register, password reset)
- User account management (profile, orders, password change)
- Contact and bulk order forms
- Brand pages (Our Story, Quality, Certifications, Sustainability)
- Legal pages (Privacy, Terms, FAQ)

---

## 🛠 Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 16.1.6 |
| Language | TypeScript | ^5 |
| UI Library | React | 19.2.3 |
| Styling | TailwindCSS | ^4 |
| Linting | ESLint | ^9 |
| Package Manager | npm | - |

---

## 📁 Project Structure

```
my-website/
├── app/
│   ├── components/          # Reusable UI components (10 files)
│   │   ├── CartDrawer.tsx
│   │   ├── ContactForm.tsx
│   │   ├── DisclaimerBanner.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── ProductCard.tsx
│   │   ├── StorySection.tsx
│   │   └── ValueCard.tsx
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── data/                # Sample/static data
│   │   └── sample-products.ts
│   ├── hooks/               # Custom React hooks
│   │   └── useProducts.ts
│   ├── lib/                 # Utilities & API layer
│   │   ├── api-config.ts
│   │   ├── api.ts
│   │   └── image-map.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── account/             # User account pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── orders/
│   │   │   └── page.tsx
│   │   └── password/
│   │       └── page.tsx
│   ├── bulk-orders/         # Bulk orders page
│   ├── cart/                # Cart page
│   ├── certifications/      # Certifications page
│   ├── checkout/            # Checkout page
│   ├── contact/             # Contact page
│   ├── faq/                 # FAQ page
│   ├── forgot-password/     # Password reset request page
│   ├── login/               # Login page
│   ├── our-story/           # Our Story page
│   ├── privacy/             # Privacy policy page
│   ├── product/             # Product detail page [id]
│   ├── quality/             # Quality page
│   ├── register/            # User registration page
│   ├── reset-password/      # Password reset page [token]
│   ├── shop/                # Shop pages with category routing
│   ├── sustainability/      # Sustainability page
│   ├── terms/               # Terms of service page
│   ├── globals.css          # Global styles & design system
│   ├── layout.tsx           # Root layout with providers
│   └── page.tsx             # Homepage
├── public/                  # Static assets
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # TailwindCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

---

## 🗺 Pages & Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage with hero, featured products, value propositions |
| `/shop` | `app/shop/page.tsx` | Shop landing page with all products |
| `/shop/[category]` | `app/shop/[category]/page.tsx` | Category-filtered product listing |
| `/product/[id]` | `app/product/[id]/page.tsx` | Individual product detail page |
| `/cart` | `app/cart/page.tsx` | Shopping cart page |
| `/checkout` | `app/checkout/page.tsx` | Checkout page (requires login) |
| `/login` | `app/login/page.tsx` | User login page |
| `/register` | `app/register/page.tsx` | User registration page |
| `/forgot-password` | `app/forgot-password/page.tsx` | Request password reset |
| `/reset-password/[token]` | `app/reset-password/[token]/page.tsx` | Reset password with token |
| `/account` | `app/account/page.tsx` | User profile page |
| `/account/orders` | `app/account/orders/page.tsx` | Order history page |
| `/account/password` | `app/account/password/page.tsx` | Change password page |
| `/our-story` | `app/our-story/page.tsx` | Brand story page |
| `/quality` | `app/quality/page.tsx` | Quality standards page |
| `/certifications` | `app/certifications/page.tsx` | Certifications display |
| `/sustainability` | `app/sustainability/page.tsx` | Sustainability initiatives |
| `/contact` | `app/contact/page.tsx` | Contact form page |
| `/bulk-orders` | `app/bulk-orders/page.tsx` | B2B bulk order inquiries |
| `/privacy` | `app/privacy/page.tsx` | Privacy policy page |
| `/terms` | `app/terms/page.tsx` | Terms of service page |
| `/faq` | `app/faq/page.tsx` | Frequently asked questions |

---

## 🧩 Components

### Core Components

| Component | File | Purpose |
|-----------|------|---------|
| `Header` | `Header.tsx` | Navigation bar with logo, menu, user auth menu, cart icon |
| `Footer` | `Footer.tsx` | Site footer with links, contact info |
| `Hero` | `Hero.tsx` | Homepage hero banner section |
| `CartDrawer` | `CartDrawer.tsx` | Slide-out cart sidebar |
| `DisclaimerBanner` | `DisclaimerBanner.tsx` | Scrolling disclaimer banner |

### Product Components

| Component | File | Purpose |
|-----------|------|---------|
| `ProductCard` | `ProductCard.tsx` | Product display card with add-to-cart |
| `FeaturedProducts` | `FeaturedProducts.tsx` | Featured products section for homepage |

### Content Components

| Component | File | Purpose |
|-----------|------|---------|
| `ValueCard` | `ValueCard.tsx` | Value proposition cards |
| `StorySection` | `StorySection.tsx` | Story block with image and text |
| `ContactForm` | `ContactForm.tsx` | Contact form component (integrated with backend) |

---

## 🪝 Hooks

| Hook | File | Purpose |
|------|------|---------|
| `useProducts` | `useProducts.ts` | Fetch products from backend API with filtering |

---

## 🔄 State Management

### Auth Context (`AuthContext.tsx`)

Manages user authentication state with token storage.

**Exposed Values:**
- `user` - Current logged-in user object
- `isAuthenticated` - Boolean auth status
- `login()` / `logout()` - Auth methods
- `updateProfile()` - Update user profile

### Cart Context (`CartContext.tsx`)

The cart uses React Context + useReducer pattern with localStorage persistence.

**Actions:**
- `ADD_ITEM` - Add product to cart
- `REMOVE_ITEM` - Remove product from cart
- `UPDATE_QUANTITY` - Update item quantity
- `CLEAR_CART` - Empty the cart
- `TOGGLE_CART` / `OPEN_CART` / `CLOSE_CART` - Cart drawer visibility
- `LOAD_CART` - Load cart from localStorage

**Exposed Values:**
- `cart` - Current cart state
- `cartTotal` - Calculated total price
- `cartCount` - Total items count
- Action methods for cart manipulation

---

## 🔌 API Layer

### Files

| File | Purpose |
|------|---------|
| `api-config.ts` | API endpoint configuration |
| `api.ts` | Axios-based API client with auth interceptors |
| `image-map.ts` | Product image mapping utilities |

### Available API Methods

- **Auth:** `login()`, `register()`, `logout()`
- **Products:** `getAll()`, `getById()`, `getByCategory()`, `getFeatured()`
- **Categories:** `getAll()`
- **Orders:** `create()`, `getMyOrders()`
- **Profile:** `get()`, `changePassword()`
- **Contact:** `submit()`

---

## 📝 Types & Interfaces

### Product Types
- `Product` - Product entity with _id, name, price, category, etc.
- `LegacyProduct` - Static product type with id (for sample data)
- `ProductCategory` - Category enum (fish-seafood, poultry, mutton, ready-to-cook, vegetarian)
- `CategoryInfo` - Category metadata

### Cart Types
- `CartItem` - Product with quantity
- `CartState` - Cart items array and open state

### Order Types
- `Address` - Delivery address fields
- `DeliverySlot` - Delivery time slot
- `Order` - Complete order entity
- `PaymentMethod` - Payment type enum
- `OrderStatus` - Order status enum

### Form Types
- `ContactFormData` - Contact form fields
- `BulkOrderFormData` - Bulk order form fields

### Auth Types
- `User` - User entity
- `AuthState` - Authentication state

---

## 🎨 Styling System

The project uses a comprehensive CSS design system defined in `globals.css`:

### Color Palette
- **Primary:** Sky Blue (`#19ABFF`)
- **Primary Dark:** `#0095E8`
- **Accent:** Coral (`var(--color-coral)`)
- **Neutrals:** Gray scale from 50-900

### Typography
- **Heading Font:** Playfair Display
- **Body Font:** DM Sans

### Components
- Custom button styles (`.btn`, `.btn-primary`, `.btn-outline`)
- Form input styles
- Card styles (`.product-card`)
- Animation utilities (including `marquee-reverse`)
- Responsive breakpoints

---

## 📊 Statistics

| Metric | Count |
|--------|-------|
| Total Pages/Routes | 22 |
| Components | 10 |
| Contexts | 2 |
| Custom Hooks | 1 |
| Lib Files | 3 |
| Product Categories | 5 |
| TypeScript Interfaces | 15+ |

---

## 📜 Change Log

### Template for New Entries

```
### [DATE] @ [TIME] IST - [Brief Title]

#### ✨ Added
- 

#### 🔧 Modified
- 

#### 🗑 Removed
- 

#### 🐛 Fixed
- 

#### 📁 Files Changed
- 

#### 📝 Notes
- 
```

---

### 2026-02-09 @ 14:43 IST - Removing "Fresh" Terminology

#### 🔧 Modified
- Removed all instances of "fresh" and "freshness" text from the website
- Business is focused on frozen products, so neutral terminology is used
- Replaced with alternatives like "premium", "quality", "flash frozen"

#### 📁 Files Changed
- `app/page.tsx` - Hero title, subtitle, "Shop Smart" section
- `app/shop/page.tsx` - Hero title and description
- `app/quality/page.tsx` - Stats label "Quality Guaranteed"
- `app/product/[id]/page.tsx` - Changed "Fresh Frozen" to "Flash Frozen"
- `app/register/page.tsx` - Registration subtitle
- `app/faq/page.tsx` - FAQ about product quality
- `app/terms/page.tsx` - Product quality section and CTA
- `app/sustainability/page.tsx` - Packaging details
- `app/contact/page.tsx` - Address from "Fresh Market Lane" to "Market Lane"
- `app/components/Footer.tsx` - Footer description
- `app/layout.tsx` - SEO metadata description and keywords
- `app/data/sample-products.ts` - Product names and descriptions

---

### 2026-02-09 @ 14:37 IST - Documentation Update

#### 🔧 Modified
- **Complete rewrite of `analyze.md`** to reflect current project state
- Added missing directories: `lib/`, `hooks/`, `account/`, `login/`, `register/`, `forgot-password/`, `reset-password/`, `privacy/`, `terms/`, `faq/`
- Added missing components: `DisclaimerBanner.tsx`, `FeaturedProducts.tsx`
- Added missing context: `AuthContext.tsx`
- Updated statistics to reflect actual counts (22 pages, 10 components)
- Reorganized change log in chronological order (newest first)
- Added new sections: Hooks, API Layer
- Moved Rules section to top with proper formatting

---

### 2026-02-07 @ ~13:00 IST - CORS and JWT Fixes

#### 🔧 Modified
- Backend configured to trust proxies for production deployment
- JWT expiration times adjusted for production environment

#### 📝 Notes
- See `backend/analyze.md` for backend-specific changes

---

### 2026-02-04 @ 17:10 IST - Quality Text Update

#### 🔧 Modified
- Replaced "pasture-raised beef" with "pasture-raised goats" in Quality sections

#### 📁 Files Changed
- `app/page.tsx`
- `app/quality/page.tsx`

---

### 2026-02-04 @ 17:04 IST - Disclaimer Text Update

#### 🔧 Modified
- Updated temperature symbol: "-18 °C" instead of "-18 degrees celsius"

#### 📁 Files Changed
- `app/components/DisclaimerBanner.tsx`

---

### 2026-02-04 @ 17:01 IST - Disclaimer Banner Refined

#### 🔧 Modified
- Background changed to transparent
- Text styling updated to thin/light font weight (`font-light`)
- Animation direction reversed (Left to Right)
- Added `marquee-reverse` animation to `globals.css`

---

### 2026-02-04 @ 16:25 IST - Contact Page Updates

#### 🔧 Modified
- `app/contact/page.tsx` - Removed "Follow Us" social links section
- `app/lib/api.ts` - Updated `contact.submit` signature to include `subject`
- `app/components/ContactForm.tsx` - Integrated with real backend API

#### 📝 Notes
- Contact form submissions now properly send the `subject` field to the backend

---

### 2026-02-04 @ 15:58 IST - Contact Form Backend Integration

#### 🔧 Modified
- Connected `ContactForm.tsx` to real backend API (`/api/contact`)
- Submissions are now saved to the MongoDB database
- Added "Order Mismatch" option to contact form subjects

#### 📁 Files Changed
- `app/components/ContactForm.tsx`

---

### 2026-02-04 @ 14:18 IST - Product Page Update

#### 🔧 Modified
- Switched from static data to dynamic backend data fetching
- Implemented `useProduct` hook to fetch product details by ID
- Updated UI to display larger high-resolution product images
- Added "Related Products" section dynamically fetched by category
- Improved "Add to Cart" and stock status display with animations

#### 🔧 Fixed
- **Header Visibility:** Implemented dynamic contrast handling in `Header.tsx`
- Logo and navigation now automatically switch to dark text on non-home pages

---

### 2026-02-04 @ 14:12 IST - Shop Grid Update

#### 🔧 Modified
- Updated product grid to display 4 cards per row on large screens (previously 3)
- Affects `/shop` and `/shop/[category]` pages

---

### 2026-02-03 @ 09:45 IST - Styling Website Text

#### 🔧 Modified
- Updated text colors to black for better contrast and readability
- Fixed visibility issues on gradient backgrounds

---

### 2026-01-30 @ 14:30 IST - Critical Checkout Bug Fix

#### 🐛 Fixed
- **CRITICAL:** Checkout was NOT saving orders to backend!
- `handlePlaceOrder()` was only simulating an API call
- Now correctly calls `api.orders.create()` with proper order data

#### ✨ Added
- Authentication check - redirects to login if user is not authenticated
- Auth loading state - shows spinner while checking authentication
- Order number display on success page
- "View My Orders" button on order success page
- Error display for failed order placements

#### 📁 Files Changed
- `app/checkout/page.tsx`

---

### 2026-01-30 @ 13:56 IST - Bug Fixes & API Updates

#### 🐛 Fixed
- `app/cart/page.tsx` - Fixed TypeScript errors for Product/LegacyProduct type handling
- Added helper functions: `getProductId()`, `getCategorySlug()`, `getProductWeight()`
- `app/account/orders/page.tsx` - Fixed order item display

#### 🔧 Modified
- `app/lib/api-config.ts` - Changed categories endpoint from `/api/admin/categories` to `/api/categories` (public)
- `app/types/index.ts` - Updated Order item type to handle populated product objects
- `app/data/sample-products.ts` - Changed type from `Product` to `LegacyProduct`

---

### 2026-01-30 @ 13:13 IST - User Account Feature Implementation

#### ✨ Added
- `/account` - User profile page with edit functionality
- `/account/orders` - Order history page with status badges
- `/account/password` - Change password page
- `/forgot-password` - Request password reset page
- `/reset-password/[token]` - Reset password with token page
- Header user menu dropdown (avatar, account links, logout)
- Login/Sign Up buttons in Header for logged-out users
- Auth protection for account pages

#### 🔧 Modified
- `app/lib/api-config.ts` - Added profile endpoints
- `app/lib/api.ts` - Added profile methods
- `app/context/AuthContext.tsx` - Added updateProfile() method
- `app/components/Header.tsx` - Complete rewrite with user authentication menu

#### 📁 Files Created
- `app/account/layout.tsx`
- `app/account/page.tsx`
- `app/account/orders/page.tsx`
- `app/account/password/page.tsx`
- `app/forgot-password/page.tsx`
- `app/reset-password/[token]/page.tsx`

---

### 2026-01-30 @ 08:32 IST - Updating Website Colors

#### 🔧 Modified
- **Major Theme Change:** Switched Primary Color from Cyan to Sky Blue (`#19ABFF`)
- Updated `globals.css` variable definitions
- Ensured consistent application across all components

---

### 2026-01-30 @ 07:34 IST - Orders & API Fixes

#### 🐛 Fixed
- Resolved issue where placed orders were not appearing in order history
- Fixed API endpoints for public category access

---

### 2026-01-29 @ 17:44 IST - Initial Analysis

#### ✨ Added
- Created initial `analyze.md` document

#### 📁 Files Analyzed
- `package.json` - Project dependencies
- `app/layout.tsx` - Root layout
- `app/page.tsx` - Homepage
- `app/globals.css` - Design system
- `app/components/*` - All components
- `app/context/CartContext.tsx` - Cart state management
- `app/data/sample-products.ts` - Product data
- `app/types/index.ts` - TypeScript definitions

#### 📝 Notes
- Website is for JHOM FOODS - Premium Meat & Seafood
- E-commerce ready with cart and checkout
- Uses TailwindCSS v4 with custom CSS design system
- All pages have proper metadata for SEO
- Cart persists to localStorage

---

> **Note:** Use the Change Log section above to document all future changes, additions, and modifications to the project.
