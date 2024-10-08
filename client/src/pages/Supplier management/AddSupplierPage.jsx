import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import NavBar from "../../components/NavBar";
import { Navigate } from "react-router-dom";

const AddSupplierPage = () => {
  const [supplierName, setSupplierName] = useState("");
  const [Companyname, setCompanyname] = useState("");
  const [itemNo, setItemNo] = useState("");
  const [itemName, setItemName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([]); // State for storing items
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParts();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation: Ensure name doesn't contain numbers
    const namePattern = /^[a-zA-Z\s]+$/; // Allows only letters and spaces
    if (!namePattern.test(supplierName)) {
      Swal.fire({
        title: "Invalid Name",
        text: "Supplier name should not contain numbers.",
        icon: "warning",
      });
      setLoading(false);
      return;
    }

    // Validation: Ensure contact number is exactly 10 digits
    if (contactNo.length !== 10 || isNaN(contactNo)) {
      Swal.fire({
        title: "Invalid Contact Number",
        text: "Contact number must be exactly 10 digits.",
        icon: "warning",
      });
      setLoading(false);
      return;
    }

    try {
      // Send supplier data to backend API
      await axios.post("http://localhost:3000/suppliers/", {
        SupplierName: supplierName,
        ItemNo: itemNo,
        ItemName: itemName,
        ContactNo: contactNo,
        Email: email,
        Address: address,
        Companyname
      });

      Swal.fire({
        title: "Success!",
        text: "Supplier added successfully.",
        icon: "success",
      });

      // Clear the form fields after successful submission
      setSupplierName("");
      setItemNo("");
      setItemName("");
      setContactNo("");
      setEmail("");
      setAddress("");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add supplier.",
        icon: "error",
      });
    } finally {
      setLoading(false);
      Navigate("/");
    }
  };

  return (
    <div className="bg-PrimaryColor min-h-screen flex justify-center items-center p-4">
      <div className="bg-SecondaryColor p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-center text-3xl font-bold mb-6 text-black">
          Supplier Registration
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-dark block mb-2">Supplier Name</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={supplierName}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only letters and spaces
                const regex = /^[A-Za-z\s]*$/;
                if (regex.test(value)) {
                  setSupplierName(value);
                }
              }}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Supplier Name</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={Companyname}
              onChange={(e) => {
                setCompanyname(e.target.value)

              }}
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
              <option value="" disabled>
                Select Item
              </option>
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
              type="Number"
              className="w-full p-2 border border-dark rounded"
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              maxLength={10} // Set max length to 10 digits

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
            className={`w-full p-2 border border-dark rounded ${loading ? "bg-gray-500" : "bg-yellow-500 text-white"
              }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Reg Supplier"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierPage;
