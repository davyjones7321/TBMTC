const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    storeName: {
        type: String,
        default: 'JHOM FOODS'
    },
    storeEmail: {
        type: String,
        default: 'contact@jhomfoods.com'
    },
    storePhone: {
        type: String,
        default: ''
    },
    storeAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    currency: {
        code: { type: String, default: 'INR' },
        symbol: { type: String, default: '₹' }
    },
    taxRate: {
        type: Number,
        default: 0
    },
    shippingMethods: [{
        name: String,
        price: Number,
        description: String,
        isActive: { type: Boolean, default: true }
    }],
    paymentMethods: {
        cod: { type: Boolean, default: true },
        online: { type: Boolean, default: false }
    },
    emailSettings: {
        smtpHost: String,
        smtpPort: Number,
        smtpUser: String,
        smtpFrom: String
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Settings', settingsSchema);
