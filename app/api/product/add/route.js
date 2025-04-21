import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";
import Product from "@/models/Product";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const IsSeller = await authSeller(userId);
    if (!IsSeller) {
      return NextResponse.json({
        success: false,
        message: "not authorized",
      });
    }
    const formData = await request.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const offerPrice = formData.get("offerPrice");
    const files = formData.getAll("images");

    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No images provided",
      });
    }
    const result = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          stream.end(buffer);
        });
      })
    );
    const images = result.map((res) => res.secure_url);
    await dbConnect();
    const newProduct = new Product({
      userId: userId,
      name: name,
      description: description,
      price: Number(price),
      offerPrice: Number(offerPrice),
      images: images,
      category: category,
      date: Date.now(),
    });
    await newProduct.save();
    return NextResponse.json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error in product upload:", error); // <-- أضف دي
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
