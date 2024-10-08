import React from "react";
import { motion } from "framer-motion";
import { FaBox, FaChartLine } from "react-icons/fa";

const inventoryData = [
  { id: 1, partName: "Brake Pads", quantity: 50, price: "$30" },
  { id: 2, partName: "Oil Filter", quantity: 120, price: "$15" },
  { id: 3, partName: "Air Filter", quantity: 85, price: "$20" },
  { id: 4, partName: "Spark Plug", quantity: 150, price: "$8" },
  { id: 5, partName: "Headlights", quantity: 30, price: "$100" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashboardOverview() {
  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-ExtraDarkColor">
          Manager Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <button className="bg-DarkColor text-white px-4 py-2 rounded-md shadow hover:bg-ExtraDarkColor transition-colors duration-300">
            Package Management
          </button>
          <button className="bg-DarkColor text-white px-4 py-2 rounded-md shadow hover:bg-ExtraDarkColor transition-colors duration-300">
            Add Inventory
          </button>
        </div>
      </div>

      {/* Inventory Summary Cards */}
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
              Total Parts
            </h2>
            <p className="text-2xl font-semibold text-DarkColor">435</p>
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
            <h2 className="text-lg font-bold text-ExtraDarkColor">Low Stock</h2>
            <p className="text-2xl font-semibold text-DarkColor">12 Parts</p>
          </div>
        </motion.div>
      </div>

      {/* Inventory Table */}
      <div className="mt-12 bg-SecondaryColor p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-ExtraDarkColor mb-6">
          Inventory Details
        </h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-DarkColor text-white">
            <tr>
              <th className="py-3 px-5 text-left">Part Name</th>
              <th className="py-3 px-5 text-left">Quantity</th>
              <th className="py-3 px-5 text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-PrimaryColor transition-colors duration-300"
              >
                <td className="py-3 px-5 text-ExtraDarkColor">
                  {item.partName}
                </td>
                <td className="py-3 px-5 text-ExtraDarkColor">
                  {item.quantity}
                </td>
                <td className="py-3 px-5 text-ExtraDarkColor">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
