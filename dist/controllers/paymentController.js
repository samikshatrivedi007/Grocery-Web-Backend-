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
exports.verifyPayment = exports.createPaymentOrder = void 0;
// Correct way to import Razorpay in TypeScript
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const order_model_1 = __importDefault(require("../models/order.model"));
//  Initialize Razorpay instance
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
//  Create Razorpay Order
const createPaymentOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, currency = 'INR', orderId } = req.body;
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: orderId,
        };
        const order = yield razorpay.orders.create(options);
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create Razorpay order', error });
    }
});
exports.createPaymentOrder = createPaymentOrder;
//  Verify Razorpay Payment
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, } = req.body;
        const generated_signature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
        const isAuthentic = generated_signature === razorpay_signature;
        if (!isAuthentic) {
            res.status(400).json({ message: 'Invalid signature' });
            return;
        }
        //  Mark order as paid in DB
        const order = yield order_model_1.default.findById(orderId);
        if (order) {
            order.status = 'Shipped'; // or "Paid" if you add a `paid` field
            order.trackingStatus = 'Payment confirmed, preparing your order';
            yield order.save();
        }
        res.status(200).json({ message: 'Payment verified', order });
    }
    catch (error) {
        res.status(500).json({ message: 'Payment verification failed', error });
    }
});
exports.verifyPayment = verifyPayment;
