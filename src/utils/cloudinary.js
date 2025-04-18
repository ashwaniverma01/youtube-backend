import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key:process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_SECRET 
});


const uploadOnCloudinary=async (localFilePath)=>{
    try{
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        // console.log("File is uploaded on cloudinary",response.url);
        //when file is successfully uploaded on cloudinary then unlink the file from local storage
        fs.unlinkSync(localFilePath)
        // console.log("Response: ",response);
        return response;
        }
        catch(error){
            fs.unlinkSync(localFilePath)
            return true;
        }
    }
    export {uploadOnCloudinary}
