import { verify } from "../components/Jwt";
import UserModel from "../schema/UserModel";


const Protector = async (req:any , res:any , next:any) =>{
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        const token = req.headers.authorization.split(" ")[1];
        if(token)
        try{
            const { id , operation } = verify(token,'auth');
            if(operation == "auth"){
                req.user = await UserModel.findById(id).select('-password');
                next();
            }
        }catch(error){
            throw new Error(`Opps!We faced an error authorizing you.Try Again`);
        }
    }
}

export default Protector;