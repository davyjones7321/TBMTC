require('dotenv').config();
require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express'); // Force restart
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Trust proxy - required for apps behind reverse proxies (Render, Heroku, etc.)
// This allows express-rate-limit to correctly identify users via X-Forwarded-For header
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000', // Next.js dev server
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:8080',
        'http://localhost:8081', // Expo web
        'http://localhost:8082', // Expo web alternate port
        'http://localhost:19006', // Expo web legacy
        'https://tbmtc-aw1x.vercel.app', // Frontend website
        'https://tbmtc.vercel.app', // Admin panel
        'https://tbmtc.onrender.com',
        process.env.CORS_ORIGIN
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api/', limiter);
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('public/images'));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin/dashboard', require('./routes/dashboard'));
app.use('/api/admin/customers', require('./routes/customers'));
app.use('/api/products', require('./routes/products'));
app.use('/api/admin/products', require('./routes/products'));
app.use('/api/admin/orders', require('./routes/orders'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin/sales', require('./routes/sales'));
app.use('/api/admin/categories', require('./routes/categories'));
app.use('/api/admin/users', require('./routes/users'));
app.use('/api/admin/settings', require('./routes/settings'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/bulk-orders', require('./routes/bulkOrders'));
app.use('/api/categories', require('./routes/publicCategories'));
app.use('/api/migrations', require('./routes/migrations'));

// Welcome route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to E-Commerce Admin API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/auth',
            dashboard: '/api/admin/dashboard',
            customers: '/api/admin/customers',
            products: '/api/admin/products',
            orders: '/api/admin/orders',
            sales: '/api/admin/sales',
            categories: '/api/admin/categories'
        }
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    server.close(() => process.exit(1));
});

module.exports = app;
