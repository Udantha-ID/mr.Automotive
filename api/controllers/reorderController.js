import ReorderRequest from "../model/ReorderRequest.js";
import SparePart from "../model/SparePart.model.js";
/*
export const createReorderRequest = async (req, res) => {
  try {
    const newReorder = new ReorderRequest(req.body);
    await newReorder.save();
    res.status(201).json(newReorder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/


export const createReorderRequest = async (req, res) => {
  try {
    // Fetch the partName from SparePart model using partId
    const sparePart = await SparePart.findById(req.body.partId);
    if (!sparePart) {
      return res.status(404).json({ message: "Spare part not found" });
    }

    // Include partName in the reorder request
    const newReorder = new ReorderRequest({
      ...req.body,
      partName: sparePart.partName, // Set partName from SparePart model
    });

    await newReorder.save();
    res.status(201).json(newReorder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

////////


export const getLowStockItems = async (req, res) => {
  try {
    const lowStockParts = await SparePart.find({ quantity: { $lt: 20 } });
    res.status(200).json(lowStockParts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching low stock items." });
  }
};

/*
export const getReorders = async (req, res) => {
  try {
    const reorders = await ReorderRequest.find();
    res.status(200).json(reorders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/

export const getReorders = async (req, res) => {
  try {
    // Populate partId to get partName from SparePart model
    const reorders = await ReorderRequest.find().populate("partId", "partName");
    res.status(200).json(reorders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
////////

export const updateReorderStatus = async (req, res) => {
  const { id } = req.params;  // Get the reorderRequestId from the URL params
  const { status } = req.body;  // Get the status from the request body

  try {
    // Find the reorder request by its ID and update the status
    const updatedReorder = await ReorderRequest.findByIdAndUpdate(
      id, 
      { status },  // Update the status field
      { new: true }  // Return the updated document
    );

    if (!updatedReorder) {
      return res.status(404).json({ message: "Reorder request not found "  });
    }

    res.status(200).json(updatedReorder);  // Return the updated reorder request
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteReorderRequest = async (req, res) => {
  const { id } = req.params;  // Get the reorderRequestId from the URL params

  try {
    // Find the reorder request by its ID and delete it
    const deletedReorder = await ReorderRequest.findByIdAndDelete(id);

    if (!deletedReorder) {
      return res.status(404).json({ message: "Reorder request not found" });
    }

    res.status(200).json({ message: "Reorder request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
