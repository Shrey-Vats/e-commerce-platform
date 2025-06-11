// backend/routes/sellerRoutes.js

import express from "express";
import { getSellerDashboard } from "../controllers/sellerController.js";
import { protect, seller } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected route for seller dashboard
router.route("/dashboard").get(protect, seller, getSellerDashboard);

// More seller-specific routes will go here:

export default router;
