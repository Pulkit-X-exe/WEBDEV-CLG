
const Product = require("../models/project.models.js");

// CREATE PRODUCT
const createProduct = async (req, res) => {
    try {

        const product = await Product.create(req.body);

        res.status(201).json({
            message: "Product created successfully",
            product: product
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }
};

module.exports = { createProduct };
