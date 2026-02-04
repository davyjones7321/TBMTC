const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticate, isAdmin } = require('../middleware/auth');
const { successResponse, errorResponse, getDateRange } = require('../utils/helpers');

// All routes require authentication and admin role
router.use(authenticate, isAdmin);

// @route   GET /api/admin/sales/report
// @desc    Get sales report by date range
// @access  Private/Admin
router.get('/report', async (req, res) => {
    try {
        const { period = 'month', startDate, endDate } = req.query;

        let dateRange;
        if (startDate && endDate) {
            dateRange = {
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            };
        } else {
            dateRange = getDateRange(period);
        }

        const salesData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$total' },
                    totalOrders: { $sum: 1 },
                    averageOrderValue: { $avg: '$total' },
                    totalItems: { $sum: { $size: '$items' } }
                }
            }
        ]);

        // Get daily breakdown
        const dailyBreakdown = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
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

        // Get payment method breakdown
        const paymentMethodBreakdown = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    revenue: { $sum: '$total' }
                }
            }
        ]);

        successResponse(res, {
            period: {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            },
            summary: salesData[0] || {
                totalRevenue: 0,
                totalOrders: 0,
                averageOrderValue: 0,
                totalItems: 0
            },
            dailyBreakdown,
            paymentMethodBreakdown
        });
    } catch (error) {
        console.error('Sales report error:', error);
        errorResponse(res, 'Failed to generate sales report', 500);
    }
});

// @route   GET /api/admin/sales/by-category
// @desc    Get sales breakdown by category
// @access  Private/Admin
router.get('/by-category', async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        const { startDate, endDate } = getDateRange(period);

        const categoryData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: { $nin: ['cancelled', 'refunded'] }
                }
            },
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
                    _id: {
                        categoryId: '$category._id',
                        categoryName: '$category.name'
                    },
                    revenue: { $sum: '$items.subtotal' },
                    itemsSold: { $sum: '$items.quantity' },
                    orders: { $addToSet: '$_id' }
                }
            },
            {
                $project: {
                    categoryId: '$_id.categoryId',
                    categoryName: '$_id.categoryName',
                    revenue: 1,
                    itemsSold: 1,
                    orderCount: { $size: '$orders' }
                }
            },
            { $sort: { revenue: -1 } }
        ]);

        successResponse(res, { categories: categoryData });
    } catch (error) {
        console.error('Sales by category error:', error);
        errorResponse(res, 'Failed to fetch sales by category', 500);
    }
});

// @route   GET /api/admin/sales/by-product
// @desc    Get top-selling products
// @access  Private/Admin
router.get('/by-product', async (req, res) => {
    try {
        const { period = 'month', limit = 20 } = req.query;
        const { startDate, endDate } = getDateRange(period);

        const productData = await Order.aggregate([
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
                    productName: { $first: '$items.name' },
                    sku: { $first: '$items.sku' },
                    revenue: { $sum: '$items.subtotal' },
                    quantitySold: { $sum: '$items.quantity' },
                    orders: { $addToSet: '$_id' }
                }
            },
            {
                $project: {
                    productId: '$_id',
                    productName: 1,
                    sku: 1,
                    revenue: 1,
                    quantitySold: 1,
                    orderCount: { $size: '$orders' }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: parseInt(limit) }
        ]);

        successResponse(res, { products: productData });
    } catch (error) {
        console.error('Sales by product error:', error);
        errorResponse(res, 'Failed to fetch sales by product', 500);
    }
});

// @route   GET /api/admin/sales/trends
// @desc    Get sales trends over time
// @access  Private/Admin
router.get('/trends', async (req, res) => {
    try {
        const { period = 'year', groupBy = 'month' } = req.query;
        const { startDate, endDate } = getDateRange(period);

        let groupFormat;
        switch (groupBy) {
            case 'day':
                groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                break;
            case 'week':
                groupFormat = {
                    year: { $year: '$createdAt' },
                    week: { $week: '$createdAt' }
                };
                break;
            case 'month':
                groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
                break;
            default:
                groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        }

        const trends = await Order.aggregate([
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
                    orders: { $sum: 1 },
                    averageOrderValue: { $avg: '$total' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        successResponse(res, {
            period,
            groupBy,
            trends
        });
    } catch (error) {
        console.error('Sales trends error:', error);
        errorResponse(res, 'Failed to fetch sales trends', 500);
    }
});

module.exports = router;
