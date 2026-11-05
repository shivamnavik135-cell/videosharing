import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import apiError from "../utils/apiError.js";
import uploadToCloudinary from "../utils/cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
    const { userName, email, fullName, password } = req.body;
    console.log(req.body);
    if ([userName, email, fullName, password].some(field => field?.trim() === "")) {
        throw new apiError(
            
            "All fields are required",400,"All fields are required"
        );
    }
    const esxistingUser=User.findOne({
        $or: [
            { userName: userName },
            { email: email }
        ]
    })
    if(existingUser){
        throw new apiError(
            409,"User with this username and email already exists"
        )}
    const avatarLoacalPath = req.files?.avatar[0]?.path;
    const coverLoaclPath = req.files?.coverPage[0]?.path;

    if(!avatarLocalPath){
        throw new apiError(409,"Avatar is required to procced forward")
    }

   const avatarUploaded = await uploadToCloudinary(avatarLoacalPath);
   const coverUploaded = await uploadToCloudinary(coverLoaclPath);

   if(!avatarUploaded){
    throw new apiError(500,"Something Went Wrong While Uploading Avatar")
   };

   const user = User.create(
    {
        fullname,
        email,
        avatar : avatarUploaded.url,
        coverImage:coverUploaded?.url || "",
        password,
        userName:userName.toLowerCase()
    }
   )

   const userCreated =  await user.findById(user._id).selection(
    "-password -refreshToken"
   )

   if(!userCreated){
    throw new apiError(500,"Something Went Wrong While Creating User Try Again")
    }

    return res.status(201).json(
        new apiResponse(200,"User created !!Succesfully")
    )


})

export default registerUser;