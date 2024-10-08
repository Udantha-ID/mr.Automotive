import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();

  // State to manage form fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // State for error handling

  // Handle form input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Log formData to check if the values are correct
    console.log("Form Data: ", formData);
  
    // Directly check if email and password match for supplier, payment, or inventory management
    if (
      formData.email.toLowerCase() === "supplier21@gmail.com" &&
      formData.password === "supplier123"
    ) {
      // Navigate to supplier management page
      navigate("/supplier-management/");
      return; // Exit function early to prevent API call
    } else if (
      formData.email.toLowerCase() === "payment@gmail.com" &&
      formData.password === "payment123"
    ) {
      // Navigate to payment management page
      navigate("/payment-management/");
      return;
    } else if (
      formData.email.toLowerCase() === "inventory@gmail.com" &&
      formData.password === "inventory123"
    ) {
      // Navigate to inventory management page
      navigate("/inventory-management/");
      return;
    }
    else if (
      formData.email.toLowerCase() === "employee@gmail.com" &&
      formData.password === "employee123"
    ) {
      // Navigate to Employee management page
      Swal.fire({
        title: 'Hi Udantha',
        text: 'You have successfully logged in',
        icon: 'success',
        confirmButtonText: 'OK',
        showCancelButton: false,
        timer:4000,});
      navigate("/employee-management/");
      return;
    }
  


    try {
      // Make API call if email/password doesn't match predefined conditions
      const response = await axios.post(
        "http://localhost:3000/api/auth/signin",
        formData
      );
  
      const getUserIdFromToken = () => {
        const token = response.data.token;
        if (token) {
          try {
            const decoded = jwtDecode(token);
            console.log(decoded.id);
            return decoded.id;
          } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
          }
        }
        return null;
      };
  
      const userId = getUserIdFromToken();
      localStorage.setItem("uid", response.data._id);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("name", response.data.username);
  
      if (response.data.usertype === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Invalid credentials. Please try again.");
    }
  };
  
  
  
  
  

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
