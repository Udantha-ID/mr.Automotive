import React, { useState, useEffect } from 'react';
import Spinner from '../../Components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function DeleteEmployee() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch employee data
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/Employee/${id}`)
      .then(response => {
        setEmployee(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching employee data", error);
        setLoading(false);
      });
  }, [id]);

  const handleDeleteEmployee = async () => {
    // const confirmDelete = window.confirm(`Are you sure you want to delete ${employee?.employeeName}?`);
    // if (!confirmDelete) return;

    try {
      await axios.put(`http://localhost:3000/Employee/employeeDelete/${employee._id}`);
      
      // Store the deleted employee in localStorage
      const storedDeletedEmployees = JSON.parse(localStorage.getItem('deletedEmployees')) || [];
      storedDeletedEmployees.push(employee);
      localStorage.setItem('deletedEmployees', JSON.stringify(storedDeletedEmployees));

      Swal.fire({
            title: 'Delete Success..',
            text: 'You have successfully Delete in',
            icon: 'success',
            confirmButtonText: 'OK',
            //cancelButtonAriaLabel: 'cancel',
            showCancelButton: false,
            timer:4000,
          })
          navigate('/employee-management/');
          return;
          
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className='text-3xl my-4'>Delete Employee</h1>
      {loading ? <Spinner /> : (
        <div className="flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto">
          {employee && (
            <>
              <h3 className='text-2xl'>Are you sure you want to delete {employee.employeeName}?</h3>
              <button className='p-2 bg-red-600 text-white m-8 w-full' onClick={handleDeleteEmployee}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default DeleteEmployee;
