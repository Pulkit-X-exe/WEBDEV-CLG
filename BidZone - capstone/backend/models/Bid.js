const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
    {
        auction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
            required: [true, "Bid must belong to an auction"],
        },
        bidder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Bid must have a bidder"],
        },
        amount: {
            type: Number,
            required: [true, "Please provide bid amount"],
            min: [1, "Bid amount must be at least 1"],
        },
        bidTime: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index on auction and amount (descending) to quickly fetch highest bids
bidSchema.index({ auction: 1, amount: -1 });
bidSchema.index({ bidder: 1 });

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;
