import express from "express";
import {
  placeOrder,
  listOrders,
  userOrders,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/orderController.js";
import userAuth from "../middleware/UserAuth.js";
import adminAuth from "../middleware/adminauth.js";
import { updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

// USER
router.post("/place", userAuth, placeOrder);
router.get("/user", userAuth, userOrders);

// RAZORPAY
router.post("/razorpay", userAuth, createRazorpayOrder);
router.post("/verify", userAuth, verifyRazorpayPayment);

// ADMIN
router.get("/list", adminAuth, listOrders);
router.post("/status", adminAuth, updateOrderStatus);

export default router;
