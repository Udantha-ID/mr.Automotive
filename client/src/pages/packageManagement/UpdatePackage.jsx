import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { storage, ref, uploadBytes, getDownloadURL } from "./../../firebase"; 
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdatePackage = () => {
  const navigate = useNavigate();
  const [pkgID, setPkgId] = useState("");
  const [pkgName, setPkgName] = useState("");
  const [pkgDes, setPkgDes] = useState("");
  const [pkgPrice, setPkgPrice] = useState("");
  const [pkgImg, setPkgImg] = useState(null);
  const [pkgExp, setPkgExp] = useState("");
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

        // Set package data
        setPkgId(data.pkgID);
        setPkgName(data.pkgName);
        setPkgDes(data.pkgDes);
        setPkgExp(data.pkgExp ? new Date(data.pkgExp).toISOString().split("T")[0] : "");
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
        pkgExp,
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
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="p-8 rounded-lg shadow-lg max-w-2xl w-full">
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
              className="w-full p-2 border rounded"
              value={pkgName}
              onChange={(e) => {
                const textOnlyRegex = /^[A-Za-z\s]*$/;
                const inputValue = e.target.value;

                if (textOnlyRegex.test(inputValue)) {
                  setPkgName(inputValue);
                }
              }}
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

          <div className="mb-4">
            <label className="text-dark block mb-2">Expire Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={pkgExp}
              onChange={(e) => setPkgExp(e.target.value)}
              min={new Date().toISOString().split("T")[0]} 
              required
            />
            {formErrors.pkgExp && (
              <span className="text-red-500 text-sm">{formErrors.pkgExp}</span>
            )}
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="text-dark block mb-2">Price</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={pkgPrice}
                onChange={(e) => {
                  const value = e.target.value;

                  const isValid = /^\d*(\.\d{0,2})?$/.test(value);

                  if (isValid && Number(value) >= 0) {
                    setPkgPrice(value);
                  }
                }}
                min="0"
                step="0.01"
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
              <div key={pkg.id}>
                <div className="mb-2 flex items-center">
                  <input
                    type="text"
                    className="w-1/2 p-2 border border-dark rounded"
                    placeholder={`Service Name #${index + 1}`}
                    value={pkg.name}
                    onChange={(e) =>
                      handleServiceChange(pkg.id, "name", e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(pkg.id)}
                    className="ml-2 p-2 text-white bg-red-500 rounded"
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
              onClick={handleAddService}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Add Service
            </button>
          </div>

          <div className="mb-4">
            <label className="text-dark block mb-2">Upload Image</label>
            <input type="file" onChange={handleImageChange} />
            {pkgImg && <p>Image: {pkgImg.name}</p>}
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded"
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
