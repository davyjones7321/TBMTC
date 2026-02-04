const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        next();
    };
};

// Validation schemas
const schemas = {
    // Auth schemas
    login: Joi.object({
        email: Joi.string().email(),
        phone: Joi.string().pattern(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/),
        password: Joi.string().min(6).required()
    }).or('email', 'phone'), // At least one of email or phone is required

    register: Joi.object({
        email: Joi.string().email(),
        phone: Joi.string().pattern(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/),
        password: Joi.string().min(6).required(),
        name: Joi.string().min(2).required(),
        role: Joi.string().valid('admin', 'customer').default('customer')
    }).or('email', 'phone'), // At least one of email or phone is required

    // Product schemas
    createProduct: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        shortDescription: Joi.string().max(200).allow(''),
        sku: Joi.string().required(),
        price: Joi.number().min(0).required(),
        compareAtPrice: Joi.number().min(0),
        cost: Joi.number().min(0),
        unit: Joi.string().valid('piece', 'kg', 'g', 'l', 'ml').default('piece'),
        unitValue: Joi.number().min(0).default(1),
        category: Joi.string().required(),
        stock: Joi.object({
            quantity: Joi.number().min(0).required(),
            lowStockThreshold: Joi.number().min(0).default(10),
            trackInventory: Joi.boolean().default(true)
        }),
        images: Joi.array().items(Joi.object({
            url: Joi.string().required(),
            alt: Joi.string().allow(''),
            isPrimary: Joi.boolean().default(false)
        })),
        isActive: Joi.boolean().default(true),
        isFeatured: Joi.boolean().default(false),
        tags: Joi.array().items(Joi.string())
    }),

    updateProduct: Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        shortDescription: Joi.string().allow(''),
        sku: Joi.string(),
        price: Joi.number().min(0),
        compareAtPrice: Joi.number().min(0),
        cost: Joi.number().min(0),
        unit: Joi.string().valid('piece', 'kg', 'g', 'l', 'ml'),
        unitValue: Joi.number().min(0),
        category: Joi.string(),
        stock: Joi.object({
            quantity: Joi.number().min(0),
            lowStockThreshold: Joi.number().min(0),
            trackInventory: Joi.boolean()
        }),
        images: Joi.array().items(Joi.object({
            url: Joi.string().required(),
            alt: Joi.string().allow(''),
            isPrimary: Joi.boolean()
        })),
        isActive: Joi.boolean(),
        isFeatured: Joi.boolean(),
        tags: Joi.array().items(Joi.string())
    }),

    // Customer schemas
    updateCustomer: Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        phone: Joi.string(),
        addresses: Joi.array().items(Joi.object({
            type: Joi.string().valid('shipping', 'billing'),
            street: Joi.string(),
            city: Joi.string(),
            state: Joi.string(),
            zipCode: Joi.string(),
            country: Joi.string(),
            isDefault: Joi.boolean()
        })),
        notes: Joi.string(),
        tags: Joi.array().items(Joi.string())
    }),

    // Order schemas
    createOrder: Joi.object({
        items: Joi.array().items(Joi.object({
            product: Joi.string().required(),
            quantity: Joi.number().min(1).required(),
            variation: Joi.string().optional(),
            price: Joi.number().min(0).optional()
        })).min(1).required(),
        shippingAddress: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zipCode: Joi.string().required(),
            country: Joi.string().required(),
            firstName: Joi.string(),
            lastName: Joi.string(),
            phone: Joi.string()
        }).required(),
        paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'paypal', 'cash_on_delivery').default('cash_on_delivery'),
        deliverySlot: Joi.string().optional()
    }),

    updateOrderStatus: Joi.object({
        status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded').required(),
        note: Joi.string()
    }),

    // Category schemas
    createCategory: Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        parent: Joi.string().allow(null),
        image: Joi.string(),
        isActive: Joi.boolean().default(true),
        sortOrder: Joi.number().default(0)
    }),

    updateCategory: Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        parent: Joi.string().allow(null),
        image: Joi.string(),
        isActive: Joi.boolean(),
        sortOrder: Joi.number()
    })
};

module.exports = {
    validate,
    schemas
};
