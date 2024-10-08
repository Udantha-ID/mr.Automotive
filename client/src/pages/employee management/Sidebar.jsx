import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBox,
  FaClipboardList,
  FaTags,
  FaChartLine,
  FaUserCircle,
} from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { Delete, SaveAltSharp } from "@mui/icons-material";

const sidebarVariants = {
  open: {
    width: "250px",
    transition: { type: "spring", stiffness: 50 },
  },
  closed: {
    width: "0px",
    transition: { type: "spring", stiffness: 50 },
  },
};

const contentVariants = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: { opacity: 1, transition: { delay: 0.3, duration: 0.3 } },
};

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(location.pathname);

  // Menu items configuration
  const menuItems = [
    {
      name: "Employee Dashboard",
      path: "/employee-management/",
      icon: <FaBox />,
    },
    {
      name: "Attandenc Dashboard",
      path: "/employee-management/attendence",
      icon: <FaClipboardList />,
    },
    {
      name: "Salary Dashboard",
      path: "/employee-management/salary",
      icon: <FaTags />,
    },
    {
      name: "Download Report",
      path: "generate-reports",
      icon: <SaveAltSharp />,
    },
    {
      name: "Delete Employee",
      path: "delete-employee",
      icon: <Delete />,
    },
  ];

  

  return (
    <motion.aside
      className="bg-SecondaryColor h-screen fixed left-0 top-0 shadow-lg overflow-hidden z-20"
      variants={sidebarVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
    >
      <motion.div
        className="p-4"
        variants={contentVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
      >
        <h2 className="text-2xl font-bold text-ExtraDarkColor mb-8 mt-10">
          Dashboard
        </h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center text-DarkColor p-2 rounded-lg hover:text-ExtraDarkColor hover:bg-DarkColor transition-colors duration-300 ${
                  selected === item.path
                    ? "bg-PrimaryColor text-DarkColor "
                    : ""
                }`}
                onClick={() => setSelected(item.path)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}

          {/* LogOut Button */}
          <li>
            <button
              className="flex items-center text-DarkColor p-2 rounded-lg hover:text-ExtraDarkColor hover:bg-DarkColor transition-colors duration-300 w-full"
              onClick={() => navigate("/")}
            >
              <span className="mr-3">
                <IoIosLogOut />
              </span>
              LogOut
            </button>
          </li>
        </ul>
      </motion.div>
    </motion.aside>
  );
}
