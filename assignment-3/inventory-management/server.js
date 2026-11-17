
require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Product Routes
const productRoutes = require("./routes/product.routes.js");

app.use("/api/products", productRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Inventory Management API is Running!");
});

// Start Server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
