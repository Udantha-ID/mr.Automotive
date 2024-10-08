import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Spinner from './Spinner';
import emailjs from 'emailjs-com';
import './../../assets/css/Dashboard.css';

const AddEmployee = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [DOB, setDOB] = useState('');
  const [NIC, setNIC] = useState('');
  const [Address, setAddress] = useState('');
  const [BasicSalary, setBasicsalary] = useState('');
  const [ContactNo, setContactNo] = useState('');
  const [Email, setEmail] = useState('');
  const [Designation, setDesignation] = useState('')
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendEmailEmployee = (employee) => {
    const emailConfig = {
        serviceID: "service_3p901v6",
        templateID: "template_cwl7ahv",
        userID: "-r5ctVwHjzozvGIfg",
    };
    
    emailjs
      .send(
        emailConfig.serviceID,
        emailConfig.templateID,
        {
          to_email: employee.Email, 
          subject: `Welcome to the Team, ${employee.employeeName}!`,
          message: `
          Dear ${employee.employeeName},

          Welcome to Mr. Automotive Service Center!

          Here are your details:
          - Name: ${employee.employeeName}
          - Designation: ${employee.Designation}
          - Basic Salary: ${employee.BasicSalary}
          - Contact Number: ${employee.ContactNo}

          We're excited to have you onboard!

          Best regards,
          Mr. Automotive Team
        `,
        },
        emailConfig.userID
      )
      .then(() => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Email sent successfully!",
          showConfirmButton: true,
          timer: 2000,
        });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Error sending email!",
          showConfirmButton: true,
          timer: 2000,
        });
      });
  };

  const handleAddEmployee = async () => {
    if (!employeeName || !DOB || !NIC || !Address || !BasicSalary || !ContactNo || !Email || !Designation) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    // Validating NIC
    const NICPatternOld = /^[0-9]{9}[vVxX]*$/i;
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

    // Basic Salary Validation
    const basicSalaryPattern = /^[1-9][0-9]*(\.\d+)?$/;
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

    try {
      setLoading(true); // Set loading before starting the API call
      await axios.post('http://localhost:3000/Employee', data);

      Swal.fire({
        title: 'Add Employee Success!',
        text: 'Employee successfully added.',
        icon: 'success',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Send Confirmation Email?",
            text: "Do you want to send a confirmation email to the employee?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, send it",
            cancelButtonText: "No, skip",
          }).then((emailResult) => {
            if (emailResult.isConfirmed) {
              sendEmailEmployee(data); // Correct email sending function
            }
          });
        }
      });

      navigate('/employee-management/');
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add employee.",
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoading(false); // Ensure loading is stopped after everything completes
    }
  };                 

  return (
    <div className='form-container'>
  <h1 className='form-title'>Add Employee</h1>

  {loading && <Spinner />}
  
  <div className="form-content">
    <div className="form-group">
      <label className='form-label'>Employee Name</label>
      <input  
      type="text" 
      value={employeeName} 
      onChange={(e) => {
        const onlyText = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setEmployeeName(onlyText);
      }} className='form-input' />
    </div>

    <div className="form-group">
          <label className="form-label">Date Of Birth</label>
          <input
            type="date"
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

    <div className="form-group">
      <label className='form-label'>NIC Number</label>
      <input type="text" 
        value={NIC} 
        onChange={(e) => {
          const reges = /^[0-9xvXVI]*$/;
          if (e.target.value.match(reges)) {
            setNIC(e.target.value);
        }}
      }
        maxLength={12}
        className='form-input' />
    </div>

    <div className="form-group">
      <label className='form-label'>Address</label>
      <input type="text" value={Address} 
        onChange={(e) => setAddress(e.target.value)}
        className='form-input' />
    </div>

    <div className="form-group">
  <label className='form-label'>Designation</label>
  
  <select 
    value={Designation} 
    onChange={(e) => setDesignation(e.target.value)} 
    className='form-input'
  >
    <option value="">-- Select Designation --</option>
    <option value="Diesel mechanic">Diesel mechanic</option>
    <option value="Automotive mechanic">Automotive mechanic</option>
    <option value="Auto body mechanics">Auto body mechanics</option>
    <option value="Service technicians">Service technicians</option>
    <option value="Auto glass mechanics">Auto glass mechanics</option>
    <option value="Tire mechanics">Tire mechanics</option>
    {/* <option value="Tester">Tester</option> */}
  </select>
</div>



    <div className="form-group">
      <label className='form-label'>Basic Salary</label>
      <input type="number" value={BasicSalary} 
        onChange={(e) => setBasicsalary(e.target.value)}
        className='form-input' />
    </div>

    <div className="form-group">
      <label className='form-label'>Contact Number</label>
      <input type="number" value={ContactNo} 
        onChange={(e) => setContactNo(e.target.value)}
        className='form-input' />
    </div>

    <div className="form-group">
      <label className='form-label'>Email</label>
      <input type="email" value={Email} 
        onChange={(e) => setEmail(e.target.value)}
        className='form-input' />
    </div>

    {/* <div className="form-group">
      <label className='form-label'>Designation</label>
      <input  
      type="text" 
      value={Designation} 
      onChange={(e) => {
        const onlyText = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setDesignation(onlyText);
      }} className='form-input' />
    </div> */}

    <button className='form-button' onClick={handleAddEmployee}>
      Add Employee
    </button>
    
    {/* <Link to="/Attemdence/dashbord" className="btn-secondary">
            Cancel
        </Link> */}
   
  </div>
</div>

  );
};

export default AddEmployee;
