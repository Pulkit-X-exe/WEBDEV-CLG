const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const mongoose = require("mongoose");
const Product = require("./models/Product");

const sampleProducts = [
    // Electronics (4 items, totalQuantity: 96, avgPrice: 5636.5, totalStockValue: 343904)
    {
        name: "USB-C Fast Charger",
        sku: "ELEC-CHG-101",
        category: "Electronics",
        price: 500,
        quantity: 58,
        reorderLevel: 15,
        supplier: "Anker Tech"
    },
    {
        name: "Wireless Earbuds",
        sku: "ELEC-EB-202",
        category: "Electronics",
        price: 4400,
        quantity: 9,
        reorderLevel: 10,
        supplier: "Sony India"
    },
    {
        name: "Mechanical Keyboard",
        sku: "ELEC-KB-303",
        category: "Electronics",
        price: 7800,
        quantity: 5,
        reorderLevel: 8,
        supplier: "Keychron"
    },
    {
        name: "Gaming Monitor 27-inch",
        sku: "ELEC-MON-404",
        category: "Electronics",
        price: 9846,
        quantity: 24,
        reorderLevel: 10,
        supplier: "LG Electronics"
    },

    // Apparel (2 items, totalQuantity: 78, avgPrice: 1399, totalStockValue: 75522)
    {
        name: "Cotton Casual T-Shirt",
        sku: "APP-TSH-501",
        category: "Apparel",
        price: 799,
        quantity: 67,
        reorderLevel: 20,
        supplier: "Raymond Ltd"
    },
    {
        name: "Denim Jacket",
        sku: "APP-JKT-502",
        category: "Apparel",
        price: 1999,
        quantity: 11,
        reorderLevel: 15,
        supplier: "Levi Strauss"
    },

    // Furniture (2 items)
    {
        name: "Study Table",
        sku: "FURN-TB-812",
        category: "Furniture",
        price: 3999,
        quantity: 2,
        reorderLevel: 4,
        supplier: "IKEA India"
    },
    {
        name: "Ergonomic Office Chair",
        sku: "FURN-CHR-813",
        category: "Furniture",
        price: 6499,
        quantity: 15,
        reorderLevel: 5,
        supplier: "Godrej Interio"
    },

    // Stationery (2 items)
    {
        name: "Gel Pen Pack of 15",
        sku: "STNY-PN-713",
        category: "Stationery",
        price: 120,
        quantity: 40,
        reorderLevel: 20,
        supplier: "Cello Pens"
    },
    {
        name: "Hardcover Spiral Notebook",
        sku: "STNY-NB-714",
        category: "Stationery",
        price: 180,
        quantity: 50,
        reorderLevel: 15,
        supplier: "Classmate"
    },

    // Groceries (2 items)
    {
        name: "Organic Green Tea",
        sku: "GROC-TEA-901",
        category: "Groceries",
        price: 350,
        quantity: 30,
        reorderLevel: 10,
        supplier: "Tata Tea"
    },
    {
        name: "Roasted Almonds 500g",
        sku: "GROC-ALM-902",
        category: "Groceries",
        price: 650,
        quantity: 25,
        reorderLevel: 10,
        supplier: "Nutty Delights"
    }
];

const seedDatabase = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/INVENTORY";
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing products
        await Product.deleteMany({});
        console.log("Cleared existing products.");

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log(`Successfully seeded ${sampleProducts.length} sample products!`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedDatabase();
