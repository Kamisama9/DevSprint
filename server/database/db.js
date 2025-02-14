import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

const connectDB=async()=>{
    try {
        await mongoose.connect();
        console.log("DB connection successfull")
    } catch (error) {
        console.log("Error in DB connection. ERROR: ",error);
    }

}
