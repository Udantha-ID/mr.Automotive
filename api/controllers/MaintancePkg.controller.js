import MaintancePkgModel from "../model/MaintancePkg.model.js";
import mongoose from "mongoose";

export const createMaintancePkg = async (req, res) => {
  try {
    const mainPkg = new MaintancePkgModel(req.body);
    await mainPkg.save();
    res.status(201).json({ message: "Maintance Pkg Created successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to Create a  new Maintance Pkg",
      error: error.message,
    });
  }
};

export const getAllMaintancePkg = async (req, res) => {
  try {
    const mainPkgs = await MaintancePkgModel.find();
    res.status(200).json(mainPkgs);
  } catch (error) {
    res.status(500).json({ message: "Error Fetching mainPkgs Data", error });
  }
};

export const getMaintancePkg = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
      const mainPkg = await MaintancePkgModel.findById(id);
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

export const deleteMaintancePkg = async (req, res) => {
  const { id } = req.params;
  try {
    await MaintancePkgModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Maintance PKG Sucessfully Deleated" });
  } catch (error) {
    res.status(500).json({ message: "Error Deleating Maintance PKG" });
  }
};

export const updateMaintancePkg = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const mainPkg = await MaintancePkgModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json(mainPkg);
  } catch (error) {
    res.status(500).json({ message: "Error Updating Maintance Log", error });
  }
};
