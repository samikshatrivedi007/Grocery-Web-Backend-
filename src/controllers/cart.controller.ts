import { Request, Response } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import { IUser } from "../models/user";

// Type guard to ensure req.user is of type IUser
function isIUser(user: any): user is IUser {
    return user && typeof user._id === "string";
}

// ✅ Get cart
export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user || !isIUser(req.user)) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        res.status(200).json(cart || { user: userId, items: [] });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Add to cart
export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user || !isIUser(req.user)) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userId = req.user._id;
        const { productId, quantity } = req.body;

        let cart = await Cart.findOne({ user: userId });
        const product = await Product.findById(productId);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        if (!cart) {
            cart = await Cart.create({
                user: userId,
                items: [{ product: productId, quantity }],
            });
        } else {
            const index = cart.items.findIndex((item) => item.product.toString() === productId);
            if (index > -1) {
                cart.items[index].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
            await cart.save();
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Update cart item quantity
export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user || !isIUser(req.user)) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userId = req.user._id;
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        const index = cart.items.findIndex((item) => item.product.toString() === productId);
        if (index > -1) {
            cart.items[index].quantity = quantity;
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Product not in cart" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Remove item from cart
export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user || !isIUser(req.user)) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userId = req.user._id;
        const { productId } = req.params;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            res.status(404).json({ message: "Cart not found" });
            return;
        }

        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// ✅ Clear entire cart
export const clearCart = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user || !isIUser(req.user)) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const userId = req.user._id;
        await Cart.findOneAndDelete({ user: userId });

        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
