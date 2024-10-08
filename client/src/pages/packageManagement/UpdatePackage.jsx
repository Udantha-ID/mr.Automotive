import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { storage, ref, uploadBytes, getDownloadURL } from "./../../firebase"; // Import from updated firebase.js
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdatePackage = () => {
  const navigate = useNavigate();
  const [pkgID, setPkgId] = useState("");
  const [pkgName, setPkgName] = useState("");
  const [pkgDes, setPkgDes] = useState("");
  const [pkgPrice, setPkgPrice] = useState("");
  const [pkgImg, setPkgImg] = useState(null);
  const [pkgServ, setPkgServ] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/maintance/get/${id}`
        );
        const data = response.data;
        setPkgId(data.pkgID);
        setPkgName(data.pkgName);
        setPkgDes(data.pkgDes);
        setPkgPrice(data.pkgPrice);
        setPkgServ(data.pkgServ || []);
        setImageURL(data.imageURL || "");
      } catch (error) {
        console.error("Error fetching package data:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to fetch package details.",
          icon: "error",
        });
      }
    };

    fetchPackageData();
  }, [id]);

  const handleAddService = () => {
    setPkgServ([...pkgServ, { id: uuidv4(), key: "", name: "" }]);
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

  const validateForm = () => {
    const errors = {};
    const textOnlyRegex = /^[A-Za-z\s]+$/;

    if (!pkgName) {
      errors.pkgName = "Package name is required";
    } else if (!textOnlyRegex.test(pkgName)) {
      errors.pkgName = "Package name can only contain letters and spaces";
    }

    pkgServ.forEach((service, index) => {
      if (!service.name) {
        errors[
          `serviceName${index}`
        ] = `Service name is required for service #${index + 1}`;
      } else if (!textOnlyRegex.test(service.name)) {
        errors[
          `serviceName${index}`
        ] = `Service name can only contain letters and spaces for service #${
          index + 1
        }`;
      }
    });

    if (!pkgPrice) {
      errors.pkgPrice = "Package price is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in the required fields.",
        icon: "error",
      });
      return;
    }
    setLoading(true);
    try {
      let imageUrl = imageURL;
      if (pkgImg) {
        imageUrl = await uploadImage(pkgImg);
        setImageURL(imageUrl);
      }

      await axios.put(`http://localhost:3000/api/maintance/update/${id}`, {
        pkgID,
        pkgName,
        pkgDes,
        pkgPrice,
        imageURL: imageUrl,
        pkgServ,
      });

      Swal.fire({
        title: "Success!",
        text: "Package updated successfully.",
        icon: "success",
      });
      navigate("/admin/pkg");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update package.",
        icon: "error",
      });
      navigate("/admin/pkg");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen flex justify-center items-center p-4">
      <div className=" p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-dark text-2xl font-bold mb-6">Update Package</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Package Id</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={pkgID}
              onChange={(e) => setPkgId(e.target.value)}
              required
              readOnly
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
            {formErrors.pkgName && (
              <span className="text-red-500 text-sm">{formErrors.pkgName}</span>
            )}
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
              {formErrors.pkgPrice && (
                <span className="text-red-500 text-sm">
                  {formErrors.pkgPrice}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-dark block mb-2">Services</label>
            {pkgServ.map((pkg, index) => (
              <div>
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
                {formErrors[`serviceName${index}`] && (
                  <span className="text-red-500 text-sm">
                    {formErrors[`serviceName${index}`]}
                  </span>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-blue-500"
              onClick={handleAddService}
            >
              Add Service
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
            {loading ? "Updating..." : "Update Package"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePackage;
