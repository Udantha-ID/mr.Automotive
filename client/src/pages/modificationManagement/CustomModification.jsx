import React from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import modBack from "../../assets/rim.png";
import { motion } from "framer-motion";
import axios from "axios";
import Per from "../../assets/performanceimg.jpeg";
import Style from "../../assets/stylevehimg.jpeg";
import Effi from "../../assets/efficencyimg.jpeg";
import Mod from "../../assets/repairveh.jpeg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as yup from "yup";
import Switch from "@mui/material/Switch";

const validationSchema = yup.object({
  customerName: yup.string().required("Customer Name is required"),
  customerEmail: yup
    .string()
    .email("Invalid email format")
    .required("Customer Email is required"),
  vehicleModel: yup.string().required("Vehicle Model is required"),
  vehicleNumber: yup.string().required("Vehicle Number is required"),
  modificationType: yup
    .string()
    .oneOf(["engine", "exhaust", "suspension"])
    .required("Modification Type is required"),
  date: yup.date().required("Preferred Date is required"),
});

const CustomModification = () => {
  const getTodayDate = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const uid = localStorage.getItem("uid");
  const [checked, setChecked] = React.useState(true);

  const formik = useFormik({
    initialValues: {
      customerId: uid || "",
      customerName: name || "",
      customerEmail: email || "",
      vehicleModel: "",
      vehicleNumber: "",
      modificationType: "engine",
      additionalNotes: "",
      date: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/mod/addMod",
          values
        );
        if (response.status === 201) {
          Swal.fire({
            title: "Success!",
            text: "Modification Appointment Created Successfully.",
            icon: "success",
          });

          formik.resetForm();
          navigate("/modreq");
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to submit the request. Please try again.",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to Create Modification Appointment.",
          icon: "error",
        });
      }
    },
  });

  const handleChange = (event) => {
    setChecked(event.target.checked);

    if (checked) {
      formik.values.vehicleNumber = "";
    } else {
      formik.values.vehicleNumber = "ශ්‍රී - ";
    }
  };

  return (
    <div>
      <NavBar style={{ zIndex: 1000 }} />

      {/* Section 1: Introduction with Background Image and Scroll Effect */}
      <motion.div
        id="introduction"
        className="bg-center min-h-screen flex justify-center pt-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-100 mt-20 -z-10">
          <img src={modBack} className="fixed z-0 min-w-full" />
        </div>
        <div className="text-center text-white">
          <h2 className="text-yellow-500 bg-black bg-opacity-40 text-5xl -z-10 font-extrabold fixed left-1/3">
            Modify Your Vehicle
          </h2>
          <div className="mt-24 left-32 right-32 overflow-hidden fixed -z-10">
            <motion.p
              className="text-white overflow-hidden"
              initial={{ y: 100 }}
              animate={{ y: -100 }}
              transition={{
                duration: 5,
                ease: "linear",
                style: { zIndex: -1 },
              }}
            >
              Boost your vehicle's performance with top-tier engine
              modifications. Experience unmatched horsepower, enhanced fuel
              efficiency, and smoother rides. Our expert modifications not only
              optimize speed and acceleration but also extend engine longevity,
              ensuring that your vehicle performs at its best. Whether you're
              looking for performance enhancements for daily driving or
              preparing for high-speed races, our engine upgrades are designed
              to meet your needs. Elevate your driving experience with precision
              tuning, cutting-edge technology, and premium parts that redefine
              what your engine is capable of.
              <br />
              <br />
              Boost your vehicle's performance with top-tier engine
              modifications. Experience unmatched horsepower, enhanced fuel
              efficiency, and smoother rides. Our expert modifications not only
              optimize speed and acceleration but also extend engine longevity,
              ensuring that your vehicle performs at its best. Whether you're
              looking for performance enhancements for daily driving or
              preparing for high-speed races, our engine upgrades are designed
              to meet your needs. Elevate your driving experience with precision
              tuning, cutting-edge technology, and premium parts that redefine
              what your engine is capable of.
              <br />
              <br />
            </motion.p>
          </div>
          <button
            onClick={() =>
              document
                .getElementById("benefits")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="bottom-10 -z-10 bg-green-400 text-black py-3 px-6 rounded-md font-bold hover:bg-gray-200 transition-colors fixed"
            style={{ left: "45%" }}
          >
            Learn More
          </button>
        </div>
      </motion.div>

      {/* Section 2: Benefits of Vehicle Modification */}
      <motion.section
        id="benefits"
        className="min-h-screen py-20 bg-gray-100 flex items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        style={{ zIndex: 2 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-20">Why Modify Your Vehicle?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white shadow-lg rounded-lg">
              <img
                src={Per}
                alt="Performance Upgrade"
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mt-4">
                  Performance Upgrades
                </h3>
                <p className="text-gray-600">
                  Boost your vehicle's performance with top-tier engine
                  modifications.
                </p>
              </div>
            </div>
            {/* Benefit 2 */}
            <div className="bg-white shadow-lg rounded-lg">
              <img
                src={Style}
                alt="Style Enhancement"
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mt-4">
                  Style Enhancements
                </h3>
                <p className="text-gray-600">
                  Customize your vehicle's appearance with exterior and interior
                  upgrades.
                </p>
              </div>
            </div>
            {/* Benefit 3 */}
            <div className="bg-white shadow-lg rounded-lg ">
              <img
                src={Effi}
                alt="Efficiency"
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mt-4">
                  Efficiency Improvements
                </h3>
                <p className="text-gray-600">
                  Increase your vehicle's fuel efficiency and reduce emissions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Section 3: Our Modification Process */}
      <motion.section
        id="process"
        className="min-h-screen py-2 bg-white flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        style={{ zIndex: 3 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-20">Our Modification Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <motion.div
              className="flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl p-5 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src={Per}
                alt="Consultation"
                className="w-20 h-20 object-cover rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                Step 1: Consultation
              </h3>
              <p className="text-gray-600 mb-4">
                Engage in a detailed discussion with our expert team. We listen
                to your specific needs, preferences, and goals to tailor a
                perfect modification plan. Our goal is to ensure your vision is
                brought to life with precision and excellence.
              </p>
              <a href="#" className="text-blue-500 hover:underline">
                Learn More
              </a>
            </motion.div>
            {/* Step 2 */}
            <motion.div
              className="flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl p-5 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <img
                src={Style}
                alt="Design"
                className="w-20 h-20 object-cover rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Step 2: Design</h3>
              <p className="text-gray-600 mb-4">
                Once we understand your vision, our design team creates a
                detailed modification plan. We use advanced tools and
                technologies to ensure that every design aspect aligns with your
                requirements, guaranteeing an enhanced vehicle appearance and
                performance.
              </p>
              <a href="#" className="text-blue-500 hover:underline">
                Learn More
              </a>
            </motion.div>
            {/* Step 3 */}
            <motion.div
              className="flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl p-5 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <img
                src={Effi}
                alt="Modification"
                className="w-20 h-20 object-cover rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">
                Step 3: Modification
              </h3>
              <p className="text-gray-600 mb-4">
                Our skilled technicians execute the modification plan with
                utmost care. Using high-quality parts and equipment, we ensure
                that every modification is performed to the highest standards,
                enhancing your vehicle's performance and appearance.
              </p>
              <a href="#" className="text-blue-500 hover:underline">
                Learn More
              </a>
            </motion.div>
            {/* Step 4 */}
            <motion.div
              className="flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl p-5 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4 }}
            >
              <img
                src={Mod}
                alt="Review"
                className="w-20 h-20 object-cover rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Step 4: Review</h3>
              <p className="text-gray-600 mb-4">
                After modification, we conduct a thorough review to ensure
                everything meets our quality standards. We test the
                modifications to guarantee optimal performance and reliability
                before handing back your vehicle.
              </p>
              <a href="#" className="text-blue-500 hover:underline">
                Learn More
              </a>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section 4: Booking Form */}
      <motion.section
        id="booking"
        className="min-h-screen py-20 bg-gray-50 flex items-center justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        style={{ zIndex: 4 }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Custom Modification Request Form
            </h3>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Row 1 */}
              <div className="flex flex-wrap -mx-2 mb-4">
                {/* <div className="w-full sm:w-1/3 px-2 mb-4 sm:mb-0">
                  <label className="text-gray-700">Customer ID</label>
                  <input
                    type="text"
                    name="customerId"
                    value={formik.values.customerId}
                    onChange={formik.handleChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    required
                    readOnly
                  />
                </div> */}
                <div className="w-full sm:w-1/3 px-2 mb-4 sm:mb-0">
                  <label className="text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formik.values.customerName}
                    onChange={formik.handleChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    onKeyDown={(e) => {
                      if (!/[a-zA-Z\s]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                  />
                  {formik.errors.customerName && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.customerName}
                    </div>
                  )}
                </div>


                <div className="w-full sm:w-1/3 px-2">
                  <label className="text-gray-700">Customer Email</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formik.values.customerEmail}
                    onChange={formik.handleChange}
                    onKeyDown={(e) => {
                      // Allow letters, numbers, backspace, tab, and '@' and '.'
                      const allowedKeys = /^[a-zA-Z0-9@.]+$/;
                      if (!allowedKeys.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                        e.preventDefault();
                      }
                    }}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    required
                  />
                  {formik.errors.customerEmail && (
                    <div className="text-red-500 text-sm">{formik.errors.customerEmail}</div>
                  )}
                </div>

              </div>
              {/* Row 2 */}
              <div className="flex flex-wrap -mx-2 mb-4">
                <div className="w-full sm:w-1/2 px-2 mb-4 sm:mb-0">
                  <label className="text-gray-700">Vehicle Model</label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formik.values.vehicleModel}
                    onChange={formik.handleChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    pattern="[A-Za-z0-9]*" // Allows only letters and numbers
                    onKeyDown={(e) => {
                      if (!/[a-zA-Z0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') {
                        e.preventDefault(); // Prevents non-letter and non-number characters
                      }
                    }}
                    required
                  />
                  {formik.errors.vehicleModel && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.vehicleModel}
                    </div>
                  )}
                </div>

                <div className="w-full sm:w-1/2 px-2">
                  <Switch
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />

                  <label className="text-gray-700">Vehicle Number</label>
                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formik.values.vehicleNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only letters, numbers, spaces, and dashes
                      if (/^[A-Za-z0-9 -]*$/.test(value)) {
                        formik.setFieldValue('vehicleNumber', value);
                      }
                    }}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    required
                  />
                  {formik.errors.vehicleNumber && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.vehicleNumber}
                    </div>
                  )}
                  {checked
                    ? !/^(?:ශ්‍රී - \d{4})$/.test(formik.values.vehicleNumber) &&
                    formik.values.vehicleNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        Please enter a valid vehicle number (ශ්‍රී - 4444)
                      </p>
                    )
                    : !/^(?:[A-Z]{3}-\d{4}|[A-Z]{2}-\d{4})$/.test(formik.values.vehicleNumber) &&
                    formik.values.vehicleNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        Please enter a valid vehicle number (e.g., ABC-1234 or AB-1234)
                      </p>
                    )}
                </div>

              </div>
              {/* Row 3 */}
              <div className="flex flex-wrap -mx-2 mb-4">
                <div className="w-full sm:w-1/2 px-2 mb-4 sm:mb-0">
                  <label className="text-gray-700">Modification Type</label>
                  <select
                    name="modificationType"
                    value={formik.values.modificationType}
                    onChange={formik.handleChange}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    required
                  >
                    <option value="engine">Engine</option>
                    <option value="exhaust">Exhaust</option>
                    <option value="suspension">Suspension</option>
                  </select>
                  {formik.errors.modificationType && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.modificationType}
                    </div>
                  )}
                </div>
                <div className="w-full sm:w-1/2 px-2">
                  <label className="text-gray-700">Preferred Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    min={getTodayDate}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    required
                  />
                  {formik.errors.date && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.date}
                    </div>
                  )}
                </div>
              </div>
              {/* Row 4 */}
              <div className="w-full px-2 mb-4">
                <label className="text-gray-700">Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  value={formik.values.additionalNotes}
                  onChange={formik.handleChange}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default CustomModification;
