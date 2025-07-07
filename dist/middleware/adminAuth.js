"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ✅ Use default Express.Request and store admin info in res.locals
const adminAuth = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (typeof decoded === "string" || !("isAdmin" in decoded)) {
            res.status(401).json({ message: "Invalid token payload" });
            return;
        }
        const admin = decoded;
        if (!admin.isAdmin) {
            res.status(403).json({ message: "Forbidden: Not an admin" });
            return;
        }
        // ✅ Store admin info in res.locals (not req.user)
        res.locals.admin = admin;
        next();
    }
    catch (error) {
        console.error("Admin auth failed:", error);
        res.status(401).json({ message: "Token validation failed" });
        return;
    }
};
exports.adminAuth = adminAuth;
