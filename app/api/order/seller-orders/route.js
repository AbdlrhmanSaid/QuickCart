import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import dbConnect from "@/config/db";
import Order from "@/models/Orders";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { message: "You are not a seller" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get orders where products belong to the current seller
    const orders = await Order.find({})
      .populate("address")
      .populate({
        path: "items.product",
        match: { userId: userId }, // التعديل هنا: استخدام userId بدل seller
      });

    // تصفية الطلبات التي تحتوي على منتجات البائع الحالي
    const filteredOrders = orders
      .map((order) => ({
        ...order.toObject(),
        items: order.items.filter((item) => item.product !== null),
      }))
      .filter((order) => order.items.length > 0);

    return NextResponse.json(
      {
        success: true,
        orders: filteredOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
