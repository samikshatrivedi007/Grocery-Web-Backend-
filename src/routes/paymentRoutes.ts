// routes/paymentRoutes.ts

import express from 'express';
import {
    createPaymentOrder,
    verifyPayment,
} from '../controllers/paymentController';
import {authMiddleware} from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create-order', authMiddleware, createPaymentOrder);
router.post('/verify', authMiddleware, verifyPayment);

export default router;
