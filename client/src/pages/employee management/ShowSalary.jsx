import { Link } from 'react-router-dom'
import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Spinner from './Spinner'
// import BackButton from '../../Components/BackButton'


const ShowEmployee = () => {

  const [Employee, setEmployees] = useState([null]);
  const [Salary, setEmployeeSalary] = useState([null])
  const [loading, setLoading] = useState(false);
  const {id} = useParams();

  useEffect(() => {
    setLoading(true);
    axios
        .get(`http://localhost:3000/Employee/${id}`)
        .then((response) => {
            setEmployees(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });
}, []);


useEffect(() => {
    setLoading(true);
    axios
        .get(`http://localhost:3000/EmployeeSalary/${id}`)
        .then((response) => {
            setEmployeeSalary(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });
}, []);

const parseFloat = (str, value) => {
  str = str.toString();
  str = str.slice(0, (str.indexOf('.')) + value + 1)
  return Number(str);
}

  return (
    <div className='p-4'>
     {/* <BackButton/> */}
      <h1 className='text-3xl font-bold mb-4'>{Salary.employeeName} Salary Details</h1>
      {loading ? (
        <Spinner/>
      ) : (
        <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">

          <div className="my-4">
            <span className='text-xl mr-4 text-gray-500'>Name</span>
            <span>{Salary.employeeName}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4 text-gray-500'>NIC</span>
            <span>{Salary.NIC}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4  text-gray-500'>From Date</span>
            <span>{Salary.formDate}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4  text-gray-500'>To Date</span>
            <span>{Salary.toDate}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4  text-gray-500'>Total Ot Hours</span>
            <span>{Salary.totalOtHours}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4  text-gray-500'>Total Ot Amount</span>
            <span>{Salary.totalOtAmount}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4  text-gray-500'>Basic Salary</span>
            <span>{Salary.basicSalary.toFix(2)}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4  text-gray-500'>Total Salary</span>
            <span>{
            parseFloat(Salary.totalSalary, 2)}</span>
          </div>
        </div>
      )}
    </div>
  )
};
export default ShowEmployee