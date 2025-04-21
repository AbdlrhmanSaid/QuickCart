import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/Product";
import { inngest } from "@/config/inngest";
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { items, address } = await request.json();
    if (!address || items.length === 0) {
      return NextResponse.json({
        success: false,
        message: "invalid data",
      });
    }
    // calculate total amount
    const amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return acc + product.offerPrice * item.quantity;
    }, 0);
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.2),
        date: Date.now(),
      },
    });
    // clear cart
    const user = await User.findById(userId);
    user.cart = {};
    await user.save();
    return NextResponse.json({
      success: true,
      message: "order Placed",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
