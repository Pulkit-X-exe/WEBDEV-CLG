const express = require('express');
const app = express();
const PORT = 3000;

const users = [
    { id: 1, name: "Aarav Sharma", email: "aarav.sharma@example.com" },
    { id: 2, name: "Rohan Verma", email: "rohan.verma@example.com" },
    { id: 3, name: "Aditya Singh", email: "aditya.singh@example.com" },
    { id: 4, name: "Arjun Mehta", email: "arjun.mehta@example.com" },
    { id: 5, name: "Karan Gupta", email: "karan.gupta@example.com" },
    { id: 6, name: "Yash Malhotra", email: "yash.malhotra@example.com" },
    { id: 7, name: "Dev Kumar", email: "dev.kumar@example.com" },
    { id: 8, name: "Rahul Chauhan", email: "rahul.chauhan@example.com" },
    { id: 9, name: "Aryan Kapoor", email: "aryan.kapoor@example.com" },
    { id: 10, name: "Vivaan Joshi", email: "vivaan.joshi@example.com" }
];

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get("/", (req, res) => {
    res.send('HELLO THIS IS HOME PAGE');
});
app.get("/about", (req, res) => {
    res.send('HELLO THIS IS ABOUT PAGE');
});
app.get("/contact", (req, res) => {
    res.send('HELLO THIS IS CONTACT PAGE');
});
app.get("/users", (req, res) => {
    res.json(users);
});
