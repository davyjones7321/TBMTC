const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const auditLog = require('../middleware/auditLog');
const { successResponse, errorResponse } = require('../utils/helpers');

// All routes require authentication and admin role
router.use(authenticate, isAdmin);

// @route   GET /api/admin/categories
// @desc    Get all categories
// @access  Private/Admin
router.get('/', async (req, res) => {
    try {
        const { includeInactive = false } = req.query;

        const query = includeInactive === 'true' ? {} : { isActive: true };

        const categories = await Category.find(query)
            .populate('parent', 'name')
            .sort({ sortOrder: 1, name: 1 });

        successResponse(res, { categories });
    } catch (error) {
        console.error('Get categories error:', error);
        errorResponse(res, 'Failed to fetch categories', 500);
    }
});

// @route   GET /api/admin/categories/:id
// @desc    Get category details
// @access  Private/Admin
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate('parent', 'name slug');

        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }

        // Get subcategories
        const subcategories = await Category.find({ parent: category._id })
            .select('name slug isActive');

        // Get product count
        const Product = require('../models/Product');
        const productCount = await Product.countDocuments({ category: category._id });

        successResponse(res, {
            category,
            subcategories,
            productCount
        });
    } catch (error) {
        console.error('Get category error:', error);
        errorResponse(res, 'Failed to fetch category', 500);
    }
});

// @route   POST /api/admin/categories
// @desc    Create new category
// @access  Private/Admin
router.post('/', validate(schemas.createCategory), auditLog('create', 'category'), async (req, res) => {
    try {
        const category = await Category.create(req.body);

        await category.populate('parent', 'name');

        successResponse(res, { category }, 'Category created successfully', 201);
    } catch (error) {
        console.error('Create category error:', error);
        errorResponse(res, 'Failed to create category', 500);
    }
});

// @route   PUT /api/admin/categories/:id
// @desc    Update category
// @access  Private/Admin
router.put('/:id', validate(schemas.updateCategory), auditLog('update', 'category'), async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('parent', 'name');

        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }

        successResponse(res, { category }, 'Category updated successfully');
    } catch (error) {
        console.error('Update category error:', error);
        errorResponse(res, 'Failed to update category', 500);
    }
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete category
// @access  Private/Admin
router.delete('/:id', auditLog('delete', 'category'), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }

        // Check if category has products
        const Product = require('../models/Product');
        const productCount = await Product.countDocuments({ category: category._id });

        if (productCount > 0) {
            return errorResponse(res, 'Cannot delete category with products. Please reassign or delete products first.', 400);
        }

        // Check if category has subcategories
        const subcategoryCount = await Category.countDocuments({ parent: category._id });

        if (subcategoryCount > 0) {
            return errorResponse(res, 'Cannot delete category with subcategories. Please delete subcategories first.', 400);
        }

        await category.deleteOne();

        successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
        console.error('Delete category error:', error);
        errorResponse(res, 'Failed to delete category', 500);
    }
});

module.exports = router;
