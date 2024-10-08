import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center space-x-2 mt-10">
    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
  </div>
);

const StatusCard = ({ title, count, icon: Icon, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 ${color}`}>
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <Icon className="h-4 w-4 text-gray-500" />
    </div>
    <p className="text-2xl font-bold">{count}</p>
  </div>
);

const RequestedParts = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/spreq/get");
        setSpareParts(response.data);
        updateStats(response.data);
      } catch (error) {
        console.error("Error fetching spare parts", error);
        Swal.fire("Error", "Error fetching spare parts", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSpareParts();
  }, []);

  const updateStats = (data) => {
    const newStats = data.reduce(
      (acc, part) => {
        acc.total++;
        acc[part.status.toLowerCase()]++;
        return acc;
      },
      { total: 0, approved: 0, pending: 0, rejected: 0 }
    );
    setStats(newStats);
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingStatus(id);
    try {
      await axios.put(`http://localhost:3000/api/spreq/${id}/status`, {
        status: newStatus,
      });
      setSpareParts((prevParts) =>
        prevParts.map((part) =>
          part._id === id ? { ...part, status: newStatus } : part
        )
      );
      updateStats(
        spareParts.map((part) =>
          part._id === id ? { ...part, status: newStatus } : part
        )
      );
      Swal.fire("Success", "Status updated successfully", "success");
    } catch (error) {
      console.error("Error updating status", error);
      Swal.fire("Error", "Failed to update status", "error");
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const getStatusRowStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Requested Spare Parts</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatusCard
          title="Total Requests"
          count={stats.total}
          icon={() => <span>📋</span>}
          color="bg-blue-100"
        />
        <StatusCard
          title="Approved"
          count={stats.approved}
          icon={() => <span>✅</span>}
          color="bg-green-100"
        />
        <StatusCard
          title="Pending"
          count={stats.pending}
          icon={() => <span>⏳</span>}
          color="bg-yellow-100"
        />
        <StatusCard
          title="Rejected"
          count={stats.rejected}
          icon={() => <span>⚠️</span>}
          color="bg-red-100"
        />
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">Item Name</th>

                <th className="px-4 py-2 text-left">Requested Items</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(spareParts) && spareParts.length > 0 ? (
                spareParts.map((part) => (
                  <motion.tr
                    key={part._id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${getStatusRowStyle(
                      part.status
                    )} border-b hover:bg-gray-50 transition-colors duration-150`}
                  >
                    <td className="px-4 py-2">
                      {part.item.map((i) => i.name).join(", ")}
                    </td>

                    <td className="px-4 py-2">
                      <ul className="list-disc pl-5">
                        {part.item.map((i, index) => (
                          <li key={index}>
                            {i.name} - Quantity: {i.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-2">
                      <div className="relative inline-block w-48">
                        {updatingStatus === part._id ? (
                          <LoadingSpinner />
                        ) : (
                          <select
                            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                            value={part.status}
                            onChange={(e) =>
                              handleStatusChange(part._id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center">
                    No spare parts available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestedParts;
