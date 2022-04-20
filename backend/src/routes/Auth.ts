import express from "express";
const Authenication = express.Router();
import ResponseFunc from "../components/Response";
import bcrypt from "bcryptjs";
import UserModel from "../schema/UserModel";
import { sign } from "../components/Jwt";

Authenication.post("/signup" , async (req , res)=>{
    const { email , password , username } = req.body;
    if(!(( email && password && username ) && (email.length >=6 && password.length >= 6 && username.length >= 4 ) && (email.includes("@") && email.includes(".")) )){
        res.json({
            ...ResponseFunc({
                status:404,
                message:'Some or all details were not passed.Try again',
            }),
        })
    }

    // push user here

    if(await UserModel.findOne({ email })){
        res.json({
            ...ResponseFunc({
                status:400,
                message:`User with email ${email} already exists`,
            }),
        })
    }else{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);
        const user = await UserModel.create({
            email,
            username,
            password:hashedPassword,
            isEmailVerified:false,
        });
        if(!user){
            res.json({
                ...ResponseFunc({
                    status:400,
                    message:`Unable to create user.Try again.`,
                }),
            })
        }else
        res.json({
            ...ResponseFunc({
                status:200,
                message:`User with email ${email} has been created`,
                token:sign({ id:(user._id) , op:"auth"}),
            })
        })
    }
});


Authenication.post("/login" , async (req , res) =>{
    const { email , password } = req.body;
    if(!(( email && password  ) && (email.length >=6 && password.length >= 6  ) && (email.includes("@") && email.includes(".")) )){
        res.json({
            ...ResponseFunc({
                status:404,
                message:'Some or all details were not passed.Try again',
            }),
        })
    }
    // find user here
    const user:any = await UserModel.findOne({ email });
    if(!user){
        res.json({
            ...ResponseFunc({
                status:400,
                message:`User with email ${email} does not exists`,
            }),
        })
    }else{
        if(await bcrypt.compare(password , user.password)){
            res.json({
                ...ResponseFunc({
                    status:200,
                    message:`User with email ${email} has been logged in`,
                    token:sign({ id:(user._id) , op:"auth"}),
                })
            })
        }else
        res.json({
            ...ResponseFunc({
                status:400,
                message:`Incorrect password.Try again`,
            }),
        })
    }
});


// work on password reset , verify email and passwordless login

export default Authenication;

