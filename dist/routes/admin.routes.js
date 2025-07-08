"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const adminAuth_1 = require("../middleware/adminAuth");
const router = express_1.default.Router();
router.post("/register", adminController_1.registerAdmin);
// 🔐 Admin Login
router.post("/login", adminController_1.adminLogin);
// 🛡️ Protected Admin Routes
router.post("/products", adminAuth_1.adminAuth, adminController_1.addProduct);
router.put("/products/:id", adminAuth_1.adminAuth, adminController_1.updateProduct);
router.delete("/products/:id", adminAuth_1.adminAuth, adminController_1.deleteProduct);
router.get("/orders", adminAuth_1.adminAuth, adminController_1.getAllOrders);
router.get("/stats", adminAuth_1.adminAuth, adminController_1.getStats);
router.get("/analytics/top-products", adminAuth_1.adminAuth, adminController_1.getTopProducts);
exports.default = router;
