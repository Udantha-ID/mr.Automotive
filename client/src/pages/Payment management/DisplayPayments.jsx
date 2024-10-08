import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const DisplayPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/payments/get/${email}`);
        setPayments(response.data.data); // Adjust based on your API response structure
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setLoading(false);
      }
    };

    fetchPayments();
  }, [email]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this payment record",
        icon: "warning",
        fontFamily: "Montserrat, sans-serif",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/payments/${id}`);
        setPayments(payments.filter((payment) => payment._id !== id));
        Swal.fire("Deleted!", "The payment record has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting payment record:", error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the payment record.",
        "error"
      );
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsPopup(true);
  };

  const handleClosePopup = () => {
    setShowDetailsPopup(false);
    setSelectedPayment(null);
  };

  if (loading) {
    return <div className="text-center py-10">Loading payments...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-28">
        <h2 className="text-2xl font-bold mb-6 text-center">My Payments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">
                {payment.Package}
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Vehicle Number:</strong> {payment.Vehicle_Number}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Payment Date:</strong> {new Date(payment.PaymentDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Payment Method:</strong> {payment.PaymentMethod}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Package Amount:</strong> Rs.{payment.Pamount}
              </p>
              <button
                className="bg-green-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded mr-5"
                onClick={() => handleViewDetails(payment)}
              >
                View Details
              </button>
              <button
                className="bg-pink-600 text-black mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md mr-5"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from bubbling up
                  handleDelete(payment._id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Details Popup */}
      <AnimatePresence>
        {showDetailsPopup && selectedPayment && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClosePopup}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-3xl w-full shadow-2xl relative overflow-y-auto max-h-[90vh]"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl text-gray-800 mb-6 font-bold border-b border-gray-300 pb-2">
                Payment ID: {selectedPayment.PaymentId}
              </h2>
              <div className="flex flex-col space-y-4">
                <p><strong>Customer Name:</strong> {selectedPayment.cusName}</p>
                <p><strong>Vehicle Number:</strong> {selectedPayment.Vehicle_Number}</p>
                <p><strong>Payment Date:</strong> {selectedPayment.PaymentDate}</p>
                <p><strong>Payment Method:</strong> {selectedPayment.PaymentMethod}</p>
                <p><strong>Booking ID:</strong> {selectedPayment.Booking_Id}</p>
                <p><strong>Package:</strong> {selectedPayment.Package}</p>
                <p><strong>Package Amount:</strong> {selectedPayment.Pamount}</p>
                <p><strong>Customer Email:</strong> {selectedPayment.email}</p>
              </div>
              <button
                className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800"
                onClick={handleClosePopup}
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default DisplayPayments;
