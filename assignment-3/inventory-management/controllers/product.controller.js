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

// Get all products with filtering, searching, sorting, and pagination
const getAllProducts = async (req, res, next) => {
    try {
        const { category, search, name, sortBy, order, sort } = req.query;

        // Build query object
        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search by name (case-insensitive)
        if (search) {
            query.name = { $regex: search, $options: "i" };
        } else if (name) {
            query.name = { $regex: name, $options: "i" };
        }

        // Sorting
        let sortOption = {};
        if (sortBy) {
            const sortOrder = order === "desc" ? -1 : 1;
            sortOption[sortBy] = sortOrder;
        } else if (sort) {
            sortOption = sort;
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await Product.countDocuments(query);
        const totalPages = Math.ceil(total / limit) || 1;
        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            total: total,
            page: page,
            totalPages: totalPages,
            count: products.length,
            products: products
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getAllProducts
};
