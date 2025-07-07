"use strict";
// routes/paymentRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/create-order', authMiddleware_1.authMiddleware, paymentController_1.createPaymentOrder);
router.post('/verify', authMiddleware_1.authMiddleware, paymentController_1.verifyPayment);
exports.default = router;
