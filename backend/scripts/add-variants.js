const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const sizes = ['6/8', '8/12', '13/15', '16/20', '21/25', '31/40', '41/50', '51/60', '61/70'];

const updateProducts = async () => {
    await connectDB();

    try {
        const productsToUpdate = [
            { name: 'Prawns PD', basePrice: 800 }, // Example base price, will vary
            { name: 'Prawns PDTO', basePrice: 850 }
        ];

        for (const p of productsToUpdate) {
            const product = await Product.findOne({ name: p.name });
            if (!product) {
                console.log(`Product not found: ${p.name}`);
                continue;
            }

            console.log(`Updating ${p.name}...`);

            // Generate variants
            const variants = sizes.map((size, index) => {
                // Simple price logic for demo: smaller count (larger prawn) = higher price
                // This is just a placeholder logic, in real world user would provide prices.
                // Using a multiplier for demonstration.
                // 6/8 is largest (most expensive), 61/70 is smallest (cheapest)
                const priceMultiplier = 1 + ((sizes.length - index) * 0.1);
                const variantPrice = Math.round(p.basePrice * priceMultiplier);

                return {
                    size: size,
                    price: variantPrice,
                    stock: 100, // Default stock
                    sku: `${product.sku}-${size.replace('/', '-')}`
                };
            });

            product.variants = variants;
            await product.save();
            console.log(`Updated ${p.name} with ${variants.length} variants.`);
        }

        console.log('All updates complete.');
    } catch (error) {
        console.error('Error updating products:', error);
    } finally {
        mongoose.connection.close();
    }
};

updateProducts();
