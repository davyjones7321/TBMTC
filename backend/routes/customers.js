const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const auditLog = require('../middleware/auditLog');
const { successResponse, errorResponse, paginate, paginationResponse } = require('../utils/helpers');

// All routes require authentication and admin role
router.use(authenticate, isAdmin);

// @route   GET /api/admin/customers
// @desc    Get all customers with pagination and filters
// @access  Private/Admin
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            sortBy = 'createdAt',
            order = 'desc',
            minSpent,
            maxSpent
        } = req.query;

        const { skip, limit: limitNum, page: pageNum } = paginate(page, limit);

        // Build query
        const query = {};

        // Search by name or email
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by total spent
        if (minSpent || maxSpent) {
            query.totalSpent = {};
            if (minSpent) query.totalSpent.$gte = parseFloat(minSpent);
            if (maxSpent) query.totalSpent.$lte = parseFloat(maxSpent);
        }

        // Build sort
        const sort = {};
        sort[sortBy] = order === 'asc' ? 1 : -1;

        // Execute query
        const [customers, total] = await Promise.all([
            Customer.find(query)
                .populate('userId', 'email isActive')
                .sort(sort)
                .skip(skip)
                .limit(limitNum),
            Customer.countDocuments(query)
        ]);

        const response = paginationResponse(customers, pageNum, limitNum, total);
        successResponse(res, response);
    } catch (error) {
        console.error('Get customers error:', error);
        errorResponse(res, 'Failed to fetch customers', 500);
    }
});

// @route   GET /api/admin/customers/:id
// @desc    Get customer details with order history
// @access  Private/Admin
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .populate('userId', 'email isActive lastLogin');

        if (!customer) {
            return errorResponse(res, 'Customer not found', 404);
        }

        // Get customer's orders
        const orders = await Order.find({ customer: customer._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('orderNumber total status paymentStatus createdAt');

        // Get order statistics
        const orderStats = await Order.aggregate([
            { $match: { customer: customer._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        successResponse(res, {
            customer,
            orders,
            orderStats: orderStats.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {})
        });
    } catch (error) {
        console.error('Get customer error:', error);
        errorResponse(res, 'Failed to fetch customer', 500);
    }
});

// @route   PUT /api/admin/customers/:id
// @desc    Update customer information
// @access  Private/Admin
router.put('/:id', validate(schemas.updateCustomer), auditLog('update', 'customer'), async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('userId', 'email');

        if (!customer) {
            return errorResponse(res, 'Customer not found', 404);
        }

        successResponse(res, { customer }, 'Customer updated successfully');
    } catch (error) {
        console.error('Update customer error:', error);
        errorResponse(res, 'Failed to update customer', 500);
    }
});

// @route   DELETE /api/admin/customers/:id
// @desc    Delete customer (soft delete)
// @access  Private/Admin
router.delete('/:id', auditLog('delete', 'customer'), async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return errorResponse(res, 'Customer not found', 404);
        }

        // Soft delete - deactivate associated user account
        const User = require('../models/User');
        await User.findByIdAndUpdate(customer.userId, { isActive: false });

        successResponse(res, null, 'Customer deactivated successfully');
    } catch (error) {
        console.error('Delete customer error:', error);
        errorResponse(res, 'Failed to delete customer', 500);
    }
});

// @route   GET /api/admin/customers/:id/analytics
// @desc    Get customer purchase analytics
// @access  Private/Admin
router.get('/:id/analytics', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return errorResponse(res, 'Customer not found', 404);
        }

        // Get monthly spending trend
        const monthlySpending = await Order.aggregate([
            {
                $match: {
                    customer: customer._id,
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    total: { $sum: '$total' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 12 }
        ]);

        // Get favorite categories
        const favoriteCategories = await Order.aggregate([
            { $match: { customer: customer._id } },
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
                    totalSpent: { $sum: '$items.subtotal' },
                    itemsPurchased: { $sum: '$items.quantity' }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 }
        ]);

        successResponse(res, {
            customerStats: {
                totalOrders: customer.totalOrders,
                totalSpent: customer.totalSpent,
                averageOrderValue: customer.averageOrderValue,
                lastOrderDate: customer.lastOrderDate,
                customerSince: customer.customerSince
            },
            monthlySpending,
            favoriteCategories
        });
    } catch (error) {
        console.error('Customer analytics error:', error);
        errorResponse(res, 'Failed to fetch customer analytics', 500);
    }
});

module.exports = router;
