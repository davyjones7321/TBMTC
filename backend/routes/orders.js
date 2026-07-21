const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const auditLog = require('../middleware/auditLog');
const { successResponse, errorResponse, paginate, paginationResponse } = require('../utils/helpers');

// All routes require authentication
router.use(authenticate);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', validate(schemas.createOrder), async (req, res) => {
    const { items, shippingAddress, paymentMethod, deliverySlot } = req.body;

    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
        attempts++;
        let session;
        let useTransaction = true;

        try {
            session = await mongoose.startSession();
            try {
                session.startTransaction();
                console.log(`[TxLog] Transaction started successfully (Attempt ${attempts}, Mode: Transactional)`);
            } catch (txErr) {
                if (process.env.NODE_ENV === 'production') {
                    console.error('❌ Critical: Database transactions are required in production but session.startTransaction() failed:', txErr.message);
                    throw txErr;
                }
                console.warn('⚠️ Warning: Transactions unsupported in this environment. Falling back to non-transactional mode:', txErr.message);
                useTransaction = false;
            }
        } catch (sErr) {
            if (process.env.NODE_ENV === 'production') {
                console.error('❌ Critical: Database session creation failed in production:', sErr.message);
                throw sErr;
            }
            console.warn('⚠️ Warning: Mongoose session creation failed:', sErr.message);
            session = null;
            useTransaction = false;
        }

        console.log(`[TxLog] Request executing with useTransaction = ${useTransaction}`);

        const sessionOptions = (useTransaction && session && session.inTransaction()) ? { session } : {};

        try {
            let subtotal = 0;
            const orderItems = [];

            for (const item of items) {
                const product = await Product.findById(item.product, null, sessionOptions);

                if (!product) {
                    const err = new Error(`Product not found: ${item.product}`);
                    err.status = 404;
                    throw err;
                }

                let price = product.price;
                let variation = item.variation;
                let glazing = item.glazing;
                let glazingPrices = product.glazingPrices;

                if (variation && product.variants && product.variants.length > 0) {
                    const variant = product.variants.find(v => v.size === variation);
                    if (variant) {
                        price = variant.price;
                        if (variant.glazingPrices && (variant.glazingPrices.glazing20 || variant.glazingPrices.glazing30 || variant.glazingPrices.glazing50)) {
                            glazingPrices = variant.glazingPrices;
                        }
                    }
                }

                if (glazing && glazingPrices) {
                    if (glazing === 20 && glazingPrices.glazing20) price = glazingPrices.glazing20;
                    else if (glazing === 30 && glazingPrices.glazing30) price = glazingPrices.glazing30;
                    else if (glazing === 50 && glazingPrices.glazing50) price = glazingPrices.glazing50;
                }

                const itemSubtotal = price * item.quantity;

                // Atomic stock decrement with $gte check
                if (product.stock && product.stock.trackInventory) {
                    let filter, update;

                    if (variation && product.variants && product.variants.some(v => v.size === variation)) {
                        filter = {
                            _id: item.product,
                            'stock.trackInventory': true,
                            'stock.quantity': { $gte: item.quantity },
                            variants: {
                                $elemMatch: {
                                    size: variation,
                                    stock: { $gte: item.quantity }
                                }
                            }
                        };
                        update = {
                            $inc: {
                                'stock.quantity': -item.quantity,
                                'variants.$.stock': -item.quantity,
                                totalSold: item.quantity
                            }
                        };
                    } else {
                        filter = {
                            _id: item.product,
                            'stock.trackInventory': true,
                            'stock.quantity': { $gte: item.quantity }
                        };
                        update = {
                            $inc: {
                                'stock.quantity': -item.quantity,
                                totalSold: item.quantity
                            }
                        };
                    }

                    const updatedProduct = await Product.findOneAndUpdate(filter, update, { new: true, ...sessionOptions });

                    if (!updatedProduct) {
                        const err = new Error(`Insufficient stock for product: ${product.name}${variation ? ` (${variation})` : ''}`);
                        err.status = 409;
                        throw err;
                    }
                } else {
                    await Product.findByIdAndUpdate(item.product, { $inc: { totalSold: item.quantity } }, sessionOptions);
                }

                orderItems.push({
                    product: product._id,
                    name: product.name,
                    sku: product.sku || '',
                    quantity: item.quantity,
                    price: price,
                    variation: variation,
                    glazing: glazing,
                    subtotal: itemSubtotal
                });

                subtotal += itemSubtotal;
            }

            const tax = 0;
            const shipping = subtotal >= 500 ? 0 : 50;
            const total = subtotal + tax + shipping;

            let customer = await Customer.findOne({ userId: req.user._id }, null, sessionOptions);
            if (!customer) {
                let firstName = req.user.firstName || req.user.name?.split(' ')[0] || '';
                let lastName = req.user.lastName || req.user.name?.split(' ').slice(1).join(' ') || '';

                if (!firstName && !lastName) {
                    if (req.user.email) {
                        firstName = req.user.email.split('@')[0];
                    } else if (req.user.phone) {
                        firstName = req.user.phone;
                    }
                }

                const [newCustomer] = await Customer.create([{
                    userId: req.user._id,
                    firstName: firstName || 'Customer',
                    lastName: lastName || '',
                    phone: req.user.phone || '',
                    email: req.user.email || '',
                    totalOrders: 0,
                    totalSpent: 0
                }], sessionOptions);
                customer = newCustomer;
            }

            // Update customer stats
            customer.totalOrders = (customer.totalOrders || 0) + 1;
            customer.totalSpent = (customer.totalSpent || 0) + total;
            customer.averageOrderValue = Number((customer.totalSpent / customer.totalOrders).toFixed(2));
            customer.lastOrderDate = new Date();
            await customer.save(sessionOptions);

            const [order] = await Order.create([{
                customer: customer._id,
                items: orderItems,
                subtotal,
                tax,
                shipping,
                total,
                shippingAddress,
                paymentMethod,
                deliverySlot,
                status: 'pending',
                paymentStatus: 'pending'
            }], sessionOptions);

            if (useTransaction && session && session.inTransaction()) {
                await session.commitTransaction();
            }
            if (session) {
                session.endSession();
            }

            return successResponse(res, { order }, 'Order placed successfully', 201);
        } catch (error) {
            if (useTransaction && session && session.inTransaction()) {
                await session.abortTransaction();
            }
            if (session) {
                session.endSession();
            }

            // Immediate abort for business rule failures (404, 409)
            if (error.status) {
                return errorResponse(res, error.message, error.status);
            }

            // Retry for TransientTransactionError with randomized backoff
            const isTransientError = error.hasErrorLabel && error.hasErrorLabel('TransientTransactionError');
            if (isTransientError && attempts < maxAttempts) {
                console.warn(`[TxLog] TransientTransactionError on attempt ${attempts}, retrying in backoff...`);
                await new Promise(res => setTimeout(res, Math.floor(Math.random() * 30) + 10));
                continue;
            }

            console.error('Create order error:', error);
            return errorResponse(res, error.message || 'Failed to create order', 500);
        }
    }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user's orders
