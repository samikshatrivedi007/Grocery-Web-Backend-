import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// ✅ Define the admin payload structure
interface AdminPayload extends JwtPayload {
    id: string;
    isAdmin: boolean;
}

// ✅ Use default Express.Request and store admin info in res.locals
export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token" });
        return ;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (typeof decoded === "string" || !("isAdmin" in decoded)) {
             res.status(401).json({ message: "Invalid token payload" });
            return;
        }

        const admin = decoded as AdminPayload;

        if (!admin.isAdmin) {
            res.status(403).json({ message: "Forbidden: Not an admin" });
            return;
        }

        // ✅ Store admin info in res.locals (not req.user)
        res.locals.admin = admin;

        next();
    } catch (error) {
        console.error("Admin auth failed:", error);
         res.status(401).json({ message: "Token validation failed" });
        return;
    }
};
