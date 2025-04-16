// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
path: './.env'
})

//handle database connection
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`App is listening on port: ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("MONGODB connection error",error);
})



/*import express from "express"
const app=express()
(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR",error);

        })
        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${PORT}`);

        })

    }catch{
        console.error("EROOR",error);
        throw error
    
    }
   
})();*/