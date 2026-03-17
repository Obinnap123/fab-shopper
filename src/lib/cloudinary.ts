import { v2 as cloudinary } from "cloudinary";
import { requiredEnv } from "@/lib/env";

cloudinary.config({
  cloud_name: requiredEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
  api_key: requiredEnv("CLOUDINARY_API_KEY"),
  api_secret: requiredEnv("CLOUDINARY_API_SECRET")
});

export { cloudinary };
