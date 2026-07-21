require('dotenv').config();
process.env.MONGOMS_START_TIMEOUT = '60000';
const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const express = require('express');
const request = require('supertest');
const Product = require('./models/Product');
const Category = require('./models/Category');
const User = require('./models/User');
const Customer = require('./models/Customer');
const Order = require('./models/Order');

// Import order router
const orderRouter = require('./routes/orders');
const { errorHandler } = require('./middleware/errorHandler');

async function runConcurrencyTest() {
    console.log('🚀 Starting Concurrency Test with MongoMemoryReplSet (Replica Set enabled)...');

    // Start MongoMemoryReplSet so replica set / multi-document transactions work
    const mongoServer = await MongoMemoryReplSet.create({
        replSet: { count: 1, dbName: 'concurrency_test_db' },
        instanceOpts: [{ launchTimeout: 60000 }],
        binary: { downloadDir: './.mongodb-binaries' }
    });
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
    console.log('✅ Connected to MongoMemoryReplSet (Replica Set Active)');

    // Setup Express Test App
    const app = express();
    app.use(express.json());

    let testUser;
    app.use((req, res, next) => {
        req.user = testUser;
        next();
    });

    app.use('/api/orders', orderRouter);
    app.use(errorHandler);

    // Create Seed Data
    testUser = await User.create({
        name: 'Concurrency Tester',
        email: 'tester@example.com',
        password: 'Password123!',
        role: 'customer'
    });

    const category = await Category.create({
        name: 'Test Category',
        isActive: true
    });

    const product = await Product.create({
        name: 'Concurrency Test Fish',
        description: 'Testing stock race conditions',
        sku: 'TEST-FISH-001',
        price: 100,
        category: category._id,
        stock: {
            quantity: 3, // Initial top-level stock
            trackInventory: true
        },
        variants: [
            {
                size: '500g',
                price: 100,
                stock: 3 // Initial variant stock
            }
        ],
        isActive: true
    });

    console.log(`📦 Initial Product Stock: Total=${product.stock.quantity}, Variant(500g)=${product.variants[0].stock}`);

    // Execute 10 Concurrent Order Requests
    const orderPayload = {
        items: [
            {
                product: product._id.toString(),
                quantity: 1,
                variation: '500g'
            }
        ],
        shippingAddress: {
            street: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'USA'
        },
        paymentMethod: 'cash_on_delivery'
    };

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: testUser._id, role: testUser.role }, process.env.JWT_SECRET || 'secret');

    console.log('⚡ Firing 10 concurrent order requests (Stock = 3)...');

    const requests = Array.from({ length: 10 }).map(() =>
        request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send(orderPayload)
    );

    const responses = await Promise.all(requests);

    // Analyze Results
    const statusCounts = {};
    responses.forEach(res => {
        statusCounts[res.status] = (statusCounts[res.status] || 0) + 1;
    });

    console.log('\n📊 Response Status Distribution:');
    console.log(JSON.stringify(statusCounts, null, 2));

    const updatedProduct = await Product.findById(product._id);
    const updatedCustomer = await Customer.findOne({ userId: testUser._id });

    console.log(`\n📦 Final Product Stock: Total=${updatedProduct.stock.quantity}, Variant(500g)=${updatedProduct.variants[0].stock}`);
    if (updatedCustomer) {
        console.log(`👤 Customer Stats: totalOrders=${updatedCustomer.totalOrders}, totalSpent=${updatedCustomer.totalSpent}, averageOrderValue=${updatedCustomer.averageOrderValue}, lastOrderDate=${updatedCustomer.lastOrderDate}`);
    }

    // Assertions
    const successCount = statusCounts[201] || 0;
    const conflictCount = statusCounts[409] || 0;

    let passed = true;
    if (successCount !== 3) {
        console.error(`❌ Expected 3 successful orders (201), got ${successCount}`);
        passed = false;
    }
    if (conflictCount !== 7) {
        console.error(`❌ Expected 7 clean 409 conflict errors, got ${conflictCount}`);
        passed = false;
    }
    if (updatedProduct.stock.quantity !== 0 || updatedProduct.variants[0].stock !== 0) {
        console.error(`❌ Expected final stock to be 0/0, got Total=${updatedProduct.stock.quantity}, Variant=${updatedProduct.variants[0].stock}`);
        passed = false;
    }
    if (!updatedCustomer || updatedCustomer.totalOrders !== 3) {
        console.error(`❌ Expected customer totalOrders = 3, got ${updatedCustomer ? updatedCustomer.totalOrders : 0}`);
        passed = false;
    }

    if (passed) {
        console.log('\n🎉 CONCURRENCY TEST WITH REAL REPLICA SET TRANSACTIONS PASSED PERFECTLY!');
    } else {
        console.error('\n❌ CONCURRENCY TEST FAILED!');
    }

    await mongoose.disconnect();
    await mongoServer.stop();
    process.exit(passed ? 0 : 1);
}

runConcurrencyTest().catch(err => {
    console.error('Test script crashed:', err);
    process.exit(1);
});
