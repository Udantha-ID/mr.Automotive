import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from "./Spinner";

const UpdateSalary = () => {
    const { id } = useParams(); // Get the salary record ID from the URL
    const [employeeName, setEmployeeName] = useState('');
    const [NIC, setNIC] = useState('');
    const [formDate, setFormDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [totalOThours, setTotalOThours] = useState('');
    const [totalOTpay, setTotalOTpay] = useState('');
    const [BasicSalary, setBasicSalary] = useState('');
    const [totalSalary, setTotalSalary] = useState('');
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [includeEPF, setIncludeEPF] = useState(false);
    const [selectEmployee, setSelectEmployee] = useState({
        employeeID: '',
        NIC: '',
        employeeName: '',
    });
    const navigate = useNavigate();

    // Fetch employee list for NIC and name selection
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

    // Handle NIC change and update selected employee details
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

    // Handle employee name change and update selected employee details
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

    // Calculate total OT hours based on NIC
    const calculateTotalOtHour = () => {
        // Logic to calculate total OT hours (similar to AddEmployeeSalary)
        // You can reuse the same logic here
    };

    // Calculate OT pay
    const calculateTotalOTpay = () => {
        const calculatedTotalOTpay = totalOThours * 585;
        setTotalOTpay(calculatedTotalOTpay);
    };

    // Calculate total salary
    const calculateTotalSalary = () => {
        let totalSalary = totalOTpay + parseFloat(BasicSalary);
        if (includeEPF) {
            const epfAmount = totalSalary * 0.08;
            totalSalary -= epfAmount;
        }
        setTotalSalary(totalSalary);
    };

    // Handle salary update
    const handleUpdateEmployeeSalary = async () => {
        if (!selectEmployee.NIC || !selectEmployee.employeeName || !formDate || !toDate || !BasicSalary) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all required fields.',
            });
            return;
        }

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
            basicSalary: BasicSalary,
            totalSalary,
        };

        setLoading(true);
        axios
            .put(`http://localhost:3000/EmployeeSalary/${id}`, data)
            .then(() => {
                setLoading(false);
                Swal.fire({
                    title: 'Update Success',
                    text: 'Salary details have been updated successfully',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 4000,
                });
                navigate('/employee-management/salary');
            })
            .catch((error) => {
                setLoading(false);
                console.error('Error updating salary details:', error);
            });
    };

    return (
        <div className="attendance-container">
            <h2 className="attendance-title">Update Employee Salary</h2>

            {/* Spinner */}
            {loading && <Spinner />}

            <div className="form-group">
                <label htmlFor="NIC" className="form-label">Employee NIC</label>
                <select
                    id="NIC"
                    className="form-select"
                    value={NIC}
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
                    value={employeeName}
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

            {/* Date inputs */}
            <div className="form-group">
                <label htmlFor="formDate" className="form-label">From Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="toDate" className="form-label">To Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </div>

            {/* Total OT Hours and OT Pay */}
            <div className="form-group">
                <label htmlFor="totalOThours" className="form-label">Total OT Hours</label>
                <input
                    type="text"
                    className="form-control"
                    value={totalOThours}
                    readOnly
                />
            </div>

            <div className="form-group">
                <label htmlFor="totalOTpay" className="form-label">Total OT Pay</label>
                <input
                    type="text"
                    className="form-control"
                    value={totalOTpay}
                    readOnly
                />
            </div>

            {/* Basic Salary */}
            <div className="form-group">
                <label htmlFor="BasicSalary" className="form-label">Basic Salary</label>
                <input
                    type="number"
                    className="form-control"
                    value={BasicSalary}
                    readOnly
                />
            </div>

            {/* Total Salary */}
            <div className="form-group">
                <label htmlFor="totalSalary" className="form-label">Total Salary</label>
                <input
                    type="text"
                    className="form-control"
                    value={totalSalary}
                    readOnly
                />
            </div>

            {/* Submit button */}
            <div className="form-buttons">
                <button className="btn-primary" onClick={handleUpdateEmployeeSalary}>
                    Update Salary
                </button>
                <button onClick={() => navigate('/employee-management/salary')} className="btn-secondary">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default UpdateSalary;
