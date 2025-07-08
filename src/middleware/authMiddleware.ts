import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        req.user = user;
        next();
    } catch (err: any) {
        res.status(401).json({ message: "Invalid token", error: err.message });
    }
};
