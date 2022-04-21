import express from "express";
import Protector from "../middlewares/ProtectRoute";
import ItemModel from "../schema/ItemModel";
const Item = express.Router();
import ResponseFunc from "../components/Response";

// protected routes
Item.post("/create" , [Protector] , async (req:any , res:any) =>{
    if(!req.user){
        throw new Error(`Unauthorized operation`);
    }
    const { id } = req.user;
    const { name , description , price } = req.body;
    if(!(name && description && price)){
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
            price:parseFloat(price),
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


Item.delete("/deleteItem/:itemID" , [Protector] , async (req:any , res:any) =>{
    if(!req.user){
        throw new Error(`Unauthorized operation`);
    }
    const { id } = req.user;
    const { itemID } = req.params;
    if(!itemID){
        res.json({
            ...ResponseFunc({
                status:400,
                message:'Item id was not passed',
            }),
        });
    }else{
        const item = await ItemModel.findById(itemID );
        if(item.user == id && item){
            await item.remove();
            res.json({
                ...ResponseFunc({
                    status:200,
                    message:`Item with id ${itemID} has been deleted`,
                }),
            });
        }else{
            res.json({
                ...ResponseFunc({
                    status:400,
                    message:'This request is un-authorized',
                }),
            });
        }
    }
});


Item.patch("/updateItem/:itemID" , [Protector] , async (req:any , res:any) =>{
    if(!req.user){
        throw new Error(`Unauthorized operation`);
    }
    const { id } = req.user;
    const { itemID } = req.params;
    if(!itemID && !req.body){
        res.json({
            ...ResponseFunc({
                status:400,
                message:'Item id or item update data were not passed',
            }),
        });
    }else{
        const patchedItem = await ItemModel.findById(itemID);
        if(!(patchedItem.user == id)){
            res.json({
                ...ResponseFunc({
                    status:400,
                    message:'This request is un-authorized',
                }),
            });
        }else{
            const updateObject = {
                ...req.body.name && { name : req.body.name },
                ...req.body.description && { description : req.body.description },
            }
            const updatedItem = await ItemModel.findByIdAndUpdate(itemID , { ... updateObject } , { new : true});
            if(!updatedItem){
                res.json({
                    ...ResponseFunc({
                        status:400,
                        message:`Faced an issue updating.Try Again`,
                    }),
                });
            }
            res.json({
                ...ResponseFunc({
                    status:200,
                    message:`Item with id ${itemID} has been updated`,
                }),
            });
        }
    }
});


//  a user will resell an item
Item.patch("/resellItem/:itemID" , [Protector] , async (req:any , res:any) =>{
    if(!req.user){
        throw new Error(`Unauthorized operation`);
    }
    const { id } = req.user;
    const { itemID } = req.params;
    if(!itemID){
        res.json({
            ...ResponseFunc({
                status:400,
                message:'Item id or item update data were not passed',
            }),
        });
    }else{
        const resellItem = await ItemModel.findById(itemID);
        if(!(resellItem.user == id && resellItem.isSold == false)){
            res.json({
                ...ResponseFunc({
                    status:400,
                    message:'This request is un-authorized',
                }),
            });
        }else{
            const ResoldItem = await ItemModel.findByIdAndUpdate(itemID , { isSold: false } , { new : true});
            if(!ResoldItem){
                res.json({
                    ...ResponseFunc({
                        status:400,
                        message:`Faced an issue updating.Try Again`,
                    }),
                });
            }
            res.json({
                ...ResponseFunc({
                    status:200,
                    message:`Item with id ${itemID} has been returned back to the market`,
                }),
            });
        }
    }
});

Item.post("/puchaseItem" , [Protector] , async (req:any , res:any) =>{
    // redirect to an blockchain function
});

//  unprotected routes
Item.get("/getAvailable" , async (req:any , res:any) =>{

    const getAvailable = await ItemModel.find({ isSold : false }).select('-user');
    if(!getAvailable){
        res.json({
            ...ResponseFunc({
                status:200,
                message:'Market items obtained',
            }),
            items:[],
        });
    }
    res.json({
        ...ResponseFunc({
            status:200,
            message:'Market items obtained',
        }),
        items:getAvailable,
    });
});


export default Item;
