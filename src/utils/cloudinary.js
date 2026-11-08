
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Configure Cloudinary when the upload function runs
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("Cloudinary upload successful:", response.secure_url);

        // Delete local file after successful upload
        fs.unlinkSync(localFilePath);

        return response.secure_url;

    } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        return null;
    }
};

export default uploadToCloudinary;
