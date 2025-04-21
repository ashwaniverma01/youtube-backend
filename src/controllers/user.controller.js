import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndToken=async(userId)=>{
try {
  const user = await User.findById(userId)
  const accessToken = await user.generateAccessToken()
  const refreshToken = await user.generateRefreshToken()
 // store refreshToken in database
  user.refreshToken=refreshToken
  //save refreshToken in database
  await user.save({validateBeforeSave:false})
  return {accessToken,refreshToken}
  
} catch (error) {
  throw new ApiError(500,"something went wrong while generates access and refresh token")
  
}
}


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

  const { fullName, email, username, password } = req.body;

//   console.log("email:", email);

  // Validate required fields
  if ([fullName, email, username, password].some(field => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Get file paths
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload images to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar?.url) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary");
  }

  // Create user
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // Retrieve user without password and refreshToken
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Return response
  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});
//req body->data
//username, email
//find user
//password check
//access and refresh token
//send cookie
const loginUser = asyncHandler(async (req, res)=>{
  const {email, password, username} = req.body
  if(!username || !email){
    throw new ApiError(400,"username and email is required")
  }
  const user = await User.findOne({
    $or: [{username},{email}]
  })


  if(!user){
    throw new ApiError(404, "user does not exist")
  }


  const isPasswordValid = await user.isPasswordCorrect(password)

  if(!isPasswordValid){
    throw new ApiError(402, "Invalid User Credentials")
  }

  const {accessToken, refreshToken} = await generateAccessAndToken(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  
  //send cookies design some options
  const options = {
    httpOnly:true,
    secure:true
  }

  return res.status(201)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(200, 
    {
      user:loggedInUser, accessToken, refreshToken
    },
    "User Logged In Successfully"
  )
  )


  
  
  

})

const logoutUser = asyncHandler(async (req, res)=>{
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }

  )
  const options={
    httpOnly:true,
    secure:true
  }
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged out"))

})

export { 
  registerUser, 
  loginUser,
  logoutUser
};
