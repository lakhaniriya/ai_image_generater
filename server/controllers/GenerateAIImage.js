
import axios from "axios";
import cloudinary from "../config/cloudinary.js";
import { createError } from "../error.js";

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return next(createError(400, "Prompt is required"));
    }

    // Pollinations image URL
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt
    )}?width=1024&height=1024&nologo=true`;

    // Download generated image
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    // Convert to base64 data URI
    const base64Image = Buffer.from(imageResponse.data).toString("base64");
    const dataUri = `data:image/png;base64,${base64Image}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "ai-images",
      resource_type: "image",
    });

    return res.status(200).json({
      success: true,
      photo: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("Generate image error:", error.message);
    return next(createError(500, error.message || "Failed to generate image"));
  }
};