const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const connectDB = require('../config/database');

// Product data from frontend
const productsData = [
    // FISH - Frozen
    { name: "Squid Rings", category: "Fish", price: 450, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Squid+Rings", unit: "kg", freshness: "Frozen", description: "Premium quality squid rings, perfect for frying", sku: "FISH-001" },
    { name: "Squid Tube", category: "Fish", price: 480, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Squid+Tube", unit: "kg", freshness: "Frozen", description: "Cleaned squid tubes, ready to cook", sku: "FISH-002" },
    { name: "Mahi Mahi", category: "Fish", price: 550, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Mahi+Mahi", unit: "kg", freshness: "Frozen", description: "Mild, sweet-flavored fish, great for grilling", sku: "FISH-003" },
    { name: "Black Pomfret", category: "Fish", price: 600, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Black+Pomfret", unit: "kg", freshness: "Frozen", description: "Rich and flavorful, ideal for frying", sku: "FISH-004" },
    { name: "White Pomfret", category: "Fish", price: 850, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=White+Pomfret", unit: "kg", freshness: "Frozen", description: "Delicate taste, perfect for steaming", sku: "FISH-005" },
    { name: "King Fish", category: "Fish", price: 750, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=King+Fish", unit: "kg", freshness: "Frozen", description: "Firm texture, excellent for curry", sku: "FISH-006" },
    { name: "Seer Fish", category: "Fish", price: 800, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Seer+Fish", unit: "kg", freshness: "Frozen", description: "Popular South Indian fish, great for fry", sku: "FISH-007" },
    { name: "Indian Basa", category: "Fish", price: 350, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Indian+Basa", unit: "kg", freshness: "Frozen", description: "Boneless fillets, mild flavor", sku: "FISH-008" },
    { name: "Vietnam Basa", category: "Fish", price: 400, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Vietnam+Basa", unit: "kg", freshness: "Frozen", description: "Premium basa fillets, versatile cooking", sku: "FISH-009" },
    { name: "Bhetki", category: "Fish", price: 650, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Bhetki", unit: "kg", freshness: "Frozen", description: "Bengali favorite, less bones", sku: "FISH-010" },
    { name: "Catla", category: "Fish", price: 300, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Catla", unit: "kg", freshness: "Frozen", description: "Popular freshwater fish for curry", sku: "FISH-011" },
    { name: "Rohu", category: "Fish", price: 320, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Rohu", unit: "kg", freshness: "Frozen", description: "Traditional Indian fish, rich taste", sku: "FISH-012" },
    { name: "Tilapia", category: "Fish", price: 250, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Tilapia", unit: "kg", freshness: "Frozen", description: "Mild white fish, easy to cook", sku: "FISH-013" },
    { name: "Sardine", category: "Fish", price: 200, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Sardine", unit: "kg", freshness: "Frozen", description: "Small oily fish, high in omega-3", sku: "FISH-014" },
    { name: "Mackerel", category: "Fish", price: 280, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Mackerel", unit: "kg", freshness: "Frozen", description: "Flavorful fish, perfect for frying", sku: "FISH-015" },
    { name: "Anchovy", category: "Fish", price: 220, image: "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Anchovy", unit: "kg", freshness: "Frozen", description: "Small fish, great for dry fry", sku: "FISH-016" },

    // FISH - Fresh
    { name: "Basa Chilled", category: "Fish", price: 420, image: "https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Basa+Chilled", unit: "kg", freshness: "Fresh", description: "Fresh chilled basa, delivered daily", sku: "FISH-017" },
    { name: "Crab", category: "Fish", price: 550, image: "https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Crab", unit: "kg", freshness: "Fresh", description: "Live/fresh crabs, premium quality", sku: "FISH-018" },

    // PRAWNS - PDTO
    { name: "Prawns PDTO", category: "Prawns", price: 650, image: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Prawns+PDTO", unit: "kg", freshness: "Frozen", description: "Peeled, deveined with tail on", variations: ['6/8', '8/12', '13/15', '16/20', '21/25', '31/40', '41/50', '51/60', '61/70'], sku: "PRWN-001" },

    // PRAWNS - PD
    { name: "Prawns PD", category: "Prawns", price: 700, image: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Prawns+PD", unit: "kg", freshness: "Frozen", description: "Peeled and deveined, tail off", variations: ['6/8', '8/12', '13/15', '16/20', '21/25', '31/40', '41/50', '51/60', '61/70'], sku: "PRWN-002" },

    // PRAWNS - Tiger
    { name: "Tiger Prawns", category: "Prawns", price: 1200, image: "https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Tiger+Prawns", unit: "kg", freshness: "Frozen", description: "Premium tiger prawns", variations: ['6/8', '8/12', '13/15', '16/20', '21/25', '31/40', '41/50', '51/60', '61/70'], sku: "PRWN-003" },

    // CHICKEN - Frozen
    { name: "Chicken Breast Boneless", category: "Chicken", price: 280, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Chicken+Breast", unit: "kg", freshness: "Frozen", description: "Tender chicken breast, protein-rich", variations: ['With Skin', 'Without Skin'], sku: "CHKN-001" },
    { name: "Chicken Curry Cut", category: "Chicken", price: 240, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Curry+Cut", unit: "kg", freshness: "Frozen", description: "Cut into curry pieces with bone", variations: ['With Skin', 'Without Skin'], sku: "CHKN-002" },
    { name: "Chicken Drum Stick", category: "Chicken", price: 260, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Drum+Stick", unit: "kg", freshness: "Frozen", description: "Juicy drumsticks, kids favorite", variations: ['With Skin', 'Without Skin'], sku: "CHKN-003" },
    { name: "Chicken Leg Boneless", category: "Chicken", price: 300, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Leg+Boneless", unit: "kg", freshness: "Frozen", description: "Boneless leg meat, versatile", variations: ['With Skin', 'Without Skin'], sku: "CHKN-004" },
    { name: "Chicken Lollipop", category: "Chicken", price: 290, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Lollipop", unit: "piece", freshness: "Frozen", description: "Party favorite, ready to fry", sku: "CHKN-005" },
    { name: "Chicken Thigh Boneless", category: "Chicken", price: 290, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Thigh+Boneless", unit: "kg", freshness: "Frozen", description: "Juicy thigh meat, boneless", variations: ['With Skin', 'Without Skin'], sku: "CHKN-006" },
    { name: "Chicken Whole Leg", category: "Chicken", price: 250, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Whole+Leg", unit: "kg", freshness: "Frozen", description: "Complete leg with drumstick", variations: ['With Skin', 'Without Skin'], sku: "CHKN-007" },
    { name: "Chicken Wings", category: "Chicken", price: 220, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Wings", unit: "kg", freshness: "Frozen", description: "Perfect for grilling and frying", variations: ['With Skin', 'Without Skin'], sku: "CHKN-008" },
    { name: "Chicken Whole Bird", category: "Chicken", price: 200, image: "https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Whole+Bird", unit: "piece", freshness: "Frozen", description: "Complete chicken, cleaned", variations: ['With Skin', 'Without Skin'], sku: "CHKN-009" },

    // MUTTON - Frozen
    { name: "Mutton Curry Cut", category: "Mutton", price: 800, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Curry", unit: "kg", freshness: "Frozen", description: "Premium curry cut with bone", sku: "MUTN-001" },
    { name: "Mutton Boneless", category: "Mutton", price: 950, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Boneless", unit: "kg", freshness: "Frozen", description: "Tender boneless pieces", sku: "MUTN-002" },
    { name: "Mutton Chops", category: "Mutton", price: 900, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Chops", unit: "kg", freshness: "Frozen", description: "Thick cut chops, perfect for grilling", sku: "MUTN-003" },
    { name: "Mutton Raan/Leg", category: "Mutton", price: 850, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Raan", unit: "piece", freshness: "Frozen", description: "Whole leg, ideal for special occasions", sku: "MUTN-004" },
    { name: "Mutton Shank/Nali", category: "Mutton", price: 850, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Nali", unit: "kg", freshness: "Frozen", description: "Rich, flavorful bone marrow", sku: "MUTN-005" },
    { name: "Mutton Paya", category: "Mutton", price: 400, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Paya", unit: "kg", freshness: "Frozen", description: "Traditional paya for soup", sku: "MUTN-006" },
    { name: "Mutton Fat", category: "Mutton", price: 200, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Fat", unit: "kg", freshness: "Frozen", description: "Pure mutton fat for cooking", sku: "MUTN-007" },
    { name: "Mutton Mince/Kheema", category: "Mutton", price: 900, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Kheema", unit: "kg", freshness: "Frozen", description: "Freshly minced mutton", sku: "MUTN-008" },
    { name: "Mutton Delicate Curry Cut", category: "Mutton", price: 850, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Delicate+Cut", unit: "kg", freshness: "Frozen", description: "Tender cuts, less fat", sku: "MUTN-009" },
    { name: "Mutton Brain", category: "Mutton", price: 300, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mutton+Brain", unit: "piece", freshness: "Frozen", description: "Delicacy, rich in nutrients", sku: "MUTN-010" },

    // MUTTON - Australian
    { name: "Australian Mutton Curry Cut", category: "Mutton", price: 1200, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Aus+Curry", unit: "kg", freshness: "Frozen", description: "Premium Australian mutton", sku: "AMUT-001" },
    { name: "Australian Jumbo Curry Cut", category: "Mutton", price: 1100, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Aus+Jumbo", unit: "kg", freshness: "Frozen", description: "Large cut pieces, Australian", sku: "AMUT-002" },
    { name: "Australian Mutton Mince", category: "Mutton", price: 1300, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Aus+Mince", unit: "kg", freshness: "Frozen", description: "Premium Australian mince", sku: "AMUT-003" },
    { name: "Australian Mutton Raan/Leg", category: "Mutton", price: 1250, image: "https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Aus+Raan", unit: "piece", freshness: "Frozen", description: "Whole Australian leg", sku: "AMUT-004" },

    // MUTTON - Fresh
    { name: "Mutton Liver", category: "Mutton", price: 600, image: "https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Mutton+Liver", unit: "kg", freshness: "Fresh", description: "Fresh mutton liver, daily supply", sku: "MUTN-011" },
    { name: "Mutton Kidney", category: "Mutton", price: 600, image: "https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Mutton+Kidney", unit: "kg", freshness: "Fresh", description: "Fresh kidney, specialty item", sku: "MUTN-012" },

    // BUFFALO - Frozen
    { name: "Buffalo Fat", category: "Buffalo", price: 150, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Buffalo+Fat", unit: "kg", freshness: "Frozen", description: "Pure buffalo fat", sku: "BUFF-001" },
    { name: "Buffalo Boneless Cubes", category: "Buffalo", price: 350, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Buff+Cubes", unit: "kg", freshness: "Frozen", description: "Cubed boneless buffalo meat", sku: "BUFF-002" },
    { name: "Buffalo Mince", category: "Buffalo", price: 380, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Buff+Mince", unit: "kg", freshness: "Frozen", description: "Lean buffalo mince", sku: "BUFF-003" },
    { name: "Buffalo Tenderloin", category: "Buffalo", price: 450, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Tenderloin", unit: "kg", freshness: "Frozen", description: "Premium tender cut", sku: "BUFF-004" },
    { name: "Buffalo Rib Eye Steak", category: "Buffalo", price: 500, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Rib+Eye", unit: "kg", freshness: "Frozen", description: "Marbled rib eye steak", sku: "BUFF-005" },
    { name: "Buffalo Rump Steak", category: "Buffalo", price: 480, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Rump+Steak", unit: "kg", freshness: "Frozen", description: "Lean rump steak", sku: "BUFF-006" },
    { name: "Buffalo Striploin Steak", category: "Buffalo", price: 490, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Striploin", unit: "kg", freshness: "Frozen", description: "Classic striploin cut", sku: "BUFF-007" },
    { name: "Buffalo Tomahawk Steak", category: "Buffalo", price: 600, image: "https://via.placeholder.com/300x200/795548/FFFFFF?text=Tomahawk", unit: "piece", freshness: "Frozen", description: "Impressive tomahawk cut", sku: "BUFF-008" },

    // SEAFOOD
    { name: "Crab Meat", category: "Seafood", price: 700, image: "https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Crab+Meat", unit: "kg", freshness: "Frozen", description: "Premium crab meat, picked", sku: "SEA-001" },
    { name: "Lobster", category: "Seafood", price: 1500, image: "https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Lobster", unit: "piece", freshness: "Frozen", description: "Luxury lobster, special order", sku: "SEA-002" },
];

const seedProducts = async () => {
    try {
        await connectDB();

        console.log('🧹 Clearing existing products and categories...');
        await Product.deleteMany({});
        await Category.deleteMany({});

        console.log('📦 Creating categories...');
        const categories = [...new Set(productsData.map(p => p.category))];
        const categoryMap = {};

        for (const catName of categories) {
            const category = await Category.create({
                name: catName,
                description: `All ${catName} products`,
                isActive: true
            });
            categoryMap[catName] = category._id;
            console.log(`   ✅ Created category: ${catName}`);
        }

        console.log('🥩 Creating products...');
        for (const p of productsData) {
            await Product.create({
                name: p.name,
                description: p.description,
                shortDescription: p.description,
                sku: p.sku,
                price: p.price,
                category: categoryMap[p.category],
                stock: {
                    quantity: 100, // Default stock
                    lowStockThreshold: 10,
                    trackInventory: true
                },
                images: [{
                    url: p.image,
                    alt: p.name,
                    isPrimary: true
                }],
                isActive: true,
                isFeatured: false,
                tags: [p.freshness, p.unit]
            });
        }

        console.log(`✨ Successfully seeded ${productsData.length} products!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedProducts();
