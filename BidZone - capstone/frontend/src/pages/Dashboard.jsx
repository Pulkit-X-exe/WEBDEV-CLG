import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getMyBidsApi, getMyAuctionsApi, deleteAuctionApi } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState(user?.role === "seller" ? "auctions" : "bids");
    const [myBids, setMyBids] = useState([]);
    const [myAuctions, setMyAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadData = async () => {
        setLoading(true);
        try {
            // Fetch bids
            const bidsData = await getMyBidsApi();
            if (bidsData.success) {
                setMyBids(bidsData.bids);
            }

            // If seller or admin, also fetch created auctions
            if (user?.role === "seller" || user?.role === "admin") {
                const auctionsData = await getMyAuctionsApi();
                if (auctionsData.success) {
                    setMyAuctions(auctionsData.auctions);
                }
            }
        } catch (err) {
            console.error("Error loading dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const handleDeleteAuction = async (auctionId) => {
        if (!window.confirm("Are you sure you want to delete this auction item?")) {
            return;
        }

        try {
            const res = await deleteAuctionApi(auctionId);
            if (res.success) {
                setMessage("Auction deleted successfully");
                setMyAuctions((prev) => prev.filter((item) => item._id !== auctionId));
            } else {
                alert(res.message || "Failed to delete auction");
            }
        } catch (err) {
            alert("Error deleting auction");
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>My Activity Dashboard</h1>
                    <p>Welcome back, <strong>{user?.name}</strong> ({user?.role})</p>
                </div>
                {user && (user.role === "seller" || user.role === "admin") && (
                    <Link to="/create-auction" className="btn-create-auction">
                        + List New Item
                    </Link>
                )}
            </div>

            {message && <div className="alert-message alert-success">{message}</div>}

            {/* Dashboard Tabs */}
            <div className="dashboard-tabs">
                {(user?.role === "seller" || user?.role === "admin") && (
                    <button
                        className={`tab-btn ${activeTab === "auctions" ? "active" : ""}`}
                        onClick={() => setActiveTab("auctions")}
                    >
                        My Listed Items ({myAuctions.length})
                    </button>
                )}
                <button
                    className={`tab-btn ${activeTab === "bids" ? "active" : ""}`}
                    onClick={() => setActiveTab("bids")}
                >
                    My Bids History ({myBids.length})
                </button>
            </div>

            {loading ? (
                <div className="loading-state">Loading your activity...</div>
            ) : (
                <div className="dashboard-content">
                    {/* Listed Items Tab */}
                    {activeTab === "auctions" && (
                        <div>
                            {myAuctions.length === 0 ? (
                                <div className="empty-state">
                                    <h3>No items listed yet</h3>
                                    <p>Start selling by creating your first auction item listing!</p>
                                    <Link to="/create-auction" className="btn-primary-block" style={{ maxWidth: "200px", margin: "20px auto 0" }}>
                                        Create Auction
                                    </Link>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="stats-table">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Category</th>
                                                <th>Starting Price</th>
                                                <th>Current Price</th>
                                                <th>Status</th>
                                                <th>End Time</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myAuctions.map((item) => (
                                                <tr key={item._id}>
                                                    <td>
                                                        <strong>{item.title}</strong>
                                                    </td>
                                                    <td>{item.category}</td>
                                                    <td>${item.startingPrice}</td>
                                                    <td><strong>${item.currentPrice}</strong></td>
                                                    <td>
                                                        <span className={`status-badge-sm ${item.status}`}>
                                                            {item.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(item.endTime).toLocaleDateString()}</td>
                                                    <td className="actions-cell">
                                                        <Link to={`/auction/${item._id}`} className="btn-action-view">
                                                            View
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteAuction(item._id)}
                                                            className="btn-action-delete"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Bids Tab */}
                    {activeTab === "bids" && (
                        <div>
                            {myBids.length === 0 ? (
                                <div className="empty-state">
                                    <h3>No bids placed yet</h3>
                                    <p>Browse active auctions and start bidding!</p>
                                    <Link to="/" className="btn-primary-block" style={{ maxWidth: "200px", margin: "20px auto 0" }}>
                                        Browse Auctions
                                    </Link>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="stats-table">
                                        <thead>
                                            <tr>
                                                <th>Auction Item</th>
                                                <th>Category</th>
                                                <th>My Bid Amount</th>
                                                <th>Current Auction Price</th>
                                                <th>Date & Time</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myBids.map((bid) => (
                                                <tr key={bid._id}>
                                                    <td>
                                                        <strong>{bid.auction ? bid.auction.title : "Deleted Auction"}</strong>
                                                    </td>
                                                    <td>{bid.auction?.category || "N/A"}</td>
                                                    <td>
                                                        <span className="my-bid-amount">${bid.amount}</span>
                                                    </td>
                                                    <td>${bid.auction?.currentPrice || "-"}</td>
                                                    <td>{new Date(bid.createdAt || bid.bidTime).toLocaleString()}</td>
                                                    <td>
                                                        {bid.auction && (
                                                            <Link to={`/auction/${bid.auction._id}`} className="btn-action-view">
                                                                View Item
                                                            </Link>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
