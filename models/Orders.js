import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, required: true },
    },
  ],
  amount: { type: Number, required: true },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "address",
    required: true,
  },
  status: { type: String, default: "Order Placed", required: true },
  date: { type: Date, required: true },
});

// Create or get the Order model
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
