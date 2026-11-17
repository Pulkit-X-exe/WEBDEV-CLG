const Product = require("../models/Product");

// Create a new product
const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct
};
