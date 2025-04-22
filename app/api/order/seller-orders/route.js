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
        { message: "Unauthorized access" },
        { status: 403 }
      );
    }

    await dbConnect();

    // التعديل 1: إضافة تصفية أولية للطلبات
    const orders = await Order.find({})
      .populate({
        path: "address",
        model: "Address",
      })
      .populate({
        path: "items.product",
        model: "Product",
        match: { userId: userId },
      })
      .lean(); // تحويل النتيجة إلى object عادي

    // التعديل 2: معالجة أكثر أمانًا للبيانات
    const filteredOrders = orders
      .map((order) => ({
        ...order,
        items: order.items.filter(
          (item) => item.product && item.product.userId === userId
        ),
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
    console.error("Server error details:", error);
    return NextResponse.json(
      { message: "Internal server error - " + error.message },
      { status: 500 }
    );
  }
}
