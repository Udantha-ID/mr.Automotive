// src/components/ProductPage.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "./../../components/Home/ProductCard";
import { FaSearch } from "react-icons/fa"; // Import search icon
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const ProductPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all"); // State for the selected product type

  useEffect(() => {
    // Fetch items from API
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/spareparts");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const items = await response.json();
        setData(items);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Error: {error}
      </div>
    );
  }

  const filteredData = data
    .filter((item) =>
      item.partName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((item) => selectedType === "all" || item.type === selectedType); // Filter by selected type or show all

  return (
    <div>
      <NavBar />
      <div className="min-h-screen px-5 pt-24 lg:pt-16">
        {/* Search Section */}
        <div className=" items-center mb-6 mt-10">
          <h2 className="text-3xl to-ExtraDarkColor font-bold mb-10 mt-10">
            Spare Parts
          </h2>
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search Products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border border-DarkColor rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-DarkColor transition-all z-20"
            />
            <FaSearch className="absolute text-3xl top-3 left-96 text-DarkColor" />
          </div>
        </div>

        {/* Type Toggle Tabs */}
        <div className="flex space-x-4 mb-6">
          {["all", "original", "duplicate", "used"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`p-2 border rounded-lg flex-1 transition-all ${
                selectedType === type
                  ? "bg-DarkColor text-white"
                  : "bg-white text-DarkColor border-DarkColor"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Section */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredData.map((item) => (
            <div key={item._id} className="">
              <ProductCard
                id={item._id}
                img={item.imageUrl || "/path/to/default/image.jpg"}
                name={item.partName}
                price={item.price.toFixed(2)}
                discount={item.discount || ""}
              />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
