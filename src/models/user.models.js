import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new Schema(
    {
        userName:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true   
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true   

        },
        fullName:{
            type:String,
            required:true,
            lowercase:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,//For tis we are goinig to use cloudinary for storing images and getting the url of the image and storing it in the database
            required:true
        },
        coverPage:{
            type:String,
        },
        watchHistory:[
            {
            type:Schema.Types.ObjectId,
            ref:"Video"
            }
            

        ],
        password:{
            type:String,
            required:[true,"Password is required"]
        },
        refreshToken:{
            type:String

        }

    },{
        timestamps:true
    }
)

userSchema.pre("save", async function (next){
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password =await bcrypt.hash(this.password,salt)
    next();
})

userSchema.methods.isPasswordMatch= async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    jwt.sign({
        _id:this._id,
        userName:this.userName,
        email:this.email,
        fullName:this.fullName

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_LIFE
    }
)
}

userSchema.methods.generateRefreshToken=function(){
    jwt.sign({
        _id:this._id,
        

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_LIFE
    }
)
}
export const User=mongoose.model("User",userSchema);