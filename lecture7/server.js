const http = require("http");

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

const server = http.createServer((req, res) => {

    // HOME
    if (req.url === "/" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Welcome to Home Page</h1>");

    }

    // ABOUT
    else if (req.url === "/about" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Welcome to About Page</h1>");

    }

    // CONTACT
    else if (req.url === "/contact" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Welcome to Contact Page</h1>");

    }

    // GET USERS
    else if (req.url === "/users" && req.method === "GET") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            users: users,
            total: users.length
        }));

    }

    // CREATE USER
    else if (req.url === "/users" && req.method === "POST") {

        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {

            try {

                const userData = JSON.parse(body);

                const user = {
                    id: users.length + 1,
                    ...userData
                };

                users.push(user);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: true,
                    message: "User created successfully",
                    user: user
                }));

            } catch (error) {

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: false,
                    message: "Invalid JSON data"
                }));
            }
        });

    }

    // 404
    else {

        res.writeHead(404, {
            "Content-Type": "text/html"
        });

        res.end("<h1>404 Page Not Found</h1>");
    }
});

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});