// backend/routes/bannerRoutes.js
import express from "express"; // Use import
const router = express.Router();
import {
  // Use import for controller functions
  getActiveBanners,
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js"; // Note the .js extension for local imports
import { protect, admin } from "../middlewares/authMiddleware.js"; // Note the .js extension

// Public route to get active banners for the homepage
router.route("/").get(getActiveBanners);

// Admin routes for managing banners
router
  .route("/admin")
  .get(protect, admin, getAllBanners) // Get all banners for admin panel
  .post(protect, admin, createBanner); // Create a new banner

router
  .route("/admin/:id")
  .get(protect, admin, getBannerById) // Get a single banner by ID for editing
  .put(protect, admin, updateBanner) // Update a banner
  .delete(protect, admin, deleteBanner); // Delete a banner

export default router; // Use export default
