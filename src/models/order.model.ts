import mongoose, { Document, Schema ,Types } from 'mongoose';

interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    user: Types.ObjectId;
    items: {
        product: Types.ObjectId;
        quantity: number;
    }[];

    totalAmount: number;
    address: string;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    trackingStatus: string;
    estimatedDeliveryTime?: Date;
    orderedAt: Date;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}


const orderSchema = new Schema<IOrder>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
            name: String,
            price: Number,
            quantity: Number,
            image: String,
        },
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled','Out for Delivery'], default: 'Pending' },
    trackingStatus: {
        type: String,
        default: 'Order Placed',
    },
    estimatedDeliveryTime: { type: Date },
    orderedAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date },
});


export default mongoose.model<IOrder>('Order', orderSchema);
