import mongoose from "mongoose";

const modificationPkgSchema = new mongoose.Schema(
  {
    modID: {
      type: String,
    },
    customerId: {
      type: String,
    },
    customerName: {
      type: String,
    },
    customerEmail: {
      type: String,
    },
    vehicleModel: {
      type: String,
    },
    vehicleNumber: {
      type: String,
    },
    modificationType: {
      type: String,
    },
    additionalNote: {
      type: String,
    },
    date: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ModificationPkgModel", modificationPkgSchema);
