import mongoose from "mongoose";

const employeeDetails = mongoose.Schema(
    {
    EmpID: {
        type: String,
        unique: true,
        require: true
    },
    employeeName: {
        type: String,
        required: true,
    },
    DOB: {
        type: String,
        required: true,
    },
    NIC: {
        type: String,
        required: true,
        unique: true
    },
    Address: {
        type: String,
        required: true,
    },
    BasicSalary: {
        type: String,
        required: true,
    },
    ContactNo: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Designation: {
        type: String,
        required: true,
    }
});

export const Employee = mongoose.model('Employee' ,employeeDetails);