import jwt from "jsonwebtoken";

export const sign = ({ id , op }:{
    id:string,
    op:string,
}) =>{
    const secretKey = (op == "auth") ? "authSignKey" : "KeyForOtherOPs";
    return jwt.sign( { id , operation:op } , `${secretKey}` , { expiresIn : '3d'} );
};

export const verify = (token:any , operation:string)=>{
    const secretKey = (operation == "auth") ? "authSignKey" : "KeyForOtherOPs";
    const tokenData = jwt.verify(token,secretKey);
    return tokenData;
}