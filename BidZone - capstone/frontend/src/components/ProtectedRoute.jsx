import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Protects routes from unauthenticated users and enforces role permissions
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="loading-spinner">Loading authentication...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return (
            <div className="container" style={{ marginTop: "40px", textAlign: "center" }}>
                <h2>Access Denied</h2>
                <p>Your current account role (<strong>{user.role}</strong>) does not have permission to view this page.</p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
