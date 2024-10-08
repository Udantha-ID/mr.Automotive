import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";

import DashboardOverview from "./DashboardOverview";
import AddSupplierPage from "./AddSupplierPage";
import ManageSupplier from "./ManageSupplier";
import AddRequestItemPage from "./AddRequestItemPage";
import ManageRequestItem from "./ManageRequestItem";

const contentVariants = {
  open: { marginLeft: 250, transition: { type: "spring", stiffness: 50 } },
  closed: { marginLeft: 0, transition: { type: "spring", stiffness: 50 } },
};

export default function DashboardLayouSt() {
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
          <Route path="/" element={<DashboardOverview />} />
          <Route path="/add-supplier" element={<AddSupplierPage />} />
          <Route path="/add-request-item" element={<AddRequestItemPage />} />
          <Route path="/manage-request-item" element={<ManageRequestItem />} />
          <Route path="/manage-supplier" element={<ManageSupplier />} />
        </Routes>
      </motion.main>
    </div>
  );
}
