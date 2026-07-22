require('dns').setServers(['8.8.8.8', '1.1.1.1']);
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

const runMigration = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const SUPER_ADMIN_EMAIL = 'khader7321@gmail.com';
        console.log(`Starting migration: Setting isSuperAdmin = true for ${SUPER_ADMIN_EMAIL}...`);

        const user = await User.findOne({ email: SUPER_ADMIN_EMAIL.toLowerCase() });

        if (!user) {
            console.log(`⚠️ User with email ${SUPER_ADMIN_EMAIL} not found.`);
            process.exit(0);
        }

        user.isSuperAdmin = true;
        user.role = 'admin';
        await user.save();

        console.log(`✅ SUCCESS: Updated user "${user.name || user.email}" (ID: ${user._id}) to isSuperAdmin: true.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

runMigration();
