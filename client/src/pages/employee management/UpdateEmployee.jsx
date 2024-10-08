import React, { useState, useEffect } from 'react';
import Spinner from '../../Components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import './../../assets/css/Dashboard.css';


const UpdateEmployee = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [DOB, setDOB] = useState('');
  const [NIC, setNIC] = useState('');
  const [Address, setAddress] = useState('');
  const [BasicSalary, setBasicsalary] = useState('');
  const [ContactNo, setContactNo] = useState('');
  const [Email, setEmail] = useState('');
  const [Designation, setDesignation] = useState('');
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3000/Employee/${id}`)
    .then((response) => {
      setEmployeeName(response.data.employeeName);
      setDOB(response.data.DOB);
      setNIC(response.data.NIC);
      setAddress(response.data.Address);
      setBasicsalary(response.data.BasicSalary);
      setContactNo(response.data.ContactNo);
      setEmail(response.data.Email);
      setDesignation(response.data.Designation);
      setLoading(false);

      }).catch((error) => {
        setLoading(false);
        alert('An error happened. please check console..');
        console.log(error);
        })
  },[id]);

  const handleUpdateEmployee = () => {


    // Validating NIC
    const NICPatternOld = /^[0-9]{9}[vVxX]$/;  
    const NICPatternNew = /^[0-9]{12}$/;       

      if (!NICPatternOld.test(NIC) && !NICPatternNew.test(NIC)) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'NIC should be in the format XXXXXXXXXV (old) or XXXXXXXXXXXX (new)',
        });
        return;
      }

    // Validating Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(Email)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a valid Email.',
      });
      return;
    }

    // Validating Contact Number
    const contactNumberPattern = /^[0-9]{10}$/;
    if (!contactNumberPattern.test(ContactNo)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Contact Number should be in the format XXXXXXXXXX.',
        });
        return;
        }

    //Basic Salary Validation
    const basicSalaryPattern = /^[1-9][0-9]*(\.\d+)?$/; // Pattern to validate positive numbers greater than 0

        if (!basicSalaryPattern.test(BasicSalary)) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Basic Salary must be a positive number greater than 0.',
          });
          return;
        }


    const data = {
      employeeName,
      DOB,
      NIC,
      Address,
      BasicSalary,
      ContactNo,
      Email,
      Designation,
    };

    console.log("Data to be sent:", data); // Debugging

    setLoading(true);
    axios
      .put(`http://localhost:3000/Employee/${id}`, data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          title: 'Update Success..',
          text: 'You have successfully Update in',
          icon: 'success',
          confirmButtonText: 'OK',
          //cancelButtonAriaLabel: 'cancel',
          showCancelButton: false,
          timer:4000,
        })
        navigate('/employee-management/');
        return;
      })
      .catch((error) => {
        setLoading(false);
        alert("An error happened. Please check the console.");
        console.log(error);
      });
  };

  return (
    <div className='form-container'>
      <h1 className='form-title'>Update {employeeName} Employee Detals</h1>

      {loading ? <Spinner /> : ''}
      <div className="form-content">

        <div className="form-group">
          <label className='text-xl mr-8 text-gray-500'>Employee Name</label>
          <input type="text" value={employeeName} 
            onChange={(e) =>{
              const onlyText = e.target.value.replace(/[^a-zA-Z\s]/g, '');
              setEmployeeName(onlyText);
            }}
            className='border-2 border-gray-500 py-2 w-full' />
        </div>

        <div className="my-1">
          <label className='text-xl mr-4 text-gray-500'>Date Of Birth</label>
          <input type="date"
                value={DOB}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  const today = new Date();
                  
                  // Calculate the difference in years between today and selected date
                  const age = today.getFullYear() - selectedDate.getFullYear();
                  const monthDiff = today.getMonth() - selectedDate.getMonth();
                  const dayDiff = today.getDate() - selectedDate.getDate();

                  // If the person is younger than 18, display error
                  if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Employee must be at least 18 years old.',
                    });
                    return;
                  }

                  // If valid, set the DOB state
                  setDOB(e.target.value);
                }}
                className="form-input"
              />
        </div>

        <div className="my-4">
          <label className='text-xl mr-4 text-gray-500'>NIC</label>
          <input type="text" value={NIC} 
            onChange={(e) => setNIC(e.target.value)}
            className='border-2 border-gray-500 py-2 w-full' />
        </div>

        <div className="my-4">
          <label className='text-xl mr-4 text-gray-500'>Address</label>
          <input type="text" value={Address} 
            onChange={(e) => setAddress(e.target.value)}
            className='border-2 border-gray-500 py-2 w-full' />
        </div>

        <div className="my-4">
          <label className='text-xl mr-4 text-gray-500'>Basic Salary</label>
          <input type="number" value={BasicSalary} 
            onChange={(e) => setBasicsalary(e.target.value)}
            className='border-2 border-gray-500 py-2 w-full' />
        </div>

        <div className="my-4">
          <label className='text-xl mr-4 text-gray-500'>Contact Number</label>
          <input type="text" value={ContactNo} 
            onChange={(e) => setContactNo(e.target.value)}
            className='border-2 border-gray-500 py-2 w-full' />
        </div>

        <div className="my-4">
          <label className='text-xl mr-4 text-gray-500'>Email</label>
          <input type="email" value={Email} 
            onChange={(e) => setEmail(e.target.value)}
            className='border-2 border-gray-500 py-2 w-full' />
        </div>

        <div className="my-4">
          <label className='text-xl mr-4 text-gray-500'>Designation</label>
          <input  
                type="text" 
                value={Designation} 
                onChange={(e) => {
                  const onlyText = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  setDesignation(onlyText);
                }} 
                className='form-input' />
        </div>

        <button className='p-2 bg-sky-300 m-2' onClick={handleUpdateEmployee}>
          Update Details
        </button>

      </div>
    </div>
  );
};

export default UpdateEmployee;
