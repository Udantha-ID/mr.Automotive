import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import { Employee } from '../../../../../Backend/models/Employee';
import './../../assets/css/Dashboard.css';
import Swal from 'sweetalert2';
import { Today } from '@mui/icons-material';

const AddAttendence = () => {
    const [NIC ,setNIC] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [date, setdate] = useState('');
    const [InTime, setInTime] = useState('');
    const [OutTime, setOutTime] = useState('');
    const [WorkingHours, setWorkingHours] = useState('');
    const [OTHour, setOTHour] = useState('');
    const [today, setToday] = useState("");
    
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // The setSelectedEmployee function is used to update this state when the employee selection changes.
    const [selectEmployee, setSelectEmployee] = useState({
        NIC: '',
        employeeName: '',
    });

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:3000/Employee')
            .then((response) => {
                //console.log('API response:', response.data); // Check the data structure
                setEmployees(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching employees:', error);
                setEmployees([]);
                setLoading(false);
            });
    }, []);
    
    useEffect(() => {
        const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format
        setToday(currentDate);
    }, []);

    //Handle to update selected employee based on NIC change
    const handleNIC = (e) =>{
        const selectedNIC = e.target.value;
        const selectemployee = employees.find((emp) => emp.NIC === selectedNIC);
        setSelectEmployee({
            ...selectEmployee,
            NIC: selectedNIC,
            employeeName: selectemployee.employeeName,
        });
    };

    //Handle to update selected employee based on employee name change
    const handleEmployeeName = (e) => {
        const selectedEmployeeName = e.target.value;
        const selectemployee = employees.find(
            (emp) => emp.employeeName === selectedEmployeeName);
        setSelectEmployee({
            ...selectEmployee,
            NIC: selectemployee.NIC || '',
            employeeName: selectedEmployeeName,

        });
    };

    // Working hours calculation based on InTime and OutTime
const handleInTime = (e) => {
    setInTime(e.target.value);
    calculateHoursWorked(e.target.value, OutTime);
};

const handleOutTime = (e) => {
    setOutTime(e.target.value);
    calculateHoursWorked(InTime, e.target.value);
};


// Calculate working hours and overtime method
const calculateHoursWorked = (inTime, outTime) => {
    const inTimeParts = inTime.split(':');
    const outTimeParts = outTime.split(':');

    const InTimeDate = new Date(2000, 0, 1, inTimeParts[0], inTimeParts[1]);
    const OutTimeDate = new Date(2000, 0, 1, outTimeParts[0], outTimeParts[1]);

    // Check if Time inputs are valid
    if (isNaN(InTimeDate.getTime()) || isNaN(OutTimeDate.getTime())) {
        console.error('Invalid Time Input. Please re-enter.');
        return;
    }
  
    const timeDiff = OutTimeDate - InTimeDate;
    const hoursWorked = timeDiff / (1000 * 60 * 60);
    const normalWorkingHours = 8;

    // Determine overtime
    if (hoursWorked > normalWorkingHours) {
        const overtimeHours = hoursWorked - normalWorkingHours;
        setOTHour(overtimeHours.toFixed(2));
        setWorkingHours(normalWorkingHours.toFixed(2));
    } else {
        setOTHour('0.00');
        setWorkingHours(hoursWorked.toFixed(2));
    }
};

console.log('Employees state:', employees);

const handleAddEmployeeAttendence = () => {

        // Validation
        if (!selectEmployee.NIC || !selectEmployee.employeeName || !date) { // Ensure date is checked correctly
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in fields Emp ID, Employee Name, Date.',
            });
            return;
        }

        //Attendance Date Validation

    const data = {
        NIC: selectEmployee.NIC,
        employeeName: selectEmployee.employeeName,
        date: date,
        InTime,
        OutTime,
        WorkingHours,
        OTHour
      };
    setLoading(true);
    axios
      .post('http://localhost:3000/EmployeeAttendence', data)
      .then(() => {
        setLoading(false);
        Swal.fire({
            title: 'Attendence Added..',
            text: 'You have successfully Add in',
            icon: 'success',
            confirmButtonText: 'OK',
            //cancelButtonAriaLabel: 'cancel',
            showCancelButton: false,
            timer:3000,
          })
        navigate('/employee-management/attendence');
        return;
        // alert('Details Update Sussces.')
        
      })
      .catch((error) => {
        setLoading(false);
        alert("An error happened. Please check the console.");
        console.log(error);
      });
  };

  const handleRecodeInTime = () =>{
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const addInTime = `${hours}:${minutes}`;
    setInTime(addInTime);
    // Recalculate hours worked
    calculateHoursWorked(addInTime, OutTime);
  }

 const handleRecodeOutTime = () => {
   const currentTime = new Date();
   const hours = currentTime.getHours().toString().padStart(2, '0');
   const minutes = currentTime.getMinutes().toString().padStart(2, '0');
   const addOutTime = `${hours}:${minutes}`;
   setOutTime(addOutTime);  // Change setInTime to setOutTime
   // Recalculate hours worked
   calculateHoursWorked(InTime, addOutTime);
 };
 
  
  return (
    <div className="attendance-container">
    <h2 className="attendance-title">Add Employee Attendance</h2>

    {/* Display a spinner while loading */}
    {loading && <Spinner />} 

    <div className="form-group">
        <label htmlFor="NIC" className="form-label">Employee NIC</label>
        <select
            id="NIC"
            className="form-select"
            value={selectEmployee.NIC}
            onChange={handleNIC}
        >
            <option value=''>Select NIC</option>
            {employees.map((Employee) => (
                <option key={Employee._id} value={Employee.NIC}>
                    {Employee.NIC}
                </option>
            ))}
        </select>
    </div>

    <div className="form-group">
        <label htmlFor="employeeName" className="form-label">Employee Name</label>
        <select
            id="employeeName"
            className="form-select"
            value={selectEmployee.employeeName}
            onChange={handleEmployeeName}
        >
            <option value=''>Select Employee Name</option>
            {employees.map((Employee) => (
                <option key={Employee._id} value={Employee.employeeName}>
                    {Employee.employeeName}
                </option>
            ))}
        </select>
    </div>

    <div className="form-group">
        <label htmlFor="date" className="form-label">Date</label>
        <input
            type="date"
            id="date"
            min={today}   
            max={today}  
            className="form-control"
            value={date}
            onChange={(e) => setdate(e.target.value)}
        />
    </div>

    <div className="form-group">
        <label htmlFor="InTime" className="form-label">In Time</label>
        <input
            type="time"
            id="InTime"
            className="form-control"
            value={InTime}
            onChange={handleInTime}
        />
    </div>

    <div className="form-group">
        <label htmlFor="OutTime" className="form-label">Out Time</label>
        <input
            type="time"
            id="OutTime"
            className="form-control"
            value={OutTime}
            onChange={handleOutTime}
        />
    </div>

    <div className="form-group">
        <label htmlFor="WorkingHours" className="form-label">Working Hours</label>
        <input
            type="text"
            id="WorkingHours"
            className="form-control"
            value={WorkingHours || ''}
            readOnly
        />
    </div>

    <div className="form-group">
        <label htmlFor="OTHour" className="form-label">Overtime Hours</label>
        <input
            type="text"
            id="OTHour"
            className="form-control"
            value={OTHour || ''}
            readOnly
        />
    </div>

    <div className="form-buttons">
        <button className="btn-primary" onClick={handleAddEmployeeAttendence}>
            Add Attendance
        </button>
        <Link to="/employee-management/attendence" className="btn-secondary">
            Cancel
        </Link>
    </div>
</div>

);

}

export default AddAttendence