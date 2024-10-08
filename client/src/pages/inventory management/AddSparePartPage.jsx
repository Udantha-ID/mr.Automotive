import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { storage, ref, uploadBytes, getDownloadURL } from "./../../firebase"; // Import from updated firebase.js
import axios from "axios"; // Import axios
import { useNavigate } from "react-router-dom";

const AddSparePartPage = () => {
  const [partName, setPartName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("original");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState([
    { id: uuidv4(), key: "", value: "" },
  ]);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [units, setUnits] = useState("Pack Of");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation functions
  const validatePartName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validateSupplier = (supplier) => /^[a-zA-Z\s]+$/.test(supplier);
  const validateQuantity = (qty) => /^[1-9]\d*$/.test(qty);
  const validateCategory = (category) => /^[a-zA-Z\s]+$/.test(category);
  const validateFeatureKey = (key) => /^[a-zA-Z\s]+$/.test(key);

  const validateImage = (file) =>
    (file.type === "image/jpeg" || file.type === "image/png") &&
    file.size <= 2 * 1024 * 1024; // 2MB limit

  const handleAddFeature = () => {
    setFeatures([...features, { id: uuidv4(), key: "", value: "" }]);
  };

  const handleFeatureChange = (id, field, value) => {
    setFeatures(
      features.map((feature) =>
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    );
  };

  const handleRemoveFeature = (id) => {
    setFeatures(features.filter((feature) => feature.id !== id));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validateImage(file)) {
        setImage(file);
      } else {
        Swal.fire({
          title: "Invalid Image",
          text: "Only JPG/PNG images under 2MB are allowed.",
          icon: "error",
        });
      }
    }
  };

  const uploadImage = async (file) => {
    try {
      const imageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation before submission
    if (!validatePartName(partName)) {
      Swal.fire("Error", "Part name should contain letters only.", "error");
      return;
    }
    if (!validateSupplier(supplier)) {
      Swal.fire("Error", "Supplier name should contain letters only.", "error");
      return;
    }
    if (!validateQuantity(quantity)) {
      Swal.fire("Error", "Quantity should be a positive integer.", "error");
      return;
    }
    if (!validateCategory(category)) {
      Swal.fire("Error", "Category should contain letters only.", "error");
      return;
    }
    if (features.some((feature) => !validateFeatureKey(feature.key))) {
      Swal.fire(
        "Error",
        "Feature keys and values should contain letters only.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        imageUrl = await uploadImage(image);
        setImageURL(imageUrl);
      }

      // Send form data to backend API
      await axios.post("http://localhost:3000/api/spareparts/add", {
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

      Swal.fire({
        title: "Success!",
        text: "Spare part added successfully.",
        icon: "success",
      });
      navigate(`/inventory-management/manage-parts`);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add spare part.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-PrimaryColor min-h-screen flex justify-center items-center p-4">
      <div className="bg-PrimaryColor p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-dark text-2xl font-bold mb-6">Add Spare Part</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Spare Part Name</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Supplier</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="text-dark block mb-2">Price</label>
              <input
                type="number"
                className="w-full p-2 border border-dark rounded"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="text-dark block mb-2">Quantity</label>
              <input
                type="number"
                className="w-full p-2 border border-dark rounded"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Category</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Type</label>
            <select
              className="w-full p-2 border border-dark rounded"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="original">Original</option>
              <option value="duplicate">Duplicate</option>
              <option value="used">Used</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Units</label>
            <select
              className="w-full p-2 border border-dark rounded"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            >
              <option value="Pack Of">Pack Of</option>
              <option value="Bottle Of">Bottle Of</option>
              <option value="Pair Of">Pair Of</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Description</label>
            <textarea
              className="w-full p-2 border border-dark rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Features</label>
            {features.map((feature) => (
              <div key={feature.id} className="mb-2 flex items-center">
                <input
                  type="text"
                  className="w-1/2 p-2 border border-dark rounded"
                  placeholder="Feature Key"
                  value={feature.key}
                  onChange={(e) =>
                    handleFeatureChange(feature.id, "key", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="w-1/2 p-2 border border-dark rounded ml-2"
                  placeholder="Feature Value"
                  value={feature.value}
                  onChange={(e) =>
                    handleFeatureChange(feature.id, "value", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="ml-2 p-2 text-red-500"
                  onClick={() => handleRemoveFeature(feature.id)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-500"
              onClick={handleAddFeature}
            >
              + Add Feature
            </button>
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">
              Image (JPG/PNG max 2MB)
            </label>
            <input
              type="file"
              accept="image/jpeg, image/png"
              className="w-full p-2 border border-dark rounded"
              onChange={handleImageChange}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full p-2 border border-dark rounded ${
              loading ? "bg-gray-500" : "bg-blue-500 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Spare Part"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSparePartPage;
