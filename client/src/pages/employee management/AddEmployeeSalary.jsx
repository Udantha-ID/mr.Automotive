import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Spinner from "./Spinner";
import { select } from "framer-motion/client";
const AddEmployeeSalary = () => {

    // const [employeeId, setEmployeeId ] = useState('');
    const [employeeName, setemployeeName] = useState('');
    const [NIC, setNIC] = useState('');
    const [formDate, setformDate] = useState('');
    const [toDate, settoDate] = useState('');
    const [totalOThours, settotalOThours] = useState('');
    const [totalOTpay, settotalOTpay] = useState('');
    const [epfAmount, setEpfAmount] = useState('');
    const [BasicSalary, setBasicSalary] = useState('');
    const [totalSalary, setTotalSalary] = useState('');
    const [employees, setEmployees] = useState([]);
    const [employeesAttendance, setEmployeesAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [includeEPF, setIncludeEPF] = useState(false);
    const navigate = useNavigate();

    // The setSelectedEmployee function is used to update this state when the employee selection changes.
    const [selectEmployee, setSelectEmployee] = useState({
        
        // _id: '',
        employeeID: '',
        NIC: '',
        employeeName: '',

    });

    // Get the Employee Details
    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:3000/Employee')
            .then((response) => {
                setEmployees(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching employees:', error);
                setEmployees([]);
                setLoading(false);
            });
    }, []);

    // Get the Employee Attendance
    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:3000/EmployeeAttendance')
            .then((res) => {
                setEmployeesAttendance(res.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const getEmployeeAttendnceByDateRange=()=>{
        axios.get('http://localhost:3000/EmployeeAttendance/date_range')
    }

    // Handle to update selected employee based on NIC change
    const handleNIC = (e) => {
        const selectedNIC = e.target.value;
        const selectemployee = employees.find((emp) => emp.NIC === selectedNIC);
        setSelectEmployee({
            ...selectEmployee,
            NIC: selectedNIC,
            employeeName: selectemployee.employeeName,
            employeeID: selectemployee._id,
        });
        setBasicSalary(selectemployee.BasicSalary);
    };

    // Handle to update selected employee based on employee name change
    const handleEmployeeName = (e) => {
        const selectedEmployeeName = e.target.value;
        const selectemployee = employees.find(
            (emp) => emp.employeeName === selectedEmployeeName
        );
        setSelectEmployee({
            ...selectEmployee,
            NIC: selectemployee.NIC || '',
            employeeName: selectedEmployeeName,
        });
        setBasicSalary(selectemployee.BasicSalary);
    };

    // Calculate Total OT Hours based on employee NIC
    const calculateTotalOtHour = () => {
        const filteredAttendance = employeesAttendance.filter(
            (attendance) =>
                attendance.NIC === selectEmployee.NIC &&
                new Date(attendance.date) >= new Date(formDate) &&
                new Date(attendance.date) <= new Date(toDate)
        );

        const totalOtHour = filteredAttendance.reduce(
            (total, attendance) => total + attendance.OTHour,
            0
        );

        // Set the total overtime hours state
        settotalOThours(totalOtHour);
    };

    // Calculate Total OT Pay based on total OT hours
    const calculateTotalOTpay = () => {
        const calculatedTotalOTpay = totalOThours * 585;
        settotalOTpay(calculatedTotalOTpay);
    };

    // Calculate total salary including EPF if selected
    const calculateTotalSalary = () => {
        let totalSalary = totalOTpay + parseFloat(BasicSalary);
        let epfAmount = 0;
    
        // Fetch employee attendance by NIC and date range
        axios.get(`http://localhost:3000/EmployeeAttendence/date_range/${selectEmployee.NIC}`, {
            params: {
                formDate,
                toDate
            }
        }).then((e) => {
            const attendanceRecords = e.data;
            const totalOTHours = attendanceRecords.reduce((sum, record) => {
                return sum + (parseFloat(record.OTHour) || 0);
            }, 0);
            settotalOThours(totalOTHours);
            calculateTotalOTpay();
        });
    
        // If EPF is included, calculate EPF amount
        if (includeEPF) {
            epfAmount = totalSalary * 0.08;
            totalSalary -= epfAmount;
        }
    
        setTotalSalary(totalSalary);  // Update total salary
        setEpfAmount(epfAmount);  // Update EPF amount for the report
    };
    

    // Validate and handle the salary submission
    const handleAddEmployeeSalary = async () => {
        if (!selectEmployee.NIC || !selectEmployee.employeeName || !formDate || !toDate || !BasicSalary) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all required fields.',
            });
            return;
        }

        // Sequentially calculate OT hours, OT pay, and total salary
        // calculateTotalOtHour();
        // setTimeout(() => {
        //     calculateTotalOTpay();
        //     setTimeout(() => {
        //         calculateTotalSalary();
        //     }, 100);
        // }, 100);
        calculateTotalOTpay();
        calculateTotalOtHour();
        calculateTotalSalary();


        const data = {
            NIC: selectEmployee.NIC,
            employeeName: selectEmployee.employeeName,
            formDate,
            toDate,
            totalOThours,
            totalOTpay,
            epfAmount: epfAmount,
            basicSalary: BasicSalary,
            totalSalary,
        };

        setLoading(true);
        axios
            .post('http://localhost:3000/EmployeeSalary', data)
            .then(() => {
                setLoading(false);
                Swal.fire({
                    title: 'Create Success..',
                    text: 'You have successfully Add in',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    //cancelButtonAriaLabel: 'cancel',
                    showCancelButton: false,
                    timer:4000,
                  })
                navigate('/employee-management/salary');
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };

    return (
        <div className="attendance-container">
            <h2 className="attendance-title">Add  Employee Salary</h2>


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
                <label htmlFor="date" className="form-label">From Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={formDate}
                    onChange={(e) => setformDate(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="toDate" className="form-label">To Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => settoDate(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="OutTime" className="form-label">Total OT Hours</label>
                <input
                    type="text"
                    className="form-control"
                    value={totalOThours}
                    readOnly
                />
                {/* <button onClick={calculateTotalOtHour}>Calculate OT Hours</button> */}
            </div>

            <div className="form-group">
                <label htmlFor="BasicSalary" className="form-label">Basic Salary</label>
                <input
                    className="form-control"
                    type='number'
                    value={BasicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                    readOnly
                />
            </div>

            <div className="form-group">
                <label htmlFor="EPF" className="form-label">Include EPF</label>
                <button onClick={() => setIncludeEPF(!includeEPF)}>
                    {includeEPF ? 'Yes' : 'No'}
                </button>
            </div>

            <div className="form-group">
                <label htmlFor="TotalOTpay" className="form-label">Total OT Pay</label>
                <input
                    type="text"
                    className="form-control"
                    value={totalOTpay}
                    readOnly
                />
                {/* <button onClick={calculateTotalOTpay}>Calculate OT Pay</button> */}
            </div>

            <div className="form-group">
                <label htmlFor="TotalSalary" className="form-label">Total Salary</label>
                <input
                    type="text"
                    className="form-control"
                    value={totalSalary}
                    readOnly
                />
               <button 
                onClick={calculateTotalSalary} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                Calculate Total Salary
                </button>

            </div>
            

            <div className="form-buttons">
                <button className="btn-primary" onClick={handleAddEmployeeSalary}>
                    Add Salary Details
                </button>
                <Link to="/employee-management/salary" className="btn-secondary">
                    Cancel
                </Link>
            </div>
        </div>
    );
};

export default AddEmployeeSalary;
