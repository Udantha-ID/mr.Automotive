import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Scrollbars } from "react-custom-scrollbars";

const UpdateReqItemPopup = ({ isOpen, onClose, requestItemData }) => {
  const [requestID, setRequestID] = useState(requestItemData?.requestID || "");
  const [supplierName, setSupplierName] = useState(requestItemData?.supplierName || "");
  const [requestDate, setRequestDate] = useState(requestItemData?.requestDate || "");
  const [itemName, setItemName] = useState(requestItemData?.itemName || "");
  const [brand, setBrand] = useState(requestItemData?.brand || "");
  const [quantity, setQuantity] = useState(requestItemData?.quantity || "");
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(requestItemData?._id || ""); // Track the current ID

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/suppliers');
        setSuppliers(response.data.data.filter(supplier => supplier.status === 'approved'));
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    const fetchParts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/spareparts");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching parts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
    fetchParts();
  }, []);

  useEffect(() => {
    if (requestItemData) {
      setRequestID(requestItemData.requestID || "");
      setSupplierName(requestItemData.supplierName || "");
      setRequestDate(requestItemData.requestDate || "");
      setItemName(requestItemData.itemName || "");
      setBrand(requestItemData.brand || "");
      setQuantity(requestItemData.quantity || "");
      setCurrentId(requestItemData._id || ""); // Update current ID
    }
  }, [requestItemData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:3000/requestItems/${currentId}`, {
        requestID,
        supplierName,
        requestDate,
        itemName,
        brand,
        quantity,
      });

      Swal.fire({
        title: "Success!",
        text: "Request item updated successfully.",
        icon: "success",
      });

      onClose(); // Close the popup after update
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update request item.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-dark text-2xl font-bold mb-6">Update Request Item</h2>
          <Scrollbars style={{ height: "70vh" }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="text-dark block mb-2">Request ID</label>
                <input
                  type="text"
                  className="w-full p-2 border border-dark rounded"
                  value={requestID}
                  onChange={(e) => setRequestID(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="text-dark block mb-2">Supplier Name</label>
                <select
                  className="w-full p-2 border border-dark rounded"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier.SupplierName}>
                      {supplier.SupplierName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="text-dark block mb-2">Request Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-dark rounded"
                  value={requestDate}
                  onChange={(e) => setRequestDate(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="text-dark block mb-2">Item Name</label>
                <select
                  className="w-full p-2 border border-dark rounded"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Item</option>
                  {items.map((item) => (
                    <option key={item._id} value={item.itemName}>
                      {item.partName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="text-dark block mb-2">Brand</label>
                <input
                  type="text"
                  className="w-full p-2 border border-dark rounded"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="text-dark block mb-2">Quantity</label>
                <input
                  type="number"
                  className="w-full p-2 border border-dark rounded"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full p-2 border border-dark rounded ${loading ? "bg-gray-500" : "bg-blue-500 text-white"}`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Request Item"}
              </button>
              <button
                type="button"
                className="mt-4 w-full p-2 border border-dark rounded bg-red-500 text-white"
                onClick={onClose}
              >
                Cancel
              </button>
            </form>
          </Scrollbars>
        </div>
      </div>
    )
  );
};

export default UpdateReqItemPopup;
