const API_BASE_URL = "http://localhost:5000/api";

// Helper to make fetch requests with auth header and token refresh support
export const fetchWithAuth = async (endpoint, options = {}) => {
    let accessToken = localStorage.getItem("bidzone_access_token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    let response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // If access token expired (401), try refreshing using refresh token
    if (response.status === 401 && localStorage.getItem("bidzone_refresh_token")) {
        const refreshToken = localStorage.getItem("bidzone_refresh_token");
        try {
            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refreshToken }),
            });

            const refreshData = await refreshRes.json();
            if (refreshData.success) {
                localStorage.setItem("bidzone_access_token", refreshData.accessToken);
                localStorage.setItem("bidzone_refresh_token", refreshData.refreshToken);

                // Retry original request with new token
                headers["Authorization"] = `Bearer ${refreshData.accessToken}`;
                response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    ...options,
                    headers,
                });
            } else {
                // Refresh token invalid, clear and redirect
                localStorage.removeItem("bidzone_access_token");
                localStorage.removeItem("bidzone_refresh_token");
                localStorage.removeItem("bidzone_user");
            }
        } catch (err) {
            console.error("Token refresh failed", err);
        }
    }

    return response.json();
};

// Auth API Calls
export const loginApi = async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    return res.json();
};

export const registerApi = async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });
    return res.json();
};

// Auction API Calls
export const getAuctionsApi = async (category = "All", status = "all", search = "") => {
    let url = `${API_BASE_URL}/auctions?`;
    if (category && category !== "All") url += `category=${encodeURIComponent(category)}&`;
    if (status && status !== "all") url += `status=${encodeURIComponent(status)}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    return res.json();
};

export const getAuctionByIdApi = async (id) => {
    const res = await fetch(`${API_BASE_URL}/auctions/${id}`);
    return res.json();
};

export const createAuctionApi = async (data) => {
    return fetchWithAuth("/auctions", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const deleteAuctionApi = async (id) => {
    return fetchWithAuth(`/auctions/${id}`, {
        method: "DELETE",
    });
};

export const getCategoryStatsApi = async () => {
    const res = await fetch(`${API_BASE_URL}/auctions/stats/category-sales`);
    return res.json();
};

export const getMyAuctionsApi = async () => {
    return fetchWithAuth("/auctions/seller/my-auctions");
};

// Bids API Calls
export const placeBidApi = async (auctionId, amount) => {
    return fetchWithAuth("/bids", {
        method: "POST",
        body: JSON.stringify({ auctionId, amount }),
    });
};

export const getBidsForAuctionApi = async (auctionId) => {
    const res = await fetch(`${API_BASE_URL}/bids/auction/${auctionId}`);
    return res.json();
};

export const getMyBidsApi = async () => {
    return fetchWithAuth("/bids/my-bids");
};
