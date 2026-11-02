const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/HospitalDB');
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection error:', err);
    }
};
module.exports = connectDB;
