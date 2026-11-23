import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary is configured with actual credentials, upload to Cloudinary
    if (
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== "your_cloudinary_api_key" &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_API_SECRET !== "your_cloudinary_api_secret"
    ) {
      const uploadResult = await uploadToCloudinary(buffer, "bk-photography");
      return NextResponse.json({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        format: uploadResult.format,
      });
    }

    // Demo / fallback mode for local testing before user sets their Cloudinary credentials:
    // Convert to base64 data URI so preview and database save work instantly!
    const base64 = `data:${file.type || "image/jpeg"};base64,${buffer.toString("base64")}`;
    return NextResponse.json({
      url: base64,
      publicId: "demo-" + Date.now(),
      format: file.type.split("/")[1] || "jpeg",
      isDemo: true,
      message: "Uploaded in demo mode. Configure Cloudinary keys in .env.local for production CDN storage.",
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload image" },
      { status: 500 }
    );
  }
}
