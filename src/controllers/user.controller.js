import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "./user.controller.js";
export {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
 //get users details from frontend
 //validation-not empty
 //check if user is already exist username email
 //check for images, check for avatar
 //upload them on cloudinary, avatar
 //create an user object create entey in database
 //remove password and refresh token from response
 //check for user creation
 //return response

 const {fullName,email,username,password}=req.body
 console.log("email:",email);
 if(
    [fullName,email,username,password].some((field)=> field?.trim()==="")
 ){
    throw new ApiError(400,"All field are required")
}

const existedUser=User.findOne({
    $or:[{username},{email}]
})

if(existedUser){
    throw new ApiError(409,"User with email or user already exist")
}
//this is on my server
const avatarLocalPath=req.files?.avatar[0]?.path
const coverImageLocalPath=req.files?.coverImage[0]?.path

if(!avatarLocalPath){
    throw new ApiError(404,"Avatar file is required")
}
const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(404,"Avatar file is required")
}
const user=await User.create({
    fullName,
    email,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    password,
    username:username.toLowerCase
})
const createdUser=username.findById(user._id).select(
    "-password -refreshToke"
)
if(createdUser){
    throw new ApiError(500,"something went wrong while registering the user")
}
return res.status(201).json()
new ApiResponse(200,createdUser,"user registered successfully")
});

export { registerUser };
