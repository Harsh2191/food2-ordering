import React,{useState} from "react";
import { useNavigate, useParams,Link } from "react-router-dom";
import axios from "axios";
import {useSnackbar} from "notistack"
import Spinner from "../components/Spinner";
import { baseUrl } from "../urls";

const DeleteFood = ()=>{
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  const {enqueueSnackbar} = useSnackbar();


  const token = localStorage.getItem('token');

  const config = {
    headers:{
      'Authorization' : `Bearer ${token}`,
      'Content-Type' : 'application/json'
    }
  }


  const handleDeleteFood = ()=>{
    setLoading(true);
    axios
    .delete(`${baseUrl}/food/${id}`,config)
    .then(()=>{
      setLoading(false);
      enqueueSnackbar('Food Deleted',{variant:'success'});
      navigate('/admin');
    })
    .catch((error)=>{
      setLoading(false);
      enqueueSnackbar('Error',{variant:'error'});
      console.log(error);
    })

  }

  return (
    <div className="p-6 bg-gray-50 flex justify-center items-center ">
      {loading && <Spinner/>}
      <div className="container max-w-lg shadow-lg p-5">
      <Link to="/admin" className="flex  justify-center items-center bg-gray-400 mb-4 w-12  py-2 px-2 text-sm rounded-xl">Back</Link>
      <h2 className="text-2xl mb-4 font-semibold text-gray-800">Are you sure you want to delete this food item</h2>
      <button onClick={handleDeleteFood} className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded-lg w-full">
        Yes, Delete
      </button>

      </div>

    </div>
  )
}


export default DeleteFood