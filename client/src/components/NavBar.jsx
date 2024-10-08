import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NavBar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // await axios.post("http://localhost:3000/api/auth/signout");

      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("email");

      navigate("/home");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center fixed min-w-full z-50">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Mr.Automotive</h1>
      </div>
      <ul className="flex space-x-6">
        {[
          "Home",
          "Booking",
          "Service",
          "Product",
          "Reg As Supplier",
        ].map((item) => (
          <li key={item} className="hover:text-yellow-400">
            <a href={`/${item}`}>{item}</a>
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-4 relative">
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-1 border border-gray-300 rounded-md"
        />
        <button className="bg-yellow-400 p-2 rounded-full">
          <i className="fas fa-search">Search</i>
        </button>

        {token ? (
          <div
            className="relative p-2"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
            />

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-20">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-200">
                    <a href="/payments">Payment</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200">
                    <a href="/bookings">Bookings</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200">
                    <a href="/modreq">Modification Requests</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200">
                    <a href={email === "admin@gmail.com" ? "/admin" : " "}>
                      Profile
                    </a>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-200">
                    <button onClick={handleLogout}>Logout</button>{" "}
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <a href="/login">Login</a>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
