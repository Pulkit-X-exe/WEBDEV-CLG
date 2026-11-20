require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Auction = require("./models/Auction");
const Bid = require("./models/Bid");

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await User.deleteMany({});
        await Auction.deleteMany({});
        await Bid.deleteMany({});
        console.log("Cleared old database records.");

        // 1. Create demo users (passwords will be hashed via User pre-save hook)
        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@bidzone.com",
            password: "password123",
            role: "admin",
        });

        const sellerUser = await User.create({
            name: "Sarah Seller",
            email: "seller@bidzone.com",
            password: "password123",
            role: "seller",
        });

        const bidder1 = await User.create({
            name: "Alex Bidder",
            email: "bidder1@bidzone.com",
            password: "password123",
            role: "bidder",
        });

        const bidder2 = await User.create({
            name: "Rahul Sharma",
            email: "bidder2@bidzone.com",
            password: "password123",
            role: "bidder",
        });

        console.log("Created demo users (admin, seller, bidder1, bidder2)");

        // 2. Create sample auctions
        const now = new Date();
        const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
        const pastDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

        const auction1 = await Auction.create({
            title: "Vintage Rolex Submariner (1984)",
            description: "Rare luxury vintage wristwatch in mint condition with original box and papers.",
            category: "Collectibles",
            startingPrice: 4500,
            currentPrice: 5200,
            imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=60",
            seller: sellerUser._id,
            highestBidder: bidder1._id,
            startTime: now,
            endTime: threeDaysLater,
            status: "active",
        });

        const auction2 = await Auction.create({
            title: "Apple MacBook Pro 16\" M3 Max",
            description: "Brand new, sealed in box. 36GB unified memory, 1TB SSD space black.",
            category: "Electronics",
            startingPrice: 2200,
            currentPrice: 2600,
            imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=60",
            seller: sellerUser._id,
            highestBidder: bidder2._id,
            startTime: now,
            endTime: fiveDaysLater,
            status: "active",
        });

        const auction3 = await Auction.create({
            title: "Original Acrylic Canvas Painting: Sunset Horizon",
            description: "Hand-painted 24x36 inch canvas painting signed by contemporary local artist.",
            category: "Art",
            startingPrice: 350,
            currentPrice: 350,
            imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=60",
            seller: sellerUser._id,
            highestBidder: null,
            startTime: now,
            endTime: threeDaysLater,
            status: "active",
        });

        const auction4 = await Auction.create({
            title: "Limited Edition Leather Jacket (Size L)",
            description: "Genuine brown cowhide leather motorcycle jacket, handcrafted with brass zippers.",
            category: "Fashion",
            startingPrice: 180,
            currentPrice: 220,
            imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=60",
            seller: sellerUser._id,
            highestBidder: bidder1._id,
            startTime: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
            endTime: pastDate,
            status: "ended",
        });

        console.log("Created sample auction items");

        // 3. Create sample bids
        await Bid.create([
            {
                auction: auction1._id,
                bidder: bidder2._id,
                amount: 4800,
                bidTime: new Date(now.getTime() - 5 * 60 * 1000),
            },
            {
                auction: auction1._id,
                bidder: bidder1._id,
                amount: 5200,
                bidTime: new Date(now.getTime() - 2 * 60 * 1000),
            },
            {
                auction: auction2._id,
                bidder: bidder1._id,
                amount: 2400,
                bidTime: new Date(now.getTime() - 10 * 60 * 1000),
            },
            {
                auction: auction2._id,
                bidder: bidder2._id,
                amount: 2600,
                bidTime: new Date(now.getTime() - 1 * 60 * 1000),
            },
            {
                auction: auction4._id,
                bidder: bidder1._id,
                amount: 220,
                bidTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
            },
        ]);

        console.log("Created sample bids");
        console.log("=========================================");
        console.log("DATABASE SEEDING COMPLETED SUCCESSFULLY!");
        console.log("Demo Credentials:");
        console.log("Admin:  admin@bidzone.com / password123");
        console.log("Seller: seller@bidzone.com / password123");
        console.log("Bidder: bidder1@bidzone.com / password123");
        console.log("=========================================");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDatabase();
