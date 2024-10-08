import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/inventory management/DashboardLayout";
import DashboardLayouSt from "./pages/Supplier management/DashboardLayoutS";
import DashboardLayoutP from "./pages/Payment management/DashboardLayoutP";

import Sidebar from "./pages/inventory management/Sidebar";
import Home from "./pages/Home";

import AddSparePartPage from "./pages/inventory management/AddSparePartPage";
import BookingPage from "./pages/bookings/BookingPage";
import CreateBooking from "./pages/bookings/CreateBooking";
import ShowAllPackages from "./pages/packageManagement/ShowAllPackages";

import AddSupplierPage from "./pages/Supplier management/AddSupplierPage";

import DisplayBookings from "./pages/bookings/DisplayBookings";
import DisplayPayments from "./pages/Payment management/DisplayPayments";

import AdminSidebar from "./components/AdminSidebar";

// import UserDashboard from "./pages/user/UserDashboard";


// import ShowPayment from "./pages/Payment management/DashboardOverview";


import Login from "./components/Login";
import Signup from "./components/Signup";
import ShowModRequest from "./pages/modificationManagement/ShowModRequest";

import CustomModification from "./pages/modificationManagement/CustomModification";

//import ShowPayment from "./pages/Payment management/DashboardOverview";

 import ShowPayment from "./pages/Payment management/DashboardOverview";

import ProductPage from "./pages/inventory management/ProductPage";
import SinglePartPage from "./pages/inventory management/SinglePartPage";

import AdminDashboard from "./components/AdminDashboard/DashboardLayout";

//Employee Files Call
import DashboardLayoutEmp from "./pages/employee management/DashboardLayoutEmp";
import AddEmployee from "./pages/employee management/AddEmployee";
import ShowEmployee from "./pages/employee management/ShowEmployee";
import UpdateEmployee from "./pages/employee management/UpdateEmployee";
import DeleteEmployee from "./pages/employee management/DeleteEmployee";
import AddAttendence from "./pages/employee management/AddAttendence";
import UpdateAttendence from "./pages/employee management/UpdateAttendence";
import DeleteAttendence from "./pages/employee management/DeleteAttendence";
import AddEmployeeSalary from "./pages/employee management/AddEmployeeSalary";
import ShowSalary from "./pages/employee management/ShowSalary";
import UpdateSalary from "./pages/employee management/UpdateSalary";
import DeleteSalary from "./pages/employee management/DeleteSalary";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/inventory-management/*" element={<DashboardLayout />} />
        <Route path="/Booking" element={<BookingPage />} />
        <Route path="/book/add/:id" element={<CreateBooking />} />

        {/* Employee Files */}
        <Route path="/employee-management/*" element={<DashboardLayoutEmp/>}/>
        <Route path="/employee/creat" element={<AddEmployee/>}/>
        <Route path="/employee/show/:id" element={<ShowEmployee/>}/>
        <Route path="/employee/update/:id" element={<UpdateEmployee/>}/>
        <Route path="/employee/delete/:id" element={<DeleteEmployee/>}/>
        <Route path="/employee/attendance" element={<AddAttendence/>} />
        <Route path="/employee/attendance/update/:id" element={<UpdateAttendence />} />
        <Route path="/employee/attendance/delete/:id" element={<DeleteAttendence />} />
        <Route path="/employee/salary/create" element={<AddEmployeeSalary />} />
        <Route path="/employee/salary/show/:id" element={<ShowSalary />} />
        <Route path="/employee/salary/update/:id" element={<UpdateSalary />} />
        <Route path="/employee/salary/delete/:id" element={<DeleteSalary />} />


        <Route path="/pkg" element={<ShowAllPackages />} />

        <Route path="/Service" element={<CustomModification />} />

        <Route path="/supplier-management/*" element={<DashboardLayouSt />} />

        {/* <Route path="/payments/allPayments" element={<ShowPayment />}></Route>
        <Route path="/payments/detail/:id" element={<ReadOnePayment />}></Route>
        <Route path="/payments/create" element={<CreatePayment />}></Route>
        <Route path="/payments/edit/:id" element={<EditPayment />}></Route>
        <Route path="/payments/delete/:id" element={<DeletePayment />}></Route> */}

        <Route path="/payment-management/*" element={<DashboardLayoutP />} />

        <Route path="/side" element={<AdminSidebar />} />
        {/* <Route path="/userside" element={<UserDashboard />} /> */}

        <Route path="/Bookings" element={<DisplayBookings />} />
        <Route path="/Reg As Supplier" element={<AddSupplierPage />} />


        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/product" element={<ProductPage />} />
        <Route path="/sparepart/:id" element={<SinglePartPage />} />

        <Route path="/payments" element={<DisplayPayments />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/modreq" element={<ShowModRequest />} />

        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
