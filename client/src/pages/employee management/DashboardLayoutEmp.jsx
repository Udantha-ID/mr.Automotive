import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

import EmployeeDashboard from "./EmployeeDashboard";
import AttendenceDashbord from "./AttendenceDashbord";
import DeleteEmployeeDashboard from "./DeleteEmployeeDashboard";
import SalaryDashboard from "./SalaryDashboard";
import GenerateReports from "./GenerateSalaryReaport";

function DashboardLayoutEmp() {
  const [isOpen, setIsOpen] = useState(true);  // Corrected

  const toggleSidebar = () => setIsOpen(!isOpen);

  const contentVariants = {
    open: { marginLeft: "250px" }, // Example of how it changes when open
    closed: { marginLeft: "0px" }, // Example of how it changes when closed
  };

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

      <Header></Header>

      {/* Main Content */}
      <motion.main
        className="flex-1 ml-0 transition-all"
        variants={contentVariants}
        animate={isOpen ? "open" : "closed"}
      >
        {/* Routes for Dashboard Components */}
        <Routes>
            <Route path="/" element={<EmployeeDashboard />} />
            <Route path="/attendence" element={<AttendenceDashbord />} />
            <Route path="/salary" element={<SalaryDashboard />} />
            <Route path="/delete-employee" element={<DeleteEmployeeDashboard />} />
            <Route path="/generate-reports" element={<GenerateReports />} />
           
        </Routes>
      </motion.main>
    </div>
  );
}

export default DashboardLayoutEmp;
