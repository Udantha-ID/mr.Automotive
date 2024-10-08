import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { FaBox, FaChartLine, FaEdit } from "react-icons/fa";
import UpdateRequestItemPopup from './UpdateReqItemPopup'; // Make sure path is correct

const ShowSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [requestItems, setRequestItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Added state for selected item

  const [reorders, setReorders] = useState([]);

  useEffect(() => {
    fetchReorders();
  }, []);

  const fetchReorders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/reorder/get");
      setReorders(response.data);
    } catch (error) {
      console.error("Error fetching reorder requests:", error);
    }
  };
  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:3000/suppliers')
      .then((response) => {
        setSuppliers(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching suppliers");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchRequestItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/requestItems');
        setRequestItems(response.data || []); // Ensure requestItems is an array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching request items:', error);
        setError("Error fetching request items");
        setLoading(false);
      }
    };

    fetchRequestItems();
  }, []);

  const handleApprove = async (id) => {
    try {
      const supplierToApprove = suppliers.find((supplier) => supplier._id === id);

      if (supplierToApprove) {
        await axios.put(`http://localhost:3000/suppliers/${id}/status`, {
          status: 'approved'
        });

        setSuppliers((prevSuppliers) =>
          prevSuppliers.map((supplier) =>
            supplier._id === id ? { ...supplier, status: 'approved' } : supplier
          )
        );
      }
    } catch (error) {
      setError("Error approving supplier");
    }
  };


  const handleDecline = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/suppliers/${id}`);

      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier._id !== id)
      );
    } catch (error) {
      setError("Error declining supplier");
    }
  };

  const handleUpdate = (item) => {
    setSelectedItem(item);
    setShowUpdatePopup(true);
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await axios.put(`http://localhost:3000/requestItems/${itemId}/status`, {
        status: newStatus
      });

      setRequestItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      setError("Error updating request item status");
    }
  };

  const handleinvenoryStatusChange = async (itemId, newStatus) => {
    try {
      // Send PUT request to update only the status
      await axios.put(`http://localhost:3000/api/reorder/updateReorderStatus/${itemId}`, {
        status: newStatus,
      });

      // Update the local reorders state
      setReorders((prevReorders) =>
        prevReorders.map((reorder) =>
          reorder._id === itemId ? { ...reorder, status: newStatus } : reorder
        )
      );
    } catch (error) {
      setError("Error updating reorder status");
      console.error('Error updating reorder status:', error);
    }
  };


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Filter approved suppliers for the Manager Dashboard
  const approvedSuppliers = suppliers.filter(
    (supplier) => supplier.status === "approved"
  );

  // Filter request items with status "processing"
  const processingItems = requestItems.filter(
    (item) => item.status === "processing"
  );

  // Calculate the number of request items
  const requestItemCount = processingItems.length;

  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-ExtraDarkColor">
          Manager Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <button className="bg-DarkColor text-white px-4 py-2 rounded-md shadow hover:bg-ExtraDarkColor transition-colors duration-300">
            Generate Report
          </button>
          <button className="bg-DarkColor text-white px-4 py-2 rounded-md shadow hover:bg-ExtraDarkColor transition-colors duration-300">
            Add Supplier
          </button>
        </div>
      </div>

      {/* Supplier Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
          className="bg-SecondaryColor p-6 rounded-lg shadow-lg flex items-center space-x-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FaBox className="text-3xl text-DarkColor" />
          <div>
            <h2 className="text-lg font-bold text-ExtraDarkColor">
              Total Approved Suppliers
            </h2>
            <p className="text-2xl font-semibold text-DarkColor">
              {approvedSuppliers.length}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-SecondaryColor p-6 rounded-lg shadow-lg flex items-center space-x-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FaChartLine className="text-3xl text-DarkColor" />
          <div>
            <h2 className="text-lg font-bold text-ExtraDarkColor">Request Items</h2>
            <p className="text-2xl font-semibold text-DarkColor">{requestItemCount}</p>
          </div>
        </motion.div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center mt-6 text-DarkColor">Loading...</div>
      ) : error ? (
        <div className="text-center mt-6 text-red-500">{error}</div>
      ) : (
        <>
          {/* Supplier Details */}
          <div className="mt-12 bg-SecondaryColor p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-ExtraDarkColor mb-6">
              Supplier Details
            </h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-DarkColor text-white">
                <tr>
                  <th className="py-3 px-5 text-left">Supplier ID</th>
                  <th className="py-3 px-5 text-left">Supplier Name</th>
                  <th className="py-3 px-5 text-left">Status</th>
                  <th className="py-3 px-5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr
                    key={supplier._id}
                    className="border-b hover:bg-PrimaryColor transition-colors duration-300"
                  >
                    <td className="py-3 px-5 text-ExtraDarkColor">
                      {supplier.SupplierID}
                    </td>
                    <td className="py-3 px-5 text-ExtraDarkColor">
                      {supplier.SupplierName}
                    </td>
                    <td className="py-3 px-5 text-ExtraDarkColor">
                      {supplier.status || "Pending"}
                    </td>
                    <td className="py-3 px-5 text-ExtraDarkColor">
                      {supplier.status === "approved" || supplier.status === "declined" ? (
                        <span>{supplier.status}</span>
                      ) : (
                        <>
                          <button
                            className="bg-green-500 text-white px-3 py-1 rounded-md mr-2"
                            onClick={() => handleApprove(supplier._id)}
                          >
                            Approve
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded-md"
                            onClick={() => handleDecline(supplier._id)}
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Request Item Details */}
          <div className="mt-12 bg-SecondaryColor p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-ExtraDarkColor mb-6">
              Request Item Details
            </h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-DarkColor text-white">
                <tr>
                  {/* <th className="py-3 px-5 text-left">Request ID</th> */}
                  <th className="py-3 px-5 text-left">Supplier Name</th>
                  <th className="py-3 px-5 text-left">Item Name</th>
                  <th className="py-3 px-5 text-left">Brand</th>
                  <th className="py-3 px-5 text-left">Quantity</th>
                  <th className="py-3 px-5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {processingItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-PrimaryColor transition-colors duration-300"
                  >
                    {/* <td className="py-3 px-5 text-ExtraDarkColor">
                      {item.requestID}
                    </td> */}
                    <td className="py-3 px-5 text-ExtraDarkColor">
                      {item.supplierName}
                    </td>
                    <td className="py-3 px-5 text-ExtraDarkColor">
                      {item.itemName}
                    </td>
                    <td className="py-3 px-5 text-ExtraDarkColor">
                      {item.brand}
                    </td>
                    <td className="py-3 px-5 text-ExtraDarkColor">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-5 text-ExtraDarkColor">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md mr-2"
                        onClick={() => handleStatusChange(item._id, 'received')}
                      >
                        Received
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                        onClick={() => handleStatusChange(item._id, 'failed')}
                      >
                        Failed
                      </button>
                      <button
                        onClick={() => handleUpdate(item)}
                        className="text-green-500 hover:text-green-700 mr-2"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* from inventory request */}
          <div className="mt-12 bg-SecondaryColor p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-ExtraDarkColor mb-6">
              Inventory manager Request Item Details
            </h2>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
                  {/* <th className="p-4 text-left font-semibold border-b border-gray-300">
              Part
            </th> */}
                  <th className="p-4 text-left font-semibold border-b border-gray-300">
                    Supplier
                  </th>
                  <th className="p-4 text-left font-semibold border-b border-gray-300">
                    Quantity
                  </th>
                  <th className="p-4 text-left font-semibold border-b border-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {reorders.map((reorder) => (
                  <tr
                    key={reorder._id}
                    className="border-b hover:bg-PrimaryColor transition-colors duration-300"
                  >
                    <td className="py-3 px-5 text-ExtraDarkColor">
                      {reorder.supplier}
                    </td>
                    <td className="py-3 px-5 text-ExtraDarkColor">
                      {reorder.quantity}
                    </td>

                    <td className="py-3 px-5 text-ExtraDarkColor">
                      <select
                        className="bg-gray-200 text-black px-3 py-1 rounded-md mr-2"
                        onChange={(e) => handleinvenoryStatusChange(reorder._id, e.target.value)}  // Send selected value on change
                        value={reorder.status}  // Set the current status as the selected value
                      >
                        <option value="pending">Pending</option>  {/* Default status option */}
                        <option value="approve">Completed</option>  {/* Status option for approved */}
                        <option value="reject">Failed</option>  {/* Status option for rejected */}
                      </select>

                      {/* <button
                        onClick={() => handleUpdate(item)}
                        className="text-green-500 hover:text-green-700 mr-2"
                      >
                        <FaEdit />
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Update Item Popup */}
      <AnimatePresence>
        {showUpdatePopup && selectedItem && (
          <UpdateRequestItemPopup
            isOpen={showUpdatePopup}
            onClose={() => setShowUpdatePopup(false)}
            requestItemData={selectedItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowSupplier;
