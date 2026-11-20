import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAuctionApi } from "../services/api";

const CATEGORIES = ["Electronics", "Collectibles", "Art", "Vehicles", "Fashion", "Other"];

const CreateAuction = () => {
    const navigate = useNavigate();

    // Controlled Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Electronics",
        startingPrice: "",
        imageUrl: "",
        endTime: "",
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // Generic input change handler for controlled form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!formData.title || !formData.description || !formData.startingPrice || !formData.endTime) {
            setErrorMsg("Please fill in all required fields.");
            return;
        }

        if (new Date(formData.endTime) <= new Date()) {
            setErrorMsg("Auction end time must be in the future.");
            return;
        }

        setLoading(true);
        try {
            const data = await createAuctionApi(formData);
            if (data.success) {
                navigate(`/auction/${data.auction._id}`);
            } else {
                setErrorMsg(data.message || "Failed to create auction.");
            }
        } catch (err) {
            setErrorMsg("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-page-container">
            <div className="form-card">
                <h2>List Item for Auction</h2>
                <p className="form-subtitle">Create a new live auction item for bidders across BidZone.</p>

                {errorMsg && <div className="alert-message alert-error">{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="controlled-form">
                    <div className="form-group">
                        <label htmlFor="title">Item Title *</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="e.g. Vintage Leather Watch"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="startingPrice">Starting Price ($ USD) *</label>
                            <input
                                id="startingPrice"
                                type="number"
                                name="startingPrice"
                                placeholder="100"
                                min="1"
                                value={formData.startingPrice}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="endTime">Auction End Date & Time *</label>
                        <input
                            id="endTime"
                            type="datetime-local"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageUrl">Image URL (Optional)</label>
                        <input
                            id="imageUrl"
                            type="url"
                            name="imageUrl"
                            placeholder="https://example.com/item.jpg"
                            value={formData.imageUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Item Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            placeholder="Describe condition, specifications, authenticity, etc."
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary-block">
                        {loading ? "Publishing Auction..." : "Create & Start Live Auction"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateAuction;
