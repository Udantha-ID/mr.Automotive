import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { storage, ref, uploadBytes, getDownloadURL } from "./../../firebase"; // Import from updated firebase.js
import axios from "axios";

const CreateModificationPkg = () => {
  const [pkgID, setPkgId] = useState("");
  const [pkgName, setPkgName] = useState("");
  const [pkgDes, setPkgDes] = useState("");
  const [pkgPrice, setPkgPrice] = useState("");
  const [pkgImg, setPkgImg] = useState(null);
  const [pkgServ, setPkgServ] = useState([
    {
      id: uuidv4(),
      key: "",
      name: "",
    },
  ]);

  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddService = () => {
    setPkgServ([...pkgServ, { id: uuidv4(), key: "", value: "" }]);
  };

  const handleServiceChange = (id, field, value) => {
    setPkgServ(
      pkgServ.map((feature) =>
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    );
  };

  const handleRemoveFeature = (id) => {
    setPkgServ(pkgServ.filter((feature) => feature.id !== id));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setPkgImg(e.target.files[0]);
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

  const generatePkgId = () => {
    const id = `P${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;
    setPkgId(id);
  };

  useEffect(() => {
    generatePkgId();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = "";
      if (pkgImg) {
        imageUrl = await uploadImage(pkgImg);
        setImageURL(imageUrl);
      }

      // Send form data to backend API
      await axios.post("http://localhost:3000/api/maintance/addMod", {
        pkgID,
        pkgName,
        pkgDes,
        pkgPrice,
        imageURL,
        pkgServ,
      });
      console.log(imageURL);
      Swal.fire({
        title: "Success!",
        text: "Spare part added successfully.",
        icon: "success",
      });
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
    <div className="bg-primary min-h-screen flex justify-center items-center p-4">
      <div className="bg-secondary p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-dark text-2xl font-bold mb-6">
          Create Maintance Packages
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Package Id</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={pkgID}
              readOnly
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Package Name</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={pkgName}
              onChange={(e) => setPkgName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Description</label>
            <textarea
              className="w-full p-2 border border-dark rounded"
              value={pkgDes}
              onChange={(e) => setPkgDes(e.target.value)}
              rows="3"
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="text-dark block mb-2">Price</label>
              <input
                type="number"
                className="w-full p-2 border border-dark rounded"
                value={pkgPrice}
                onChange={(e) => setPkgPrice(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-dark block mb-2">Services</label>
            {pkgServ.map((pkg) => (
              <div key={pkg.id} className="mb-2 flex items-center">
                <input
                  type="text"
                  className="w-1/2 p-2 border border-dark rounded"
                  placeholder="Service Id"
                  value={pkg.key}
                  onChange={(e) =>
                    handleServiceChange(pkg.id, "key", e.target.value)
                  }
                />
                <input
                  type="text"
                  className="w-1/2 p-2 border border-dark rounded ml-2"
                  placeholder="Service Name"
                  value={pkg.name}
                  onChange={(e) =>
                    handleServiceChange(pkg.id, "name", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveFeature(pkg.id)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-500"
              onClick={handleAddService}
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
            {loading ? "Adding..." : "Add Spare Part"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateModificationPkg;
