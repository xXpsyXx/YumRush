import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true },
    status: { type: String, default: "placed" },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
