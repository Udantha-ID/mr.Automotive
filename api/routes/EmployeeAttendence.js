import express from 'express';
import mongoose from 'mongoose';
import { EmployeeAttendence } from '../model/EmployeeAttendence.js';
const rout = express.Router();

// Save the Employee Attendance
rout.post('/', async (req, res) => {
    try {
        if (
            !req.body.NIC ||
            !req.body.employeeName ||
            !req.body.date
        ) {
            return res.status(400).send({
                message: "Please fill all the fields",
            });
        }

        // console.log(req.body)

        const AddEmployeeAttendence = {
            NIC: req.body.NIC,
            employeeName: req.body.employeeName,
            date: req.body.date,
            InTime: req.body.InTime || null,
            OutTime: req.body.OutTime || null,
            WorkingHours: req.body.WorkingHours || null,
            OTHour: req.body.OTHour || null
        };

        const empAttendence = await EmployeeAttendence.create(AddEmployeeAttendence);
        return res.status(201).send(empAttendence);
    } catch (error) {  // Fixed the type
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

//Get all Attendence Details
rout.get('/', async (req, res) => {
    try {
        const empAttendence = await EmployeeAttendence.find({});
        return res.status(200).json({
            count: empAttendence.length,
            data: empAttendence,
        });
        } catch (error) {
            console.log(error.message);
            res.status(500).send({ message: error.message });
            }
    });
    

    rout.get('/date_range/:NIC', async (req, res) => {
        try {
            const { NIC } = req.params;
            const { formDate, toDate } = req.query;
            const startDate = new Date(formDate);
            const endDate = new Date(toDate);     
            const attendanceRecords = await EmployeeAttendence.find({
                NIC: NIC,
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            });

    
             if (attendanceRecords.length > 0) {
            res.status(200).json(attendanceRecords);
        } else {
            res.status(404).json({ message: 'No attendance records found for the specified date range.' });
        }
            } 
        catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    });

    rout.get('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const attendence = await EmployeeAttendence.findById(id);
    
            if (!attendence) {
                return res.status(404).json({ message: 'Employee not found' });
            }
    
            return res.status(200).json(attendence);
        } 
        catch (error) {
            console.log(error.message);
            res.status(500).json({ message: error.message });
        }
    });
    

    //Update EmployeeAttendence Details
    rout.put('/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const empAttendence = await EmployeeAttendence.findByIdAndUpdate(id, req.body, { new: true
                });
                return res.status(200).json(empAttendence);
                } 
                catch (error) {
                    console.log(error.message);
                    res.status(500).send({ message: error.message });
                    }
            });



    //Delete Attendence
    rout.delete('/:id', async (req, res) => {
        try {
          const { id } = req.params;
      
          const result = await EmployeeAttendence.findByIdAndDelete(id);
      
          if (!result) {
            return res.status(404).json({ message: 'Employee not found' });
          }
      
          return res.status(200).send({ message: 'Employee deleted successfully' });
        } catch (error) {
          console.log(error.message);
          res.status(500).send({ message: error.message });
        }
      });
    

export default rout;