// @access  Private
router.get('/my-orders', async (req, res) => {
    try {
        console.log('=== MY ORDERS DEBUG ===');
        console.log('User ID:', req.user._id);
        console.log('User email:', req.user.email);

        // Find the Customer record for this user
        let customer = await Customer.findOne({ userId: req.user._id });
        console.log('Customer by userId:', customer ? customer._id : 'NOT FOUND');

        // Fallback: Try to find by email if not found by userId
        if (!customer && req.user.email) {
            customer = await Customer.findOne({ email: req.user.email.toLowerCase() });
            console.log('Customer by email:', customer ? customer._id : 'NOT FOUND');

            // If found by email, link to user for future queries
            if (customer) {
                customer.userId = req.user._id;
                await customer.save();
                console.log('Linked Customer to User');
            }
        }

        // If no customer record exists, return empty orders
        if (!customer) {
            console.log('No customer record for this user');
            console.log('=== END DEBUG ===');
            return successResponse(res, { orders: [] });
        }

        const orders = await Order.find({ customer: customer._id })
            .populate('items.product', 'name images')
            .sort({ createdAt: -1 });

        console.log('Orders found:', orders.length);
        console.log('=== END DEBUG ===');

        successResponse(res, { orders });
    } catch (error) {
        console.error('Get my orders error:', error);
        errorResponse(res, 'Failed to fetch your orders', 500);
    }
});

