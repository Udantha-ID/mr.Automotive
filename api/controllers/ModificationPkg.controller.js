import ModiificationModel from "../model/Modiification.model.js";
import mongoose from "mongoose";

export const createModificationPkg = async (req, res) => {
  try {
    const mainPkg = new ModiificationModel(req.body);
    await mainPkg.save();
    res.status(201).json({ message: "Modification Pkg Created successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to Create a  new Modification Pkg",
      error: error.message,
    });
  }
};

export const getAllModificationPkg = async (req, res) => {
  try {
    const mainPkgs = await ModiificationModel.find();
    res.status(200).json(mainPkgs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Fetching ModificationPkg Data", error });
  }
};

export const getModificationPkg = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
      const mainPkg = await ModiificationModel.findById(id);
      if (mainPkg) {
        return res.status(200).json(mainPkg);
      }
    }
    res.status(404).json({ message: "mainPkg not found" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error fetching mainPkg: " + error.message });
  }
};

export const deleteModificationPkg = async (req, res) => {
  const { id } = req.params;
  try {
    await ModiificationModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Maintance PKG Sucessfully Deleated" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleating Maintance PKG" });
  }
};

export const updateModificationPkg = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const mainPkg = await ModiificationModel.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true,
      }
    );
    res.status(200).json(mainPkg);
  } catch (error) {
    res.status(500).json({ message: "Error Updating Maintance Log", error });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const response = await ModiificationModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModificationByEmail = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const modPkg = await ModiificationModel.find({
      customerEmail: email.toLowerCase(),
    });

    if (modPkg.length === 0) {
      return res
        .status(404)
        .json({ message: "No modPkg found for this email" });
    }

    res.status(200).json(modPkg);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching Bookings Data", error });
  }
};
