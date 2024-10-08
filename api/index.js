import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.routs.js";
import cors from "cors";
import sparePartRoutes from "./routes/SparePart.route.js";
import userRouter from "./routes/user.route.js";

import bookingRoutes from "./routes/Booking.route.js";
import maintancePkgRoutes from "./routes/MaintancePkg.route.js";
import modificationRoutes from "./routes/ModificationPkg.route.js";

import Supplier_Route from "./routes/Supplier.route.js";

import Request_router from "./routes/RequestItem_route.js";
import Payment_Route from "./routes/Payment_Route.js";

import Customer_Route from "./routes/Customer_Route.js";

import reorderRout from "./routes/reorderRoutes.js";
import spareReqRoute from "./routes/SpareReq.route.js";


import "./scheduler.js";

//Employee routes filess...
import employeeRoute from './routes/Employee.js';
import AttendenceRoute from './routes/EmployeeAttendence.js';
import employeeSalaryRoute from './routes/EmployeeSalary.js'



dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to Mongo DB successfully!!!");
  })
  .catch((err) => {
    console.log("Error connecting to Mongo");
  });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

//Call the employee menager part
app.use("/Employee", employeeRoute);
app.use("/EmployeeAttendence", AttendenceRoute);
app.use("/EmployeeSalary", employeeSalaryRoute);



app.use("/api/spareparts", sparePartRoutes);
app.use("/api/reorder", reorderRout);

app.use("/requestItems", Request_router);
app.use("/Customer", Customer_Route);

app.use("/api/booking", bookingRoutes);
app.use("/api/maintance", maintancePkgRoutes);
app.use("/api/mod", modificationRoutes);

app.use("/suppliers", Supplier_Route);
app.use("/payments", Payment_Route);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use("/api/spreq", spareReqRoute);

app.listen(3000, () => {
  console.log("Server listening on port 3000!!!");
});
