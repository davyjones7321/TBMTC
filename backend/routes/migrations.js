const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const { authenticate, isAdmin } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/helpers');

// @route   POST /api/migrations/update-customers
// @desc    One-time migration to update existing customers with user data
// @access  Private/Admin only
router.post('/update-customers', authenticate, isAdmin, async (req, res) => {
    try {
        console.log('🔄 Starting customer migration...');

        // Find all customers
        const customers = await Customer.find({});
        console.log(`Found ${customers.length} customers to check`);

        let updated = 0;
        let skipped = 0;

        for (const customer of customers) {
            // Get the linked user
            const user = await User.findById(customer.userId);

            if (!user) {
                console.log(`⚠️  Customer ${customer._id} has no linked user - skipping`);
                skipped++;
                continue;
            }

            let needsUpdate = false;
            const updates = {};

            // Update firstName if missing
            if (!customer.firstName || customer.firstName === 'Customer') {
                let firstName = user.firstName || user.name?.split(' ')[0] || '';

                if (!firstName) {
                    if (user.email) {
                        firstName = user.email.split('@')[0];
                    } else if (user.phone) {
                        firstName = user.phone;
                    } else {
                        firstName = 'Customer';
                    }
                }

                updates.firstName = firstName;
                needsUpdate = true;
            }

            // Update lastName if missing
            if (!customer.lastName) {
                updates.lastName = user.lastName || user.name?.split(' ').slice(1).join(' ') || '';
                needsUpdate = true;
            }

            // Update email if missing
            if (!customer.email && user.email) {
                updates.email = user.email;
                needsUpdate = true;
            }

            // Update phone if missing
            if (!customer.phone && user.phone) {
                updates.phone = user.phone;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await Customer.findByIdAndUpdate(customer._id, updates);
                console.log(`✅ Updated customer ${customer._id}`);
                updated++;
            } else {
                skipped++;
            }
        }

        // Also fix orders with null customers
        const ordersWithoutCustomer = await Order.find({ customer: null });
        let ordersFixed = 0;

        console.log(`Found ${ordersWithoutCustomer.length} orders without customers`);

        successResponse(res, {
            summary: {
                customersUpdated: updated,
                customersSkipped: skipped,
                totalCustomers: customers.length,
                ordersWithoutCustomer: ordersWithoutCustomer.length
            }
        }, `Migration completed: ${updated} customers updated, ${ordersWithoutCustomer.length} orders found without customers`);

    } catch (error) {
        console.error('❌ Migration error:', error);
        errorResponse(res, `Migration failed: ${error.message}`, 500);
    }
});

module.exports = router;
