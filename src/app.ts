import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './config/db';

// Routes
import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/paymentRoutes";
import adminRoutes from "./routes/admin.routes";

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/auth", authRoutes);     // register, login
app.use("/api/cart", cartRoutes);     // cart routes (protected by auth middleware)
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/admin", adminRoutes);

// Base route
app.get("/", (_req, res) => {
    res.send("🚀 Grocery Delivery Backend API is running");
});

export default app;
