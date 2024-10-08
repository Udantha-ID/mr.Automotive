import mongoose from "mongoose";

const employeeAttendenceSchema =  mongoose.Schema({
    NIC:{
        type: String,
        required: true,
    },
    employeeName:{
        type: String,
        required:true,
    },
    date:{
        type: Date,
        required:true
    },
    InTime:{
        type: String,
    },
    OutTime:{
        type:String,
    },
    WorkingHours:{
        type:String,
    },
    OTHour:{
        type:String,
    },
});

export const EmployeeAttendence = mongoose.model('EmployeeAttendence',employeeAttendenceSchema);



