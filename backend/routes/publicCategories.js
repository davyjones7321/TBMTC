const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { successResponse, errorResponse } = require('../utils/helpers');

// @route   GET /api/categories
// @desc    Get all active categories (public endpoint)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate('parent', 'name slug')
            .sort({ sortOrder: 1, name: 1 })
            .select('name slug description image isActive sortOrder');

        successResponse(res, { categories });
    } catch (error) {
        console.error('Get public categories error:', error);
        errorResponse(res, 'Failed to fetch categories', 500);
    }
});

// @route   GET /api/categories/:slug
// @desc    Get category by slug (public endpoint)
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug, isActive: true })
            .populate('parent', 'name slug');

        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }

        successResponse(res, { category });
    } catch (error) {
        console.error('Get category by slug error:', error);
        errorResponse(res, 'Failed to fetch category', 500);
    }
});

module.exports = router;
