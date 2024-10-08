import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function DeleteEmployeeDashboard() {
  const [deletedEmployees, setDeletedEmployees] = useState([]);

  useEffect(() => {
    // Fetch deleted employees from localStorage
    const storedDeletedEmployees = JSON.parse(localStorage.getItem('deletedEmployees')) || [];
    setDeletedEmployees(storedDeletedEmployees);
  }, []);

  const handleDelete = (employeeId) => {
    // Confirm before deletion
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this employee?");
    if (!confirmDelete) return;

    // Remove the employee from the state
    const updatedEmployees = deletedEmployees.filter(employee => employee._id !== employeeId);
    setDeletedEmployees(updatedEmployees);

    // Update localStorage
    localStorage.setItem('deletedEmployees', JSON.stringify(updatedEmployees));

    alert("Employee deleted permanently!");
  };

  return (
    <div className="container">
      <div className="header mb-4">
        <h1 className="title">Deleted Employee Dashboard</h1>
        <div className="actions">
          <Link to='/employee-management' className='btn btn-primary'>
            Back to Employee Dashboard
          </Link>
        </div>
      </div>

      {/* Table to display deleted employees */}
      {deletedEmployees.length === 0 ? (
        <p>No employees have been deleted yet.</p>
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
              {/* <th>Actions</th> Add actions column */}
            </tr>
          </thead>
          <tbody>
            {deletedEmployees.map((employee, index) => (
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
                {/* <td>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(employee._id)} >
                    Delete
                  </button>
                </td> */}
                 {/* Add delete button */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DeleteEmployeeDashboard;
