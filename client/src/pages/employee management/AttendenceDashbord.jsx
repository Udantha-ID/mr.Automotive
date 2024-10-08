import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';
import { AiFillEye, AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import './../../assets/css/Dashboard.css';


function AttendenceDashbord() {
  const [empAttendences, setEmployeeAttendence] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:3000/EmployeeAttendence')
      .then((res) => {
        setEmployeeAttendence(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const filteredEmployees = empAttendences.filter((attendance) =>
    attendance.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attendance.NIC.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <div className='container mt-4'>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className='title'>Attendance Dashboard</h1>
        {/* <Link to='/EmployeeAttendence/create' className=''>
        <h1>Add Attendance</h1>
        </Link> */}

        {/* <Link 
          to='/employee/attendance' 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block margin-left"
        >
          <h1 className="text-xl">Add Attendance</h1>
        </Link> */}

          <div className="actions">
          <Link to='/employee/attendance' className='btn btn-primary'>
             Add Attendance
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

      {loading ? (
        <Spinner />
      ) : (
        <table className='table table-bordered table-hover'>
          <thead className='thead-dark'>
            <tr>
              <th>No</th>
              <th>Employee Name</th>
              <th>NIC</th>
              <th>Date</th>
              <th>InTime</th>
              <th>OutTime</th>
              <th>WorkingHours</th>
              <th>OtHour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((attendance, index) => (
              <tr key={attendance._id}>
                <td>{index + 1}</td>
                <td>{attendance.employeeName}</td>
                <td>{attendance.NIC}</td>
                <td>{attendance.date}</td>
                <td>{attendance.InTime}</td>
                <td>{attendance.OutTime}</td>
                <td>{attendance.WorkingHours}</td>
                <td>{attendance.OTHour}</td>
                <td>
                  <div className='d-flex justify-content-around'>
                    <Link to={`/employee/attendance/update/${attendance._id}`}>
                      <AiOutlineEdit cal>
                      </AiOutlineEdit>
                    </Link>
                    <Link to={`/employee/attendance/delete/${attendance._id}`}>
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
  )
};

export default AttendenceDashbord;
