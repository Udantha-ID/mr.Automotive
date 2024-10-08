import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const UpdateSupplier = ({ isOpen, onClose, supplierData }) => {
  const [supplierName, setSupplierName] = useState(supplierData?.SupplierName || "");
  const [Companyname, setCompanyname] = useState(supplierData?.Companyname || "");
  const [itemNo, setItemNo] = useState(supplierData?.ItemNo || "");
  const [itemName, setItemName] = useState(supplierData?.ItemName || "");
  const [contactNo, setContactNo] = useState(supplierData?.ContactNo || "");
  const [email, setEmail] = useState(supplierData?.Email || "");
  const [address, setAddress] = useState(supplierData?.Address || "");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState(supplierData?._id || ""); // Track the current ID

  useEffect(() => {
    const fetchParts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/spareparts");
        setItems(response.data); // Store fetched items in state
      } catch (error) {
        console.error("Error fetching parts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  useEffect(() => {
    if (supplierData) {
      setSupplierName(supplierData.SupplierName || "");
      setCompanyname(supplierData.Companyname || "");
      setItemNo(supplierData.ItemNo || "");
      setItemName(supplierData.ItemName || "");
      setContactNo(supplierData.ContactNo || "");
      setEmail(supplierData.Email || "");
      setAddress(supplierData.Address || "");
      setCurrentId(supplierData._id || ""); // Update current ID
    }
  }, [supplierData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`http://localhost:3000/suppliers/${currentId}`, {
        SupplierName: supplierName,
        Companyname,
        ItemNo: itemNo,
        ItemName: itemName,
        ContactNo: contactNo,
        Email: email,
        Address: address,
      });

      Swal.fire({
        title: "Success!",
        text: "Supplier updated successfully.",
        icon: "success",
      });

      onClose(); // Close the popup after update
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update supplier.",
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
          <h2 className="text-dark text-2xl font-bold mb-6">Update Supplier</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-dark block mb-2">Supplier Name</label>
              <input
                type="text"
                className="w-full p-2 border border-dark rounded"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-dark block mb-2">Company Name</label>
              <input
                type="text"
                className="w-full p-2 border border-dark rounded"
                value={Companyname}
                onChange={(e) => setCompanyname(e.target.value)}
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
              <label className="text-dark block mb-2">Contact Number</label>
              <input
                type="text"
                className="w-full p-2 border border-dark rounded"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-dark block mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-dark rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-dark block mb-2">Address</label>
              <textarea
                className="w-full p-2 border border-dark rounded"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="3"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full p-2 border border-dark rounded ${loading ? "bg-gray-500" : "bg-blue-500 text-white"}`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Supplier"}
            </button>
            <button
              type="button"
              className="mt-4 w-full p-2 border border-dark rounded bg-red-500 text-white"
              onClick={onClose}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default UpdateSupplier;
