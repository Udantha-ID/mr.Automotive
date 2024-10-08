import React, { useEffect, useState } from "react";
import axios from "axios";

const RequestedReorders = () => {
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

  

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
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
            <tr key={reorder._id} className="border-b border-secondary">
              {/* <td className="p-4 text-dark">{reorder.partName}</td> */}
              <td className="p-4 text-dark">{reorder.supplier}</td>
              <td className="p-4 text-dark">{reorder.quantity}</td>
              <td className="p-4 text-dark">{reorder.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestedReorders;
