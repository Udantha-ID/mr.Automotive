import mongoose from "mongoose";

const sparePartSchema = new mongoose.Schema({
  item: [
    {
      name: {
        type: String,
        required: [true, "Product Name Required"],
      },
      quantity: {
        type: Number,
        required: [true, "Product Quantity Required"],
        default: 1,
      },
    },
  ],
  description: { type: String },
  status: { type: String, default: "Pending" },
});

export default mongoose.model("sparePartSchema", sparePartSchema);
