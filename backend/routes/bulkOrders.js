const express = require('express');
const router = express.Router();
const BulkOrder = require('../models/BulkOrder');
const { authenticate, isAdmin } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/helpers');

// @route   POST /api/bulk-orders
// @desc    Submit a bulk order request
// @access  Public
router.post('/', async (req, res) => {
    try {
        const {
            businessName,
            businessType,
            contactName,
            email,
            phone,
            city,
            estimatedMonthlyVolume,
            productInterests,
            message
        } = req.body;

        const bulkOrder = await BulkOrder.create({
            businessName,
            businessType,
            contactName,
            email,
            phone,
            city,
            estimatedMonthlyVolume,
            productInterests,
            message
        });

        successResponse(res, { bulkOrder }, 'Bulk order request submitted successfully', 201);
    } catch (error) {
        console.error('Submit bulk order error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return errorResponse(res, messages[0], 400);
        }
        errorResponse(res, 'Failed to submit bulk order request', 500);
    }
});

// @route   GET /api/bulk-orders
// @desc    Get all bulk order requests
// @access  Private/Admin
router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        const bulkOrders = await BulkOrder.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await BulkOrder.countDocuments(query);

        successResponse(res, {
            bulkOrders,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalCount: count
        });
    } catch (error) {
        console.error('Get bulk orders error:', error);
        errorResponse(res, 'Failed to fetch bulk orders', 500);
    }
});

// @route   GET /api/bulk-orders/stats
// @desc    Get bulk order statistics
// @access  Private/Admin
router.get('/stats', authenticate, isAdmin, async (req, res) => {
    try {
        const stats = await BulkOrder.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalCount = await BulkOrder.countDocuments();
        const newCount = await BulkOrder.countDocuments({ status: 'new' });

        successResponse(res, {
            stats,
            totalCount,
            newCount
        }, 'Stats fetched successfully');
    } catch (error) {
        console.error('Get bulk order stats error:', error);
        errorResponse(res, 'Failed to fetch stats', 500);
    }
});

// @route   GET /api/bulk-orders/:id
// @desc    Get a single bulk order request
// @access  Private/Admin
router.get('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const bulkOrder = await BulkOrder.findById(req.params.id);

        if (!bulkOrder) {
            return errorResponse(res, 'Bulk order not found', 404);
        }

        successResponse(res, { bulkOrder });
    } catch (error) {
        console.error('Get bulk order error:', error);
        errorResponse(res, 'Failed to fetch bulk order', 500);
    }
});

// @route   PUT /api/bulk-orders/:id
// @desc    Update bulk order status
// @access  Private/Admin
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { status, notes } = req.body;
        const updateData = { updatedAt: Date.now() };

        if (status) updateData.status = status;
        if (notes !== undefined) updateData.notes = notes;

        const bulkOrder = await BulkOrder.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!bulkOrder) {
            return errorResponse(res, 'Bulk order not found', 404);
        }

        successResponse(res, { bulkOrder }, 'Bulk order updated successfully');
    } catch (error) {
        console.error('Update bulk order error:', error);
        errorResponse(res, 'Failed to update bulk order', 500);
    }
});

// @route   DELETE /api/bulk-orders/:id
// @desc    Delete a bulk order request
// @access  Private/Admin
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const bulkOrder = await BulkOrder.findByIdAndDelete(req.params.id);

        if (!bulkOrder) {
            return errorResponse(res, 'Bulk order not found', 404);
        }

        successResponse(res, null, 'Bulk order deleted successfully');
    } catch (error) {
        console.error('Delete bulk order error:', error);
        errorResponse(res, 'Failed to delete bulk order', 500);
    }
});

module.exports = router;
