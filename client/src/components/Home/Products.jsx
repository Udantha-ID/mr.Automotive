import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-5 pt-24 lg:pt-16">
      {/* Heading section with View More button on the same line */}
      <div className="flex ml-20 mr-20 justify-between items-center pb-4">
        <h1 className="font-semibold text-4xl text-ExtraDarkColor">
          Spare Parts
        </h1>
        <div
          className="flex-1 max-w-xs p-3 flex justify-center items-center border-2 border-dashed border-DarkColor rounded-lg cursor-pointer hover:bg-SecondaryColor"
          onClick={() => navigate("/products")}
        >
          <h2 className="text-xl font-semibold text-DarkColor">
            View More Items
          </h2>
        </div>
      </div>

      {/* Cards section */}
      <div className="flex justify-center items-center gap-5 pt-8">
        {/* Limit the number of items displayed to 4 */}
        {data.slice(0, 4).map((item) => (
          <div key={item._id} className="flex-1 max-w-xs">
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
  );
}
