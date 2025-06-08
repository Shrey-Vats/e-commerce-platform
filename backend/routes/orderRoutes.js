import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders); // Private: create order. Private/Admin: get all orders
router.route("/myorders").get(protect, getMyOrders); // Private: get orders for the logged-in user
router.route("/:id").get(protect, getOrderById); // Private: get a specific order by ID
router.route("/:id/pay").put(protect, updateOrderToPaid); // Private: update order to paid status
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered); // Private/Admin: update order to delivered status

export default router;
