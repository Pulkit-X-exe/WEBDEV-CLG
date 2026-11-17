const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || "Server Error";

    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid product ID format";
    }

    if (err.code === 11000) {
        statusCode = 400;
        message = "SKU must be unique. A product with this SKU already exists.";
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((val) => val.message).join(", ");
    }

    res.status(statusCode).json({
        message: message
    });
};

module.exports = errorHandler;
