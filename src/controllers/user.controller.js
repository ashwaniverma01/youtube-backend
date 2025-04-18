import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
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

export { registerUser };
