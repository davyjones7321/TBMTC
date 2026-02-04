const mongoose = require('mongoose');

const contactQuerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
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
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required']
    },
    subject: {
        type: String,
        enum: ['general', 'wholesale', 'quality', 'partnership', 'media', 'order_mismatch'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied'],
        default: 'new'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ContactQuery', contactQuerySchema);
