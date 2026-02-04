// Pagination helper
const paginate = (page = 1, limit = 10) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const skip = (pageNum - 1) * limitNum;

    return {
        skip,
        limit: limitNum,
        page: pageNum
    };
};

// Build pagination response
const paginationResponse = (data, page, limit, total) => {
    const totalPages = Math.ceil(total / limit);

    return {
        data,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};

// Date range helper
const getDateRange = (period) => {
    const now = new Date();
    let startDate;

    switch (period) {
        case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
        case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        default:
            startDate = new Date(now.setDate(now.getDate() - 30));
    }

    return {
        startDate,
        endDate: new Date()
    };
};

// Success response helper
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Error response helper
const errorResponse = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
    const response = {
        success: false,
        message
    };

    if (errors) {
        response.errors = errors;
    }

    return res.status(statusCode).json(response);
};

// Create custom error
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
    }).format(amount);
};

// Generate random string
const generateRandomString = (length = 10) => {
    return Math.random().toString(36).substring(2, length + 2);
};

module.exports = {
    paginate,
    paginationResponse,
    getDateRange,
    successResponse,
    errorResponse,
    AppError,
    formatCurrency,
    generateRandomString
};
