import mongoose, { Schema } from "mongoose";
import { User } from "./user.models";
const subscription = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    chanel:{
        type:Schema.Types.ObjectId,
        ref:User
    }
},{timestamps:true})

export const Subscription = mongoose.model("subscription",subscriptionSchema);