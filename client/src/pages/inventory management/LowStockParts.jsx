import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";

const LowStockParts = () => {
  const [lowStockParts, setLowStockParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [showReorderPopup, setShowReorderPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchLowStockParts();
  }, []);

  const fetchLowStockParts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/reorder/low-stock"
      );
      setLowStockParts(response.data);
    } catch (error) {
      console.error("Error fetching low stock parts:", error);
    }
  };

  const handleReorder = (part) => {
    setSelectedPart(part);
    setShowReorderPopup(true);
  };








  const sendEmailToSupplier = () => {
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
          to_email: "konarashan@gmail.com", // Supplier email
          to_name: "Supplier Manager", // Supplier's name
          part_name: selectedPart.partName, // Part name
          supplier_name: selectedPart.supplier, // Supplier name
          quantity: quantity, // Quantity to reorder
          message: `
            Dear Supplier Manager,
  
            I want to reorder the following items to fulfill the low stock. Please check your order:
  
            - Part Name: ${selectedPart.partName}
            - Supplier: ${selectedPart.supplier}
            - Quantity: ${quantity}
  
            Thank you for your assistance!
  
            Best regards,
            [Your Name]
            [Your Position] (Optional)
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
  












  const placeReorder = async () => {
    
    try {
      const response = await axios.post(
        "http://localhost:3000/api/reorder/reorder",
        {
          partId: selectedPart._id,
          supplier: selectedPart.supplier,
          quantity,
        }
      );
      Swal.fire("Success", response.data.message, "success");



      Swal.fire({
        title: "Send Email?",
        text: "Do you want to send a confirmation email to the supplier?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, send it",
        cancelButtonText: "No, skip",
      }).then((emailResult) => {
        if (emailResult.isConfirmed) {
          sendEmailToSupplier(); // Call the updated email function
        }
      });




      setShowReorderPopup(false);
      fetchLowStockParts();
    } catch (error) {
      Swal.fire("Error", "Failed to place reorder request.", "error");
    }
  };

  return (
    <div className="bg-PrimaryColor min-h-screen p-8">
      <h1 className="text-extra-dark text-3xl mb-8 font-bold">
        Low Stock Parts
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto"
      >
        <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-teal-400 text-white">
              <th className="p-4 text-left font-semibold border-b border-gray-300">
                Part
              </th>
              <th className="p-4 text-left font-semibold border-b border-gray-300">
                Supplier
              </th>
              <th className="p-4 text-left font-semibold border-b border-gray-300">
                Quantity
              </th>
              <th className="p-4 text-left font-semibold border-b border-gray-300">
                Reorder
              </th>
            </tr>
          </thead>
          <tbody>
            {lowStockParts.map((part) => (
              <motion.tr
                key={part._id}
                className="border-b border-secondary transition duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="p-4 text-dark">{part.partName}</td>
                <td className="p-4 text-dark">{part.supplier}</td>
                <td className="p-4 text-dark">{part.quantity}</td>
                <td className="p-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    onClick={() => handleReorder(part)}
                  >
                    Reorder
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <AnimatePresence>
        {showReorderPopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl relative"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">
                Reorder {selectedPart?.partName}
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Supplier
                </label>
                <input
                  type="text"
                  value={selectedPart?.supplier}
                  readOnly
                  className="w-full border border-gray-300 p-2 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-md"
                  min="1"
                />
              </div>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                onClick={placeReorder}
              >
                Place Reorder
              </button>
              <button
                className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800"
                onClick={() => setShowReorderPopup(false)}
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LowStockParts;
