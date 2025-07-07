import jwt from "jsonwebtoken";

export const generateAdminToken = (adminId: string) => {
    return jwt.sign({ id: adminId, isAdmin: true }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    });
};

