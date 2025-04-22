import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        fullName:{
            type:String,
            required:true,
            index:true
        },
        avatar:{
            type:String,
            required:true
        },
        coverImage:{
            type:String,
           
        },
        watchHistory:[
            {
                type:String,
                required:true
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken:{
            type:String
        }


},
{timestamps:true})
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    console.log("Hash Password",this.password);
    this.password=await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect=async function (password) {
    console.log("password",password);
    console.log("Hash Password",this.password);
    return await bcrypt.compare(password,this.password)
    
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this.id,
            username:this.username,
            email:this.email,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,

        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}
export const User=mongoose.model("User",userSchema)