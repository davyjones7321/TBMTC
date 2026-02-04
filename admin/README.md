# Admin Panel - E-Commerce Platform

A modern, production-ready admin panel built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend API running on `http://localhost:5000`

### Installation & Setup

```bash
# Navigate to admin folder
cd admin

# Install dependencies
npm install

# Start development server
npm run dev
```

The admin panel will run on **http://localhost:5174**

### Login Credentials

- **Email:** `khader7321@gmail.com`
- **Password:** `9113239243`

---

## ✨ Features (Phase 1)

### Authentication
- ✅ Secure admin login with JWT
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Session persistence

### Dashboard
- ✅ Key metrics (Revenue, Orders, Customers, Low Stock)
- ✅ Real-time data from backend API
- ✅ Loading states

### Product Management
- ✅ View all products in table format
- ✅ Product details with images
- ✅ Stock level indicators (color-coded)
- ✅ Delete products with confirmation
- ✅ Active/Inactive status badges

### Navigation
- ✅ Sidebar with active route highlighting
- ✅ User info display
- ✅ Logout functionality

---

## 📁 Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components
│   │   ├── ui/              # Shadcn UI components
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication state
│   ├── lib/
│   │   ├── api.ts          # API client with interceptors
│   │   ├── constants.ts    # App constants
│   │   └── utils.ts        # Utility functions
│   ├── pages/
│   │   ├── Login.tsx       # Admin login
│   │   ├── Dashboard.tsx   # Overview & stats
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management (coming soon)
│   │   ├── customers/      # Customer management (coming soon)
│   │   └── reports/        # Sales reports (coming soon)
│   ├── types/
│   │   └── index.ts        # TypeScript definitions
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── .env                    # Environment variables
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Routing** | React Router v6 |
| **State Management** | React Query (TanStack) |
| **HTTP Client** | Axios |
| **UI Framework** | Shadcn UI + Tailwind CSS |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |
| **Icons** | Lucide React |

---

## 🔌 API Integration

The admin panel connects to the backend API running on `http://localhost:5000`.

### Available Endpoints

- `POST /api/auth/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/products` - List products
- `DELETE /api/admin/products/:id` - Delete product
- More endpoints available (see src/lib/api.ts)

---

## 📝 Next Steps (Phase 2)

### To Complete:
1. **Product Forms** - Create/Edit product functionality
2. **Order Management** - View orders, update status
3. **Customer Management** - View customers and analytics
4. **Sales Reports** - Charts and analytics
5. **Polish** - Toast notifications, better error handling

---

## 🎨 Design Features

- Clean, modern UI design
- Responsive layout
- Color-coded status indicators
- Smooth hover effects
- Active route highlighting
- Loading states
- Error handling

---

## 📄 License

MIT License

---

**Built with ❤️ for efficient e-commerce management**
