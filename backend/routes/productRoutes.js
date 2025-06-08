import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
} from "../controllers/productController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/").get(getProducts).post(protect, admin, createProduct); // Public: get all products. Private/Admin: create product
router.route("/:id/reviews").post(protect, createProductReview); // Private: create a review for a specific product
router
  .route("/:id")
  .get(getProductById) // Public: get a single product
  .delete(protect, admin, deleteProduct) // Private/Admin: delete a product
  .put(protect, admin, updateProduct); // Private/Admin: update a product

export default router;
