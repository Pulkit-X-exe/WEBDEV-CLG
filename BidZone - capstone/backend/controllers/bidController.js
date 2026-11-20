const Bid = require("../models/Bid");
const Auction = require("../models/Auction");

// @desc    Place a bid on an active auction
// @route   POST /api/bids
// @access  Private (Authenticated users)
const placeBid = async (req, res, next) => {
    try {
        const { auctionId, amount } = req.body;

        if (!auctionId || !amount) {
            return res.status(400).json({
                success: false,
                message: "Please provide auctionId and bid amount",
            });
        }

        const numericAmount = Number(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Bid amount must be a positive number",
            });
        }

        const auction = await Auction.findById(auctionId);
        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction not found",
            });
        }

        // Check if auction is active
        if (auction.status === "ended") {
            return res.status(400).json({
                success: false,
                message: "This auction has already ended. No more bids allowed.",
            });
        }

        // Check if auction has expired by time
        if (new Date() >= new Date(auction.endTime)) {
            auction.status = "ended";
            await auction.save();

            // Broadcast that the auction has ended
            if (req.io) {
                req.io.to(`auction_${auctionId}`).emit("auction_ended", {
                    auctionId: auction._id,
                    winner: auction.highestBidder,
                    finalPrice: auction.currentPrice,
                });
            }

            return res.status(400).json({
                success: false,
                message: "Auction timer has expired. This auction is now closed.",
            });
        }

        // Prevent seller from bidding on their own auction
        if (auction.seller.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Sellers cannot place bids on their own auction items.",
            });
        }

        // Validation: bid must strictly exceed the current highest price
        if (numericAmount <= auction.currentPrice) {
            return res.status(400).json({
                success: false,
                message: `Your bid of $${numericAmount} must be strictly higher than the current price of $${auction.currentPrice}`,
            });
        }

        // Create the bid
        const bid = new Bid({
            auction: auction._id,
            bidder: req.user._id,
            amount: numericAmount,
        });

        await bid.save();

        // Update auction current price and highest bidder
        auction.currentPrice = numericAmount;
        auction.highestBidder = req.user._id;
        await auction.save();

        await bid.populate("bidder", "name email");

        // Broadcast real-time update to all clients in this auction's room
        if (req.io) {
            req.io.to(`auction_${auctionId}`).emit("bid_update", {
                auctionId: auction._id,
                currentPrice: auction.currentPrice,
                highestBidder: {
                    _id: req.user._id,
                    name: req.user.name,
                },
                newBid: bid,
            });

            // Also emit general auction update to everyone browsing the marketplace
            req.io.emit("marketplace_update", {
                auctionId: auction._id,
                currentPrice: auction.currentPrice,
                highestBidderName: req.user.name,
            });
        }

        res.status(201).json({
            success: true,
            message: "Bid placed successfully!",
            bid,
            currentPrice: auction.currentPrice,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bids for a specific auction
// @route   GET /api/bids/auction/:auctionId
// @access  Public
const getBidsForAuction = async (req, res, next) => {
    try {
        const bids = await Bid.find({ auction: req.params.auctionId })
            .populate("bidder", "name email")
            .sort({ amount: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bids.length,
            bids,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get bids placed by the logged-in user
// @route   GET /api/bids/my-bids
// @access  Private (Protected)
const getMyBids = async (req, res, next) => {
    try {
        const bids = await Bid.find({ bidder: req.user._id })
            .populate("auction", "title category status currentPrice endTime imageUrl")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bids.length,
            bids,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    placeBid,
    getBidsForAuction,
    getMyBids,
};
