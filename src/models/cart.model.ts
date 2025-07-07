import mongoose ,{Document,Schema} from "mongoose";
export interface ICartItem {
    product : mongoose.Schema.Types.ObjectId;
    quantity:number;
}
export interface ICart extends Document {
    user:mongoose.Schema.Types.ObjectId;
    items:ICartItem [];
}
const cartSchema: Schema = new Schema<ICart>({
    user: {type:mongoose.Schema.Types.ObjectId, ref:'user', required:true,unique:true},
    items: [
        {
            product:{type:mongoose.Schema.Types.ObjectId, ref:'product', required:true},
            quantity:{type:Number,required:true,default:1},
        }
    ]
});
export default mongoose.model<ICart>("cart", cartSchema)