const express = require("express");
const router = express.Router();
const {
    register,
    login,
    refreshToken,
    logout,
    getProfile,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected routes (require valid JWT access token)
router.post("/logout", verifyToken, logout);
router.get("/profile", verifyToken, getProfile);

module.exports = router;
