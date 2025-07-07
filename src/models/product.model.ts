import mongoose, { Schema, Document} from "mongoose";
export interface IProduct  extends Document {
    title: string;
    price: number;
    image: string;
    stock: number;
    category: string;
}
const ProductSchema :Schema = new Schema<IProduct>({
    title: {type:String, required:true},
    price: {type:Number, required:true},
    image: {type:String},
    stock: {type:Number, default:0},
    category: {type:String},
})
export default mongoose.model<IProduct>("product", ProductSchema);