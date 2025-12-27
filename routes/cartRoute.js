import express from "express";
import userAuth from "../middleware/userAuth.js";
import { getCart, saveCart } from "../controllers/cartController.js";

const router = express.Router();

router.get("/", userAuth, getCart);
router.post("/", userAuth, saveCart);

export default router;
