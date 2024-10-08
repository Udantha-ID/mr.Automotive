import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaEdit } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ModificationReport from "./ModificationReport";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Modal from "react-modal";
import TextField from "@mui/material/TextField";
import { init, send } from "emailjs-com";

const ModificationManagement = () => {
  const navigate = useNavigate();
  const [modifications, setModifications] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredMods, setFilteredMods] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sparePart, setSparePart] = useState([]);
  const [selectedPart, setSelectedPart] = useState({});
  const [item, setItem] = useState({
    name: "",
    quantity: "",
  });
  const [pickList, setPickList] = useState([]);

  init("jm1C0XkEa3KYwvYK0");

  const handleUpdateClick = (id) => {
    navigate(`/modification-management/update/${id}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchModifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/mod/getMod"
        );
        const spaREPart = await axios.get(
          "http://localhost:3000/api/spareparts/"
        );
        console.log(spaREPart);
        setSparePart(spaREPart.data);
        setModifications(response.data);
      } catch (error) {
        console.error("Error fetching modifications:", error);
      }
    };
    fetchModifications();
  }, []);

  useEffect(() => {
    const filtered = modifications.filter((item) => {
      const modificationDate = dayjs(item.date);
      const matchesDateRange =
        (!startDate || modificationDate.isAfter(startDate, "day")) &&
        (!endDate || modificationDate.isBefore(endDate, "day"));

      return (
        (item.customerName?.toLowerCase() || "").includes(
          searchValue.toLowerCase()
        ) && matchesDateRange
      );
    });
    setFilteredMods(filtered);
  }, [searchValue, modifications, startDate, endDate]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this modification",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/api/mod/delMod/${id}`);
        setModifications(modifications.filter((mod) => mod._id !== id));
        Swal.fire("Deleted!", "The modification has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting modification:", error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the modification.",
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
            `http://localhost:3000/api/mod/status/${id}`,
            { status: newStatus }
          );

          await send("service_fjpvjh9", "template_atolrdf", {
            to_email: order.customerEmail,
            service_date_time: order.date,
            status: newStatus,
          });
          console.log(modifications.customerEmail);
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

  const openCard = (order) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
    const selectedPart = sparePart.find(
      (part) => part.partName === selectedName
    );
    console.log(selectedPart);
    setSelectedPart(selectedPart);
  };

  const calculateSubtotal = () => {
    return pickList
      .reduce(
        (total, item) =>
          total + parseFloat(item.unitPrice * item.quantity || 0),
        0
      )
      .toFixed(2);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      setPickList((preList) => [...preList, item]);
      setItem({ name: "", quantity: "" });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleRequest = async () => {
    try {
      const response = axios.post("http://localhost:3000/api/spreq/add", {
        item: pickList,
      });
      console.log(pickList);
      Swal.fire("Request Sent Sucessfully!", "", "success");
      window.location.reload();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-ExtraDarkColor">
          Modification Management
        </h1>
        <input
          type="text"
          placeholder="Search..."
          className="bg-SecondaryColor rounded-md p-2 w-64 outline-none"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="flex items-center space-x-4">
          <PDFDownloadLink
            document={<ModificationReport packages={filteredMods} />}
            fileName="filtered-modifications.pdf"
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
            <label>Start Date:</label>
            <DatePicker
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <label>End Date:</label>
            <DatePicker
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
              minDate={startDate} // Disable dates before the selected Start Date
            />
          </div>
          {/* Error message for invalid date range */}
          {startDate && endDate && endDate <= startDate && (
            <p className="text-red-500 text-xs mt-1">
              End date should be greater than Start Date
            </p>
          )}
          <button
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
            }}
            className="mt-2 p-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Clear Dates
          </button>
        </LocalizationProvider>
      </div>





      {/* Modification Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
          className="bg-SecondaryColor p-6 rounded-lg shadow-lg flex items-center space-x-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FaEdit className="text-3xl text-DarkColor" />
          <div>
            <h2 className="text-lg font-bold text-ExtraDarkColor">
              Total Modifications
            </h2>
            <p className="text-2xl font-semibold text-DarkColor">
              {modifications.length}
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
              Recent Modifications
            </h2>
            <p className="text-2xl font-semibold text-DarkColor">15</p>
          </div>
        </motion.div>
      </div>

      {/* Modification Table */}
      <div className="mt-12 bg-SecondaryColor p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-ExtraDarkColor mb-6">
          Modification Details
        </h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-DarkColor text-white">
            <tr>
              <th className="py-3 px-2 text-left">CusName</th>
              <th className="py-3 px-2 text-left">Email</th>
              <th className="py-3 px-2 text-left">Model</th>
              <th className="py-3 px-2 text-left">Vehical No</th>
              <th className="py-3 px-2 text-left">Mod Type</th>
              <th className="py-3 px-2 text-left">Date</th>
              <th className="py-3 px-2 text-left">Status</th>
              <th className="py-3 px-2 text-left">Delete</th>
              <th className="py-3 px-2 text-left">Request</th>
            </tr>
          </thead>
          <tbody>
            {filteredMods.map((item) => (
              <tr
                key={item._id}
                className="border-b hover:bg-PrimaryColor transition-colors duration-300"
              >
                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.customerName}
                </td>

                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.customerEmail}
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.vehicleModel}
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.vehicleNumber}
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.modificationType}
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">{item.date}</td>
                <td className="p-4">
                  <select
                    className="p-2 bg-PrimaryColor rounded"
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
                    className="bg-pink-600 text-white mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
                    Delete
                  </button>
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">
                  <button
                    className="bg-green-600 text-white mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                    onClick={(e) => openCard(item)}
                  >
                    Request Parts
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="text-center bg-white p-10 h-fit w-3/4 max-w-4xl rounded-xl ml-20 "
          overlayClassName="fixed inset-0 flex justify-center items-center bg-black bg-opacity-64 rounded-xl"
        >
          <div className="">
            <form onSubmit={handleOnSubmit}>
              <div className="bg-slate-200 p-6 text-black rounded-2xl shadow-sm">
                <h1 className="text-3xl font-bold mb-4">Spare Part Request</h1>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col mb-4 w-1/2">
                    <label className="block text-gray-700 required">Item Name:</label>
                    <select
                      className="border border-gray-300 text-black rounded-md p-2"
                      name="name"
                      value={item.name}
                      onChange={(e) => {
                        const selectedPart = sparePart.find(
                          (part) => part.name === e.target.value
                        );
                        handleOnChange(e, selectedPart);
                      }}
                      required
                    >
                      {sparePart.map((part) => (
                        <option key={part._id} value={part.name}>
                          {part.partName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col mb-4">
                    <label className="block text-gray-700 required">Quantity:</label>
                    <input
                      type="number"
                      className="border border-gray-300 text-black rounded-md p-2 w-2/3"
                      placeholder="Quantity"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => {
                        const quantity = parseInt(e.target.value, 10);
                        if (quantity > 0) {
                          handleOnChange(e); // Only update if the value is positive
                        }
                      }}
                      min="1" // HTML validation for positive numbers
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md"
                >
                  Add To List
                </button>
              </div>
            </form>

            {/* Picklist Table */}
            <div className="mt-4">
              {pickList.length <= 0 ? (
                <p>No items added yet</p>
              ) : (
                <table className="min-w-full text-black bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">Name</th>
                      <th className="py-2 px-4 border-b">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pickList.map((item, index) => (
                      <tr key={index} className="border-b text-center">
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <button
                className="bg-pink-600 text-white mt-10 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                onClick={handleRequest}
              >
                Send Request
              </button>
            </div>
          </div>

        </Modal>
      </div>
    </div>
  );
};

export default ModificationManagement;
