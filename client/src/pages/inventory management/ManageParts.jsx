import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaEye, FaExclamationTriangle } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import UpdateItemPopup from "./UpdateItemPopup";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ManageParts = () => {
  const [parts, setParts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [totalParts, setTotalParts] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [chartData, setChartData] = useState({ pieData: [], barData: [] });

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/spareparts");
      setParts(response.data);
      setTotalParts(response.data.length);
      const lowStockCount = response.data.filter(
        (part) => part.quantity < 20
      ).length;
      setLowStockItems(lowStockCount);
      generateChartData(response.data, lowStockCount);
    } catch (error) {
      console.error("Error fetching parts:", error);
      Swal.fire("Error", "Failed to fetch spare parts", "error");
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (data, lowStockCount) => {
    const pieData = [
      { name: "Low Stock", value: lowStockCount },
      { name: "Normal Stock", value: data.length - lowStockCount },
    ];

    const barData = [
      {
        name: "Original Parts",
        count: data.filter((part) => part.type === "original").length,
      },
      {
        name: "Duplicate Parts",
        count: data.filter((part) => part.type === "duplicate").length,
      },
      {
        name: "Used Parts",
        count: data.filter((part) => part.type === "used").length,
      },
    ];

    setChartData({ pieData, barData });
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/spareparts/search?q=${e.target.value}`
      );
      setParts(response.data);
    } catch (error) {
      console.error("Error searching parts:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:3000/api/spareparts/delete/${id}`
          );
          Swal.fire("Deleted!", "Spare part has been deleted.", "success");
          fetchParts();
        } catch (error) {
          Swal.fire("Error!", "Failed to delete spare part.", "error");
        }
      }
    });
  };

  const handleUpdate = (part) => {
    setSelectedPart(part);
    setShowUpdatePopup(true);
  };

  const handleOverview = (part) => {
    setSelectedPart(part);
  };

  const renderFeatures = (features) => {
    return features.map((feature, index) => (
      <li key={index} className="text-sm text-gray-600">
        {`${feature.key}: ${feature.value}`}
      </li>
    ));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-gray-800 text-3xl mb-8 font-bold">
        Manage Spare Parts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Parts</h2>
          <p className="text-3xl font-bold text-blue-600">{totalParts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Low Stock Items</h2>
          <p className="text-3xl font-bold text-red-600">{lowStockItems}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Normal Stock Items</h2>
          <p className="text-3xl font-bold text-green-600">
            {totalParts - lowStockItems}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Stock Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Parts by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search parts..."
        className="w-full mb-6 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={searchQuery}
        onChange={handleSearch}
      />

      {loading ? (
        <LoadingSpinner />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-x-auto"
        >
          <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-teal-400 text-white">
                <th className="p-4 text-left font-semibold">Part</th>
                <th className="p-4 text-left font-semibold">Type</th>
                <th className="p-4 text-left font-semibold">Price</th>
                <th className="p-4 text-left font-semibold">Quantity</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((part) => (
                <motion.tr
                  key={part._id}
                  className={`border-b border-gray-200 transition duration-200 ${
                    part.quantity < 20 ? "bg-red-100" : ""
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="p-4 flex items-center space-x-4">
                    <img
                      src={part.imageUrl}
                      alt={part.partName}
                      className="w-12 h-12 object-cover rounded shadow-md transform transition duration-300 hover:scale-105"
                    />
                    <div>
                      <span className="text-gray-800 font-medium">
                        {part.partName}
                      </span>
                      <p className="text-sm text-gray-600">{part.supplier}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 capitalize">{part.type}</td>
                  <td className="p-4 text-gray-600">Rs {part.price}</td>
                  <td className="p-4 text-gray-600">
                    {part.quantity}
                    {part.quantity < 20 && (
                      <div className="flex items-center text-red-600 mt-1 animate-bounce">
                        <FaExclamationTriangle className="mr-1" />
                        <span className="text-xs">Low stock</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button
                      className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition duration-300 text-sm"
                      onClick={() => handleUpdate(part)}
                    >
                      <FaEdit className="mr-1" /> Update
                    </button>
                    <button
                      className="flex items-center bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300 text-sm"
                      onClick={() => handleDelete(part._id)}
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                    <button
                      className="flex items-center bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition duration-300 text-sm"
                      onClick={() => handleOverview(part)}
                    >
                      <FaEye className="mr-1" /> View
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Item Overview Popup */}
      <AnimatePresence>
        {selectedPart && !showUpdatePopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPart(null)}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-3xl w-full shadow-2xl relative"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl text-gray-800 mb-6 font-bold border-b border-gray-300 pb-2">
                {selectedPart.partName}
              </h2>
              <div className="flex space-x-6">
                <div className="w-1/3">
                  <img
                    src={selectedPart.imageUrl}
                    alt={selectedPart.partName}
                    className="w-full h-auto object-cover rounded shadow-lg"
                  />
                </div>
                <div className="w-2/3 pl-4 space-y-4">
                  <p>
                    <strong>Supplier:</strong> {selectedPart.supplier}
                  </p>
                  <p>
                    <strong>Price:</strong> Rs {selectedPart.price}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {selectedPart.quantity}
                  </p>
                  <p>
                    <strong>Category:</strong> {selectedPart.category}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedPart.type}
                  </p>
                  <p>
                    <strong>Units:</strong> {selectedPart.units}
                  </p>
                  <div>
                    <h3 className="text-lg mb-2 font-semibold">Features:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {renderFeatures(selectedPart.features)}
                    </ul>
                  </div>
                </div>
              </div>
              <button
                className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedPart(null)}
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Item Popup */}
      <AnimatePresence>
        {showUpdatePopup && (
          <UpdateItemPopup
            isOpen={showUpdatePopup}
            onClose={() => setShowUpdatePopup(false)}
            partData={selectedPart}
            onUpdate={fetchParts}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageParts;
