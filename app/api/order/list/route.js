import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "@/config/db";
import Address from "@/models/Address";
import Product from "@/models/Product";
import Order from "@/models/Orders";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();
    const { userId } = getAuth(request);

    const orders = await Order.find({ userId })
      .populate("items.product")
      .populate("address");

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