// --- Admin Routes ---
router.use(isAdmin);
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            paymentStatus,
            startDate,
            endDate,
            search = '',
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query;

        const { skip, limit: limitNum, page: pageNum } = paginate(page, limit);

        // Build query
        const query = {};

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by payment status
        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        // Filter by date range
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Search by order number
        if (search) {
            query.orderNumber = { $regex: search, $options: 'i' };
        }

        // Build sort
        const sort = {};
        sort[sortBy] = order === 'asc' ? 1 : -1;

        // Execute query
        const [orders, total] = await Promise.all([
            Order.find(query)
                .populate('customer', 'firstName lastName email')
                .sort(sort)
                .skip(skip)
                .limit(limitNum),
            Order.countDocuments(query)
        ]);

        const response = paginationResponse(orders, pageNum, limitNum, total);
        successResponse(res, response);
    } catch (error) {
        console.error('Get orders error:', error);
        errorResponse(res, 'Failed to fetch orders', 500);
    }
});

// @route   GET /api/admin/orders/stats
// @desc    Get order statistics
// @access  Private/Admin
router.get('/stats', async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$total' }
                }
            }
        ]);

        const paymentStats = await Order.aggregate([
            {
                $group: {
                    _id: '$paymentStatus',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$total' }
                }
            }
        ]);

        successResponse(res, {
            orderStats: stats.reduce((acc, item) => {
                acc[item._id] = {
                    count: item.count,
                    totalValue: item.totalValue
                };
                return acc;
            }, {}),
            paymentStats: paymentStats.reduce((acc, item) => {
                acc[item._id] = {
                    count: item.count,
                    totalValue: item.totalValue
                };
                return acc;
            }, {})
        });
    } catch (error) {
        console.error('Order stats error:', error);
        errorResponse(res, 'Failed to fetch order statistics', 500);
    }
});

// @route   GET /api/admin/orders/:id
// @desc    Get order details
// @access  Private/Admin
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'firstName lastName email phone')
            .populate('items.product', 'name images');

        if (!order) {
            return errorResponse(res, 'Order not found', 404);
        }

        successResponse(res, { order });
    } catch (error) {
        console.error('Get order error:', error);
        errorResponse(res, 'Failed to fetch order', 500);
    }
});

// @route   PATCH /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.patch('/:id/status', validate(schemas.updateOrderStatus), auditLog('status_change', 'order'), async (req, res) => {
    try {
        const { status, note } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return errorResponse(res, 'Order not found', 404);
        }

        // Update status
        order.status = status;

        // Add note to status history if provided
        if (note) {
            order.statusHistory[order.statusHistory.length - 1].note = note;
        }

        // If order is delivered, update customer stats
        if (status === 'delivered' && order.paymentStatus === 'paid') {
            const customer = await Customer.findById(order.customer);
            if (customer) {
                await customer.updateStats(order.total);
            }
        }

        // If order is cancelled, restore product stock
        if (status === 'cancelled') {
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (product && product.stock.trackInventory) {
                    await product.updateStock(item.quantity, 'add');
                }
            }
        }

        await order.save();

        successResponse(res, { order }, 'Order status updated successfully');
    } catch (error) {
        console.error('Update order status error:', error);
        errorResponse(res, 'Failed to update order status', 500);
    }
});

module.exports = router;
