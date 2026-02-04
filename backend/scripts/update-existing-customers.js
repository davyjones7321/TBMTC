const mongoose = require('mongoose');
const User = require('../models/User');
const Customer = require('../models/Customer');
require('dotenv').config();

/**
 * This script updates existing Customer records with data from their linked User accounts
 * Run this once to fix customers that were created before the name-handling fix
 */
async function updateExistingCustomers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

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

                // Fallback to email prefix or phone
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

            // Apply updates if needed
            if (needsUpdate) {
                await Customer.findByIdAndUpdate(customer._id, updates);
                console.log(`✅ Updated customer ${customer._id}:`, updates);
                updated++;
            } else {
                skipped++;
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   Updated: ${updated}`);
        console.log(`   Skipped: ${skipped}`);
        console.log(`   Total: ${customers.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run the script
updateExistingCustomers();
