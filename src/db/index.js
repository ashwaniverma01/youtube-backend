import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//database connection
const connectDB=async ()=>{
    try{
        //mongoose return as a object so we can store in a variable
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected DB HOST: ${connectionInstance.connection.host}`);
        console.log(`MongoDB connected DB NAME: ${connectionInstance.connection.name}`);
        console.log(`MongoDB connected DB PORT: ${connectionInstance.connection.port}`);
        console.log(`MongoDB connected DB USER: ${connectionInstance.connection.user}`);

    }catch(error){
        console.error("MONGODB CONNECTION FAILED",error)
        process.exit(1)
    }

}

export default connectDB