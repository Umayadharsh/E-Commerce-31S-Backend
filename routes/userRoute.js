import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword
} from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/admin", adminLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/update", userAuth , updateProfile); 
router.post("/change-password", userAuth, changePassword);

export default router;
