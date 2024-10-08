import { Link } from 'react-router-dom'
import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Spinner from './Spinner'
// import BackButton from '../../Components/BackButton'


const ShowEmployee = () => {

  const [Employee, setEmployees] = useState([null]);
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

  return (
    <div className='p-4'>
     {/* <BackButton/> */}
      <h1 className='text-3xl font-bold mb-4'>{Employee.employeeName} Details</h1>
      {loading ? (
        <Spinner/>
      ) : (
        <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">

          <div className="my-4">
            <span className='text-xl mr-4 text-gray-500'>Name</span>
            <span>{Employee.employeeName}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4 text-gray-500'>DateOfBirth</span>
            <span>{Employee.DOB}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4  text-gray-500'>NIC</span>
            <span>{Employee.NIC}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4  text-gray-500'>Address</span>
            <span>{Employee.Address}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4  text-gray-500'>ContactNumber</span>
            <span>{Employee.ContactNo}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4  text-gray-500'>Email</span>
            <span>{Employee.Email}</span>
          </div>

          <div className="my-4">
            <span className='text-xl mr-4  text-gray-500'>Designation</span>
            <span>{Employee.Designation}</span>
          </div>
        </div>
      )}
    </div>
  )
};

export default ShowEmployee