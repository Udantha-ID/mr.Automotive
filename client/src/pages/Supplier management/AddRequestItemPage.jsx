import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import emailjs from "emailjs-com";

const AddRequestItemPage = () => {
  const [requestID, setRequestID] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/suppliers");
        setSuppliers(
          response.data.data.filter((supplier) => supplier.status === "approved")
        );
      } catch (error) {
        console.error("Error fetching suppliers:", error);
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

  const sendEmailToCustomer = (reqitem) => {
    const emailConfig = {
      serviceID: "service_3p901v6",
      templateID: "template_cwl7ahv",
      userID: "-r5ctVwHjzozvGIfg",
    };

    emailjs
      .send(
        emailConfig.serviceID,
        emailConfig.templateID,
        {
          to_email: reqitem.Email, // Corrected email key here
          subject: `Request item for ${reqitem.itemName}`,
          message: `
          Dear ${reqitem.supplierName},

          We want the following items immediately!

          ReqItem Summary:
          - Item Name: ${reqitem.itemName}
          - Brand Name: ${reqitem.brand}
          - Quantity: ${reqitem.quantity}
          - Date of request: ${reqitem.requestDate}

          Please confirm the delivery date and we will send the Money as soon as possible.

          Best regards,
          Mr. Automotive Team
        `,
        },
        emailConfig.userID
      )
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Email sent successfully!",
          showConfirmButton: true,
          timer: 2000,
        });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error sending email!",
          showConfirmButton: true,
          timer: 2000,
        });
      });
  };

  const handleSupplierChange = (e) => {
    const selectedSupplierName = e.target.value;
    setSupplierName(selectedSupplierName);

    const selectedSupplier = suppliers.find(
      (supplier) => supplier.SupplierName === selectedSupplierName
    );

    if (selectedSupplier) {
      setSupplierEmail(selectedSupplier.Email);
    } else {
      setSupplierEmail("");
    }
  };

  const clearForm = () => {
    setRequestID("");
    setSupplierName("");
    setRequestDate("");
    setItemName("");
    setBrand("");
    setQuantity("");
    setSupplierEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const reqitem = {
      requestID,
      supplierName,
      requestDate,
      itemName,
      brand,
      quantity,
      Email: supplierEmail,
    };

    try {
      await axios.post("http://localhost:3000/requestItems/", reqitem);
      Swal.fire({
        title: "Success!",
        text: "Request item added successfully.",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Send Email?",
            text: "Do you want to send a confirmation email to the supplier?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, send it",
            cancelButtonText: "No, skip",
          }).then((emailResult) => {
            if (emailResult.isConfirmed) {
              sendEmailToCustomer(reqitem);
            }
          });
        }
      });

      clearForm();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add request item.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-PrimaryColor min-h-screen flex justify-center items-center p-4">
      <div className="bg-SecondaryColor p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-dark text-3xl font-bold mb-6 bg-gray-800 text-white">
          Add Request Item
        </h2>
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
              onChange={handleSupplierChange}
              required
            >
              <option value="" disabled>
                Select Supplier
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier.SupplierName}>
                  {supplier.SupplierName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="text-dark block mb-2">Supplier Email</label>
            <input
              type="email"
              className="w-full p-2 border border-dark rounded"
              value={supplierEmail}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Request Date</label>
            <input
              type="date"
              className="w-full p-2 border border-dark rounded"
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
              min={todayDate}
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
            <label className="text-dark block mb-2">Brand</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={brand}
              onChange={(e) => {
                const value = e.target.value.trim();
                const regex = /^[A-Za-z\s]*$/;
                if (regex.test(value)) {
                  setBrand(value);
                }
              }}
            />
          </div>

          <div className="mb-4">
            <label className="text-dark block mb-2">Quantity</label>
            <input
              type="number"
              className="w-full p-2 border border-dark rounded"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={1}
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
            {loading ? "Adding..." : "Add Request Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRequestItemPage;
