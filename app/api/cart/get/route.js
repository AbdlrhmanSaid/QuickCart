import dbConnect from "@/config/db";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/User";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    await dbConnect();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { cartItems } = user;

    return NextResponse.json({ cartItems }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
