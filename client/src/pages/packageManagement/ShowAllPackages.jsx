import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBox, FaChartLine, FaSearch } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PackageReport from "./PackageReport"; 

const ShowAllPackages = () => {
  const navigate = useNavigate();
  const [maintancePkgs, setmaintancePkgs] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredPkg, setFilteredPkg] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sparePart, setSparePart] = useState([]); 
  const [pickList, setPickList] = useState([]); 
  const [item, setItem] = useState({ name: "", quantity: 0 }); 

  const handleUpdateClick = (id) => {
    navigate(`/admin/upd/${id}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchMaintaincePkgs = async () => {
      try {
        const pkgs = await axios.get("http://localhost:3000/api/maintance/get");
        setmaintancePkgs(pkgs.data);
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };
    fetchMaintaincePkgs();
  }, []);

  useEffect(() => {
    const serchResult = maintancePkgs.filter((item) =>
      item.pkgName.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredPkg(serchResult);
  }, [searchValue, maintancePkgs]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this package log.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/api/maintance/del/${id}`);
        setmaintancePkgs(maintancePkgs.filter((rep) => rep._id !== id));
        Swal.fire("Deleted!", "The package has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the package.",
        "error"
      );
    }
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
        setSparePart(spaREPart.data);
      } catch (error) {
        console.error("Error fetching modifications:", error);
      }
    };
    fetchModifications();
  }, []);

  const navigateAddPkg = () => {
    navigate("/admin/add-pkg");
  };

  const openCard = (order) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Define handleOnChange function
  const handleOnChange = (e, selectedPart) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  
  const handleOnSubmit = (e) => {
    e.preventDefault();
    setPickList((prevList) => [...prevList, item]);
    setItem({ name: "", quantity: 0 }); 
  };

  const handleRequest = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/spreq/add", {
        item: pickList,
      });
      Swal.fire("Request Sent Successfully!", "", "success");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-ExtraDarkColor">
          Manager Dashboard
        </h1>
        <FaSearch className="text-DarkColor mr-3" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-SecondaryColor rounded-md p-2 w-64 outline-none"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="flex items-center space-x-4">
          <PDFDownloadLink
            document={<PackageReport packages={filteredPkg} />}
            fileName="maintenance-packages.pdf"
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
          <button
            className="bg-DarkColor text-white px-4 py-2 rounded-md shadow hover:bg-ExtraDarkColor transition-colors duration-300"
            onClick={navigateAddPkg}
          >
            Add Maintance Package
          </button>
        </div>
      </div>

      {/* Inventory Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
          className="bg-SecondaryColor p-6 rounded-lg shadow-lg flex items-center space-x-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FaBox className="text-3xl text-DarkColor" />
          <div>
            <h2 className="text-lg font-bold text-ExtraDarkColor">
              Total Packages
            </h2>
            <p className="text-2xl font-semibold text-DarkColor">
              {maintancePkgs.length}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-SecondaryColor p-6 rounded-lg shadow-lg flex items-center space-x-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FaChartLine className="text-3xl text-DarkColor" />
          <div>
            <h2 className="text-lg font-bold text-ExtraDarkColor">
              Total Services
            </h2>
            <p className="text-2xl font-semibold text-DarkColor">{20}</p>
          </div>
        </motion.div>
      </div>

      {/* Maintenance package Table */}
      <div className="mt-12 bg-SecondaryColor p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-ExtraDarkColor mb-6">
          Maintenance Package Details
        </h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-DarkColor text-white">
            <tr>
              <th className="py-3 px-5 text-left">Package Name</th>
              <th className="py-3 px-5 text-left">Price(Rs)</th>
              <th className="py-3 px-5 text-left">Services</th>
              <th className="py-3 px-5 text-left">Action</th>
              <th className="py-3 px-5 text-left">Request</th>
            </tr>
          </thead>
          <tbody>
            {filteredPkg.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-PrimaryColor transition-colors duration-300"
              >
                <td className="py-3 px-5 text-ExtraDarkColor">
                  {item.pkgName}
                </td>
                <td className="py-3 px-5 text-ExtraDarkColor">
                  {item.pkgPrice}
                </td>
                <td className="py-3 px-5 text-ExtraDarkColor">
                  {item.pkgServ.map((serv) => serv.name).join(", ")}
                </td>
                <td className="py-3 px-5 text-ExtraDarkColor">
                  <button
                    className="bg-violet-500 text-black mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md mr-5"
                    onClick={() => handleUpdateClick(item._id)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-pink-600 text-black mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md mr-5"
                    onClick={(e) => handleDelete(item._id)}
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
              <div className=" bg-slate-200 p-6 text-black rounded-2xl shadow-sm">
                <h1 className="text-3xl font-bold mb-4">Spare Part Request</h1>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col mb-4 w-1/2">
                    <label className="block text-gray-700 required">
                      Item Name:
                    </label>
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
                    <label className="block text-gray-700 required">
                      Quantity:
                    </label>
                    <input
                      type="number"
                      className="border border-gray-300 text-black rounded-md p-2 w-2/3"
                      placeholder="Quantity"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Check if the value is a positive integer
                        if (/^\d+$/.test(value) || value === "") {
                          handleOnChange(e); 
                        }
                      }}
                      min="0" 
                      step="1"
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

export default ShowAllPackages;
