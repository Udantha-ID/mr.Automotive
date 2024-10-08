import React, { useState } from 'react';
// import BackButton from '../../Components/BackButton';
import axios from 'axios';
import { useNavigate ,useParams } from 'react-router-dom';
import Spinner from './Spinner';
import Swal from 'sweetalert2';

function DeleteSalary() {

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
  
    const handleDeleteEmployeeSalary = () => {
      setLoading(false);
      axios
        .delete(`http://localhost:3000/EmployeeSalary/${id}`)
        .then(() => {
          setLoading(false);
          Swal.fire({
            title: 'Delete Success..',
            text: 'You have successfully Delete in',
            icon: 'success',
            confirmButtonText: 'OK',
            //cancelButtonAriaLabel: 'cancel',
            showCancelButton: false,
            timer:4000,
          })
          navigate('/employee-management/salary');
          return
        })
        .catch((error) =>{
          setLoading(false);
          alert('An error happened. please check console..');
          console.log(error)
        })
    }
  return (
    <div className="p-4">
      <h1 className='text-3xl my-4'>
          Delete Employe
      </h1>
      {loading ? <Spinner/>: ''}

      <div className="flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto">
          <h3 className='text-2xl'>Are you Sure You want to Delete this employee Id:</h3>
          <button className='p-2 bg-red-600 text-white m-8 w-full' onClick={handleDeleteEmployeeSalary}>Delete</button>
      </div>
    </div>
  )
};

export default DeleteSalary;