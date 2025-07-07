"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopProducts = exports.getStats = exports.getAllOrders = exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.registerAdmin = exports.adminLogin = void 0;
const admin_model_1 = __importDefault(require("../models/admin.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
const generateToken_1 = require("../utils/generateToken");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// ✅ Admin Login
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const admin = yield admin_model_1.default.findOne({ email });
    if (admin && (yield admin.matchPassword(password))) {
        res.json({
            token: (0, generateToken_1.generateAdminToken)(admin._id.toString()),
            admin: { id: admin._id, email: admin.email },
        });
    }
    else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});
exports.adminLogin = adminLogin;
// ✅ Register Admin
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existing = yield admin_model_1.default.findOne({ email });
    if (existing) {
        res.status(400).json({ message: "Admin already exists with this email" });
        return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newAdmin = yield admin_model_1.default.create({
        email,
        password: hashedPassword,
    });
    res.status(201).json({
        message: "Admin registered successfully",
        admin: {
            id: newAdmin._id,
            email: newAdmin.email,
        },
        token: (0, generateToken_1.generateAdminToken)(newAdmin._id.toString()),
    });
});
exports.registerAdmin = registerAdmin;
// ✅ Add new product
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = res.locals.admin;
    console.log("Admin ID:", admin.id);
    const product = yield product_model_1.default.create(req.body);
    res.status(201).json(product);
});
exports.addProduct = addProduct;
// ✅ Update product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
});
exports.updateProduct = updateProduct;
// ✅ Delete product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield product_model_1.default.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
});
exports.deleteProduct = deleteProduct;
// ✅ Get all orders
const getAllOrders = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.default.find().populate("user", "name email");
    res.json(orders);
});
exports.getAllOrders = getAllOrders;
// ✅ Get revenue & order stats
const getStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.default.find();
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const orderCount = orders.length;
    res.json({ totalRevenue, orderCount });
});
exports.getStats = getStats;
// ✅ Get top products
const getTopProducts = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topProducts = yield order_model_1.default.aggregate([
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                totalOrdered: { $sum: "$items.quantity" },
            },
        },
        { $sort: { totalOrdered: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails",
            },
        },
        { $unwind: "$productDetails" },
    ]);
    res.json(topProducts);
});
exports.getTopProducts = getTopProducts;
