import mongoose from "mongoose";

const reorderRequestSchema = new mongoose.Schema({
  partId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SparePart",
    required: true,
  },
  partName: { type: String },
  supplier: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approve","reject"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ReorderRequest", reorderRequestSchema);
