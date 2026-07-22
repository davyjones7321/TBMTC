require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function createSuperAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const superAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const superAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        if (!superAdminEmail) {
            console.error('❌ DEFAULT_ADMIN_EMAIL not set in .env');
            process.exit(1);
        }

        if (!superAdminPassword) {
            console.error('❌ DEFAULT_ADMIN_PASSWORD not set in .env');
            process.exit(1);
        }

        // Check if super admin already exists
        const existing = await User.findOne({ email: superAdminEmail });
        if (existing) {
            console.log('⚠️  Super admin already exists!');
            console.log('Email:', existing.email);
            console.log('Role:', existing.role);
            console.log('isSuperAdmin:', existing.isSuperAdmin);
            process.exit(0);
        }

        // Create super admin
        const superAdmin = await User.create({
            email: superAdminEmail,
            password: superAdminPassword,
            firstName: 'Super',
            lastName: 'Admin',
            role: 'admin',
            isSuperAdmin: true,
            isActive: true
        });

        console.log('✅ Super admin created successfully!');
        console.log('Email:', superAdmin.email);
        console.log('⚠️  This account has full administrative privileges!');
        console.log('⚠️  Please change your password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createSuperAdmin();
