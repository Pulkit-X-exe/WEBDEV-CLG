import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { getAuctionByIdApi, placeBidApi } from "../services/api";
import { socket } from "../services/socket";
import { AuthContext } from "../context/AuthContext";
import CountdownTimer from "../components/CountdownTimer";

const AuctionDetail = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);

    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [bidAmount, setBidAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch initial auction data
    const fetchAuctionData = async () => {
        try {
            const data = await getAuctionByIdApi(id);
            if (data.success) {
                setAuction(data.auction);
                setBids(data.bids || []);
                // set default bid amount recommendation
                setBidAmount(data.auction.currentPrice + 50);
            } else {
                setErrorMsg(data.message);
            }
        } catch (err) {
            setErrorMsg("Failed to load auction details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctionData();
    }, [id]);

    // Socket.io Real-Time Room Setup and Event Listeners
    useEffect(() => {
        if (!id) return;

        // Join the specific room for this auction
        socket.emit("join_auction", id);

        // Receive real-time bid updates
        const handleBidUpdate = (data) => {
            if (data.auctionId === id) {
                setAuction((prev) => ({
                    ...prev,
                    currentPrice: data.currentPrice,
                    highestBidder: data.highestBidder,
                }));
                setBids((prev) => [data.newBid, ...prev]);
                setSuccessMsg(`New bid placed: $${data.currentPrice} by ${data.highestBidder.name}!`);
                setBidAmount(data.currentPrice + 50);
            }
        };

        // Receive auction ended announcement
        const handleAuctionEnded = (data) => {
            if (data.auctionId === id) {
                setAuction((prev) => ({
                    ...prev,
                    status: "ended",
                }));
            }
        };

        socket.on("bid_update", handleBidUpdate);
        socket.on("auction_ended", handleAuctionEnded);

        return () => {
            socket.emit("leave_auction", id);
            socket.off("bid_update", handleBidUpdate);
            socket.off("auction_ended", handleAuctionEnded);
        };
    }, [id]);

    // Handle Controlled Form Submission for Placing a Bid
    const handlePlaceBid = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!user) {
            setErrorMsg("Please login to place a bid.");
            return;
        }

        const numericBid = Number(bidAmount);
        if (isNaN(numericBid) || numericBid <= auction.currentPrice) {
            setErrorMsg(`Your bid must be higher than the current price of $${auction.currentPrice}`);
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await placeBidApi(id, numericBid);
            if (data.success) {
                setSuccessMsg(`Your bid of $${numericBid} was placed successfully!`);
                setAuction(data.auction);
                setBids((prev) => [data.bid, ...prev]);
                setBidAmount(numericBid + 50);
            } else {
                setErrorMsg(data.message || "Failed to place bid");
            }
        } catch (err) {
            setErrorMsg("An unexpected error occurred while placing the bid.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Quick bid increment helper
    const incrementBid = (increment) => {
        const base = auction ? auction.currentPrice : 0;
        setBidAmount(base + increment);
    };

    if (loading) return <div className="loading-state">Loading auction details...</div>;
    if (!auction) return <div className="empty-state"><h3>Auction Not Found</h3></div>;

    const isSeller = user && auction.seller && (user.id === auction.seller._id || user._id === auction.seller._id);
    const isEnded = auction.status === "ended";

    return (
        <div className="auction-detail-container">
            <Link to="/" className="back-link">← Back to All Auctions</Link>

            <div className="auction-detail-layout">
                {/* Left Side: Image and Details */}
                <div className="detail-media-section">
                    <div className="detail-image-box">
                        <img
                            src={auction.imageUrl}
                            alt={auction.title}
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60";
                            }}
                        />
                        <span className={`status-badge-lg ${auction.status}`}>
                            {isEnded ? "AUCTION CLOSED" : "● LIVE AUCTION"}
                        </span>
                    </div>

                    <div className="item-description-card">
                        <h3>Item Description</h3>
                        <p>{auction.description}</p>

                        <div className="item-meta-info">
                            <div><strong>Category:</strong> {auction.category}</div>
                            <div><strong>Starting Price:</strong> ${auction.startingPrice}</div>
                            <div><strong>Listed By:</strong> {auction.seller ? auction.seller.name : "Seller"}</div>
                            <div><strong>Auction Ends:</strong> {new Date(auction.endTime).toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Live Bidding & History */}
                <div className="detail-action-section">
                    <div className="bidding-control-card">
                        <h1 className="item-title">{auction.title}</h1>

                        <div className="countdown-box">
                            <span className="countdown-title">Time Remaining</span>
                            <CountdownTimer
                                endTime={auction.endTime}
                                status={auction.status}
                                onExpire={() => setAuction((prev) => ({ ...prev, status: "ended" }))}
                            />
                        </div>

                        <div className="current-bid-box">
                            <span className="bid-label">Current Highest Bid</span>
                            <div className="bid-amount-display">${auction.currentPrice}</div>
                            <span className="highest-bidder-label">
                                {auction.highestBidder
                                    ? `Leading Bidder: ${auction.highestBidder.name}`
                                    : "No bids placed yet - Be the first!"}
                            </span>
                        </div>

                        {/* Winner Announcement if Ended */}
                        {isEnded && (
                            <div className="winner-announcement-card">
                                <h3>🏆 Auction Ended</h3>
                                {auction.highestBidder ? (
                                    <p>
                                        Winner: <strong>{auction.highestBidder.name}</strong> for{" "}
                                        <strong>${auction.currentPrice}</strong>!
                                    </p>
                                ) : (
                                    <p>Auction ended with no bids placed.</p>
                                )}
                            </div>
                        )}

                        {/* Notification Messages */}
                        {errorMsg && <div className="alert-message alert-error">{errorMsg}</div>}
                        {successMsg && <div className="alert-message alert-success">{successMsg}</div>}

                        {/* Controlled Bidding Form */}
                        {!isEnded && (
                            <div className="place-bid-form-wrapper">
                                {isSeller ? (
                                    <div className="seller-notice">
                                        ℹ You are the seller of this item. Sellers cannot bid on their own auctions.
                                    </div>
                                ) : user ? (
                                    <form onSubmit={handlePlaceBid} className="controlled-bid-form">
                                        <label htmlFor="bidInput">Your Bid Amount ($ USD):</label>
                                        <div className="bid-input-group">
                                            <span className="currency-prefix">$</span>
                                            <input
                                                id="bidInput"
                                                type="number"
                                                min={auction.currentPrice + 1}
                                                step="1"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="btn-submit-bid"
                                            >
                                                {isSubmitting ? "Placing..." : "Place Bid"}
                                            </button>
                                        </div>

                                        <div className="quick-bid-buttons">
                                            <span>Quick Add:</span>
                                            <button type="button" onClick={() => incrementBid(20)}>+$20</button>
                                            <button type="button" onClick={() => incrementBid(50)}>+$50</button>
                                            <button type="button" onClick={() => incrementBid(100)}>+$100</button>
                                            <button type="button" onClick={() => incrementBid(500)}>+$500</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="login-to-bid-box">
                                        <p>You must be logged in to participate in live bidding.</p>
                                        <Link to="/login" className="btn-login-prompt">Login to Place Bid</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Live Bid History */}
                    <div className="bid-history-card">
                        <h3>Live Bid History ({bids.length})</h3>
                        {bids.length === 0 ? (
                            <p className="no-bids-text">No bids have been recorded for this item yet.</p>
                        ) : (
                            <div className="bid-history-list">
                                {bids.map((b, index) => (
                                    <div
                                        key={b._id || index}
                                        className={`bid-history-item ${index === 0 ? "leading-bid" : ""}`}
                                    >
                                        <div className="bidder-info">
                                            <span className="bidder-name">
                                                {b.bidder ? b.bidder.name : "Bidder"}
                                                {index === 0 && <span className="leading-tag">Top Bid</span>}
                                            </span>
                                            <span className="bid-timestamp">
                                                {new Date(b.bidTime || b.createdAt).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                        <div className="bid-amount-badge">${b.amount}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetail;
