const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const { authenticate, isAdmin } = require('../middleware/auth');
const { successResponse, errorResponse, getDateRange } = require('../utils/helpers');

// All routes require authentication and admin role
router.use(authenticate, isAdmin);

// @route   GET /api/admin/dashboard/stats
// @desc    Get all dashboard stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        const { startDate, endDate } = getDateRange(period);

        // 1. Overview Stats
        const [
            totalCustomers,
            totalProducts,
            totalOrders,
            revenueData
        ] = await Promise.all([
            Customer.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$total' },
                        averageOrderValue: { $avg: '$total' }
                    }
                }
            ])
        ]);

        // 2. Low Stock
        const lowStockCount = await Product.countDocuments({
            $expr: { $lte: ['$stock.quantity', '$stock.lowStockThreshold'] }
        });

        // 3. Recent Orders
        const recentOrders = await Order.find()
            .populate('customer', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderNumber customer total status paymentStatus createdAt');

        // 4. Sales Data (Revenue Chart) - Last 7 days for simplicity or based on period
        // For now, let's just get last 7 days daily revenue
        const chartStartDate = new Date();
        chartStartDate.setDate(chartStartDate.getDate() - 7);

        const salesDataRaw = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: chartStartDate },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const salesData = salesDataRaw.map(item => ({
            date: item._id,
            sales: item.revenue,
            orders: item.orders
        }));

        // 5. Category Breakdown (Top Categories)
        const categoryBreakdownRaw = await Order.aggregate([
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'product.category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            {
                $group: {
                    _id: '$category.name',
                    value: { $sum: '$items.subtotal' }
                }
            },
            { $limit: 5 }
        ]);

        const categoryBreakdown = categoryBreakdownRaw.map(item => ({
            name: item._id,
            value: item.value
        }));

        successResponse(res, {
            totalRevenue: revenueData[0]?.totalRevenue || 0,
            revenueChange: 12.5, // Mocked for now
            totalOrders,
            ordersChange: 8.2, // Mocked
            totalCustomers,
            customersChange: 15.3, // Mocked
            lowStockCount,
            recentOrders,
            salesData,
            categoryBreakdown
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        errorResponse(res, 'Failed to fetch dashboard stats', 500);
    }
});

// @route   GET /api/admin/dashboard/overview
// @desc    Get dashboard overview statistics
// @access  Private/Admin
router.get('/overview', async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        const { startDate, endDate } = getDateRange(period);

        // Get total statistics
        const [
            totalCustomers,
            totalProducts,
            totalOrders,
            revenueData
        ] = await Promise.all([
            Customer.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Order.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: '$total' },
                        averageOrderValue: { $avg: '$total' }
                    }
                }
            ])
        ]);

        // Get period statistics
        const periodOrders = await Order.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const periodRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        // Get new customers in period
        const newCustomers = await Customer.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        // Get order status breakdown
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get low stock products count
        const lowStockProducts = await Product.countDocuments({
            $expr: { $lte: ['$stock.quantity', '$stock.lowStockThreshold'] }
        });

        successResponse(res, {
            overview: {
                totalCustomers,
                totalProducts,
                totalOrders,
                totalRevenue: revenueData[0]?.totalRevenue || 0,
                averageOrderValue: revenueData[0]?.averageOrderValue || 0
            },
            period: {
                name: period,
                startDate,
                endDate,
                orders: periodOrders,
                revenue: periodRevenue[0]?.total || 0,
                newCustomers
            },
            ordersByStatus: ordersByStatus.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            alerts: {
                lowStockProducts
            }
        });
    } catch (error) {
        console.error('Dashboard overview error:', error);
        errorResponse(res, 'Failed to fetch dashboard data', 500);
    }
});

// @route   GET /api/admin/dashboard/revenue-chart
// @desc    Get revenue chart data
// @access  Private/Admin
router.get('/revenue-chart', async (req, res) => {
    try {
        const { period = 'month', groupBy = 'day' } = req.query;
        const { startDate, endDate } = getDateRange(period);

        let groupFormat;
        switch (groupBy) {
            case 'hour':
                groupFormat = { $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' } };
                break;
            case 'day':
                groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                break;
            case 'week':
                groupFormat = { $week: '$createdAt' };
                break;
            case 'month':
                groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
                break;
            default:
                groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        }

        const revenueData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: groupFormat,
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        successResponse(res, {
            period,
            groupBy,
            data: revenueData.map(item => ({
                date: item._id,
                revenue: item.revenue,
                orders: item.orders
            }))
        });
    } catch (error) {
        console.error('Revenue chart error:', error);
        errorResponse(res, 'Failed to fetch revenue data', 500);
    }
});

// @route   GET /api/admin/dashboard/recent-orders
// @desc    Get recent orders
// @access  Private/Admin
router.get('/recent-orders', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const orders = await Order.find()
            .populate('customer', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('orderNumber customer total status paymentStatus createdAt');

        successResponse(res, { orders });
    } catch (error) {
        console.error('Recent orders error:', error);
        errorResponse(res, 'Failed to fetch recent orders', 500);
    }
});

// @route   GET /api/admin/dashboard/top-products
// @desc    Get top-selling products
// @access  Private/Admin
router.get('/top-products', async (req, res) => {
    try {
        const { limit = 10, period = 'month' } = req.query;
        const { startDate, endDate } = getDateRange(period);

        const topProducts = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: { $nin: ['cancelled', 'refunded'] }
                }
            },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: '$items.subtotal' },
                    productName: { $first: '$items.name' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: parseInt(limit) }
        ]);

        successResponse(res, { products: topProducts });
    } catch (error) {
        console.error('Top products error:', error);
        errorResponse(res, 'Failed to fetch top products', 500);
    }
});

// @route   GET /api/admin/dashboard/recent-customers
// @desc    Get recently registered customers
// @access  Private/Admin
router.get('/recent-customers', async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const customers = await Customer.find()
            .populate('userId', 'email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('firstName lastName totalOrders totalSpent createdAt');

        successResponse(res, { customers });
    } catch (error) {
        console.error('Recent customers error:', error);
        errorResponse(res, 'Failed to fetch recent customers', 500);
    }
});

module.exports = router;
