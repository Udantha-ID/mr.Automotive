import SpareReqModel from "../model/SpareReq.model.js";

export const createSpareReq = async (req, res) => {
  try {
    const spareReq = new SpareReqModel(req.body);
    await spareReq.save();
    res.status(201).json({ message: "Spare Part Requested Successfully" });
  } catch (error) {}
};

export const getAllSparePartsRequests = async (req, res) => {
  try {
    const spareParts = await SpareReqModel.find();
    res.status(200).json(spareParts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updateStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const sparePart = await SpareReqModel.findById(req.params.id);
    if (!sparePart) {
      return res.status(404).json({ message: "Spare part not found" });
    }

    sparePart.status = status;
    await sparePart.save();
    res.status(200).json({ message: "Status updated successfully", sparePart });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
