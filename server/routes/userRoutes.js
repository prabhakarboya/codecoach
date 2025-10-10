import express from "express";
import { getProfile, updateProfile, getProgress } from "../controllers/profileController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

// Get current user profile
router.get("/profile", protect, getProfile);

// Update current user profile
router.put("/profile", protect, updateProfile);

// Get user progress or stats
router.get("/progress", protect, getProgress);

export default router;
