import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID from the token payload and exclude the password
      req.user = await User.findById(decoded.userId).select("-password");

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Not authorized, token failed".red);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// Middleware for admin users
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // If user is admin, proceed
  } else {
    res.status(403); // Forbidden
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
