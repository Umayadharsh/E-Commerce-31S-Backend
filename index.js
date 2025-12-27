import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cors from "cors";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// 🔗 CONNECT DATABASE
connectDB();

// 🧠 BODY PARSER
app.use(express.json());

// ✅ CORS — ADMIN + USER FRONTEND
const allowedOrigins = [
  "http://localhost:5173", // admin
  "https://e-commerce-31-s-frontend.vercel.app/", // user
];

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "token"],
  })
);

// 🧪 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API Working");
});

// 🚏 ROUTES
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);

// 🚀 START SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
