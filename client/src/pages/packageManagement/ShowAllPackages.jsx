import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBox, FaChartLine, FaSearch } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PackageReport from "./PackageReport"; // Import the new component

const ShowAllPackages = () => {
  const navigate = useNavigate();
  const [maintancePkgs, setmaintancePkgs] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredPkg, setFilteredPkg] = useState([]);

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

  const navigateAddPkg = () => {
    navigate("/admin/add-pkg");
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
            fileName="filtered-packages.pdf"
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

      {/* Inventory Table */}
      <div className="mt-12 bg-SecondaryColor p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-ExtraDarkColor mb-6">
          Inventory Details
        </h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-DarkColor text-white">
            <tr>
              <th className="py-3 px-5 text-left">Pkg Name</th>
              <th className="py-3 px-5 text-left">Price</th>
              <th className="py-3 px-5 text-left">Services</th>
              <th className="py-3 px-5 text-left">Action</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowAllPackages;
