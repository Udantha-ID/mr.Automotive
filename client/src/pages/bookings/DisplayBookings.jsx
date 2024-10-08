import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Swal from "sweetalert2";
import { Modal } from "@mui/material";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const DisplayBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatedDate, setUpdatedDate] = useState(null);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/booking/get/${email}`
        );
        setBookings(response.data); // Assuming response data is an array of bookings
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [email]);

  if (loading) {
    return <div className="text-center py-10">Loading bookings...</div>;
  }

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this booking.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/api/booking/delete/${id}`);
        setBookings(bookings.filter((booking) => booking._id !== id));
        Swal.fire("Deleted!", "The booking has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the booking.",
        "error"
      );
    }
  };

  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setUpdatedDate(dayjs(booking.date));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBooking(null);
  };

  const handleUpdateBooking = async () => {
    try {
      const updatedBooking = {
        ...selectedBooking,
        date: updatedDate.format("YYYY-MM-DD"),
        time: updatedDate.format("HH:mm"),
      };

      await axios.put(
        `http://localhost:3000/api/booking/update/${selectedBooking._id}`,
        updatedBooking
      );

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === selectedBooking._id ? updatedBooking : booking
        )
      );

      Swal.fire("Updated!", "The booking has been updated.", "success");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating booking:", error);
      Swal.fire(
        "Error",
        "An error occurred while updating the booking.",
        "error"
      );
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-28">
        <h2 className="text-2xl font-bold mb-6 text-center">My Bookings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">
                {booking.vehicleModel}
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Vehicle Number:</strong> {booking.vehNum}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Package:</strong> {booking.package.pkgName}
              </p>
              <p className="text-gray-600 mb-2">
                <strong>Customer Name:</strong> {booking.cusName}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Date:</strong>{" "}
                {new Date(booking.date).toLocaleDateString()}
              </p>
              <button
                className="bg-green-400 text-black mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md mr-5"
                onClick={() => handleOpenModal(booking)}
              >
                Reschedule
              </button>
              <button
                className="bg-pink-600 text-black mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                onClick={() => handleDelete(booking._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for rescheduling */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="bg-white p-6 rounded-lg max-w-md mx-auto mt-20 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Reschedule Booking</h2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select New Date and Time"
              value={updatedDate}
              onChange={(newValue) => setUpdatedDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleUpdateBooking}
            >
              Update Booking
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default DisplayBookings;
