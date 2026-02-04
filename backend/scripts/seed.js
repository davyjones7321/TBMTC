require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

const clearDatabase = async () => {
    try {
        await User.deleteMany({});
        await Customer.deleteMany({});
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});
        console.log('🗑️  Database cleared');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
};

const seedUsers = async () => {
    try {
        // Create admin user
        const admin = await User.create({
            email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com',
            password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123',
            name: 'Admin User',
            role: 'admin'
        });

        // Create customer users
        const customers = await User.create([
            {
                email: 'john.doe@example.com',
                password: 'Customer@123',
                name: 'John Doe',
                role: 'customer'
            },
            {
                email: 'jane.smith@example.com',
                password: 'Customer@123',
                name: 'Jane Smith',
                role: 'customer'
            },
            {
                email: 'bob.wilson@example.com',
                password: 'Customer@123',
                name: 'Bob Wilson',
                role: 'customer'
            }
        ]);

        console.log('✅ Users seeded');
        return { admin, customers };
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error;
    }
};

const seedCustomers = async (users) => {
    try {
        const customers = await Customer.create([
            {
                userId: users[0]._id,
                firstName: 'John',
                lastName: 'Doe',
                phone: '+1234567890',
                addresses: [{
                    type: 'shipping',
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA',
                    isDefault: true
                }],
                totalOrders: 0,
                totalSpent: 0
            },
            {
                userId: users[1]._id,
                firstName: 'Jane',
                lastName: 'Smith',
                phone: '+1234567891',
                addresses: [{
                    type: 'shipping',
                    street: '456 Oak Ave',
                    city: 'Los Angeles',
                    state: 'CA',
                    zipCode: '90001',
                    country: 'USA',
                    isDefault: true
                }],
                totalOrders: 0,
                totalSpent: 0
            },
            {
                userId: users[2]._id,
                firstName: 'Bob',
                lastName: 'Wilson',
                phone: '+1234567892',
                addresses: [{
                    type: 'shipping',
                    street: '789 Pine Rd',
                    city: 'Chicago',
                    state: 'IL',
                    zipCode: '60601',
                    country: 'USA',
                    isDefault: true
                }],
                totalOrders: 0,
                totalSpent: 0
            }
        ]);

        console.log('✅ Customers seeded');
        return customers;
    } catch (error) {
        console.error('Error seeding customers:', error);
        throw error;
    }
};

const seedCategories = async () => {
    try {
        const categories = await Category.create([
            {
                name: 'Electronics',
                description: 'Electronic devices and accessories',
                isActive: true,
                sortOrder: 1
            },
            {
                name: 'Clothing',
                description: 'Fashion and apparel',
                isActive: true,
                sortOrder: 2
            },
            {
                name: 'Home & Garden',
                description: 'Home improvement and garden supplies',
                isActive: true,
                sortOrder: 3
            },
            {
                name: 'Books',
                description: 'Books and publications',
                isActive: true,
                sortOrder: 4
            },
            {
                name: 'Sports & Outdoors',
                description: 'Sports equipment and outdoor gear',
                isActive: true,
                sortOrder: 5
            }
        ]);

        console.log('✅ Categories seeded');
        return categories;
    } catch (error) {
        console.error('Error seeding categories:', error);
        throw error;
    }
};

