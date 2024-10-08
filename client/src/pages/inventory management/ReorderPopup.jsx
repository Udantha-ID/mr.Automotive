import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const ReorderPopup = ({ isOpen, onClose, partData }) => {
  const [quantity, setQuantity] = useState("");

  const handleReorderSubmit = async () => {
    if (!quantity) {
      Swal.fire("Error", "Please enter a quantity.", "error");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/reorders", {
        partId: partData._id,
        partName: partData.partName,
        supplier: partData.supplier,
        quantity,
        status: "pending",
      });

      Swal.fire("Success", "Reorder request has been placed.", "success");
      onClose();
    } catch (error) {
      Swal.fire("Error", "Failed to place reorder request.", "error");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg p-8 max-w-lg w-full shadow-2xl relative"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Reorder Spare Part</h2>
        <p>
          <strong>Part:</strong> {partData.partName}
        </p>
        <p>
          <strong>Supplier:</strong> {partData.supplier}
        </p>

        <label className="block mt-4 text-dark">Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full p-2 mt-2 border border-dark rounded-md"
        />

        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleReorderSubmit}
          >
            Place Reorder
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReorderPopup;
