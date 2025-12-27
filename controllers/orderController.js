import orderModel from "../models/orderModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import SendEmail from "../utils/SendEmail.js";

/* ============================
   CREATE RAZORPAY ORDER
============================ */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/* ============================
   VERIFY RAZORPAY PAYMENT
============================ */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const newOrder = new orderModel({
      ...orderData,
      paymentMethod: "razorpay",
      paymentStatus: "Paid",
    });

    await newOrder.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/* ============================
   PLACE ORDER (COD)
============================ */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address, amount, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      address,
      amount,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "Pending" : "Initiated",
    });

    await newOrder.save();

    // 🔥 FETCH USER EMAIL
    const populatedOrder = await newOrder.populate(
      "userId",
      "name email"
    );

    await SendEmail({
      to: populatedOrder.userId.email,
      subject: "Order Confirmed 🎉",
      text: `
Hi ${populatedOrder.userId.name},

Your order has been placed successfully!

Order ID: ${newOrder._id}
Total Amount: ₹${amount}
Payment Method: ${paymentMethod}

Thank you for shopping with us ❤️
31S Store
      `,
    });

    res.json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

/* ============================
   ADMIN — LIST ALL ORDERS
============================ */
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* ============================
   ADMIN — UPDATE ORDER STATUS + EMAIL
============================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({
        success: false,
        message: "Order ID and status are required",
      });
    }

    const order = await orderModel
      .findById(orderId)
      .populate("userId", "name email");

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;
    await order.save();

    // 📧 EMAIL USER
    await SendEmail({
      to: order.userId.email,
      subject: `Order Status Updated – ${status}`,
      text: `
Hi ${order.userId.name},

Your order (${order._id}) status has been updated.

📦 Current Status: ${status}

Thank you for shopping with us ❤️
31S Store
      `,
    });

    res.json({
      success: true,
      message: "Order status updated",
    });
  } catch (error) {
    console.error("STATUS UPDATE ERROR:", error);
    res.json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

/* ============================
   USER — MY ORDERS
============================ */
export const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel
      .find({ userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
