# JHOMFOODS Mobile App - Project Analysis

> **Last Updated:** January 22, 2026  
> **Purpose:** Quick reference for AI assistants to understand the mobile app structure without re-analyzing.

---

## 📱 App Overview

| Property | Value |
|----------|-------|
| **App Name** | JHOMFOODS |
| **Package ID** | `com.jhomfoods.mobile` |
| **Version** | 1.0.0 |
| **Framework** | Expo SDK 54 + Expo Router 6 |
| **React Native** | 0.81.5 |
| **Styling** | NativeWind 4 (Tailwind CSS) |
| **State Management** | React Context + React Query |
| **Language** | TypeScript |

---

## 🗂️ Directory Structure

```
mobile/
├── app/                    # Expo Router file-based routing
│   ├── _layout.tsx         # Root layout with providers
│   ├── index.tsx           # Entry redirect
│   ├── (auth)/             # Auth screens group
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/             # Main tab navigation
│   │   ├── _layout.tsx     # Tab bar configuration
│   │   ├── home.tsx        # Home/Products screen
│   │   ├── cart.tsx        # Cart screen
│   │   └── profile.tsx     # User profile screen
│   ├── checkout/           # Checkout flow
│   │   ├── _layout.tsx
│   │   ├── delivery-details.tsx
│   │   ├── payment.tsx
│   │   └── review-order.tsx
│   ├── orders.tsx          # My Orders page
│   ├── help-support.tsx    # Help & Support page
│   ├── location-select.tsx # Location selection page
│   └── product/            # Product details
│       └── [id].tsx        # Dynamic product page
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── CategoryNav.tsx # Category filter navigation
│   │   └── ProductCard.tsx # Product display card
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   ├── CartContext.tsx
│   │   ├── CheckoutContext.tsx
│   │   ├── LocationContext.tsx
│   │   └── ProductsContext.tsx
│   ├── data/               # Data & types
│   │   ├── local-images.ts # Local image mappings
│   │   ├── products.ts     # Fallback product data
│   │   └── types.ts        # TypeScript types
│   ├── lib/                # Utilities
│   │   ├── api.ts          # Axios API client
│   │   ├── api-config.ts   # API URL configuration
│   │   ├── queryClient.ts  # React Query setup
│   │   └── storage.ts      # Secure storage wrapper
│   └── types/              # Additional types
├── assets/                 # Images, icons, fonts
├── app.json                # Expo configuration
├── package.json            # Dependencies
├── tailwind.config.js      # NativeWind config
├── tsconfig.json           # TypeScript config
└── babel.config.js         # Babel configuration
```

---

## 🔌 Backend API Integration

### Base URL Configuration (`src/lib/api-config.ts`)
### Base URL Configuration (`src/lib/api-config.ts`)
- **Active:** `https://jhomfoods-test-1.onrender.com` (Render Production)
- **Local (Commented):** `http://localhost:5000` or `http://192.168.1.11:5000`

