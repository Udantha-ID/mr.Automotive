import mongoose from "mongoose";

const requestItemSchema = new mongoose.Schema(
  {
    requestID: {
      type: String,
      required: true,
      unique: true,
    },
    supplierName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      
  },
    requestDate: {
      type: Date,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['processing', 'received', 'failed'],
      default: 'processing'
  }
  },
  { timestamps: true } // Enable createdAt and updatedAt fields
);

export const RequestItem = mongoose.model("RequestItem", requestItemSchema);
