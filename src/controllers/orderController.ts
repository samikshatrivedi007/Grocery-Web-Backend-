import { Request, Response } from 'express';
import Order from '../models/order.model';
import Product from '../models/product.model';
import Cart from '../models/cart.model';

export const trackOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id;
        const userId = req.user?.id;

        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        res.status(200).json({
            status: order.status,
            trackingStatus: order.trackingStatus,
            estimatedDeliveryTime: order.estimatedDeliveryTime,
            orderedAt: order.orderedAt,
            deliveredAt: order.deliveredAt || null,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, trackingStatus, estimatedDeliveryTime } = req.body;
        const orderId = req.params.id;

        const order = await Order.findById(orderId);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        if (status) order.status = status;
        if (trackingStatus) order.trackingStatus = trackingStatus;
        if (estimatedDeliveryTime) order.estimatedDeliveryTime = new Date(estimatedDeliveryTime);

        if (status === 'Delivered') {
            order.deliveredAt = new Date();
            order.trackingStatus = 'Order Delivered';
        }

        await order.save();

        res.status(200).json({ message: 'Order status updated', order });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const placeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { address } = req.body;

        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            res.status(400).json({ message: 'Cart is empty' });
            return;
        }

        const orderItems = cart.items.map(item => {
            const product = item.product as any;

            return {
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.image,
            };
        });

        const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const newOrder = await Order.create({
            userId,
            items: orderItems,
            totalAmount,
            address,
        });

        await Cart.findOneAndDelete({ userId });

        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const orders = await Order.find({ userId }).sort({ orderedAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id;
        const userId = req.user?.id;

        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};

export const cancelOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id;
        const userId = req.user?.id;

        const order = await Order.findOne({ _id: orderId, userId });
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }

        if (order.status !== 'Pending') {
            res.status(400).json({ message: 'Only pending orders can be cancelled' });
            return;
        }

        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ message: 'Order cancelled', order });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
};
