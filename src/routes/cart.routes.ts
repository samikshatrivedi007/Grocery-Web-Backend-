import {Router} from 'express';
import{getCart,addToCart,updateCartItem,removeCartItem,clearCart} from "../controllers/cart.controller";
import {authMiddleware} from "../middleware/authMiddleware";

const router =  Router();
router.get("/", authMiddleware, getCart);
router.post("/add",authMiddleware, addToCart);
router.put("/update", authMiddleware, updateCartItem);
router.delete("/remove/:productId", authMiddleware, removeCartItem);
router.delete("/clear", authMiddleware, clearCart);

export default router;