const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const frontendProducts = [
    // FISH - Frozen
    { name: "Squid Rings", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Squid+Rings", unit: "kg", freshness: "Frozen", description: "Premium quality squid rings, perfect for frying" },
    { name: "Squid Tube", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Squid+Tube", unit: "kg", freshness: "Frozen", description: "Cleaned squid tubes, ready to cook" },
    { name: "Mahi Mahi", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Mahi+Mahi", unit: "kg", freshness: "Frozen", description: "Mild, sweet-flavored fish, great for grilling" },
    { name: "Black Pomfret", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Black+Pomfret", unit: "kg", freshness: "Frozen", description: "Rich and flavorful, ideal for frying" },
    { name: "White Pomfret", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=White+Pomfret", unit: "kg", freshness: "Frozen", description: "Delicate taste, perfect for steaming" },
    { name: "King Fish", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=King+Fish", unit: "kg", freshness: "Frozen", description: "Firm texture, excellent for curry" },
    { name: "Seer Fish", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Seer+Fish", unit: "kg", freshness: "Frozen", description: "Popular South Indian fish, great for fry" },
    { name: "Indian Basa", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Indian+Basa", unit: "kg", freshness: "Frozen", description: "Boneless fillets, mild flavor" },
    { name: "Vietnam Basa", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Vietnam+Basa", unit: "kg", freshness: "Frozen", description: "Premium basa fillets, versatile cooking" },
    { name: "Bhetki", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Bhetki", unit: "kg", freshness: "Frozen", description: "Bengali favorite, less bones" },
    { name: "Catla", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Catla", unit: "kg", freshness: "Frozen", description: "Popular freshwater fish for curry" },
    { name: "Rohu", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Rohu", unit: "kg", freshness: "Frozen", description: "Traditional Indian fish, rich taste" },
    { name: "Tilapia", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Tilapia", unit: "kg", freshness: "Frozen", description: "Mild white fish, easy to cook" },
    { name: "Sardine", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Sardine", unit: "kg", freshness: "Frozen", description: "Small oily fish, high in omega-3" },
    { name: "Mackerel", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Mackerel", unit: "kg", freshness: "Frozen", description: "Flavorful fish, perfect for frying" },
    { name: "Anchovy", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Anchovy", unit: "kg", freshness: "Frozen", description: "Small fish, great for dry fry" },

    // FISH - Fresh
    { name: "Basa Chilled", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Basa+Chilled", unit: "kg", freshness: "Fresh", description: "Fresh chilled basa, delivered daily" },
    { name: "Crab", category: "Fish", price: 0, image: "https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Crab", unit: "kg", freshness: "Fresh", description: "Live/fresh crabs, premium quality" },

    // PRAWNS - PDTO
    { name: "Prawns PDTO", category: "Prawns", price: 0, image: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Prawns+PDTO", unit: "kg", freshness: "Frozen", description: "Peeled, deveined with tail on", variations: ['6/8', '8/12', '13/15', '16/20', '21/25', '31/40', '41/50', '51/60', '61/70'] },

    // PRAWNS - PD
    { name: "Prawns PD", category: "Prawns", price: 0, image: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Prawns+PD", unit: "kg", freshness: "Frozen", description: "Peeled and deveined, tail off", variations: ['6/8', '8/12', '13/15', '16/20', '21/25', '31/40', '41/50', '51/60', '61/70'] },

    // PRAWNS - Tiger
    { name: "Tiger Prawns", category: "Prawns", price: 0, image: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Tiger+Prawns", unit: "kg", freshness: "Frozen", description: "Premium tiger prawns", variations: ['6/8', '8/12', '13/15', '16/20', '21/25', '31/40', '41/50', '51/60', '61/70'] },

    // CHICKEN - Frozen
    { name: "Chicken Breast Boneless", category: "Chicken", price: 0, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Chicken+Breast", unit: "kg", freshness: "Frozen", description: "Tender chicken breast, protein-rich", variations: ['With Skin', 'Without Skin'] },
    { name: "Chicken Curry Cut", category: "Chicken", price: 0, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Curry+Cut", unit: "kg", freshness: "Frozen", description: "Cut into curry pieces with bone", variations: ['With Skin', 'Without Skin'] },
    { name: "Chicken Drum Stick", category: "Chicken", price: 0, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Drum+Stick", unit: "kg", freshness: "Frozen", description: "Juicy drumsticks, kids favorite", variations: ['With Skin', 'Without Skin'] },
    { name: "Chicken Leg Boneless", category: "Chicken", price: 0, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Leg+Boneless", unit: "kg", freshness: "Frozen", description: "Boneless leg meat, versatile", variations: ['With Skin', 'Without Skin'] },
    { name: "Chicken Lollipop", category: "Chicken", price: 0, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Lollipop", unit: "piece", freshness: "Frozen", description: "Party favorite, ready to fry" },
    { name: "Chicken Thigh Boneless", category: "Chicken", price: 0, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Thigh+Boneless", unit: "kg", freshness: "Frozen", description: "Juicy thigh meat, boneless", variations: ['With Skin', 'Without Skin'] },
    { name: "Chicken Whole Leg", category: "Chicken", price: 0, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Whole+Leg", unit: "kg", freshness: "Frozen", description: "Complete leg with drumstick", variations: ['With Skin', 'Without Skin'] },
    { name: "Chicken Wings", category: "Chicken", price: 0, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Wings", unit: "kg", freshness: "Frozen", description: "Perfect for grilling and frying", variations: ['With Skin', 'Without Skin'] },
    { name: "Chicken Whole Bird", category: "Chicken", price: 0, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Whole+Bird", unit: "piece", freshness: "Frozen", description: "Complete chicken, cleaned", variations: ['With Skin', 'Without Skin'] },

    // MUTTON - Frozen
    { name: "Mutton Curry Cut", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Curry", unit: "kg", freshness: "Frozen", description: "Premium curry cut with bone" },
    { name: "Mutton Boneless", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Boneless", unit: "kg", freshness: "Frozen", description: "Tender boneless pieces" },
    { name: "Mutton Chops", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Chops", unit: "kg", freshness: "Frozen", description: "Thick cut chops, perfect for grilling" },
    { name: "Mutton Raan/Leg", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Raan", unit: "piece", freshness: "Frozen", description: "Whole leg, ideal for special occasions" },
    { name: "Mutton Shank/Nali", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Nali", unit: "kg", freshness: "Frozen", description: "Rich, flavorful bone marrow" },
    { name: "Mutton Paya", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Paya", unit: "kg", freshness: "Frozen", description: "Traditional paya for soup" },
    { name: "Mutton Fat", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Fat", unit: "kg", freshness: "Frozen", description: "Pure mutton fat for cooking" },
    { name: "Mutton Mince/Kheema", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Kheema", unit: "kg", freshness: "Frozen", description: "Freshly minced mutton" },
    { name: "Mutton Delicate Curry Cut", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Delicate+Cut", unit: "kg", freshness: "Frozen", description: "Tender cuts, less fat" },
    { name: "Mutton Brain", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Brain", unit: "piece", freshness: "Frozen", description: "Delicacy, rich in nutrients" },

    // MUTTON - Australian
    { name: "Australian Mutton Curry Cut", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Aus+Curry", unit: "kg", freshness: "Frozen", description: "Premium Australian mutton" },
    { name: "Australian Jumbo Curry Cut", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Aus+Jumbo", unit: "kg", freshness: "Frozen", description: "Large cut pieces, Australian" },
    { name: "Australian Mutton Mince", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Aus+Mince", unit: "kg", freshness: "Frozen", description: "Premium Australian mince" },
    { name: "Australian Mutton Raan/Leg", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Aus+Raan", unit: "piece", freshness: "Frozen", description: "Whole Australian leg" },

    // MUTTON - Fresh
    { name: "Mutton Liver", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Mutton+Liver", unit: "kg", freshness: "Fresh", description: "Fresh mutton liver, daily supply" },
    { name: "Mutton Kidney", category: "Mutton", price: 0, image: "https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Mutton+Kidney", unit: "kg", freshness: "Fresh", description: "Fresh kidney, specialty item" },

    // BUFFALO - Frozen
    { name: "Buffalo Fat", category: "Buffalo", price: 0, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Buffalo+Fat", unit: "kg", freshness: "Frozen", description: "Pure buffalo fat" },
    { name: "Buffalo Boneless Cubes", category: "Buffalo", price: 0, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Buff+Cubes", unit: "kg", freshness: "Frozen", description: "Cubed boneless buffalo meat" },
    { name: "Buffalo Mince", category: "Buffalo", price: 0, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Buff+Mince", unit: "kg", freshness: "Frozen", description: "Lean buffalo mince" },
    { name: "Buffalo Tenderloin", category: "Buffalo", price: 0, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Tenderloin", unit: "kg", freshness: "Frozen", description: "Premium tender cut" },
    { name: "Buffalo Rib Eye Steak", category: "Buffalo", price: 0, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Rib+Eye", unit: "kg", freshness: "Frozen", description: "Marbled rib eye steak" },
    { name: "Buffalo Rump Steak", category: "Buffalo", price: 0, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Rump+Steak", unit: "kg", freshness: "Frozen", description: "Lean rump steak" },
    { name: "Buffalo Striploin Steak", category: "Buffalo", price: 0, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Striploin", unit: "kg", freshness: "Frozen", description: "Classic striploin cut" },
    { name: "Buffalo Tomahawk Steak", category: "Buffalo", price: 0, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Tomahawk", unit: "piece", freshness: "Frozen", description: "Impressive tomahawk cut" },

    // SEAFOOD
    { name: "Crab Meat", category: "Seafood", price: 0, image: "https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Crab+Meat", unit: "kg", freshness: "Frozen", description: "Premium crab meat, picked" },
    { name: "Lobster", category: "Seafood", price: 0, image: "https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Lobster", unit: "piece", freshness: "Frozen", description: "Luxury lobster, special order" },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        await Category.deleteMany({});
        await Order.deleteMany({});
        await Customer.deleteMany({});
        console.log('Cleared existing products, categories, orders, and customers');

        // Get unique categories
        const categoryNames = [...new Set(frontendProducts.map(p => p.category))];
        const categoryMap = {};

        // Create categories
        for (const catName of categoryNames) {
            const category = await Category.create({
                name: catName,
                description: `${catName} products`,
                isActive: true
            });
            categoryMap[catName] = category._id;
            console.log(`Created category: ${catName}`);
        }

        // Create products
        for (const p of frontendProducts) {
            await Product.create({
                name: p.name,
                description: p.description,
                sku: p.name.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 10) + Math.floor(Math.random() * 1000),
                price: p.price,
                category: categoryMap[p.category],
                images: [{ url: p.image, isPrimary: true }],
                stock: {
                    quantity: 100, // Default stock
                    trackInventory: true
                },
                tags: [p.freshness, p.unit], // Store freshness and unit in tags for now
                isActive: true
            });
        }

        console.log(`Successfully seeded ${frontendProducts.length} products`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
