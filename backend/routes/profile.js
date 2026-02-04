const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { successResponse, errorResponse } = require('../utils/helpers');

// @route   GET /api/profile
// @desc    Get current user profile
// @access  Private
router.get('/', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        successResponse(res, { user });
    } catch (error) {
        console.error('Get profile error:', error);
        errorResponse(res, 'Failed to get profile', 500);
    }
});
// @route   PUT /api/profile
// @desc    Update profile info
// @access  Private
router.put('/', authenticate, async (req, res) => {
    try {
        console.log('Profile update request body:', req.body);
        const { name, phone, firstName, lastName } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            console.error('User not found for profile update');
            return errorResponse(res, 'User not found', 404);
        }

        if (phone) user.phone = phone;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        console.log('Saving user:', user);
        await user.save();
        console.log('User saved successfully');

        // Audit log
        await AuditLog.create({
            user: user._id,
            action: 'update',
            resource: 'profile',
            description: 'Updated profile information',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        });

        successResponse(res, { user }, 'Profile updated successfully');
    } catch (error) {
        console.error('Update profile error:', error);
        // Check for duplicate key error (e.g. phone number)
        if (error.code === 11000) {
            if (error.keyPattern.phone) {
                return errorResponse(res, 'Phone number already in use', 400);
            }
        }
        errorResponse(res, 'Failed to update profile: ' + error.message, 500);
    }
});

router.put('/password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return errorResponse(res, 'Incorrect current password', 400);
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Audit log
        await AuditLog.create({
            user: user._id,
            action: 'password_change',
            resource: 'profile',
            description: 'Changed password',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        });

        successResponse(res, null, 'Password changed successfully');
    } catch (error) {
        console.error('Change password error:', error);
        errorResponse(res, 'Failed to change password', 500);
    }
});

module.exports = router;
