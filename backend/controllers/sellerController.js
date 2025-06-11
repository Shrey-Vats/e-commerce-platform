// backend/controllers/sellerController.js

import asyncHandler from "express-async-handler"; // CORRECT: Importing from the package
import User from "../models/User.js"; // To interact with user data if needed
import Product from "../models/Product.js"; // To interact with product data

/**
 * @desc Get seller dashboard data
 * @route GET /api/sellers/dashboard
 * @access Private/Seller
 */
const getSellerDashboard = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  // Count products listed by this seller (now using 'seller' field)
  const productCount = await Product.countDocuments({ seller: sellerId });

  res.status(200).json({
    message: `Welcome to your Seller Dashboard, ${req.user.name}!`,
    sellerId: sellerId,
    productCount: productCount,
    // Add more data here later, like orders, revenue, etc.
  });
});

export { getSellerDashboard };
