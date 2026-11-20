const express = require("express");
const router = express.Router();
const {
    placeBid,
    getBidsForAuction,
    getMyBids,
} = require("../controllers/bidController");
const { verifyToken } = require("../middleware/authMiddleware");

// Public route to see bids for an auction
router.get("/auction/:auctionId", getBidsForAuction);

// Protected routes (require user to be logged in)
router.post("/", verifyToken, placeBid);
router.get("/my-bids", verifyToken, getMyBids);

module.exports = router;
