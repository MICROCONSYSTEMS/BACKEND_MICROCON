import mongoose from "mongoose";

const orderCounterSchema = new mongoose.Schema({
  financialYear: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 }
});

export const OrderCounter = mongoose.model("OrderCounter", orderCounterSchema);
