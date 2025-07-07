
// Correct way to import Razorpay in TypeScript
import Razorpay from "razorpay";

import crypto from 'crypto';
import { Request, Response } from 'express';
import Order from '../models/order.model';

//  Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id:  process.env.RAZORPAY_KEY_ID!,
    key_secret:  process.env.RAZORPAY_KEY_SECRET!,
});

//  Create Razorpay Order
export const createPaymentOrder = async (req: Request, res: Response) => {
    try {
        const { amount, currency = 'INR', orderId } = req.body;

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency,
            receipt: orderId,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create Razorpay order', error });
    }
};

//  Verify Razorpay Payment
export const verifyPayment = async (req: Request, res: Response) : Promise<void> => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body;

        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET!)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        const isAuthentic = generated_signature === razorpay_signature;

        if (!isAuthentic) {
            res.status(400).json({ message: 'Invalid signature' });
            return;
        }

        //  Mark order as paid in DB
        const order = await Order.findById(orderId);
        if (order) {
            order.status = 'Shipped'; // or "Paid" if you add a `paid` field
            order.trackingStatus = 'Payment confirmed, preparing your order';
            await order.save();
        }

        res.status(200).json({ message: 'Payment verified', order });
    } catch (error) {
        res.status(500).json({ message: 'Payment verification failed', error });
    }
};
