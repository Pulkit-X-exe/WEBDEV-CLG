const express = require("express");
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getLowStockProducts,
    getCategorySummary,
    getProductById,
    updateProduct,
    adjustStock,
    deleteProduct
} = require("../controllers/product.controller");

// Product Routes
router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/low-stock", getLowStockProducts);
router.get("/summary", getCategorySummary);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.patch("/:id/stock", adjustStock);
router.delete("/:id", deleteProduct);

module.exports = router;
