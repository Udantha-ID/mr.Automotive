import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import UpdateSupplierPopup from './UpdateSupplier'; // Placeholder for edit popup
import SupplierReport from './SupplierReport'; // Report generation component

const ManageSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState(null); // For overview and edit
  const [showUpdatePopup, setShowUpdatePopup] = useState(false); // For edit popup
  const [searchTerm, setSearchTerm] = useState(''); // Search term state

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/suppliers');
        setSuppliers(response.data.data.filter(supplier => supplier.status === 'approved'));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/suppliers/${id}`);
      setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier._id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleOverview = (supplier) => {
    setSelectedSupplier(supplier); // Set selected supplier for overview
  };

  const handleUpdate = (supplier) => {
    setSelectedSupplier(supplier); // Set selected supplier for edit
    setShowUpdatePopup(true);
  };

  // Filter suppliers based on the search term
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.SupplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // supplier.Companyname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.ItemName.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const handleGenerateReport = () => {
    // Logic for generating the supplier report, could be handled within the SupplierReport component
    if (filteredSuppliers.length === 0) {
      alert('No suppliers to generate a report.');
    } else {
      // Trigger report download or open report modal
      console.log('Generating report...');
    }
  };

  if (loading) {
    return <div className="text-center mt-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Approved Suppliers</h1>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border border-gray-400 rounded-lg"
          placeholder="Search by supplier name, item name, or contact number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Supplier Report Component */}
      <div className='mb-4'>
        <SupplierReport filteredSuppliers={filteredSuppliers} />
      </div>

      {/* Make table responsive */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden table-fixed">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left w-1/6">Supplier ID</th>
              <th className="py-3 px-4 text-left w-1/4">Supplier Name</th>
              <th className="py-3 px-4 text-left w-1/4">Supplier Companyname</th>
              <th className="py-3 px-4 text-left w-1/6">Supply items</th>
              <th className="py-3 px-4 text-left w-1/6">Contact number</th>
              <th className="py-3 px-4 text-left w-1/6">Email</th>
              <th className="py-3 px-4 text-left w-1/6">Address</th>
              <th className="py-3 px-4 text-left w-1/6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier) => (
                <motion.tr
                  key={supplier._id}
                  className="border-b hover:bg-gray-100 transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="py-2 px-4">{supplier.SupplierID}</td>
                  <td className="py-2 px-4">{supplier.SupplierName}</td>
                  <td className="py-2 px-4">{supplier.Companyname}</td>
                  <td className="py-2 px-4">{supplier.ItemName}</td>
                  <td className="py-2 px-4">{supplier.ContactNo}</td>
                  <td className="py-2 px-4">{supplier.Email}</td>
                  <td className="py-2 px-4">{supplier.Address}</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleOverview(supplier)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleUpdate(supplier)}
                        className="text-green-500 hover:text-green-700 mr-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-3 px-5 text-center">
                  No suppliers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Supplier Overview Popup */}
      <AnimatePresence>
        {selectedSupplier && !showUpdatePopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSupplier(null)}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-3xl w-full shadow-2xl relative"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl text-gray-800 mb-6 font-bold border-b border-gray-300 pb-2">
                {selectedSupplier.SupplierName}
              </h2>
              <div className="flex flex-col space-y-4">
                <p><strong>Supplier ID:</strong> {selectedSupplier.SupplierID}</p>
                <p><strong>Contact:</strong> {selectedSupplier.ContactNo}</p>
                <p><strong>Email:</strong> {selectedSupplier.Email}</p>
                <p><strong>Address:</strong> {selectedSupplier.Address}</p>
              </div>
              <button
                className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedSupplier(null)}
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Supplier Popup */}
      <AnimatePresence>
        {showUpdatePopup && (
          <UpdateSupplierPopup
            isOpen={showUpdatePopup}
            onClose={() => setShowUpdatePopup(false)}
            supplierData={selectedSupplier} // Ensure prop name matches the popup
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageSupplier;
