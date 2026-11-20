import React, { createContext, useState, useEffect } from "react";
import { loginApi, registerApi } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage on page load
    useEffect(() => {
        const storedUser = localStorage.getItem("bidzone_user");
        const token = localStorage.getItem("bidzone_access_token");

        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
            }
        }
        setLoading(false);
    }, []);

    // Login action
    const login = async (email, password) => {
        const data = await loginApi({ email, password });
        if (data.success) {
            localStorage.setItem("bidzone_access_token", data.accessToken);
            localStorage.setItem("bidzone_refresh_token", data.refreshToken);
            localStorage.setItem("bidzone_user", JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    // Register action
    const register = async (name, email, password, role) => {
        const data = await registerApi({ name, email, password, role });
        if (data.success) {
            localStorage.setItem("bidzone_access_token", data.accessToken);
            localStorage.setItem("bidzone_refresh_token", data.refreshToken);
            localStorage.setItem("bidzone_user", JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    // Logout action
    const logout = () => {
        localStorage.removeItem("bidzone_access_token");
        localStorage.removeItem("bidzone_refresh_token");
        localStorage.removeItem("bidzone_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
