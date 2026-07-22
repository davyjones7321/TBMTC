const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: function () {
            return !this.phone; // Email required only if phone is not provided
        },
        unique: true,
        sparse: true, // Allow null values for unique constraint
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: function () {
            return !this.email; // Phone required only if email is not provided
        },
        unique: true,
        sparse: true, // Allow null values for unique constraint
        trim: true,
        match: [/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, 'Please provide a valid phone number']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Validate that at least email or phone is provided
userSchema.pre('validate', function (next) {
    if (!this.email && !this.phone) {
        next(new Error('Either email or phone must be provided'));
    } else {
        next();
    }
});

// Index for faster queries
userSchema.index({ role: 1 });

// Virtual for full name (backward compatibility)
userSchema.virtual('name').get(function () {
    if (this.firstName || this.lastName) {
        return `${this.firstName || ''} ${this.lastName || ''}`.trim();
    }
    return '';
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Method to get public profile
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);
