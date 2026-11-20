import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-icon">🔨</span> BidZone
                </Link>

                <nav className="navbar-links">
                    <Link to="/" className="nav-link">Auctions</Link>
                    <Link to="/analytics" className="nav-link">Category Stats</Link>

                    {user && (
                        <Link to="/dashboard" className="nav-link">My Activity</Link>
                    )}

                    {user && (user.role === "seller" || user.role === "admin") && (
                        <Link to="/create-auction" className="btn-create-auction">
                            + List Item
                        </Link>
                    )}
                </nav>

                <div className="navbar-auth">
                    {user ? (
                        <div className="user-profile-badge">
                            <span className="user-name">{user.name}</span>
                            <span className={`role-pill role-${user.role}`}>{user.role}</span>
                            <button onClick={handleLogout} className="btn-logout">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="btn-login">Login</Link>
                            <Link to="/register" className="btn-register">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
