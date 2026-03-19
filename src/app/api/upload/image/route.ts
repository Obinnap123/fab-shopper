import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

type UploadResult = {
  url: string;
  publicId: string;
};

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("file").filter((file) => file instanceof File) as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const uploads = await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise<UploadResult>((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "fab-shopper/products" },
          (error, response) => {
            if (error || !response) {
              reject(error ?? new Error("Upload failed"));
              return;
            }
            resolve({ url: response.secure_url, publicId: response.public_id });
          }
        );
        upload.end(buffer);
      });

      return result;
    })
  );

  return NextResponse.json({ data: uploads }, { status: 201 });
}
