const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['create', 'update', 'delete', 'login', 'logout', 'status_change', 'signup', 'password_change', 'other']
    },
    resource: {
        type: String,
        required: true,
        enum: ['user', 'customer', 'product', 'order', 'category', 'auth', 'profile', 'settings', 'other']
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    description: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resource: 1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
