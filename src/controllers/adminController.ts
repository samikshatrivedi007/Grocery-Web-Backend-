import { Request, Response } from "express";
import Admin from "../models/admin.model";
import Product from "../models/product.model";
import Order, { IOrder } from "../models/order.model";
import { generateAdminToken } from "../utils/generateToken";
import bcrypt from "bcryptjs";

// ✅ Admin Login
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && await admin.matchPassword(password)) {
        res.json({
            token: generateAdminToken(admin._id.toString()),
            admin: { id: admin._id, email: admin.email },
        });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
};

// ✅ Register Admin
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
        res.status(400).json({ message: "Admin already exists with this email" });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        message: "Admin registered successfully",
        admin: {
            id: newAdmin._id,
            email: newAdmin.email,
        },
        token: generateAdminToken(newAdmin._id.toString()),
    });
};

// ✅ Add new product
export const addProduct = async (req: Request, res: Response): Promise<void> => {
    const admin = res.locals.admin;
    console.log("Admin ID:", admin.id);

    const product = await Product.create(req.body);
    res.status(201).json(product);
};

// ✅ Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
};

// ✅ Delete product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
};

// ✅ Get all orders
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
};

// ✅ Get revenue & order stats
export const getStats = async (_req: Request, res: Response): Promise<void> => {
    const orders = await Order.find() as IOrder[];
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const orderCount = orders.length;

    res.json({ totalRevenue, orderCount });
};

// ✅ Get top products
export const getTopProducts = async (_req: Request, res: Response): Promise<void> => {
    const topProducts = await Order.aggregate([
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
};
