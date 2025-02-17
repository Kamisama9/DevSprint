import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("DB connection successfull")
    } catch (error) {
        console.log("Error in DB connection. ERROR: ",error);
    }

}
export default connectDB;
