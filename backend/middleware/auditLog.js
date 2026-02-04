const AuditLog = require('../models/AuditLog');

// Audit log middleware
const auditLog = (action, resource) => {
    return async (req, res, next) => {
        // Store original send function
        const originalSend = res.send;

        // Override send function to capture response
        res.send = function (data) {
            // Only log successful operations (2xx status codes)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // Create audit log entry
                AuditLog.create({
                    user: req.user?._id,
                    action,
                    resource,
                    resourceId: req.params.id || req.body?._id,
                    description: `${action} ${resource}`,
                    metadata: {
                        method: req.method,
                        path: req.path,
                        params: req.params,
                        query: req.query,
                        body: sanitizeBody(req.body)
                    },
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('user-agent')
                }).catch(err => {
                    console.error('Failed to create audit log:', err);
                });
            }

            // Call original send
            originalSend.call(this, data);
        };

        next();
    };
};

// Sanitize sensitive data from body
const sanitizeBody = (body) => {
    if (!body) return {};

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];

    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    });

    return sanitized;
};

module.exports = auditLog;
