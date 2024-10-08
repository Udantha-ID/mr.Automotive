import mongoose from "mongoose";

const sparePartSchema = new mongoose.Schema({
  partName: { type: String, required: true },
  supplier: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true },
  type: {
    type: String,
    enum: ["original", "duplicate", "used"],
    default: "original",
  },
  description: { type: String },
  features: [
    {
      key: String,
      value: String,
    },
  ],
  imageUrl: { type: String },
  units: { type: String, required: true },
});

export default mongoose.model("SparePart", sparePartSchema);
