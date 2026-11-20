import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuctionsApi } from "../services/api";
import { socket } from "../services/socket";
import CountdownTimer from "../components/CountdownTimer";

const CATEGORIES = ["All", "Electronics", "Collectibles", "Art", "Vehicles", "Fashion", "Other"];

const Home = () => {
    const [auctions, setAuctions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const loadAuctions = async () => {
        setLoading(true);
        try {
            const data = await getAuctionsApi(selectedCategory, statusFilter, searchTerm);
            if (data.success) {
                setAuctions(data.auctions);
            }
        } catch (err) {
            console.error("Failed to load auctions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuctions();
    }, [selectedCategory, statusFilter]);

    // Handle search form submission (controlled input)
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        loadAuctions();
    };

    // Socket.io listeners for real-time marketplace updates
    useEffect(() => {
        const handleMarketplaceUpdate = (data) => {
            setAuctions((prev) =>
                prev.map((item) =>
                    item._id === data.auctionId
                        ? { ...item, currentPrice: data.currentPrice }
                        : item
                )
            );
        };

        const handleNewAuction = (newAuction) => {
            setAuctions((prev) => [newAuction, ...prev]);
        };

        socket.on("marketplace_update", handleMarketplaceUpdate);
        socket.on("new_auction_created", handleNewAuction);

        return () => {
            socket.off("marketplace_update", handleMarketplaceUpdate);
            socket.off("new_auction_created", handleNewAuction);
        };
    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="hero-section">
                <h1>Live Online Auctions Made Simple</h1>
                <p>Discover rare items, place live bids, and win exciting auctions in real-time.</p>

                {/* Controlled Search Form */}
                <form onSubmit={handleSearchSubmit} className="search-bar-form">
                    <input
                        type="text"
                        placeholder="Search items by name (e.g. Rolex, MacBook, Art)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-button">
                        Search
                    </button>
                </form>
            </div>

            {/* Filter Controls */}
            <div className="filter-controls">
                <div className="category-pills">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="status-dropdown">
                    <label htmlFor="status-select">Status: </label>
                    <select
                        id="status-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Auctions</option>
                        <option value="active">Active Only</option>
                        <option value="ended">Ended Only</option>
                    </select>
                </div>
            </div>

            {/* Auction Cards Grid */}
            {loading ? (
                <div className="loading-state">Loading live auctions...</div>
            ) : auctions.length === 0 ? (
                <div className="empty-state">
                    <h3>No auctions found</h3>
                    <p>Try clearing filters or check back later for new listings.</p>
                </div>
            ) : (
                <div className="auction-grid">
                    {auctions.map((item) => (
                        <div key={item._id} className="auction-card">
                            <div className="card-image-wrapper">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60";
                                    }}
                                />
                                <span className={`card-status ${item.status}`}>
                                    {item.status === "active" ? "● LIVE" : "ENDED"}
                                </span>
                            </div>

                            <div className="card-body">
                                <span className="card-category">{item.category}</span>
                                <h3 className="card-title">{item.title}</h3>
                                <p className="card-desc">
                                    {item.description.length > 80
                                        ? `${item.description.substring(0, 80)}...`
                                        : item.description}
                                </p>

                                <div className="card-price-info">
                                    <div>
                                        <span className="price-label">Current Bid</span>
                                        <span className="price-val">${item.currentPrice}</span>
                                    </div>
                                    <div className="card-timer">
                                        <CountdownTimer endTime={item.endTime} status={item.status} />
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <span className="seller-name">
                                        Seller: {item.seller ? item.seller.name : "Verified"}
                                    </span>
                                    <Link to={`/auction/${item._id}`} className="btn-view-auction">
                                        {item.status === "active" ? "Place Bid →" : "View Result"}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
