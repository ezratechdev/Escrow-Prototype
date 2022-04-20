import mongoose from "mongoose";


const ItemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true , 'Name of item is required'],
    },
    description:{
        type:String,
        required:[true , 'Item decription is required'],
    },
    user:{
        type:mongoose.Types.ObjectId,
        required:[true, 'User object is not present'],
        ref:'User',
    },
    isSold:{
        type:Boolean,
        required:[true, 'State of item has not been specified'],
    }
} , { timestamps: true});

export default mongoose.model('Item' , ItemSchema);