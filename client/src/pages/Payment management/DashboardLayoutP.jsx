import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import Header from "./Header";
import { Route, Routes } from "react-router-dom";

import DashboardOverview from "./DashboardOverview";
import AddPaymentPage from "./AddPaymentPage";
import ManagePayment from "./ManagePayment";
import PaymentReport from "./PaymentReport";
import ManageEmployeeSal from "./ManageEmployeeSal";

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
          <Route path="/add-payment" element={<AddPaymentPage />} />
          <Route
            path="/manage-payment"
            element={<ManagePayment />}
          />
           <Route
            path="/manage-EmployeeSalarypayment"
            element={<ManageEmployeeSal />}
          />
          <Route path="/payment-report" element={<PaymentReport />} />
        </Routes>
      </motion.main>
    </div>
  );
}
