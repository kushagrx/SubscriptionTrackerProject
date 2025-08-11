const errorMiddleware = (err, req, res, next) => {
    console.error(err); // Always log full error for debugging

    let statusCode = err.status || 500;
    let message = err.message || 'Server Error';

    // Handle Mongoose bad ObjectId
    if (err.name === 'CastError') {
        message = `Resource not found: Invalid ${err.path}`;
        statusCode = 404;
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value entered for "${field}"`;
        statusCode = 400;
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(val => val.message).join(', ');
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        error: message
    });
};

export default errorMiddleware;