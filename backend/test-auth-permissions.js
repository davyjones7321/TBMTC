require('dotenv').config();
process.env.MONGOMS_START_TIMEOUT = '60000';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const request = require('supertest');
const User = require('./models/User');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const { errorHandler } = require('./middleware/errorHandler');

async function runAuthPermissionsTest() {
    console.log('🚀 Starting Auth & Role Permissions Verification Test...');

    const mongoServer = await MongoMemoryServer.create({
        instance: { dbName: 'test_auth_perm', launchTimeout: 60000 },
        binary: { downloadDir: './.mongodb-binaries' }
    });
    await mongoose.connect(mongoServer.getUri());
    console.log('✅ Connected to MongoMemoryServer');

    const app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
    app.use('/api/admin/users', userRouter);
    app.use(errorHandler);

    // 1. Create Test Accounts
    const password = 'Password123!';

    const superAdmin = await User.create({
        email: 'superadmin@example.com',
        password,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'admin',
        isSuperAdmin: true
    });

    const regularAdmin = await User.create({
        email: 'regadmin@example.com',
        password,
        firstName: 'Regular',
        lastName: 'Admin',
        role: 'admin',
        isSuperAdmin: false
    });

    const customer = await User.create({
        email: 'customer@example.com',
        password,
        firstName: 'Normal',
        lastName: 'Customer',
        role: 'customer',
        isSuperAdmin: false
    });

    console.log('📦 Created SuperAdmin, RegularAdmin, and Customer test accounts.');

    let passed = true;

    // Test (a): Customer CANNOT get a token from /api/auth/admin/login
    console.log('\n--- Test (a): Customer login to /api/auth/admin/login ---');
    const resA = await request(app)
        .post('/api/auth/admin/login')
        .send({ email: customer.email, password });
    console.log(`Status: ${resA.status}, Message: "${resA.body.message}"`);
    if (resA.status === 403) {
        console.log('✅ Passed: Customer blocked from /admin/login (403)');
    } else {
        console.error(`❌ Failed: Expected 403, got ${resA.status}`);
        passed = false;
    }

    // Test (b): Admin/SuperAdmin CANNOT get a token from /api/auth/login
    console.log('\n--- Test (b): Admin login to /api/auth/login ---');
    const resB1 = await request(app)
        .post('/api/auth/login')
        .send({ email: regularAdmin.email, password });
    console.log(`Admin Status: ${resB1.status}, Message: "${resB1.body.message}"`);

    const resB2 = await request(app)
        .post('/api/auth/login')
        .send({ email: superAdmin.email, password });
    console.log(`SuperAdmin Status: ${resB2.status}, Message: "${resB2.body.message}"`);

    if (resB1.status === 403 && resB2.status === 403) {
        console.log('✅ Passed: Admins blocked from customer /login (403)');
    } else {
        console.error(`❌ Failed: Expected 403 for admins at /login`);
        passed = false;
    }

    // Login superAdmin and regularAdmin to get tokens for route testing
    const superAdminLoginRes = await request(app)
        .post('/api/auth/admin/login')
        .send({ email: superAdmin.email, password });
    const superAdminToken = superAdminLoginRes.body.data.token;

    const regAdminLoginRes = await request(app)
        .post('/api/auth/admin/login')
        .send({ email: regularAdmin.email, password });
    const regAdminToken = regAdminLoginRes.body.data.token;

    // Test (c): Regular admin gets 403 attempting to delete super admin
    console.log('\n--- Test (c): Regular admin attempting DELETE on SuperAdmin account ---');
    const resC = await request(app)
        .delete(`/api/admin/users/${superAdmin._id}`)
        .set('Authorization', `Bearer ${regAdminToken}`);
    console.log(`Status: ${resC.status}, Message: "${resC.body.message}"`);
    if (resC.status === 403) {
        console.log('✅ Passed: Regular admin receives 403 when trying to delete SuperAdmin');
    } else {
        console.error(`❌ Failed: Expected 403, got ${resC.status}`);
        passed = false;
    }

    // Test (d): Super admin status shows isSuperAdmin: true on /api/auth/me
    console.log('\n--- Test (d): Super admin status on GET /api/auth/me ---');
    const resD = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${superAdminToken}`);
    console.log(`Status: ${resD.status}, isSuperAdmin: ${resD.body.data.user.isSuperAdmin}`);
    if (resD.status === 200 && resD.body.data.user.isSuperAdmin === true) {
        console.log('✅ Passed: Super admin shows isSuperAdmin = true on /api/auth/me');
    } else {
        console.error(`❌ Failed: Expected isSuperAdmin = true on /api/auth/me`);
        passed = false;
    }

    await mongoose.disconnect();
    await mongoServer.stop();

    if (passed) {
        console.log('\n🎉 ALL ROLE & PERMISSION VERIFICATION TESTS PASSED PERFECTLY!');
    } else {
        console.error('\n❌ SOME VERIFICATION TESTS FAILED!');
    }

    process.exit(passed ? 0 : 1);
}

runAuthPermissionsTest().catch(err => {
    console.error('Test crashed:', err);
    process.exit(1);
});
