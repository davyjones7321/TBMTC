# E-Commerce Backend API

A comprehensive backend system for an e-commerce admin panel built with Express.js, MongoDB Atlas, and JWT authentication.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Dashboard Analytics**: Real-time statistics, revenue charts, and business insights
- **Customer Management**: Complete CRUD operations with purchase analytics
- **Inventory Management**: Product management with stock tracking and low-stock alerts
- **Order Management**: Order processing with status tracking and inventory synchronization
- **Sales Reports**: Comprehensive sales analytics and trend analysis
- **Category Management**: Hierarchical category structure
- **Audit Logging**: Track all admin actions for compliance
- **Security**: Rate limiting, input validation, and error handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd axial-crater
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   The `.env` file is already configured with your MongoDB Atlas connection. Review and update if needed:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=7d
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 🔐 Default Admin Credentials

After seeding the database, use these credentials to login:

- **Email**: `admin@example.com`
- **Password**: `Admin@123`

⚠️ **Important**: Change these credentials immediately in production!

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

All admin routes require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints Overview

#### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new admin (admin only)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout user

#### Dashboard
- `GET /api/admin/dashboard/overview` - Get dashboard statistics
- `GET /api/admin/dashboard/revenue-chart` - Get revenue chart data
- `GET /api/admin/dashboard/recent-orders` - Get recent orders
- `GET /api/admin/dashboard/top-products` - Get top-selling products
- `GET /api/admin/dashboard/recent-customers` - Get recent customers

#### Customers
- `GET /api/admin/customers` - List all customers (with pagination)
- `GET /api/admin/customers/:id` - Get customer details
- `PUT /api/admin/customers/:id` - Update customer
- `DELETE /api/admin/customers/:id` - Delete customer
- `GET /api/admin/customers/:id/analytics` - Get customer analytics

#### Products
- `GET /api/admin/products` - List all products (with pagination)
- `GET /api/admin/products/low-stock` - Get low stock products
- `GET /api/admin/products/:id` - Get product details
- `POST /api/admin/products` - Create new product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `PATCH /api/admin/products/:id/stock` - Update stock quantity

#### Orders
- `GET /api/admin/orders` - List all orders (with filters)
- `GET /api/admin/orders/stats` - Get order statistics
- `GET /api/admin/orders/:id` - Get order details
- `PATCH /api/admin/orders/:id/status` - Update order status

#### Sales
- `GET /api/admin/sales/report` - Get sales report
- `GET /api/admin/sales/by-category` - Sales by category
- `GET /api/admin/sales/by-product` - Top-selling products
- `GET /api/admin/sales/trends` - Sales trends over time

#### Categories
- `GET /api/admin/categories` - List all categories
- `GET /api/admin/categories/:id` - Get category details
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/categories/:id` - Update category
- `DELETE /api/admin/categories/:id` - Delete category

## 📝 Example API Calls

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin@123"
  }'
```

### Get Dashboard Overview
```bash
curl -X GET http://localhost:5000/api/admin/dashboard/overview \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json"
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "sku": "PROD-001",
    "price": 99.99,
    "category": "category_id",
    "stock": {
      "quantity": 100,
      "lowStockThreshold": 10
    }
  }'
```

### Get Orders with Filters
```bash
curl -X GET "http://localhost:5000/api/admin/orders?status=pending&page=1&limit=10" \
  -H "Authorization: Bearer <your_token>"
```

## 🗂️ Project Structure

```
axial-crater/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── User.js              # User model
│   ├── Customer.js          # Customer model
│   ├── Product.js           # Product model
│   ├── Order.js             # Order model
│   ├── Category.js          # Category model
│   └── AuditLog.js          # Audit log model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── dashboard.js         # Dashboard routes
│   ├── customers.js         # Customer routes
│   ├── products.js          # Product routes
│   ├── orders.js            # Order routes
│   ├── sales.js             # Sales routes
│   └── categories.js        # Category routes
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Error handling
│   ├── validation.js        # Input validation
│   └── auditLog.js          # Audit logging
├── utils/
│   └── helpers.js           # Utility functions
├── scripts/
│   └── seed.js              # Database seeding
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md               # Documentation
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password encryption
- **Rate Limiting**: Prevent brute force attacks
- **Input Validation**: Joi schema validation
- **CORS**: Configurable cross-origin resource sharing
- **Audit Logging**: Track all admin actions
- **Role-Based Access**: Admin-only routes protection

## 📊 Database Models

### User
- Email, password, name, role (admin/customer)
- Active status and last login tracking

### Customer
- Personal information and contact details
- Multiple addresses support
- Purchase statistics (total orders, total spent, average order value)

### Product
- Complete product information
- Stock management with low-stock alerts
- Category association
- Images and variants support

### Order
- Order items with product references
- Status tracking (pending, processing, shipped, delivered, cancelled)
- Payment information
- Shipping and billing addresses

### Category
- Hierarchical category structure
- Active/inactive status
- Sort ordering

### AuditLog
- User action tracking
- Resource and action type
- IP address and user agent logging

## 🧪 Testing

The backend includes sample data for testing. After running `npm run seed`, you'll have:

- 1 admin user
- 3 customer users with profiles
- 5 product categories
- 8 sample products
- 3 sample orders

## 🚀 Deployment

### Environment Variables for Production

Update these variables for production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_random_secret
JWT_REFRESH_SECRET=your_strong_refresh_secret
CORS_ORIGIN=your_frontend_url
```

### Deployment Platforms

This backend can be deployed to:
- Heroku
- AWS (EC2, Elastic Beanstalk)
- DigitalOcean
- Vercel
- Railway
- Render

## 📈 Performance Optimization

- Database indexes on frequently queried fields
- Pagination for large datasets
- Aggregation pipelines for analytics
- Efficient population of references

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

ISC

## 👨‍💻 Support

For issues and questions, please create an issue in the repository.

## 🔄 Version History

- **v1.0.0** - Initial release
  - Complete authentication system
  - Admin panel APIs
  - Dashboard analytics
  - Customer, product, and order management
  - Sales reports and analytics

---

**Built with ❤️ using Express.js and MongoDB**
