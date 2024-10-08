import React, { useEffect, useState } from 'react';
import axios from 'axios';
import  Spinner  from './Spinner';
import { Link } from 'react-router-dom';
import { AiFillEye, AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import './../../assets/css/Dashboard.css';



function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:3000/Employee') // Adjust the API endpoint if needed
      .then((response) => {
        setEmployees(response.data.data);
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
      setEmployees(response.data.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error", error);
      setError("An error occurred while fetching the employee for the search query.");
      setLoading(false);
    }
  };

  const searchFilter = (employee) => {
    const query = searchQuery.toLowerCase();
    return (
      employee.employeeName.toLowerCase().includes(query) ||
      employee.NIC.toLowerCase().includes(query)
    );
  };

  const filteredEmployees = employees.filter(searchFilter);

  return (
    <div className='container'>
      {/* Header */}
      <div className="header mb-4">
        <h1 className='title'>Employee Dashboard</h1>
        <div className="actions">
          <Link to='/employee/creat' className='btn btn-primary'>
            Add New Employee
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
        {/* Image is optional, update src if necessary */}
        {/* <img src='' alt=""/> */}
        {/* <button onClick={handleSearch} className='btn btn-secondary'>Search</button> */}
      </div>

      {/* Error Display */}
      {error && <p className="text-danger">{error}</p>}

      {/* Spinner or Table */}
      {loading ? (
        <Spinner />
      ) : (
        <table className='table'>
          <thead className='thead'>
            <tr>
              <th>No</th>
              <th>Employee Name</th>
              <th>DOB</th>
              <th>NIC</th>
              <th>Address</th>
              <th>Designation</th>
              <th>Basic Salary</th>
              <th>Contact No</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee._id}>
                <td>{index + 1}</td>
                <td>{employee.employeeName}</td>
                <td>{employee.DOB}</td>
                <td>{employee.NIC}</td>
                <td>{employee.Address}</td>
                <td>{employee.Designation}</td>
                <td>Rs: {employee.BasicSalary}</td>
                <td>{employee.ContactNo}</td>
                <td>{employee.Email}</td>
                <td>
                  <div className='action-icons'>
                    <Link to={`/employee/show/${employee._id}`}>
                      <AiFillEye className='text-success' />
                    </Link>
                    <Link to={`/employee/update/${employee._id}`}>
                      <AiOutlineEdit className='text-warning' />
                    </Link>
                    <Link to={`/employee/delete/${employee._id}`}>
                      <MdOutlineDelete className='text-danger' />
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

export default EmployeeDashboard;
