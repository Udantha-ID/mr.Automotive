import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Assuming you're using react-router
import { FaPlus, FaMinus } from "react-icons/fa"; // Icons for quantity increment/decrement
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

const SinglePartPage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate(); // For navigation
  const [sparePart, setSparePart] = useState(null);
  const [quantity, setQuantity] = useState(1); // Initial quantity

  useEffect(() => {
    // Fetch the spare part details by ID
    const fetchSparePartDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/spareparts/${id}`
        );
        const data = await response.json();
        setSparePart(data);
      } catch (error) {
        console.error("Error fetching spare part details:", error);
      }
    };

    fetchSparePartDetails();
  }, [id]);

  // Handle adding to cart
  const handleAddToCart = () => {
    // Add functionality to add item to cart (could be local state or API)
    console.log(`Adding ${quantity} ${sparePart.partName} to cart`);
  };

  // Handle buying the item immediately
  const handleBuyNow = () => {
    // Add functionality to initiate purchase (e.g., navigate to payment)
    console.log(`Buying ${quantity} ${sparePart.partName} now`);
    navigate("/checkout"); // Example navigation to a checkout page
  };

  // Handle quantity change
  const handleQuantityChange = (change) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + change));
  };

  if (!sparePart) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="min-h-screen p-5">
        <div className="container mx-auto max-w-5xl mt-40">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Spare Part Image */}
            <div className="w-full md:w-1/2">
              <img
                src={sparePart.imageUrl || "/path/to/default/image.jpg"}
                alt={sparePart.partName}
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Spare Part Details */}
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl font-bold text-DarkColor">
                {sparePart.partName}
              </h1>
              <p className="text-lg text-gray-600">{sparePart.description}</p>

              {/* Features */}
              <div className="mt-4">
                <h3 className="text-xl font-semibold">Features:</h3>
                <ul className="list-disc list-inside">
                  {sparePart.features?.map((feature, index) => (
                    <li key={index}>
                      <strong>{feature.key}:</strong> {feature.value}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price and Supplier */}
              <p className="mt-4 text-xl font-semibold text-DarkColor">
                Price: Rs {sparePart.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                Supplier: {sparePart.supplier}
              </p>

              {/* Quantity */}
              <div className="mt-4 flex items-center space-x-4">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 border rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  <FaMinus />
                </button>
                <span className="text-xl">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 border rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Add to Cart and Buy Now Buttons */}
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition"
                >
                  Buy It Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SinglePartPage;
