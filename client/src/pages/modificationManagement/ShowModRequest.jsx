import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { Modal } from "@mui/material";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const ShowModRequest = () => {
  const [modReq, setModReq] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [updatedDate, setUpdatedDate] = useState(null);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchModRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/mod/get/${email}`
        );
        setModReq(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching modification requests:", error);
        setLoading(false);
      }
    };

    fetchModRequests();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">Loading modification requests...</div>
    );
  }

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this modification request.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/api/mod/delMod/${id}`);
        setModReq(modReq.filter((req) => req._id !== id));
        Swal.fire(
          "Deleted!",
          "The modification request has been deleted.",
          "success"
        );
      }
    } catch (error) {
      console.error("Error deleting modification request:", error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the request.",
        "error"
      );
    }
  };

  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setUpdatedDate(dayjs(request.date));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRequest(null);
  };

  const handleUpdateRequest = async () => {
    try {
      const updatedRequest = {
        ...selectedRequest,
        date: updatedDate.format("YYYY-MM-DD"),
      };

      await axios.put(
        `http://localhost:3000/api/mod/updateMod/${selectedRequest._id}`,
        updatedRequest
      );

      setModReq((prevReq) =>
        prevReq.map((req) =>
          req._id === selectedRequest._id ? updatedRequest : req
        )
      );

      Swal.fire(
        "Updated!",
        "The modification request has been updated.",
        "success"
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating modification request:", error);
      Swal.fire(
        "Error",
        "An error occurred while updating the request.",
        "error"
      );
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mx-auto px-4 py-8 pt-28">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Modification Requests
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modReq.map((request) => (
            <div
              key={request._id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-2">
                Modification Type: {request.modificationType}
              </h3>
              <p className="text-gray-600 mb-2">
                <strong>Customer Name:</strong> {request.customerName}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Date:</strong>{" "}
                {new Date(request.date).toLocaleDateString()}
              </p>
              <button
                className="bg-green-400 text-black mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md mr-5"
                onClick={() => handleOpenModal(request)}
              >
                Update
              </button>
              <button
                className="bg-pink-600 text-black mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                onClick={() => handleDelete(request._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for updating request */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="bg-white p-6 rounded-lg max-w-md mx-auto mt-20 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Update Request</h2>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select New Date"
              value={updatedDate}
              onChange={(newValue) => setUpdatedDate(newValue)}
              minDate={dayjs().startOf("day")} // Restrict to future dates only
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleUpdateRequest}
            >
              Update Request
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

export default ShowModRequest;
