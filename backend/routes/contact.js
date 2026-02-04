const express = require('express');
const router = express.Router();
const ContactQuery = require('../models/ContactQuery');
const { authenticate, isAdmin } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/helpers');

// @route   POST /api/contact
// @desc    Submit a contact query
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message, subject } = req.body;

        const query = await ContactQuery.create({
            name,
            email,
            phone,
            message,
            subject
        });

        successResponse(res, { query }, 'Message sent successfully');
    } catch (error) {
        console.error('Submit query error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return errorResponse(res, messages[0], 400);
        }
        errorResponse(res, 'Failed to send message', 500);
    }
});

// @route   GET /api/contact
// @desc    Get all queries
// @access  Private/Admin
router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        if (req.query.subject) {
            query.subject = req.query.subject;
        }

        const queries = await ContactQuery.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await ContactQuery.countDocuments(query);

        successResponse(res, {
            queries,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('Get queries error:', error);
        errorResponse(res, 'Failed to fetch queries', 500);
    }
});

// @route   PUT /api/contact/:id
// @desc    Update query status
// @access  Private/Admin
router.put('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const query = await ContactQuery.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!query) {
            return errorResponse(res, 'Query not found', 404);
        }

        successResponse(res, { query }, 'Status updated successfully');
    } catch (error) {
        console.error('Update query error:', error);
        errorResponse(res, 'Failed to update status', 500);
    }
});

// @route   GET /api/contact/stats
// @desc    Get query statistics
// @access  Private/Admin
router.get('/stats', authenticate, isAdmin, async (req, res) => {
    try {
        const stats = await ContactQuery.aggregate([
            {
                $group: {
                    _id: '$subject',
                    count: { $sum: 1 },
                    unread: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'new'] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        successResponse(res, { stats }, 'Stats fetched successfully');
    } catch (error) {
        console.error('Get stats error:', error);
        errorResponse(res, 'Failed to fetch stats', 500);
    }
});

// @route   DELETE /api/contact/:id
// @desc    Delete a query
// @access  Private/Admin
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const query = await ContactQuery.findByIdAndDelete(req.params.id);

        if (!query) {
            return errorResponse(res, 'Query not found', 404);
        }

        successResponse(res, null, 'Query deleted successfully');
    } catch (error) {
        console.error('Delete query error:', error);
        errorResponse(res, 'Failed to delete query', 500);
    }
});

module.exports = router;
