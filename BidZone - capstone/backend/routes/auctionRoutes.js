const express = require("express");
const router = express.Router();
const {
    createAuction,
    getAllAuctions,
    getAuctionById,
    updateAuction,
    deleteAuction,
    getMyAuctions,
    getCategorySalesStats,
} = require("../controllers/auctionController");
const { verifyToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Public aggregation route
router.get("/stats/category-sales", getCategorySalesStats);

// Seller/Admin protected route: get own created auctions
router.get("/seller/my-auctions", verifyToken, authorizeRoles("seller", "admin"), getMyAuctions);

// Public routes for browsing auctions
router.get("/", getAllAuctions);
router.get("/:id", getAuctionById);

// Protected routes (RBAC): Creating auction requires seller or admin role
router.post("/", verifyToken, authorizeRoles("seller", "admin"), createAuction);

// Protected routes: updating or deleting auction
router.put("/:id", verifyToken, authorizeRoles("seller", "admin"), updateAuction);
router.delete("/:id", verifyToken, authorizeRoles("seller", "admin"), deleteAuction);

module.exports = router;
