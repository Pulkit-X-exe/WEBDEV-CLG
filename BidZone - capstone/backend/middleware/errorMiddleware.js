// Centralized Error-Handling Middleware
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || "Internal Server Error";

    // Mongoose bad ObjectId format
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Resource not found with invalid ID: ${err.value}`;
    }

    // Mongoose duplicate key error (e.g., email already exists)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate field value entered: ${field} already exists.`;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token signature";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token has expired, please log in again";
    }

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};

module.exports = errorHandler;
