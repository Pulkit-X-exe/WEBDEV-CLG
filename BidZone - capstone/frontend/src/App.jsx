import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import AuctionDetail from "./pages/AuctionDetail";
import CreateAuction from "./pages/CreateAuction";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/auction/:id" element={<AuctionDetail />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Role-Based (RBAC) Protected Route: Seller / Admin only */}
                            <Route
                                path="/create-auction"
                                element={
                                    <ProtectedRoute allowedRoles={["seller", "admin"]}>
                                        <CreateAuction />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </main>

                    <footer className="footer">
                        <p>© 2026 BidZone – Online Auction Platform (College Web Development Capstone Project)</p>
                    </footer>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
