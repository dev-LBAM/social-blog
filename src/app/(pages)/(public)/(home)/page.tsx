'use client'

import { useState } from "react";
import React from "react";
import RegisterForm from "@/app/components/RegisterForm";
import LoginForm from "@/app/components/LoginForm";

const ExamplePage = () => {

  const[isRegister, setIsRegister] = useState(false)

  return (
    <div className="flex items-center justify-center h-screen ">

      <div className="max-w-md w-full p-8 rounded-xl " >
        
        {isRegister ? <RegisterForm />: <LoginForm />}

        <button 
        onClick={ () => setIsRegister(!isRegister)} 
        className="font-serif bg-gradient-to-r from-white to-indigo-500 bg-clip-text text-transparent  pt-5 hover:underline transition-transform duration-100 ease-in-out transform hover:scale-103 cursor-pointer " >
        {isRegister ? "Already have an account?" : "Don't have an account?"}
        </button>
      </div>
    </div>
  );
};

export default ExamplePage;

