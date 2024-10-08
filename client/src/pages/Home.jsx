// Home.js
import React from "react";
import { motion } from "framer-motion"; // Import Framer Motion
import NavBar from "./../components/NavBar";
import Footer from "./../components/Footer";
import HomeCon from "../components/Home/HomeCon";
import Collection from "../components/Home/Collection";
import Products from "../components/Home/Products";
import Review from "../components/Home/Review";
import CarServiceCarousel from "../components/Home/CarServiceCarousel";
import AboutUs from "../components/Home/AboutUs";
import Fact from "../components/Home/Fact";
import Services from "../components/Home/Services";

// Animation Variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      damping: 20,
      staggerChildren: 0.2, // Adds delay between child animations
    },
  },
};

const componentVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <div>
      <div className="navbar">
        <NavBar />
      </div>

      <div className="carousel">
        <motion.div
          id="home"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={componentVariants}>
            <CarServiceCarousel />
          </motion.div>
        </motion.div>
      </div>

      <div className="carousel">
        <motion.div
          id="home"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={componentVariants}>
            <AboutUs />
          </motion.div>
        </motion.div>
      </div>

      {/* Collection Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={componentVariants}>
          <Collection />
        </motion.div>
      </motion.div>

      {/* Products Section */}
      <motion.div
        id="products"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={componentVariants}>
          <Products />
        </motion.div>
      </motion.div>

      <motion.div
        id="products"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={componentVariants}>
          <Fact />
        </motion.div>
      </motion.div>

      <motion.div
        id="products"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={componentVariants}>
          <Services />
        </motion.div>
      </motion.div>

      {/* Review Section */}
      <motion.div
        id="review"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={componentVariants}>
          <Review />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={componentVariants}>
          <Footer />
        </motion.div>
      </motion.div>
    </div>
  );
}
