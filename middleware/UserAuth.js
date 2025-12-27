import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.json({
        success: false,
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel
      .findById(decoded.id)
      .select("name email");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ VERY IMPORTANT
    req.userId = user._id;
    req.user = user; // 👈 THIS FIXES COD

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);
    res.json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default authUser;
