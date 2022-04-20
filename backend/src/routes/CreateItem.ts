import express from "express";
import Protector from "../middlewares/ProtectRoute";
import ItemModel from "../schema/ItemModel";
const Item = express.Router();
import ResponseFunc from "../components/Response";


Item.post("/create" , [Protector] , async (req:any , res:any) =>{
    if(!req.user){
        throw new Error(`Unauthorized operation`);
    }
    const { id } = req.user;
    const { name , description } = req.body;
    if(!(name && description)){
        res.json({
            ...ResponseFunc({
                status:400,
                message:`${name ?  description ? null : 'name and description were' : null  } not passed`
            }),
        });
    }else{
        const NewItem = await ItemModel.create({
            name,
            description,
            user:id,
            isSold:false,
        });
        if(!NewItem){
            res.json({
                ...ResponseFunc({
                    status:400,
                    message:`Unable to create a new item.Please try again later`,
                }),
            })
        }else{
            res.json({
                ...ResponseFunc({
                    status:200,
                    message:`New item with id ${NewItem._id} has been created`,
                }),
            })
        }
    }
});
Item.post("/getMyItems" , [Protector] , async (req:any , res:any) =>{
    if(!req.user){
        throw new Error(`Unauthorized operation`);
    }
    const { id } = req.user;
    const AllItems = await ItemModel.find({user:id});
    if(AllItems.length == 0){
        res.json({
            ...ResponseFunc({
                status:200,
                message:'User items obtained',
            }),
            items:[],
        });
    }else{
        res.json({
            ...ResponseFunc({
                status:200,
                message:'User items obtained',
            }),
            items:AllItems,
        });
    }
});
Item.post("/getAvailable" , [Protector] , async (req:any , res:any) =>{});
Item.post("/deleteItem" , [Protector] , async (req:any , res:any) =>{
    
});
Item.post("/puchaseItem" , [Protector] , async (req:any , res:any) =>{});
Item.post("/updateItem" , [Protector] , async (req:any , res:any) =>{});


export default Item;
