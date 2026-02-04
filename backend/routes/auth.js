const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const crypto = require('crypto');
const PasswordReset = require('../models/PasswordReset');
const { sendPasswordResetEmail } = require('../services/emailService');
const { authenticate } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const { successResponse, errorResponse } = require('../utils/helpers');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE
    });
};

// @route   POST /api/auth/login
// @desc    Login user with email or phone
// @access  Public
router.post('/login', validate(schemas.login), async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        // Find user by email or phone
        const query = email ? { email } : { phone };
        const user = await User.findOne(query).select('+password');

        if (!user) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        // Check if user is active
        if (!user.isActive) {
            return errorResponse(res, 'Account is deactivated', 403);
        }
        // Verify password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create audit log
        await AuditLog.create({
            user: user._id,
            action: 'login',
            resource: 'auth',
            description: `User logged in with ${email ? 'email' : 'phone'}`,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        });

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Remove password from response
        const userResponse = user.toJSON();

        // Check for Super Admin
        const SUPER_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
        if (SUPER_ADMIN_EMAIL && user.email === SUPER_ADMIN_EMAIL) {
            userResponse.isSuperAdmin = true;
        } else {
            userResponse.isSuperAdmin = false;
        }

        successResponse(res, {
            user: userResponse,
            token,
            refreshToken
        }, 'Login successful');
    } catch (error) {
        console.error('Login error:', error);
        errorResponse(res, 'Login failed', 500);
    }
});

// @route   POST /api/auth/signup
// @desc    Register new customer
// @access  Public
router.post('/signup', validate(schemas.register), async (req, res) => {
    try {
        const { email, phone, password, name } = req.body;

        // Check if user already exists by email or phone
        const existingUser = await User.findOne({
            $or: [
                email ? { email } : null,
                phone ? { phone } : null
            ].filter(Boolean)
        });

        if (existingUser) {
            return errorResponse(res, 'User with this email or phone already exists', 400);
        }

        // Split name into firstName and lastName
        let firstName = '';
        let lastName = '';
        if (name) {
            const nameParts = name.trim().split(/\s+/);
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
        }

        // Create new user (force role to customer)
        const user = await User.create({
            email,
            phone,
            password,
            firstName,
            lastName,
            role: 'customer'
        });

        // Create audit log
        await AuditLog.create({
            user: user._id,
            action: 'signup',
            resource: 'user',
            description: 'New customer signed up',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        });

        // Generate tokens for immediate login
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        successResponse(res, {
            user: user.toJSON(),
            token,
            refreshToken
        }, 'Registration successful', 201);
    } catch (error) {
        console.error('Signup error:', error);
        errorResponse(res, `Registration failed: ${error.message}`, 500);
    }
});

// @route   POST /api/auth/register
// @desc    Register new admin (protected - super admin only)
// @access  Private/Super Admin
router.post('/register', authenticate, validate(schemas.register), async (req, res) => {
    try {
        const SUPER_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
        const { email, phone, password, name, role } = req.body;

        // If creating an admin, only super admin can do it
        if (role === 'admin') {
            if (!SUPER_ADMIN_EMAIL || req.user.email !== SUPER_ADMIN_EMAIL) {
                return errorResponse(res, 'Only the super admin can create new admin users', 403);
            }
        } else {
            // For creating customers, any admin can do it
            if (req.user.role !== 'admin') {
                return errorResponse(res, 'Only admins can create new users', 403);
            }
        }

        // Check if user already exists by email or phone
        const existingUser = await User.findOne({
            $or: [
                email ? { email } : null,
                phone ? { phone } : null
            ].filter(Boolean)
        });

        if (existingUser) {
            return errorResponse(res, 'User with this email or phone already exists', 400);
        }

        // Split name into firstName and lastName
        let firstName = '';
        let lastName = '';
        if (name) {
            const nameParts = name.trim().split(/\s+/);
            firstName = nameParts[0] || '';
            lastName = nameParts.slice(1).join(' ') || '';
        }

        // Create new user
        const user = await User.create({
            email,
            phone,
            password,
            firstName,
            lastName,
            role
        });

        // Create audit log
        await AuditLog.create({
            user: req.user._id,
            action: 'create',
            resource: 'user',
            resourceId: user._id,
            description: `Created new ${role} user`,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        });

        successResponse(res, { user: user.toJSON() }, 'User created successfully', 201);
    } catch (error) {
        console.error('Registration error:', error);
        errorResponse(res, 'Registration failed', 500);
    }
});

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return errorResponse(res, 'Refresh token required', 400);
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Get user
        const user = await User.findById(decoded.id);

        if (!user || !user.isActive) {
            return errorResponse(res, 'Invalid refresh token', 401);
        }

        // Generate new access token
        const token = generateToken(user._id);

        successResponse(res, { token }, 'Token refreshed successfully');
    } catch (error) {
        console.error('Token refresh error:', error);
        errorResponse(res, 'Token refresh failed', 401);
    }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authenticate, async (req, res) => {
    try {
        const userResponse = req.user.toJSON();

        // Check for Super Admin
        const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
        if (SUPER_ADMIN_EMAIL && req.user.email === SUPER_ADMIN_EMAIL) {
            userResponse.isSuperAdmin = true;
        } else {
            userResponse.isSuperAdmin = false;
        }

        successResponse(res, { user: userResponse }, 'User profile retrieved');
    } catch (error) {
        console.error('Get profile error:', error);
        errorResponse(res, 'Failed to get profile', 500);
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticate, async (req, res) => {
    try {
        // Create audit log
        await AuditLog.create({
            user: req.user._id,
            action: 'logout',
            resource: 'auth',
            description: 'User logged out',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        });

        successResponse(res, null, 'Logout successful');
    } catch (error) {
        console.error('Logout error:', error);
        errorResponse(res, 'Logout failed', 500);
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Return success even if user not found for security
            return successResponse(res, null, 'If an account exists, a reset email has been sent');
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save to database
        await PasswordReset.create({
            userId: user._id,
            token: hashedToken
        });

        // Send email
        const emailResult = await sendPasswordResetEmail(user.email, resetToken);

        if (!emailResult.success) {
            return errorResponse(res, 'Failed to send reset email', 500);
        }

        successResponse(res, null, 'If an account exists, a reset email has been sent');
    } catch (error) {
        console.error('Forgot password error:', error);
        errorResponse(res, 'Request failed', 500);
    }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        const resetToken = req.params.token;
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Find valid token
        const resetDoc = await PasswordReset.findOne({ token: hashedToken });

        if (!resetDoc) {
            return errorResponse(res, 'Invalid or expired reset token', 400);
        }

        // Find user
        const user = await User.findById(resetDoc.userId);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // Update password
        user.password = password;
        await user.save();

        // Delete used token (and all other tokens for this user)
        await PasswordReset.deleteMany({ userId: user._id });

        // Create audit log
        await AuditLog.create({
            user: user._id,
            action: 'password_reset',
            resource: 'auth',
            description: 'Password reset via email',
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        });

        successResponse(res, null, 'Password reset successful');
    } catch (error) {
        console.error('Reset password error:', error);
        errorResponse(res, 'Reset failed', 500);
    }
});


module.exports = router;
