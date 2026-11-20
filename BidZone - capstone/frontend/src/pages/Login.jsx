import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Controlled Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            navigate("/");
        } else {
            setErrorMsg(result.message || "Invalid email or password.");
        }
    };

    // Quick demo login helpers for college evaluation testing
    const fillDemoUser = (demoEmail) => {
        setEmail(demoEmail);
        setPassword("password123");
    };

    return (
        <div className="form-page-container">
            <div className="form-card">
                <h2>Welcome Back</h2>
                <p className="form-subtitle">Login to your BidZone account to participate in live auctions.</p>

                {/* Demo Logins Box */}
                <div className="demo-credentials-box">
                    <span className="demo-label">⚡ Quick Demo Logins:</span>
                    <div className="demo-buttons-group">
                        <button
                            type="button"
                            className="btn-demo"
                            onClick={() => fillDemoUser("bidder1@bidzone.com")}
                        >
                            Bidder Demo
                        </button>
                        <button
                            type="button"
                            className="btn-demo"
                            onClick={() => fillDemoUser("seller@bidzone.com")}
                        >
                            Seller Demo
                        </button>
                        <button
                            type="button"
                            className="btn-demo"
                            onClick={() => fillDemoUser("admin@bidzone.com")}
                        >
                            Admin Demo
                        </button>
                    </div>
                </div>

                {errorMsg && <div className="alert-message alert-error">{errorMsg}</div>}

                <form onSubmit={handleSubmit} className="controlled-form">
                    <div className="form-group">
                        <label htmlFor="login-email">Email Address</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary-block">
                        {loading ? "Logging in..." : "Login to Account"}
                    </button>
                </form>

                <p className="form-footer-text">
                    Don't have an account yet? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
