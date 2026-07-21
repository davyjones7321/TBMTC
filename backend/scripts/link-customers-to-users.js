const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Customer = require('../models/Customer');

const runMigration = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log('Starting migration: Linking legacy Customers to Users...');

        // metrics
        let usersProcessed = 0;
        let linksCreated = 0;
        let alreadyLinked = 0;
        let noCustomerFound = 0;
        let errors = 0;

        // Get all users
        const users = await User.find({});
        console.log(`Found ${users.length} users to process.`);

        for (const user of users) {
            usersProcessed++;

            if (!user.email) {
                console.log(`Skipping user ${user._id} (no email)`);
                continue;
            }

            try {
                // Check if a customer already exists with this userId
                const existingLinkedCustomer = await Customer.findOne({ userId: user._id });

                if (existingLinkedCustomer) {
                    alreadyLinked++;
                    // Optional: output
                    // console.log(`User ${user.email} already linked to Customer ${existingLinkedCustomer._id}`);
                    continue;
                }

                // If not linked, try to find a customer by email (case insensitive)
                const customer = await Customer.findOne({
                    email: user.email.toLowerCase(),
                    userId: { $exists: false } // Only find unlinked customers, or we might overwrite? 
                    // Actually, if userId exists but is DIFFERENT, that's a conflict.
                    // If userId exists and is SAME, we caught it above.
                    // Let's just find by email for now.
                });

                if (customer) {
                    if (customer.userId) {
                        console.warn(`WARNING: Customer ${customer._id} (${customer.email}) has userId ${customer.userId} but User is ${user._id}. Mismatch? Skipping.`);
                        errors++;
                        continue;
                    }

                    // Link them
                    customer.userId = user._id;
                    await customer.save();

                    console.log(`LINKED: User ${user.email} -> Customer ${customer._id}`);
                    linksCreated++;
                } else {
                    noCustomerFound++;
                }

            } catch (err) {
                console.error(`Error processing user ${user.email}:`, err.message);
                errors++;
            }
        }

        console.log('\n--- Migration Summary ---');
        console.log(`Total Users Processed: ${usersProcessed}`);
        console.log(`Already Linked properly: ${alreadyLinked}`);
        console.log(`New Links Created: ${linksCreated}`);
        console.log(`No matching Customer found: ${noCustomerFound}`);
        console.log(`Errors/Warnings: ${errors}`);
        console.log('-------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

runMigration();
