import mongoose, {Document, Schema} from 'mongoose';
export interface IUser extends Document {
    name:string;
    email:string;
    phone?:string;
    password:string;
    role:string;
}
const userSchema :Schema =new Schema<IUser>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required :true,
        unique:true,
    },
    phone:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:'user',
    },
    },
{ timestamps: true });
export default mongoose.model<IUser>('User', userSchema);