const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: [true, 'Business name is required'],
        trim: true
    },
    businessType: {
        type: String,
        required: [true, 'Business type is required'],
        enum: ['restaurant', 'hotel', 'catering', 'retailer', 'other']
    },
    contactName: {
        type: String,
        required: [true, 'Contact name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    estimatedMonthlyVolume: {
        type: String,
        required: [true, 'Estimated monthly volume is required']
    },
    productInterests: [{
        type: String
    }],
    message: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'read', 'contacted', 'converted'],
        default: 'new'
    },
    notes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
bulkOrderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
