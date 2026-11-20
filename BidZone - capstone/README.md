# BidZone – Online Auction Platform

A full-stack online auction marketplace where sellers list items and buyers place live bids in real-time until the countdown timer expires. Built as a 3rd semester Web Development Capstone Project.

---

## 📋 Project Overview & Mandatory Requirements

This project fulfills all mandatory requirements:

| Requirement | Implementation in BidZone |
| :--- | :--- |
| **MVC Folder Structure** | Backend structured strictly into `config/`, `models/`, `controllers/`, `routes/`, `middleware/` |
| **Environment Variables** | Managed in `.env` (ignored in `.gitignore`, `.env.example` provided) |
| **JWT Access & Refresh Tokens** | 15-minute access token + 7-day refresh token rotation with bcrypt password hashing |
| **Role-Based Access Control (RBAC)** | Protected routes for authenticated users + role-based permissions (`bidder`, `seller`, `admin`) |
| **Mongoose Schemas & Relationships** | Schema validation, enums, regexes, and relationships (`User` ↔ `Auction` ↔ `Bid`) |
| **Aggregation Pipeline Query** | Multi-stage pipeline (`$group`, `$project`, `$sort`, `$cond`) for category sales analytics |
| **Database Indexing** | Indexes on `{ category: 1, status: 1 }`, `{ endTime: 1 }`, and `{ auction: 1, amount: -1 }` |
| **Centralized Error Handling** | Global error middleware handling `CastError`, `ValidationError`, `11000` duplicates, and JWT errors |
| **Postman REST API Testing** | Complete Postman collection included (`BidZone.postman_collection.json`) |
| **React Frontend** | React 19 + Vite with React Router, Context API (`AuthContext`), Controlled Forms, and Protected Routes |
| **Real-Time WebSockets** | Socket.io broadcasting live bids, price updates, and auction end notifications |

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.io, JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), Cors, Dotenv
- **Frontend:** React, Vite, React Router (`react-router-dom`), Context API, Socket.io-client, Fetch API, CSS3
- **Tools:** Postman for REST API verification, Git for version control

---

## 📁 Project Directory Structure

```text
BidZone - capstone/
├── BidZone.postman_collection.json      # Postman Collection for submission
├── .gitignore                           # Ignores .env and node_modules
├── README.md                            # Complete Project Documentation
│
├── backend/
│   ├── config/
│   │   └── db.js                        # MongoDB Mongoose connection
│   ├── models/
│   │   ├── User.js                      # User schema with roles & bcrypt hook
│   │   ├── Auction.js                   # Auction item schema with indexes
│   │   └── Bid.js                       # Bid schema with relationship & indexes
│   ├── controllers/
│   │   ├── authController.js            # Register, Login, RefreshToken, Profile
│   │   ├── auctionController.js         # CRUD, RBAC, Aggregation Pipeline
│   │   └── bidController.js             # Place bid, Socket broadcast, My bids
│   ├── routes/
│   │   ├── authRoutes.js                # Auth endpoints
│   │   ├── auctionRoutes.js             # Auction endpoints
│   │   └── bidRoutes.js                 # Bidding endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js            # JWT access token verification
│   │   ├── roleMiddleware.js            # Role-Based Access Control (RBAC)
│   │   └── errorMiddleware.js           # Centralized HTTP error handler
│   ├── .env                             # Environment variables (not committed)
│   ├── .env.example                     # Example environment config
│   ├── server.js                        # Express app + HTTP & Socket.io server
│   ├── seed.js                          # Database seeder with sample data
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx          # Context API for auth & token storage
    │   ├── components/
    │   │   ├── Navbar.jsx               # Navigation bar with role badges
    │   │   ├── ProtectedRoute.jsx       # Route guard with RBAC checks
    │   │   └── CountdownTimer.jsx       # Live countdown timer component
    │   ├── pages/
    │   │   ├── Home.jsx                 # Live auction list, search, filters
    │   │   ├── AuctionDetail.jsx        # Live bidding room with Socket.io
    │   │   ├── CreateAuction.jsx        # Controlled form for listing items
    │   │   ├── Login.jsx                # Controlled login form + Quick demo logins
    │   │   ├── Register.jsx             # Controlled registration form
    │   │   ├── Analytics.jsx            # Aggregation pipeline analytics view
    │   │   └── Dashboard.jsx            # My Bids & My Listed Auctions
    │   ├── services/
    │   │   ├── api.js                   # Centralized Fetch API client
    │   │   └── socket.js                # Socket.io client connection
    │   ├── App.jsx                      # App router configuration
    │   └── index.css                    # Clean, responsive CSS styling
    ├── index.html
    └── package.json
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** running locally on port `27017`

### 2. Backend Setup
```bash
cd backend
npm install

