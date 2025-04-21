import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import dbConnect from "@/config/db";

export async function GET(request) {
  try {
    await dbConnect();
    const { userId } = getAuth(request);
    const IsSeller = await authSeller(userId);
    if (!IsSeller) {
      return NextResponse.json({
        success: false,
        message: "not authorized",
      });
    }
    const products = await Product.find({});
    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
