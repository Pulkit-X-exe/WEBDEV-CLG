require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const productRoutes = require("./routes/product.routes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.send("Inventory Management API is Running!");
});

// Product Routes
app.use("/api/products", productRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
