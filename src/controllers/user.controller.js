
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import apiError from "../utils/apiError.js";
import uploadToCloudinary from "../utils/cloudinary.js";

const genertaeRefreshTokenAndAcessToken = async(userId)=>{
        try{
            const user = await User.findById(userId);
            const acessToken= user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();
            user.refreshToken = refreshToken;
            await user.save({validationBeforeSave : false});

            return {acessToken,refreshToken};

        }
        catch(err){
            throw new apiError(500,"Something went Wrongwhile generating tokens")
        }

    };

const registerUser = asyncHandler(async (req, res) => {

    console.log("\n========== REGISTRATION STARTED ==========");

    // STEP 1: Get user details
    console.log("1. Checking request body...");

    const { userName, email, fullName, password } = req.body;

    console.log("Request Body:", req.body);

    // STEP 2: Validate user details
    console.log("2. Validating user details...");

    if ([userName, email, fullName, password].some(
        (field) => !field?.trim()
    )) {
        console.log("ERROR: Required fields are missing");

        throw new apiError(400, "All fields are required");
    }

    console.log("SUCCESS: All fields are valid");

    // STEP 3: Check existing user
    console.log("3. Checking existing user...");

    const existingUser = await User.findOne({
        $or: [
            { userName: userName.toLowerCase() },
            { email: email.toLowerCase() }
        ]
    });

    if (existingUser) {
        console.log("ERROR: User already exists");

        throw new apiError(
            409,
            "User with this username or email already exists"
        );
    }

    console.log("SUCCESS: User does not exist");

    // STEP 4: Get uploaded file paths
    console.log("4. Checking uploaded files...");

    console.log("Uploaded Files:", req.files);

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverLocalPath = req.files?.coverPage?.[0]?.path;

    console.log("Avatar Path:", avatarLocalPath);
    console.log("Cover Path:", coverLocalPath);

    if (!avatarLocalPath) {
        console.log("ERROR: Avatar is missing");

        throw new apiError(400, "Avatar is required");
    }

    // STEP 5: Upload avatar to Cloudinary
    console.log("5. Uploading avatar to Cloudinary...");

    const avatarUploaded = await uploadToCloudinary(avatarLocalPath);

    console.log("Avatar Upload Result:", avatarUploaded);

    if (!avatarUploaded) {
        console.log("ERROR: Avatar upload failed");

        throw new apiError(
            500,
            "Something went wrong while uploading avatar"
        );
    }

    console.log("SUCCESS: Avatar uploaded");

    // STEP 6: Upload cover image (optional)
    console.log("6. Uploading cover image...");

    const coverUploaded = coverLocalPath
        ? await uploadToCloudinary(coverLocalPath)
        : null;

    console.log("Cover Upload Result:", coverUploaded);

    // STEP 7: Create user
    console.log("7. Creating user in MongoDB...");

    const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        avatar: avatarUploaded,
        coverImage: coverUploaded || "",
        password,
        userName: userName.toLowerCase()
    });

    console.log("SUCCESS: User created");
    console.log("User ID:", user._id);

    // STEP 8: Fetch user without sensitive fields
    console.log("8. Fetching created user...");

    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!userCreated) {
        console.log("ERROR: Unable to fetch created user");

        throw new apiError(
            500,
            "Something went wrong while creating user"
        );
    }

    console.log("SUCCESS: User fetched");

    // STEP 9: Send response
    console.log("9. Sending response to client...");

    console.log("========== REGISTRATION COMPLETED ==========\n");

    return res.status(201).json(
        new apiResponse(
            201,
            "User registered successfully"
        )
    );

});

const loginUser = asyncHandler (async (req,res)=>{
    // Implementation for loginUser will go here
    //usrer email and password required field 
    // check user exist or not 
    // if user not exist redirect it to register page 
    // if user exsit then check  for thr credentials if correct or not
    // if correct then genrate access token and refreshToken
    // send the access token and refresh token to the user 
    

    const {email,userName,password}= req.body;
    console.log(`login request from user: ${email} ${userName}`);

    if (!email || !userName) {
        throw new apiError(400,"Email and username are required")
    };

    const user = await User.findOne({
        $or:[
            {email},{userName}
        ]
    });
    console.log(`user found: ${user}`);
    if (!user){
        throw new apiError(404,"user not found please register first")
    };

    

    const isPasswordCorrect = await user.isPasswordMatch(password);
    if (!isPasswordCorrect){
        throw new apiError(401,"invalid credentials")
    };

    const {acessToken,refreshToken} = await genertaeRefreshTokenAndAcessToken(user._id);

    const loggedInUser= await User.findById(user._id)
    .select("-password -refreshToken");

    const options ={
        httpObly : true,
        secure: true
    }

    return res.ststus(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",acessToken,options)
    .json(
        new apiResponse(
            200,
            loggedInUser,
            "user logged in successfully"
        )
    )

    

});

export default registerUser;
