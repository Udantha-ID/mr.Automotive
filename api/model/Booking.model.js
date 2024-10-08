import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    package: {
      pkgName: {
        type: String,
      },
      pkgID: {
        type: String,
      },
      pkgDes: {
        type: String,
      },
      pkgPrice: {
        type: Number,
      },
    },
    cusName: {
      type: String,
      reqired: true,
    },
    cusEmail: {
      type: String,
      reqired: true,
    },
    cusMobile: {
      type: String,
      reqired: true,
    },
    vehNum: {
      type: String,
      reqired: true,
    },
    vType: {
      type: String,
      reqired: true,
    },
    milage: {
      type: Number,
      reqired: true,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BookingModel", bookingSchema);
