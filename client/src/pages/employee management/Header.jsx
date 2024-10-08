// Header.js
import React from "react";
import { FaSearch, FaBell } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-PrimaryColor pt-4 flex justify-between items-center">
        
      <div className="flex items-center"></div>
      <div className="flex items-center">
        <FaBell className="text-DarkColor mr-4 cursor-pointer" />
        <img
          src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg" 
          alt="Profile"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
}
