// import {v2 as cloudinary} from 'cloudinary'

// const connectCloudinary = async()=>{
    
//     cloudinary.config({
//         cloud_name:process.env.CLOUDINARY_NAME,
//         api_key:process.env.CLOUDINARY_API_KEY,
//         api_secret:process.env.CLOUDINARY_SECRET_KEY,
//     })

// }

// export default connectCloudinary

import { v2 as cloudinary } from "cloudinary";

let isConfigured = false;

export const connectCloudinary = () => {
  if (!isConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });

    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error("Cloudinary ENV not loaded at runtime");
    }

    isConfigured = true;
  }

  return cloudinary;
};
