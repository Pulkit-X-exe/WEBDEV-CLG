require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const bidRoutes = require("./routes/bidRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
const server = http.createServer(app);

// Setup Socket.io with CORS
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
});

// Attach socket.io instance to every request so controllers can emit real-time events
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

// API Routes
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to BidZone - Online Auction Platform API",
        status: "Running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);

// 404 Route Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.originalUrl}`,
    });
});

// Centralized Error-Handling Middleware
app.use(errorHandler);

// Socket.io Connection Logic
io.on("connection", (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    // Join room specific to an auction
    socket.on("join_auction", (auctionId) => {
        socket.join(`auction_${auctionId}`);
        console.log(`User ${socket.id} joined room auction_${auctionId}`);
    });

    // Leave room
    socket.on("leave_auction", (auctionId) => {
        socket.leave(`auction_${auctionId}`);
        console.log(`User ${socket.id} left room auction_${auctionId}`);
    });

    socket.on("disconnect", () => {
        console.log(`Socket client disconnected: ${socket.id}`);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
    }
};

startServer();
