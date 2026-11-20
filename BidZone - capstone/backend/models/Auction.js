const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide an auction item title"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters long"],
        },
        description: {
            type: String,
            required: [true, "Please provide item description"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Please select a category"],
            enum: {
                values: ["Electronics", "Collectibles", "Art", "Vehicles", "Fashion", "Other"],
                message: "Invalid category selected",
            },
        },
        startingPrice: {
            type: Number,
            required: [true, "Please provide starting price"],
            min: [1, "Starting price must be at least 1"],
        },
        currentPrice: {
            type: Number,
            default: function () {
                return this.startingPrice;
            },
        },
        imageUrl: {
            type: String,
            default: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60",
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Auction must have a seller"],
        },
        highestBidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        startTime: {
            type: Date,
            default: Date.now,
        },
        endTime: {
            type: Date,
            required: [true, "Please provide auction end date and time"],
        },
        status: {
            type: String,
            enum: ["active", "ended"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for fast querying by category, status, and endTime
auctionSchema.index({ category: 1, status: 1 });
auctionSchema.index({ endTime: 1 });
auctionSchema.index({ seller: 1 });

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
