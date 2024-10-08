import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { storage, ref, uploadBytes, getDownloadURL } from "./../../firebase"; // Import from updated firebase.js
import axios from "axios"; // Import axios
import { Scrollbars } from "react-custom-scrollbars";

const UpdateItemPopup = ({ isOpen, onClose, partData }) => {
  const [partName, setPartName] = useState(partData?.partName || "");
  const [supplier, setSupplier] = useState(partData?.supplier || "");
  const [price, setPrice] = useState(partData?.price || "");
  const [quantity, setQuantity] = useState(partData?.quantity || "");
  const [category, setCategory] = useState(partData?.category || "");
  const [type, setType] = useState(partData?.type || "original");
  const [description, setDescription] = useState(partData?.description || "");
  const [features, setFeatures] = useState(
    partData?.features || [{ id: uuidv4(), key: "", value: "" }]
  );
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(partData?.imageUrl || "");
  const [units, setUnits] = useState(partData?.units || "Pack Of");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (partData) {
      setPartName(partData.partName || "");
      setSupplier(partData.supplier || "");
      setPrice(partData.price || "");
      setQuantity(partData.quantity || "");
      setCategory(partData.category || "");
      setType(partData.type || "original");
      setDescription(partData.description || "");
      setFeatures(partData.features || [{ id: uuidv4(), key: "", value: "" }]);
      setImageURL(partData.imageUrl || "");
      setUnits(partData.units || "Pack Of");
    }
  }, [partData]);

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
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
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
    setLoading(true);
    try {
      let updatedImageURL = imageURL;
      if (image) {
        updatedImageURL = await uploadImage(image);
        setImageURL(updatedImageURL);
      }

      // Send updated data to backend API
      await axios.put(
        `http://localhost:3000/api/spareparts/update/${partData._id}`,
        {
          partName,
          supplier,
          price,
          quantity,
          category,
          type,
          description,
          features,
          imageUrl: updatedImageURL,
          units,
        }
      );

      Swal.fire({
        title: "Success!",
        text: "Spare part updated successfully.",
        icon: "success",
      });
      window.location.reload();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update spare part.",
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
          <h2 className="text-dark text-2xl font-bold mb-6">
            Update Spare Part
          </h2>
          <Scrollbars style={{ height: "70vh" }}>
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
                      className="ml-2 text-red-500"
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
                  Add Feature
                </button>
              </div>
              <div className="mb-4">
                <label className="text-dark block mb-2">Image</label>
                <input
                  type="file"
                  className="w-full p-2 border border-dark rounded"
                  onChange={handleImageChange}
                />
              </div>
              <button
                type="submit"
                className={`w-full p-2 border border-dark rounded ${
                  loading ? "bg-gray-500" : "bg-blue-500 text-white"
                }`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Spare Part"}
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

export default UpdateItemPopup;
