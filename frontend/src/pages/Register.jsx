import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

import axios from "axios";
import { baseUrl } from "../urls";

const Register = ()=>{
const navigate=useNavigate();

const [userData, setUserData] = useState({
  name:'',
  email:'',
  password:'',
  password2:''
})

const [errorMessage , setErrorMessage] = useState('');
const [isSuccess , setIsSuccess] = useState(false);

const changeInputHandler = (e) =>{
  setUserData({...userData,[e.target.name]: e.target.value});
  setErrorMessage('');
  setIsSuccess(false);
};


const sumbitHandler = async (e) =>{
  e.preventDefault();

  if(userData.password !== userData.password2) {
    setIsSuccess(false);
    setErrorMessage('Passwords do not match');
    return;
  }
  try{
    const config ={
      headers:{
        'content-Type' : ' application/json'
      }
    };
    await axios.post(`${baseUrl}/auth/register`,{
      name:userData.name,
      email: userData.email,
      password : userData.password
    } , config
  );
  setIsSuccess(true);
  setErrorMessage('registration successful');


  setTimeout(()=>{
    navigate('/login')
  }, 4000);

  } catch (error){
      setIsSuccess(false);
      setErrorMessage(error.response.data.msg || 'An error occured')
  }
}


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 ">

      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {errorMessage && (
        <p className={`${isSuccess ? 'text-green-500' : 'text-red-500' } text-lg italic mb-4`}> {errorMessage}</p>
      )}

      <form className="w-full max-w-xs" onSubmit={sumbitHandler}>
        <input type="text" placeholder='Username' name="name" value={userData.name} onChange={changeInputHandler} className="shadow border rounded-md w-full py-2 px-3 text-gray-700"/>

        <input type="text" placeholder='Email' name="email" value={userData.email} onChange={changeInputHandler} className="shadow border rounded-md w-full py-2 px-3 text-gray-700"/>

        <input type="password" placeholder='Password' name="password" value={userData.password} onChange={changeInputHandler} className="shadow border rounded-md w-full py-2 px-3 text-gray-700"/>

        <input type="password" placeholder='confirm password' name="password2" value={userData.password2} onChange={changeInputHandler} className="shadow border rounded-md w-full py-2 px-3 text-gray-700"/>
       
        <button type="submit"className="bg-blue-500 hover: bg-blue-800 text-white font-bold py-2 px-4 rounded-md w-full ">Register</button>
      </form>
        <p className="mt-4">Existing/created Acccount?</p>
        <Link to="/login" className="text-blue-500 hover:text-blue-800 text-xl">Sign In</Link>
    </div>

  )
}


export default Register