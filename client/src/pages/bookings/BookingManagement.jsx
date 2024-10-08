import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaUserAlt } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import BookingsReport from "./BookingsReport";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { init, send } from "emailjs-com";

const BookingManagement = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredBook, setFilteredBook] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  init("jm1C0XkEa3KYwvYK0");

  const handleUpdateClick = (id) => {
    navigate(`/booking-management/update/${id}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/booking/get"
        );
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const filtered = bookings.filter((item) => {
      // Check if cusName exists and is a string before applying toLowerCase()
      const customerName = item?.cusName || "";
      const bookingDate = dayjs(item.date);
      const matchesDateRange =
        (!startDate || bookingDate.isAfter(startDate, "day")) &&
        (!endDate || bookingDate.isBefore(endDate, "day"));

      return (
        customerName.toLowerCase().includes(searchValue.toLowerCase()) &&
        matchesDateRange
      );
    });
    setFilteredBook(filtered);
  }, [searchValue, bookings, startDate, endDate]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this booking",
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

  const handleStatusChange = (order, id, newStatus) => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(
            `http://localhost:3000/api/booking/status/${id}`,
            { status: newStatus }
          );

          await send("service_fjpvjh9", "template_atolrdf", {
            to_email: order.cusEmail,
            service_date_time: order.date,
            status: newStatus,
          });

          Swal.fire("Saved!", "", "success");
          window.location.reload();
        } catch (error) {
          console.log(error);
          Swal.fire("Error saving changes", "", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };

  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-ExtraDarkColor">
          Booking Management
        </h1>
        <input
          type="text"
          placeholder="Search..."
          className="bg-SecondaryColor rounded-md p-2 w-64 outline-none"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="flex items-center space-x-4">
          <PDFDownloadLink
            document={<BookingsReport packages={filteredBook} />}
            fileName="filtered-bookings.pdf"
          >
            {({ loading }) => (
              <button
                className="bg-DarkColor text-white px-4 py-2 rounded-md shadow hover:bg-ExtraDarkColor transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Generating PDF..." : "Generate Report"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Date Filter */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-ExtraDarkColor mb-4">
          Filter by Date
        </h2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex space-x-4">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            {startDate >= endDate && (
              <p className="text-red-500 text-xs mt-1">
                End date should greater than Start Date
              </p>
            )}
          </div>
        </LocalizationProvider>
      </div>

      {/* Booking Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
          className="bg-SecondaryColor p-6 rounded-lg shadow-lg flex items-center space-x-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FaUserAlt className="text-3xl text-DarkColor" />
          <div>
            <h2 className="text-lg font-bold text-ExtraDarkColor">
              Total Bookings
            </h2>
            <p className="text-2xl font-semibold text-DarkColor">
              {bookings.length}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-SecondaryColor p-6 rounded-lg shadow-lg flex items-center space-x-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FaCalendarAlt className="text-3xl text-DarkColor" />
          <div>
            <h2 className="text-lg font-bold text-ExtraDarkColor">
              Upcoming Services
            </h2>
            <p className="text-2xl font-semibold text-DarkColor">25</p>
          </div>
        </motion.div>
      </div>

      {/* Booking Table */}
      <div className="mt-12 bg-SecondaryColor p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-ExtraDarkColor mb-6">
          Booking Details
        </h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-DarkColor text-white">
            <tr>
              <th className="py-3 px-2 text-left">Customer Name</th>
              <th className="py-3 px-2 text-left">Booking Date</th>
              <th className="py-3 px-2 text-left">Time</th>
              <th className="py-3 px-2 text-left">Package</th>
              <th className="py-3 px-2 text-left">Price</th>
              <th className="py-3 px-2 text-left">Status</th>
              <th className="py-3 px-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBook.map((item) => (
              <tr
                key={item._id}
                className="border-b hover:bg-PrimaryColor transition-colors duration-300"
              >
                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.cusName}
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">{item.date}</td>
                <td className="py-3 px-2 text-ExtraDarkColor">{item.time}</td>
                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.package.pkgName}
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.package.pkgPrice}
                </td>
                <td className="px-2">
                  <select
                    className=" bg-PrimaryColor rounded"
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item, item._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Compleated">Compleated</option>
                  </select>
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">
                  <button
                    className="bg-pink-600 text-black mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md mr-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