# (Optional) Seed the database with demo users, auctions, and bids
npm run seed

# Start backend server
npm start
# or with nodemon:
npm run dev
```
Backend will start on: `http://localhost:5000`

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on: `http://localhost:5173`

---

## 🔑 Demo Login Accounts

You can quickly test with these pre-seeded accounts (or use the one-click demo buttons on the Login page):

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Bidder** | `bidder1@bidzone.com` | `password123` | Can place bids, view auctions, track bid history |
| **Seller** | `seller@bidzone.com` | `password123` | Can list auction items, view and manage their items, receive bids |
| **Admin** | `admin@bidzone.com` | `password123` | Full access: create, edit, delete any auction, view all stats |

---

## 📊 Aggregation Pipeline Implementation

Located in `backend/controllers/auctionController.js` (`getCategorySalesStats`):

```javascript
const stats = await Auction.aggregate([
    // Stage 1: Group by category and compute counts, averages, and sales volume
    {
        $group: {
            _id: "$category",
            totalAuctions: { $sum: 1 },
            activeAuctions: {
                $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
            },
            endedAuctions: {
                $sum: { $cond: [{ $eq: ["$status", "ended"] }, 1, 0] },
            },
            avgStartingPrice: { $avg: "$startingPrice" },
            highestPrice: { $max: "$currentPrice" },
            totalVolume: { $sum: "$currentPrice" },
        },
    },
    // Stage 2: Project formatted output
    {
        $project: {
            _id: 0,
            category: "$_id",
            totalAuctions: 1,
            activeAuctions: 1,
            endedAuctions: 1,
            avgStartingPrice: { $round: ["$avgStartingPrice", 2] },
            highestPrice: 1,
            totalVolume: 1,
        },
    },
    // Stage 3: Sort by auction volume descending
    {
        $sort: { totalAuctions: -1 },
    },
]);
```

---

## 🚀 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user with hashed password |
| `POST` | `/api/auth/login` | Public | Login and receive access & refresh tokens |
| `POST` | `/api/auth/refresh-token` | Public | Refresh expired access token using refresh token |
| `POST` | `/api/auth/logout` | Protected | Logout user and invalidate refresh token |
| `GET` | `/api/auth/profile` | Protected | Get profile of logged-in user |

### 🏷 Auctions (`/api/auctions`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auctions` | Public | Get all auctions (with filters for search/category/status) |
| `GET` | `/api/auctions/:id` | Public | Get single auction by ID with bid history |
| `POST` | `/api/auctions` | **Seller / Admin** (RBAC) | Create a new auction item |
| `PUT` | `/api/auctions/:id` | **Seller / Admin** (RBAC) | Update auction details (before bids are placed) |
| `DELETE` | `/api/auctions/:id` | **Seller / Admin** (RBAC) | Delete auction and related bids |
| `GET` | `/api/auctions/seller/my-auctions` | **Seller / Admin** (RBAC) | Get auctions created by current seller |
| `GET` | `/api/auctions/stats/category-sales`| Public | **Aggregation pipeline query** for category stats |

### 🔨 Bids (`/api/bids`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bids` | Protected | Place a live bid (validates bid > currentPrice and broadcasts via Socket.io) |
| `GET` | `/api/bids/auction/:auctionId` | Public | Get all bids for a specific auction |
| `GET` | `/api/bids/my-bids` | Protected | Get bidding history for logged-in user |

---

## 📮 Postman Collection

Import `BidZone.postman_collection.json` into Postman to run tests covering:
1. User registration & login (auto-sets `{{accessToken}}`, `{{refreshToken}}`, and role tokens).
2. Auction item browsing, filtering, and single-item lookup.
3. RBAC checks (verifies sellers can create items, while bidders receive `403 Forbidden`).
4. Live bidding validation (verifies bids lower than current highest bid receive `400 Bad Request`).
5. Aggregation pipeline testing (`/api/auctions/stats/category-sales`).
6. Centralized error handling (`400`, `401`, `403`, `404`).
