import express from "express";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminauth.js";
import {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();

// 🔥 ADD PRODUCT (MULTIPLE IMAGES)
router.post(
  "/add",
  adminAuth,
  upload.array("images", 4), // 👈 THIS MUST BE "images"
  addProduct
);

// OTHER ROUTES
router.get("/list", listProducts);
router.post("/remove", adminAuth, removeProduct);
router.post("/single", singleProduct);
router.post("/update", adminAuth, updateProduct);

export default router;
