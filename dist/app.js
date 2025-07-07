"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // for parsing application/json
// Connect to MongoDB
(0, db_1.default)();
// API Routes
app.use("/api/auth", auth_routes_1.default); // register, login
app.use("/api/cart", cart_routes_1.default); // cart routes (protected by auth middleware)
app.use('/api/orders', order_routes_1.default);
app.use('/api/payment', paymentRoutes_1.default);
app.use("/api/admin", admin_routes_1.default);
// Base route
app.get("/", (_req, res) => {
    res.send("🚀 Grocery Delivery Backend API is running");
});
exports.default = app;
