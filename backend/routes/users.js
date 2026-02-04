const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authenticate, isAdmin } = require('../middleware/auth');
const { successResponse, errorResponse, paginationResponse } = require('../utils/helpers');

// All routes require authentication and admin role
router.use(authenticate, isAdmin);

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filtering
// @access  Private/Admin
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role, isActive } = req.query;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Build query
        const query = {};

        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } }
            ];
        }

        if (role) {
            query.role = role;
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            User.countDocuments(query)
        ]);

        // Get user stats
        const stats = await User.aggregate([
            {
                $group: {
                    _id: null,
                    totalUsers: { $sum: 1 },
                    totalAdmins: {
                        $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
                    },
                    totalCustomers: {
                        $sum: { $cond: [{ $eq: ['$role', 'customer'] }, 1, 0] }
                    },
                    activeUsers: {
                        $sum: { $cond: ['$isActive', 1, 0] }
                    },
                    inactiveUsers: {
                        $sum: { $cond: ['$isActive', 0, 1] }
                    }
                }
            }
        ]);

        const response = paginationResponse(users, pageNum, limitNum, total);
        response.stats = stats[0] || {
            totalUsers: 0,
            totalAdmins: 0,
            totalCustomers: 0,
            activeUsers: 0,
            inactiveUsers: 0
        };

        successResponse(res, response);
    } catch (error) {
        console.error('Get users error:', error);
        errorResponse(res, 'Failed to fetch users', 500);
    }
});

// @route   GET /api/admin/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        successResponse(res, { user });
    } catch (error) {
        console.error('Get user error:', error);
        errorResponse(res, 'Failed to fetch user', 500);
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role (Super Admin only)
// @access  Private/Super Admin
router.put('/:id/role', async (req, res) => {
    try {
        // Super admin email - only this user can manage roles
        const SUPER_ADMIN_EMAIL = 'khader7321@gmail.com';

        // Check if current user is super admin
        if (req.user.email !== SUPER_ADMIN_EMAIL) {
            return errorResponse(res, 'Only the super admin can manage user roles', 403);
        }

        const { role } = req.body;

        if (!['admin', 'customer'].includes(role)) {
            return errorResponse(res, 'Invalid role. Must be admin or customer', 400);
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // Prevent changing super admin's role
        if (user.email === SUPER_ADMIN_EMAIL) {
            return errorResponse(res, 'Cannot modify super admin role', 400);
        }

        user.role = role;
        await user.save();

        successResponse(res, { user: user.toJSON() }, 'User role updated successfully');
    } catch (error) {
        console.error('Update role error:', error);
        errorResponse(res, 'Failed to update user role', 500);
    }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Activate or deactivate user
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
    try {
        const SUPER_ADMIN_EMAIL = 'khader7321@gmail.com';
        const { isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // Prevent modifying super admin status
        if (user.email === SUPER_ADMIN_EMAIL) {
            return errorResponse(res, 'Cannot modify super admin status', 400);
        }

        // Prevent deactivating yourself
        if (user._id.toString() === req.user._id.toString()) {
            return errorResponse(res, 'You cannot deactivate your own account', 400);
        }

        user.isActive = isActive;
        await user.save();

        successResponse(res, { user: user.toJSON() }, `User ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
        console.error('Update status error:', error);
        errorResponse(res, 'Failed to update user status', 500);
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (hard delete)
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return errorResponse(res, 'You cannot delete your own account', 400);
        }

        await user.deleteOne();

        successResponse(res, null, 'User deleted successfully');
    } catch (error) {
        console.error('Delete user error:', error);
        errorResponse(res, 'Failed to delete user', 500);
    }
});

module.exports = router;