### API Endpoints Used
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |
| `/api/auth/signup` | POST | User registration |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/me` | GET | Get current user |
| `/api/products` | GET | Get all products |
| `/api/products/:id` | GET | Get product by ID |
| `/api/admin/categories` | GET | Get categories |
| `/api/orders` | POST | Create order |
| `/api/orders/my-orders` | GET | Get user's orders |
| `/api/contact` | POST | Submit support query |

---

## 🎯 Context Providers

### 1. AuthContext (`src/contexts/AuthContext.tsx`)
- **State:** `user`, `loading`
- **Methods:** `login()`, `register()`, `logout()`, `refreshUser()`
- **Storage:** JWT token in Expo SecureStore

### 2. CartContext (`src/contexts/CartContext.tsx`)
- **State:** `cart`, `cartCount`, `cartTotal`, `loading`
- **Methods:** `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`, `placeOrder()`
- **Storage:** Cart persisted to AsyncStorage

### 3. ProductsContext (`src/contexts/ProductsContext.tsx`)
- **State:** `products`, `categories`, `loading`, `error`
- **Methods:** `refreshProducts()`, `getProductById()`
- **Features:** 
  - Fetches products from backend API
  - Transforms backend format to mobile format
  - Filters out Buffalo category (hidden)
  - Maps 'Fish' category to 'Seafood' to consolidate items

### 4. CheckoutContext (`src/contexts/CheckoutContext.tsx`)
- Manages checkout flow state

---

## 📦 Product Categories

| Category | Visible in App |
|----------|----------------|
| Seafood | ✅ Yes (Includes Fish) |
| Prawns | ✅ Yes |
| Chicken | ✅ Yes |
| Mutton | ✅ Yes |
| Buffalo | ❌ Hidden |

---

## 🔑 Key Data Types

### Product (Mobile App Format)
```typescript
interface Product {
    id: string;           // MongoDB _id
    name: string;
    description: string;
    price: number;
    unit: string;
    category: string;
    imageUrl: string;     // Remote image URL
    imageKey: string;     // Local image key
    freshness: 'Fresh' | 'Frozen';
    variations?: Array<{ size: string; price: number }>;
    inStock: boolean;
    stockQuantity: number;
}
```

### User
```typescript
interface User {
    id: string;
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
}
```

---

## 📜 Dependencies (Key Packages)

| Package | Version | Purpose |
|---------|---------|---------|
| expo | ~54.0.31 | Core framework |
| expo-router | ~6.0.22 | File-based routing |
| react-native | 0.81.5 | Mobile framework |
| nativewind | ^4.1.19 | Tailwind CSS for RN |
| @tanstack/react-query | ^5.90.12 | Data fetching |
| axios | ^1.13.2 | HTTP client |
| expo-secure-store | ~15.0.8 | Secure token storage |
| react-hook-form | ^7.68.0 | Form handling |
| zod | ^4.2.1 | Validation |
| lucide-react-native | ^0.561.0 | Icons |

---

## 🚀 Run Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

---

## ⚠️ Important Notes

1. **Backend Required:** The app fetches products from the backend API. Backend must be running.
2. **Network Config:** For physical devices, update IP in `src/lib/api-config.ts`
3. **Buffalo Hidden:** Buffalo products are filtered out in `ProductsContext.tsx`
4. **New Architecture:** React Native New Architecture is enabled (`"newArchEnabled": true`)
5. **OTA Updates Disabled:** Expo updates are disabled in `app.json`

---

## 📝 Changelog

| Date | Changes |
|------|---------|
| Jan 27, 2026 | Config: Switched API to Production - Updated `api-config.ts` to use `https://jhomfoods-test-1.onrender.com` by default for all platforms, replacing localhost configuration. |
| Jan 27, 2026 | Added: Global Error Handling - Standardized error messages for API (400, 401, 404, 500), Auth, Cart, and Location. |
| Jan 27, 2026 | Refactored: Checkout flow headers. Replaced native stack headers with custom `SafeAreaView` headers in `delivery-details.tsx`, `payment.tsx`, and `review-order.tsx` to definitively resolve status bar overlap/cutoff issues. |
| Jan 27, 2026 | Optimization: Category Consolidation - Merged "Fish" products into "Seafood" category. Updated `ProductsContext` mapping and removed "Fish" from `CategoryNav`. |
| Jan 27, 2026 | Added: Stock management UI - Low stock warning (≤10 items) and "Out of Stock" button state in `ProductCard.tsx`. Improved error handling in `CartContext.tsx` to show "Order exceeds current stock". |
| Jan 27, 2026 | Updated: Color theme changed from burgundy/crimson (#8B1538/#A91D3A) to coral/teal (#D84A4A/#4A9B9B). Primary=coral, accent=cream (#FFF8F0), secondary=teal for seafood. Applied to 11 files. |
| Jan 27, 2026 | Added: Location detection feature (`LocationContext.tsx` + `location-select.tsx`) with GPS detection, reverse geocoding, and saved locations. Tappable location in home header. |
| Jan 27, 2026 | Removed: Profile avatars from Home page header and Profile page (user preference) |
| Jan 27, 2026 | Fixed: Profile avatar now fully visible (was cut off by header). Added `paddingTop: 60` to scroll content in `profile.tsx` |
| Jan 27, 2026 | Added: Help & Support feature (`app/help-support.tsx`) with contact info, call/email actions, and support form. Integrates with `/api/contact` API. Accessible from Profile menu. |
| Jan 27, 2026 | Fixed: User full name now displays correctly in Profile (was showing "Guest User"). Added `constructFullName()` helper in `AuthContext.tsx` and `getDisplayName()` in `profile.tsx` |
| Jan 27, 2026 | Fixed: My Orders now shows order history correctly. Backend `/my-orders` endpoint was querying wrong ID - fixed to use Customer ID instead of User ID |
| Jan 24, 2026 | Added My Orders page (`app/orders.tsx`) with navigation from profile |
| Jan 22, 2026 | Initial analysis document created |

