import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import apiError from "../utils/apiError.js";
import { User } from "../models/user.models.js";

const verifyJWT = asyncHandler(async(req,res,next)=>{
    try{
        const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

        if (!token) {
            throw new apiError(401,"Acess Token is missing");
        };

        const decodedJwt = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedJwt?._id).select(
            "-passsword -refreshToken" 
        );
        if (!user){
            throw apiError(401,"invalid AcesssToken")
        };

        req.user = user;
        next();
    }
    catch(err){
        throw new apiError(401,"invalid AcesssToken")
    }
});

export {verifyJWT};