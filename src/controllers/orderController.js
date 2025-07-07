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
exports.cancelOrder = exports.getOrderById = exports.getAllOrders = exports.placeOrder = exports.updateOrderStatus = exports.trackOrderStatus = void 0;
const order_model_1 = __importDefault(require("../models/order.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const trackOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const orderId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const order = yield order_model_1.default.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({
            status: order.status,
            trackingStatus: order.trackingStatus,
            estimatedDeliveryTime: order.estimatedDeliveryTime,
            orderedAt: order.orderedAt,
            deliveredAt: order.deliveredAt || null,
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.trackOrderStatus = trackOrderStatus;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, trackingStatus, estimatedDeliveryTime } = req.body;
        const orderId = req.params.id;
        const order = yield order_model_1.default.findById(orderId);
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        if (status)
            order.status = status;
        if (trackingStatus)
            order.trackingStatus = trackingStatus;
        if (estimatedDeliveryTime)
            order.estimatedDeliveryTime = new Date(estimatedDeliveryTime);
        if (status === 'Delivered') {
            order.deliveredAt = new Date();
            order.trackingStatus = 'Order Delivered';
        }
        yield order.save();
        res.status(200).json({ message: 'Order status updated', order });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { address } = req.body;
    const cart = yield cart_model_1.default.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
    }
    const orderItems = cart.items.map(item => {
        const product = item.product;
        return {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
            image: product.image,
        };
    });
    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = yield order_model_1.default.create({
        userId,
        items: orderItems,
        totalAmount,
        address,
    });
    yield cart_model_1.default.findOneAndDelete({ userId });
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
});
exports.placeOrder = placeOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const orders = yield order_model_1.default.find({ userId }).sort({ orderedAt: -1 });
    res.status(200).json(orders);
});
exports.getAllOrders = getAllOrders;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orderId = req.params.id;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const order = yield order_model_1.default.findOne({ _id: orderId, userId });
    if (!order)
        return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
});
exports.getOrderById = getOrderById;
const cancelOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orderId = req.params.id;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const order = yield order_model_1.default.findOne({ _id: orderId, userId });
    if (!order)
        return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'Pending') {
        return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }
    order.status = 'Cancelled';
    yield order.save();
    res.status(200).json({ message: 'Order cancelled', order });
});
exports.cancelOrder = cancelOrder;
