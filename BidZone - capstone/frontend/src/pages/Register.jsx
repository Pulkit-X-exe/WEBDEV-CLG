import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    // Controlled Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "bidder",
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

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

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        const result = await register(
            formData.name,
            formData.email,
            formData.password,
            formData.role
        );
        setLoading(false);

        if (result.success) {
            navigate("/");
        } else {
            setErrorMsg(result.message || "Registration failed.");
        }
    };

    return (
        <div className="form-page-container">
            <div className="form-card">
                <h2>Create Your Account</h2>
                <p className="form-subtitle">Join BidZone to bid on exclusive items or start selling today.</p>

                {errorMsg && <div className="alert-message alert-error">{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="controlled-form">
                    <div className="form-group">
                        <label htmlFor="reg-name">Full Name *</label>
                        <input
                            id="reg-name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-email">Email Address *</label>
                        <input
                            id="reg-email"
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="reg-password">Password *</label>
                            <input
                                id="reg-password"
                                type="password"
                                name="password"
                                placeholder="Min 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-confirm">Confirm Password *</label>
                            <input
                                id="reg-confirm"
                                type="password"
                                name="confirmPassword"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="reg-role">Choose Account Role *</label>
                        <select
                            id="reg-role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="bidder">Bidder (Place bids on auctions)</option>
                            <option value="seller">Seller (List auction items & receive bids)</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary-block">
                        {loading ? "Creating Account..." : "Register Account"}
                    </button>
                </form>

                <p className="form-footer-text">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
