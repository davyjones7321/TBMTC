const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const auditLog = require('../middleware/auditLog');
const { successResponse, errorResponse, paginate, paginationResponse } = require('../utils/helpers');

// @route   GET /api/products
// @desc    Get all products with pagination and filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            category,
            isActive,
            isFeatured,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        const { skip, limit: limitNum, page: pageNum } = paginate(page, limit);

        // Build query
        const query = {};

        // Search by name or SKU
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by active status
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        } else {
            // Default to active only for public, but allow override?
            // For now, let's just default to showing all if not specified, 
            // or maybe we should enforce active only if no token?
            // Simplicity: just return what is asked.
        }

        // Filter by featured status
        if (isFeatured !== undefined) {
            query.isFeatured = isFeatured === 'true';
        }

        // Build sort
        const sort = {};
        sort[sortBy] = order === 'asc' ? 1 : -1;

        // Execute query
        const [products, total] = await Promise.all([
            Product.find(query)
                .populate('category', 'name')
                .sort(sort)
                .skip(skip)
                .limit(limitNum),
            Product.countDocuments(query)
        ]);

        const response = paginationResponse(products, pageNum, limitNum, total);
        successResponse(res, response);
    } catch (error) {
        console.error('Get products error:', error);
        errorResponse(res, 'Failed to fetch products', 500);
    }
});

// @route   GET /api/products/:id
// @desc    Get product details
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug');

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        successResponse(res, { product });
    } catch (error) {
        console.error('Get product error:', error);
        errorResponse(res, 'Failed to fetch product', 500);
    }
});

// --- Admin Routes ---
router.use(authenticate, isAdmin);

// @route   GET /api/admin/products/low-stock
// @desc    Get products with low stock
// @access  Private/Admin
router.get('/low-stock', async (req, res) => {
    try {
        const products = await Product.find({
            'stock.trackInventory': true,
            $expr: { $lte: ['$stock.quantity', '$stock.lowStockThreshold'] }
        })
            .populate('category', 'name')
            .sort({ 'stock.quantity': 1 })
            .select('name sku stock category price');

        successResponse(res, {
            products,
            count: products.length
        });
    } catch (error) {
        console.error('Low stock products error:', error);
        errorResponse(res, 'Failed to fetch low stock products', 500);
    }
});

// @route   POST /api/admin/products
// @desc    Create new product
// @access  Private/Admin
router.post('/', validate(schemas.createProduct), auditLog('create', 'product'), async (req, res) => {
    try {
        const product = await Product.create(req.body);

        await product.populate('category', 'name');

        successResponse(res, { product }, 'Product created successfully', 201);
    } catch (error) {
        console.error('Create product error:', error);
        errorResponse(res, 'Failed to create product', 500);
    }
});

// @route   PUT /api/admin/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', validate(schemas.updateProduct), auditLog('update', 'product'), async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category', 'name');

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        successResponse(res, { product }, 'Product updated successfully');
    } catch (error) {
        console.error('Update product error:', error);
        errorResponse(res, 'Failed to update product', 500);
    }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/:id', auditLog('delete', 'product'), async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        successResponse(res, null, 'Product deleted successfully');
    } catch (error) {
        console.error('Delete product error:', error);
        errorResponse(res, 'Failed to delete product', 500);
    }
});

// @route   PATCH /api/admin/products/:id/stock
// @desc    Update product stock
// @access  Private/Admin
router.patch('/:id/stock', auditLog('update', 'product'), async (req, res) => {
    try {
        const { quantity, operation = 'set' } = req.body;

        if (quantity === undefined) {
            return errorResponse(res, 'Quantity is required', 400);
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        // Update stock based on operation
        if (operation === 'set') {
            product.stock.quantity = quantity;
        } else if (operation === 'add') {
            product.stock.quantity += quantity;
        } else if (operation === 'subtract') {
            product.stock.quantity = Math.max(0, product.stock.quantity - quantity);
        }

        await product.save();

        successResponse(res, { product }, 'Stock updated successfully');
    } catch (error) {
        console.error('Update stock error:', error);
        errorResponse(res, 'Failed to update stock', 500);
    }
});

module.exports = router;
