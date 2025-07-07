import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
    email: string;
    password: string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}


const adminSchema = new mongoose.Schema<IAdmin>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });


// Hash password before saving
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare password method
adminSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
};


const Admin = mongoose.model<IAdmin>("Admin", adminSchema);
export default Admin;
