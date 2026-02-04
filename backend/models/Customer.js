const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: false, // Optional - users might only have a single name
        trim: true,
        default: ''
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    addresses: [{
        type: {
            type: String,
            enum: ['shipping', 'billing'],
            default: 'shipping'
        },
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        isDefault: {
            type: Boolean,
            default: false
        }
    }],
    totalOrders: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    averageOrderValue: {
        type: Number,
        default: 0
    },
    lastOrderDate: {
        type: Date
    },
    customerSince: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    },
    tags: [String]
}, {
    timestamps: true
});

// Indexes
customerSchema.index({ userId: 1 });
customerSchema.index({ firstName: 1, lastName: 1 });
customerSchema.index({ totalSpent: -1 });
customerSchema.index({ createdAt: -1 });

// Virtual for full name
customerSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Method to update customer stats
customerSchema.methods.updateStats = async function (orderAmount) {
    this.totalOrders += 1;
    this.totalSpent += orderAmount;
    this.averageOrderValue = this.totalSpent / this.totalOrders;
    this.lastOrderDate = new Date();
    await this.save();
};

module.exports = mongoose.model('Customer', customerSchema);