const seedProducts = async (categories) => {
    try {
        const products = await Product.create([
            {
                name: 'Wireless Bluetooth Headphones',
                description: 'High-quality wireless headphones with noise cancellation',
                shortDescription: 'Premium wireless headphones',
                sku: 'ELEC-HEAD-001',
                price: 99.99,
                compareAtPrice: 149.99,
                cost: 50.00,
                category: categories[0]._id,
                stock: {
                    quantity: 50,
                    lowStockThreshold: 10
                },
                isActive: true,
                isFeatured: true,
                tags: ['electronics', 'audio', 'wireless']
            },
            {
                name: 'Smart Watch',
                description: 'Feature-rich smartwatch with fitness tracking',
                shortDescription: 'Advanced fitness smartwatch',
                sku: 'ELEC-WATCH-001',
                price: 199.99,
                compareAtPrice: 249.99,
                cost: 100.00,
                category: categories[0]._id,
                stock: {
                    quantity: 30,
                    lowStockThreshold: 5
                },
                isActive: true,
                isFeatured: true,
                tags: ['electronics', 'wearable', 'fitness']
            },
            {
                name: 'Cotton T-Shirt',
                description: 'Comfortable 100% cotton t-shirt',
                shortDescription: 'Classic cotton tee',
                sku: 'CLOTH-SHIRT-001',
                price: 24.99,
                cost: 10.00,
                category: categories[1]._id,
                stock: {
                    quantity: 100,
                    lowStockThreshold: 20
                },
                isActive: true,
                tags: ['clothing', 'casual', 'cotton']
            },
            {
                name: 'Denim Jeans',
                description: 'Classic fit denim jeans',
                shortDescription: 'Comfortable denim jeans',
                sku: 'CLOTH-JEANS-001',
                price: 59.99,
                compareAtPrice: 79.99,
                cost: 30.00,
                category: categories[1]._id,
                stock: {
                    quantity: 75,
                    lowStockThreshold: 15
                },
                isActive: true,
                tags: ['clothing', 'denim', 'casual']
            },
            {
                name: 'Garden Tool Set',
                description: 'Complete set of essential garden tools',
                shortDescription: '10-piece garden tool set',
                sku: 'HOME-TOOL-001',
                price: 49.99,
                cost: 25.00,
                category: categories[2]._id,
                stock: {
                    quantity: 40,
                    lowStockThreshold: 10
                },
                isActive: true,
                tags: ['garden', 'tools', 'outdoor']
            },
            {
                name: 'LED Desk Lamp',
                description: 'Adjustable LED desk lamp with USB charging',
                shortDescription: 'Modern LED desk lamp',
                sku: 'HOME-LAMP-001',
                price: 34.99,
                cost: 15.00,
                category: categories[2]._id,
                stock: {
                    quantity: 8,
                    lowStockThreshold: 10
                },
                isActive: true,
                tags: ['home', 'lighting', 'office']
            },
            {
                name: 'Programming Book: JavaScript Mastery',
                description: 'Comprehensive guide to modern JavaScript',
                shortDescription: 'Learn JavaScript from basics to advanced',
                sku: 'BOOK-PROG-001',
                price: 39.99,
                cost: 15.00,
                category: categories[3]._id,
                stock: {
                    quantity: 60,
                    lowStockThreshold: 10
                },
                isActive: true,
                isFeatured: true,
                tags: ['books', 'programming', 'education']
            },
            {
                name: 'Yoga Mat',
                description: 'Non-slip yoga mat with carrying strap',
                shortDescription: 'Premium yoga mat',
                sku: 'SPORT-YOGA-001',
                price: 29.99,
                cost: 12.00,
                category: categories[4]._id,
                stock: {
                    quantity: 45,
                    lowStockThreshold: 10
                },
                isActive: true,
                tags: ['sports', 'yoga', 'fitness']
            }
        ]);

        console.log('✅ Products seeded');
        return products;
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
};

const seedOrders = async (customers, products) => {
    try {
        const orders = await Order.create([
            {
                customer: customers[0]._id,
                items: [
                    {
                        product: products[0]._id,
                        name: products[0].name,
                        sku: products[0].sku,
                        price: products[0].price,
                        quantity: 1,
                        subtotal: products[0].price
                    },
                    {
                        product: products[6]._id,
                        name: products[6].name,
                        sku: products[6].sku,
                        price: products[6].price,
                        quantity: 2,
                        subtotal: products[6].price * 2
                    }
                ],
                status: 'delivered',
                paymentStatus: 'paid',
                paymentMethod: 'credit_card',
                shippingAddress: {
                    firstName: 'John',
                    lastName: 'Doe',
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA',
                    phone: '+1234567890'
                },
                subtotal: products[0].price + (products[6].price * 2),
                tax: 15.00,
                shippingCost: 10.00,
                total: products[0].price + (products[6].price * 2) + 15.00 + 10.00
            },
            {
                customer: customers[1]._id,
                items: [
                    {
                        product: products[1]._id,
                        name: products[1].name,
                        sku: products[1].sku,
                        price: products[1].price,
                        quantity: 1,
                        subtotal: products[1].price
                    }
                ],
                status: 'processing',
                paymentStatus: 'paid',
                paymentMethod: 'paypal',
                shippingAddress: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    street: '456 Oak Ave',
                    city: 'Los Angeles',
                    state: 'CA',
                    zipCode: '90001',
                    country: 'USA',
                    phone: '+1234567891'
                },
                subtotal: products[1].price,
                tax: 18.00,
                shippingCost: 10.00,
                total: products[1].price + 18.00 + 10.00
            },
            {
                customer: customers[2]._id,
                items: [
                    {
                        product: products[2]._id,
                        name: products[2].name,
                        sku: products[2].sku,
                        price: products[2].price,
                        quantity: 3,
                        subtotal: products[2].price * 3
                    },
                    {
                        product: products[3]._id,
                        name: products[3].name,
                        sku: products[3].sku,
                        price: products[3].price,
                        quantity: 1,
                        subtotal: products[3].price
                    }
                ],
                status: 'pending',
                paymentStatus: 'pending',
                paymentMethod: 'cash_on_delivery',
                shippingAddress: {
                    firstName: 'Bob',
                    lastName: 'Wilson',
                    street: '789 Pine Rd',
                    city: 'Chicago',
                    state: 'IL',
                    zipCode: '60601',
                    country: 'USA',
                    phone: '+1234567892'
                },
                subtotal: (products[2].price * 3) + products[3].price,
                tax: 12.00,
                shippingCost: 10.00,
                total: (products[2].price * 3) + products[3].price + 12.00 + 10.00
            }
        ]);

        // Update customer stats for delivered orders
        await customers[0].updateStats(orders[0].total);

        console.log('✅ Orders seeded');
        return orders;
    } catch (error) {
        console.error('Error seeding orders:', error);
        throw error;
    }
};

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        await connectDB();
        await clearDatabase();

        const { admin, customers: customerUsers } = await seedUsers();
        const customers = await seedCustomers(customerUsers);
        const categories = await seedCategories();
        const products = await seedProducts(categories);
        const orders = await seedOrders(customers, products);

        console.log('\n✅ Database seeding completed successfully!');
        console.log('\n📝 Default Admin Credentials:');
        console.log(`   Email: ${process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com'}`);
        console.log(`   Password: ${process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123'}`);
        console.log('\n📊 Seeded Data Summary:');
        console.log(`   - Users: 4 (1 admin, 3 customers)`);
        console.log(`   - Customers: 3`);
        console.log(`   - Categories: 5`);
        console.log(`   - Products: 8`);
        console.log(`   - Orders: 3`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
