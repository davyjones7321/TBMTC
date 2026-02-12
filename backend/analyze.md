# JHOM FOODS Backend - Development Notes

## Project Overview
Express.js backend API for JHOM FOODS e-commerce platform.

## rules 
1. do not change anything untill its nessacry
2. if you want to change anything , ask permission from the user
3. if you find any bug , report it to the user
4. this backend is for admin, website, and application. so if you want to make changes assume that changes made will affect all those things.
5. do not use generic information to make changes.
6. update if you make changes in backend and update the analyze.md file.

**Tech Stack:**
- Express.js with Node.js
- MongoDB with Mongoose ODM
- JWT Authentication
- bcrypt for password hashing

**Port:** 5000
**Database:** MongoDB Atlas (ecommerce)

---

## Change Log

### 2026-02-12 @ 17:20 IST - Pieces per KG Feature

#### ✨ Added
- `models/Product.js` - Added `piecesPerKg` field (Number, default: null) to Product schema
- Allows admin to set approximate number of pieces per 1 kg for a product
- Displayed on website and mobile app product detail pages

---

### 2026-02-12 @ 16:00 IST - All Prawn Sizes (9 Variants)

#### 🔧 Modified
- `scripts/add-variants.js` - Added Tiger Prawns to variant generation
- `scripts/seed-full-products.js` - Tiger Prawns now has all 9 prawn sizes
- `scripts/seed-frontend-products.js` - Same update for frontend seed data

#### 📝 Notes
- All 9 prawn sizes: 6/8, 8/12, 13/15, 16/20, 21/25, 31/40, 41/50, 51/60, 61/70
- `add-variants.js` script was run to update the database

---

### 2026-02-04 @ 14:07 IST - Documentation Verification

#### 🔧 Verified
- Confirmed `analyze.md` accurately reflects current backend state and API endpoints.

---

### 2026-01-30 @ 13:56 IST - User Account Features & Fixes

#### ✨ Added
- `routes/publicCategories.js` - Public categories endpoint for shop pages (no auth required)
- Public endpoint: `GET /api/categories` - Get all active categories
- Public endpoint: `GET /api/categories/:slug` - Get category by slug

#### 🔧 Modified
- `server.js` - Registered public categories route at `/api/categories`
- `routes/orders.js` - Order creation now saves `name` and `sku` in order items
- `routes/orders.js` - Added fallback Customer lookup by email in my-orders endpoint
- `routes/orders.js` - Auto-links Customer to User when found by email

#### 📝 Notes
- Orders endpoint `/api/orders/my-orders` now performs two-step lookup:
  1. First tries to find Customer by `userId`
  2. Falls back to finding Customer by `email`
  3. If found by email, automatically links the Customer record to the User for future queries
- This fixes issues where legacy Customer records weren't linked to User accounts

---

## API Endpoints Reference

### Public Endpoints (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all active categories |
| GET | `/api/categories/:slug` | Get category by slug |
| GET | `/api/products` | Get products (paginated) |
| GET | `/api/products/:id` | Get product by ID |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password/:token` | Reset password |

### Protected Endpoints (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update profile (name, phone) |
| PUT | `/api/profile/password` | Change password |
| GET | `/api/orders/my-orders` | Get user's orders |
| POST | `/api/orders` | Create new order |

### Admin Endpoints (Admin Role Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/categories` | Get all categories (admin) |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |
| GET | `/api/admin/orders` | Get all orders |
| PATCH | `/api/admin/orders/:id/status` | Update order status |

---

## Known Issues & TODOs

### In Progress
- [ ] Customer-User linking: Some legacy Customer records may not have `userId` field
  - Workaround: my-orders endpoint now looks up by email as fallback
  - Long-term: Run migration to link all Customers to Users

### Resolved
- [x] Public categories endpoint created for shop pages
- [x] Order items now include product name and SKU
- [x] Contact Form: Schema and Routes updated for Subject categorization

#### Queries Stats Problem & Fix Attempt
**Problem:** Admin dashboard stats were showing 0 queries despite existing data.
**Root Cause:** Legacy query documents were created before the `subject` field was added to the schema. The aggregation logic groups by `subject`, so queries with missing `subject` (null) were excluded or grouped incorrectly.
**Fix Implemented:**
- Updated `ContactQuery` schema to include `subject`.
- Created `GET /api/contact/stats` to aggregate counts.
- Ran migration script (`migrate_contact.js`) to backfill `subject: 'general'` for all existing documents.
**Status:** User reported stats still not reflecting correct counts. Further debugging stopped per request.

---

### 2026-02-04 @ 16:40 IST - Admin Panel Enhancements

#### ✨ Added
- **Featured Product Toggle:** Added a "Featured" column to the Admin Product List.
- Allows admins to instantly toggle a product's "Featured" status directly from the list view.
- Toggled products immediately appear in the "Featured Products" section on the Website Home Page.

#### 🔧 Modified
- `admin/src/pages/products/ProductList.tsx` - Added `isFeatured` toggle logic and UI.

---

---

> **Note:** Keep this document updated with all backend changes, additions, and modifications.
