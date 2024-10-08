import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';
import { AiFillEye, AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineDelete } from 'react-icons/md';
// import '../../Styles/Dashboard.css';
import { aside } from 'framer-motion/client';
import Swal from 'sweetalert2';

function SalaryDashboard() {
  const [employeeSalary, setEmployeeSalary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:3000/EmployeeSalary')
      .then((response) => {
        setEmployeeSalary(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/searchEmployee?search=${searchQuery}`);
      setEmployeeSalary(response.data.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error", error);
      setError("An error occurred while fetching the employee for the search query.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      }).then(async(result) => {
        if (result.value) {
          try {
            const response = await axios.delete(`http://localhost:3000/EmployeeSalary/${id}`);
            Swal.fire("Deleted!", "Spare part has been deleted.", "success");
          fetchParts();
          } catch (error) {
            console.error("Error", error);
            Swal.fire("Error!", "Failed to delete spare part.", "error");
            }
            }
          });
  };

  const filteredEmployeeSalary = employeeSalary.filter((salary) => {
    const query = searchQuery.toLowerCase();
    return (
      salary.employeeName.toLowerCase().includes(query) ||
      salary.NIC.toLowerCase().includes(query)
    );
  });

  const parseFloat = (str, value) => {
    str = str.toString();
    str = str.slice(0, (str.indexOf('.')) + value + 1)
    return Number(str);
  }

  return (
    <div className='container'>
    
      <div className="header mb-4">
        <h1 className='title'>Employee Salary Dashboard</h1>
        <div className="actions">
          <Link to='/employee/salary/create' className='btn btn-primary'>
            Add Salary Employee
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className='search-bar'>
        <input
          type='text'
          placeholder='Search by name or NIC'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='search-input'
        />
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <table className='table'>
          <thead className='thead'>
            <tr>
              <th>No</th>
              <th>Employee Name</th>
              <th>NIC</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Total OT Hours</th>
              <th>Total OT Pay</th>
              <th>Basic Salary</th>
              <th>Total Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployeeSalary.map((salary, index) => (
              <tr key={salary._id}>
                <td>{index + 1}</td>
                <td>{salary.employeeName}</td>
                <td>{salary.NIC}</td>
                <td>{salary.formDate}</td>
                <td>{salary.toDate}</td>
                <td>{salary.totalOtHours} Hours</td>
                <td>Rs: {salary.totalOtAmount}</td>
                <td>Rs: {salary.basicSalary}</td>
                <td>Rs: {Number(salary.totalSalary).toFixed(2)}</td>
                <td>
                  <div className='action-icons'>
                    <Link to={`/employee/salary/show/${salary._id}`}>
                      <AiFillEye className='text-success' />
                    </Link>
                    <Link to={`/employee/salary/update/${salary._id}`}>
                      <AiOutlineEdit className='text-warning' />
                    </Link>
                    <Link to={`/employee/salary/delete/${salary._id}`}>
                      <MdOutlineDelete  className='text-danger' />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SalaryDashboard;
