import express , {Request , Response} from "express";
import http from "http";
import Authenication from "./routes/Auth";
import ResponseFunc from "./components/Response";
import Item from "./routes/CreateItem";
import mongoose from "mongoose";

// constants
const app = express()
const Server = http.createServer(app)
const PORT = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended:true,
}));
app.use("/auth",Authenication);
app.use("/item" , Item);

// default 404 error path
app.use((req:Request , res:Response)=>{
    res.json({
        ...ResponseFunc({
            status:404,
            message:'Page was not found',
        }),
    })
});
// for easy configuration i have stored it in a plain string ... i will improve later store it in an .env
const mongodbLink = "mongodb+srv://jwtuser:jwtuser@cluster0.fgsl9.mongodb.net/ItemTrade?retryWrites=true&w=majority"


mongoose.connect(mongodbLink)
.then(() => Server.listen(PORT))
.catch(() => {throw new Error(`An error occurred connecting to the database`)});



