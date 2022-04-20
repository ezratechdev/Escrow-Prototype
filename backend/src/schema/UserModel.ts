import mongoose from "mongoose";

const UserSchema  = new mongoose.Schema({
    email:{
        type:String,
        required:[true , 'Email of user is needed'],
    },
    password:{
        type:String,
        required:[true , 'User password was not passed'],
    },
    username:{
        type:String,
        required:[true , 'Username is requied'],
    },
    isEmailVerified:{
        type:Boolean,
        required:[true , 'User state was not initialized'],
    }
},{ timestamps : true});


export default mongoose.model('User' , UserSchema);