'use client'

import { useState } from "react"
import React from "react"
import RegisterForm from "@/app/components/RegisterForm"
import LoginForm from "@/app/components/LoginForm"

export default function HomePage() 
{
  const[isRegister, setIsRegister] = useState(false)

  return (
    <div className="flex items-center justify-center h-screen ">

      <div className="max-w-md w-full p-8 rounded-xl " >
        
        {isRegister ? <RegisterForm /> : <LoginForm />}

        <button 
          onClick={ () => setIsRegister(!isRegister)} 
          className="font-serif text-gradient  pt-5 transition-transform duration-200 ease-in-out transform hover:scale-103 cursor-pointer " >
          {isRegister ? "Already have an account?" : "Don't have an account?"}
        </button>

      </div>

    </div>
  )
}


