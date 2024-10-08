import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";

import DashboardOverview from "./DashboardOverview";

import BookingManagement from "../../pages/bookings/BookingManagement";
import ShowAllPackages from "../../pages/packageManagement/ShowAllPackages";
import CreatePackage from "../../pages/packageManagement/CreatePackage";
import UpdatePackage from "../../pages/packageManagement/UpdatePackage";
import ModificationManagement from "../../pages/modificationManagement/ModificationManagement";
const contentVariants = {
  open: { marginLeft: 250, transition: { type: "spring", stiffness: 50 } },
  closed: { marginLeft: 0, transition: { type: "spring", stiffness: 50 } },
};

export default function AdminDashboard() {
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
          <Route path="/book" element={<BookingManagement />} />
          <Route path="/pkg" element={<ShowAllPackages />} />
          <Route path="/add-pkg" element={<CreatePackage />} />
          <Route path="/upd/:id" element={<UpdatePackage />} />
          <Route path="/mod" element={<ModificationManagement />} />
        </Routes>
      </motion.main>
    </div>
  );
}
