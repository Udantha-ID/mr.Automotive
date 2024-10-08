import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";
import ManageParts from "./ManageParts";
import DashboardOverview from "./DashboardOverview";
import AddSparePartPage from "./AddSparePartPage";
import InventoryReport from "./InventoryReport";
import ReorderSpareParts from "./ReorderSpareParts";
import RequestedParts from "./RequestedParts";

const contentVariants = {
  open: { marginLeft: 250, transition: { type: "spring", stiffness: 50 } },
  closed: { marginLeft: 0, transition: { type: "spring", stiffness: 50 } },
};

export default function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="relative min-h-screen bg-PrimaryColor">
      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 bg-ExtraDarkColor text-SecondaryColor p-2 rounded-full shadow-md"
        onClick={toggleSidebar}
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar Component */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <motion.main
        className="flex-1 ml-0 transition-all"
        variants={contentVariants}
        animate={isOpen ? "open" : "closed"}
      >
        <Header />

        {/* Routes for Dashboard Components */}
        <Routes>
          <Route path="/" element={<ManageParts />} />

          <Route path="/add-parts" element={<AddSparePartPage />} />

          <Route path="/inventory-report" element={<InventoryReport />} />
          <Route path="/reorder" element={<ReorderSpareParts />} />
          <Route path="/requested-parts" element={<RequestedParts />} />
        </Routes>
      </motion.main>
    </div>
  );
}
