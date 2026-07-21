# JHOM FOODS Admin Panel - Development Notes

## Project Overview
React-based admin panel for JHOM FOODS e-commerce platform.

**Tech Stack:**
- React with TypeScript
- Vite (dev server)
- React Router for routing
- Shadcn/ui component library (Button, Input, Label, Textarea, Select, Switch, Card)
- Lucide React icons

**Port:** 5174

---

## Rules
1. Do not change anything until it's necessary.
2. If you want to change anything, ask permission from the user.
3. If you find any bug, report it to the user.
4. Update this file if you make changes in the admin panel.

---

## Key Pages

| Route | File | Description |
|-------|------|-------------|
| `/products` | `ProductList.tsx` | Product list with featured toggle |
| `/products/new` | `ProductCreate.tsx` | Create new product form |
| `/products/:id` | `ProductEdit.tsx` | Edit existing product form |

---

## Product Form Sections

Both `ProductCreate.tsx` and `ProductEdit.tsx` use the same form layout:

### Basic Information
- Product Name, Short Description, Full Description

### Pricing & Units (4-column grid)
- Selling Price (₹)
- Unit Type (piece, kg, g, l, ml)
- Unit Value (e.g., 1 for 1 kg)
- **Pieces per KG** — Approximate number of pieces in 1 kg (optional, saved as `piecesPerKg` on backend)

### Variants
- Managed by `VariantManager` component (size, price, stock, sku per variant)

### Inventory
- SKU, Stock Quantity, Low Stock Alert, Track Inventory toggle

### Sidebar
- Product Status (Active/Featured toggles)
- Category selector
- Product Image (URL input)
- Tags

---

## Change Log

### 2026-02-12 @ 17:20 IST - Pieces per KG Feature

#### ✨ Added
- **Pieces per KG field** in Pricing & Units section of both `ProductCreate.tsx` and `ProductEdit.tsx`
- Field is optional, saves as `piecesPerKg` (Number) to backend
- Helper text: "Approx. pieces in 1 kg"
- Grid changed from 3-column to 4-column to accommodate the new field

#### 📁 Files Changed
- `admin/src/pages/products/ProductEdit.tsx`
- `admin/src/pages/products/ProductCreate.tsx`

---

### 2026-02-12 @ 19:45 IST - UI Fixes
#### 🐛 Fixed
- **Double Scrollbars:** Fixed issue where admin panel showed two vertical scrollbars.
- Added `height: 100vh` and `overflow: hidden` to `body` in `index.css` to prevent browser-level scrolling.

---

> **Note:** Keep this document updated with all admin panel changes, additions, and modifications.
