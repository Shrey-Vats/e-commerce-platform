import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/authController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.post("/login", authUser);
router.post("/", registerUser);
router.post("/logout", logoutUser);

// Use .route() for chaining HTTP methods on the same path
router
  .route("/profile")
  .get(protect, getUserProfile) // GET /api/users/profile - Protected
  .put(protect, updateUserProfile); // PUT /api/users/profile - Protected

// Admin-only routes
router.route("/").get(protect, admin, getUsers); // GET /api/users - Protected, Admin only

router
  .route("/:id")
  .delete(protect, admin, deleteUser) // DELETE /api/users/:id - Protected, Admin only
  .get(protect, admin, getUserById) // GET /api/users/:id - Protected, Admin only
  .put(protect, admin, updateUser); // PUT /api/users/:id - Protected, Admin only

export default router;
