const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    shortDescription: {
        type: String,
        maxlength: 200
    },
    sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        uppercase: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    compareAtPrice: {
        type: Number,
        min: 0
    },
    cost: {
        type: Number,
        min: 0
    },
    unit: {
        type: String,
        enum: ['piece', 'kg', 'g', 'l', 'ml'],
        default: 'piece'
    },
    unitValue: {
        type: Number,
        default: 1
    },
    piecesPerKg: {
        type: Number,
        default: null
    },
    glazingPrices: {
        glazing20: { type: Number, default: null },
        glazing30: { type: Number, default: null },
        glazing50: { type: Number, default: null }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    images: [{
        url: String,
        alt: String,
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    stock: {
        quantity: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        lowStockThreshold: {
            type: Number,
            default: 10
        },
        trackInventory: {
            type: Boolean,
            default: true
        }
    },
    variants: [{
        size: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, default: 0 },
        sku: String,
        glazingPrices: {
            glazing20: { type: Number, default: null },
            glazing30: { type: Number, default: null },
            glazing50: { type: Number, default: null }
        }
    }],
    specifications: [{
        name: String,
        value: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    tags: [String],
    totalSold: {
        type: Number,
        default: 0
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Indexes
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ 'stock.quantity': 1 });
productSchema.index({ totalSold: -1 });
productSchema.index({ createdAt: -1 });

// Generate slug before saving
productSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Virtual for low stock status
productSchema.virtual('isLowStock').get(function () {
    return this.stock.trackInventory && this.stock.quantity <= this.stock.lowStockThreshold;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
    if (this.compareAtPrice && this.compareAtPrice > this.price) {
        return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
    }
    return 0;
});

// Method to update stock
productSchema.methods.updateStock = async function (quantity, operation = 'subtract') {
    if (operation === 'subtract') {
        this.stock.quantity -= quantity;
        this.totalSold += quantity;
    } else {
        this.stock.quantity += quantity;
    }
    await this.save();
};

module.exports = mongoose.model('Product', productSchema);
