import express from 'express';
// import { Employee } from '../model/Employee.js';
import { Employee } from '../model/Employee.js';
const rout = express.Router();


//Add new Emplyees
rout.post('/', async (req, res) => {
    try {
        // Validate all required fields
        if(!req.body.employeeName ||
            !req.body.DOB ||
            !req.body.NIC ||
            !req.body.Address ||
            !req.body.BasicSalary ||
            !req.body.ContactNo ||
            !req.body.Email ||
            !req.body.Designation
        ) {
            return res.status(400).send({
              message: 'Send all required fields: employeeName, DOB, NIC, Address, BasicSalary, ContactNo, Email, and Designation',
            });
        }

        // Generate a unique EmpID
        const generateEmpID = () => {
            return `EMP${Date.now()}`; // Example: EMP1694014461751
        };

        const newEmployee = {
            EmpID: generateEmpID(),  // Assign unique EmpID
            employeeName: req.body.employeeName,
            DOB: req.body.DOB,
            NIC: req.body.NIC,
            Address: req.body.Address,
            BasicSalary: req.body.BasicSalary,
            ContactNo: req.body.ContactNo,
            Email: req.body.Email,
            Designation: req.body.Designation,
        };

        // Create and save the new employee
        const employee = await Employee.create(newEmployee);
        
        return res.status(201).send(employee);

    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
});


//Get the All Employees Details in Database
rout.get('/', async (req, res) =>{
    try {

        const employee = await Employee.find({});
        return res.status(200).json(
           {
             count: employee.length,
             data: employee
           }
        );
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
});


//Get one Employees Details in Database by id
rout.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        return res.status(200).json(employee);
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});



//Update Employee by using id
rout.put('/:id', async (req, res) =>{
    try {
       if(
            !req.body.employeeName ||
            !req.body.DOB ||
            !req.body.NIC ||
            !req.body.Address ||
            !req.body.BasicSalary ||
            !req.body.ContactNo ||
            !req.body.Email ||
            !req.body.Designation
       ){
        return res.status(400).send({
            message: "Please fill all fields in this.."});
       }
       const{id} = req.params;
       const result = await Employee.findByIdAndUpdate(id, req.body);
       //return res.status(200).json(result);
       if(!result){
            return res.status(404).json({message: 'This Employee not avalable in DB..'})
       }
       else{
        return res.status(200).send({message:'Employee Details Update Succesfully..'});
       }
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message});
    }
});



//Pass the employee data Deletede employee dashboard
    rout.put('/employeeDelete/:id', async (req, res) => {
        try {
            const { id } = req.params;
          
            // Find and delete the employee
            const deletedEmployee = await Employee.findByIdAndDelete(id);
          
            if (!deletedEmployee) {
                return res.status(404).send({ message: 'Employee not found.' });
            }
          
            return res.status(200).send({ message: 'Employee deleted successfully.' });
        } catch (error) {
            console.error(error.message);
            return res.status(500).send({ message: 'Server error' });
        }
    });
    
  


//Rout Delate Emlpoyee by id
rout.delete('/:id', async(req,res) =>{

    try {
        const {id} = req.params;
        const result = await Employee.findByIdAndDelete(id);

        if(!result){
            return res.status(404).json({message: 'This Employee not avalable in DB.'})
        }
        else{
            return res.status(200).send({message:'Employee Details Delete Succesfully..'});
            }
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message: error.message});
    }

});

rout.get('/searchEmployee', async (req, res) => {
    try {
      // Destructuring the request query with default values
      const { page = 1, limit = 8, search = '', sort = 'employeeName' } = req.query;
  
      // Convert to integers and calculate skip value for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const limitNum = parseInt(limit);
  
      // Build the search query
      const query = {
        $or: [
          { employeeName: { $regex: new RegExp(search, 'i') } }, // Case-insensitive search
          { NIC: { $regex: new RegExp(search, 'i') } }
        ]
      };
  
      // Retrieve employees with pagination and sorting
      const employees = await Employee.find(query)
        .skip(skip)
        .limit(limitNum)
        .sort({ [sort]: 1 });
  
      // Get the total number of employees matching the query for pagination
      const totalEmployees = await Employee.countDocuments(query);
      const totalPages = Math.ceil(totalEmployees / limitNum);
  
      // Respond with the filtered data and pagination info
      res.status(200).json({
        data: employees,
        pagination: {
          totalEmployees,
          totalPages,
          currentPage: parseInt(page),
          limit: limitNum
        }
      });
    } catch (error) {
      console.error("Error searching employees:", error);
      res.status(500).json({ message: error.message });
    }
  });

export default rout; 



