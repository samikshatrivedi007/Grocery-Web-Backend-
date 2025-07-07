"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authMiddleware, orderController_1.placeOrder);
router.get('/', authMiddleware_1.authMiddleware, orderController_1.getAllOrders);
router.get('/:id', authMiddleware_1.authMiddleware, orderController_1.getOrderById);
router.put('/:id/cancel', authMiddleware_1.authMiddleware, orderController_1.cancelOrder);
// Delivery tracking
router.get('/:id/track', authMiddleware_1.authMiddleware, orderController_1.trackOrderStatus);
router.put('/:id/update-status', authMiddleware_1.authMiddleware, orderController_1.updateOrderStatus);
exports.default = router;
