const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const AuditLog = require('../models/AuditLog');
const { authenticate, isAdmin } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/helpers');

// @route   GET /api/admin/settings
// @desc    Get all settings
// @access  Private/Admin
router.get('/', authenticate, isAdmin, async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            // Create default settings if not exists
            settings = await Settings.create({});
        }

        successResponse(res, { settings });
    } catch (error) {
        console.error('Get settings error:', error);
        errorResponse(res, 'Failed to fetch settings', 500);
    }
});

// @route   PUT /api/admin/settings
// @desc    Update settings
// @access  Private/Admin
router.put('/', authenticate, isAdmin, async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings(req.body);
        } else {
            // Update fields
            Object.assign(settings, req.body);
        }

        settings.updatedAt = Date.now();
        await settings.save();

        // Audit log
        await AuditLog.create({
            user: req.user._id,
            action: 'update',
            resource: 'settings',
            description: 'Updated store settings',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        });

        successResponse(res, { settings }, 'Settings updated successfully');
    } catch (error) {
        console.error('Update settings error:', error);
        errorResponse(res, 'Failed to update settings', 500);
    }
});

module.exports = router;
