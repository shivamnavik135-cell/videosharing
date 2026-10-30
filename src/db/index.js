import mongoose from "mongoose";
import { db_name } from "../constants.js";

export const connectDB= async ()=>{
    try{
        const connection = await mongoose.connect(`${process.env.MONOGODB_URL}/${db_name}`);
        console.log(`MongoDB Connected : ${connection.connection.host}`)

    }
    catch(err){
        console.log("Error while connecting to database",err);
        process.exit(1);

    }

}