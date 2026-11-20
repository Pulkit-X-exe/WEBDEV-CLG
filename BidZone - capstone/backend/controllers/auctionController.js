const Auction = require("../models/Auction");
const Bid = require("../models/Bid");

// Helper to check if auction has passed its end time and update status
const checkAuctionExpiry = async (auction) => {
    if (auction.status === "active" && new Date() >= new Date(auction.endTime)) {
        auction.status = "ended";
        await auction.save();
    }
    return auction;
};

// @desc    Create a new auction item
// @route   POST /api/auctions
// @access  Private (Seller, Admin)
const createAuction = async (req, res, next) => {
    try {
        const { title, description, category, startingPrice, imageUrl, endTime } = req.body;

        if (!title || !description || !category || !startingPrice || !endTime) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required auction details.",
            });
        }

        const parsedEndTime = new Date(endTime);
        if (isNaN(parsedEndTime.getTime()) || parsedEndTime <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "End time must be a valid future date and time.",
            });
        }

        const auction = new Auction({
            title,
            description,
            category,
            startingPrice: Number(startingPrice),
            currentPrice: Number(startingPrice),
            imageUrl: imageUrl || undefined,
            seller: req.user._id,
            endTime: parsedEndTime,
            status: "active",
        });

        await auction.save();

        // Populate seller details for response
        await auction.populate("seller", "name email");

        // Broadcast new auction to socket clients if available
        if (req.io) {
            req.io.emit("new_auction_created", auction);
        }

        res.status(201).json({
            success: true,
            message: "Auction created successfully!",
            auction,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all auctions with optional filters (category, status, search)
// @route   GET /api/auctions
// @access  Public
const getAllAuctions = async (req, res, next) => {
    try {
        const { category, status, search } = req.query;
        let query = {};

        if (category && category !== "All") {
            query.category = category;
        }

        if (status && status !== "all") {
            query.status = status;
        }

        if (search) {
            query.title = { $regex: search, $options: "i" };
        }

        let auctions = await Auction.find(query)
            .populate("seller", "name email")
            .populate("highestBidder", "name")
            .sort({ createdAt: -1 });

        // Auto-update any expired active auctions
        for (let auction of auctions) {
            await checkAuctionExpiry(auction);
        }

        res.status(200).json({
            success: true,
            count: auctions.length,
            auctions,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single auction by ID
// @route   GET /api/auctions/:id
// @access  Public
const getAuctionById = async (req, res, next) => {
    try {
        let auction = await Auction.findById(req.params.id)
            .populate("seller", "name email")
            .populate("highestBidder", "name");

        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction item not found",
            });
        }

        // Check if expired
        await checkAuctionExpiry(auction);

        // Fetch recent bids for this auction
        const bids = await Bid.find({ auction: auction._id })
            .populate("bidder", "name email")
            .sort({ amount: -1 });

        res.status(200).json({
            success: true,
            auction,
            bids,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update auction (only by seller or admin before bids are placed)
// @route   PUT /api/auctions/:id
// @access  Private (Seller who owns it, or Admin)
const updateAuction = async (req, res, next) => {
    try {
        const auction = await Auction.findById(req.params.id);

        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction not found",
            });
        }

        // Check ownership or admin
        const isOwner = auction.seller.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to edit this auction.",
            });
        }

        // Prevent updating if bids have already been placed
        const existingBidsCount = await Bid.countDocuments({ auction: auction._id });
        if (existingBidsCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot modify auction details after bids have already been placed.",
            });
        }

        const { title, description, category, startingPrice, imageUrl, endTime } = req.body;

        if (title) auction.title = title;
        if (description) auction.description = description;
        if (category) auction.category = category;
        if (startingPrice) {
            auction.startingPrice = Number(startingPrice);
            auction.currentPrice = Number(startingPrice);
        }
        if (imageUrl) auction.imageUrl = imageUrl;
        if (endTime) auction.endTime = new Date(endTime);

        await auction.save();

        res.status(200).json({
            success: true,
            message: "Auction updated successfully",
            auction,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete auction
// @route   DELETE /api/auctions/:id
// @access  Private (Seller who owns it, or Admin)
const deleteAuction = async (req, res, next) => {
    try {
        const auction = await Auction.findById(req.params.id);

        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction not found",
            });
        }

        const isOwner = auction.seller.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to delete this auction.",
            });
        }

        // Delete associated bids first
        await Bid.deleteMany({ auction: auction._id });
        await Auction.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Auction and related bids deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get auctions created by the logged-in seller
// @route   GET /api/auctions/seller/my-auctions
// @access  Private (Seller, Admin)
const getMyAuctions = async (req, res, next) => {
    try {
        const auctions = await Auction.find({ seller: req.user._id })
            .populate("highestBidder", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: auctions.length,
            auctions,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Category-wise Sales & Auction Statistics (Aggregation Pipeline Query)
// @route   GET /api/auctions/stats/category-sales
// @access  Public
const getCategorySalesStats = async (req, res, next) => {
    try {
        // Mongoose Aggregation Pipeline:
        // Stage 1: $group by category to calculate counts, average prices, and volume
        // Stage 2: $project formatted fields
        // Stage 3: $sort by totalAuctions descending
        const stats = await Auction.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalAuctions: { $sum: 1 },
                    activeAuctions: {
                        $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
                    },
                    endedAuctions: {
                        $sum: { $cond: [{ $eq: ["$status", "ended"] }, 1, 0] },
                    },
                    avgStartingPrice: { $avg: "$startingPrice" },
                    highestPrice: { $max: "$currentPrice" },
                    totalVolume: { $sum: "$currentPrice" },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    totalAuctions: 1,
                    activeAuctions: 1,
                    endedAuctions: 1,
                    avgStartingPrice: { $round: ["$avgStartingPrice", 2] },
                    highestPrice: 1,
                    totalVolume: 1,
                },
            },
            {
                $sort: { totalAuctions: -1 },
            },
        ]);

        res.status(200).json({
            success: true,
            message: "Category sales aggregation statistics retrieved successfully",
            count: stats.length,
            stats,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAuction,
    getAllAuctions,
    getAuctionById,
    updateAuction,
    deleteAuction,
    getMyAuctions,
    getCategorySalesStats,
};
