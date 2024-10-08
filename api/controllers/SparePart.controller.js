import SparePart from "../model/SparePart.model.js";

export const createSparePart = async (req, res) => {
  try {
    const {
      partName,
      supplier,
      price,
      quantity,
      category,
      type,
      description,
      features,
      imageUrl,
      units,
    } = req.body;

    const sparePart = new SparePart({
      partName,
      supplier,
      price,
      quantity,
      category,
      type,
      description,
      features,
      imageUrl,
      units,
    });

    await sparePart.save();

    res
      .status(201)
      .json({ message: "Spare part added successfully", sparePart });
  } catch (error) {
    res.status(500).json({ message: "Error adding spare part", error });
  }
};

// Get all spare parts
export const getAllSpareParts = async (req, res) => {
  try {
    const spareParts = await SparePart.find();
    res.status(200).json(spareParts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching spare parts", error });
  }
};

// Update spare part by ID
export const updateSparePart = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPart = await SparePart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Spare part updated successfully", updatedPart });
  } catch (error) {
    res.status(500).json({ message: "Error updating spare part", error });
  }
};

// Delete spare part by ID
export const deleteSparePart = async (req, res) => {
  try {
    const { id } = req.params;
    await SparePart.findByIdAndDelete(id);
    res.status(200).json({ message: "Spare part deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting spare part", error });
  }
};

// Search spare parts by query
export const searchSpareParts = async (req, res) => {
  try {
    const { q } = req.query;
    const parts = await SparePart.find({
      partName: { $regex: q, $options: "i" }, // Case-insensitive search
    });
    res.status(200).json(parts);
  } catch (error) {
    res.status(500).json({ message: "Error searching spare parts", error });
  }
};

export const getOnePart = async (req, res) => {
  try {
    const sparePart = await SparePart.findById(req.params.id);
    if (!sparePart) {
      return res.status(404).json({ message: "Spare part not found" });
    }
    res.json(sparePart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
