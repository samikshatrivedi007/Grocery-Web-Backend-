import express from "express";
import {
    adminLogin,
    addProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    getStats,
    getTopProducts,
    registerAdmin
} from "../controllers/adminController";
import  {adminAuth}  from "../middleware/adminAuth";

const router = express.Router();

router.post("/register", registerAdmin);
// 🔐 Admin Login
router.post("/login", adminLogin);

// 🛡️ Protected Admin Routes
router.post("/products", adminAuth, addProduct);
router.put("/products/:id", adminAuth, updateProduct);
router.delete("/products/:id", adminAuth, deleteProduct);
router.get("/orders", adminAuth, getAllOrders);
router.get("/stats", adminAuth, getStats);
router.get("/analytics/top-products", adminAuth, getTopProducts);



export default router;
