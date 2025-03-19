'use client'

import { useState } from "react"
import React from "react"

import LoginForm from "@/app/components/LoginForm"
import CheckEmail from "@/app/components/CheckEmail"

export default function HomePage() 
{
  const[isRegister, setIsRegister] = useState(false)

  return (
    <div className="flex items-center justify-center h-screen ">

      <div className="max-w-md w-full p-8 rounded-xl  " >
        
        {isRegister ? <CheckEmail /> : <LoginForm />}
        <div className="flex items-center gap-2 text-white pt-8 rounded-xl max-w-md w-full text-sm">
          <p>{isRegister ? "Already have an account?" : "Don't have an account?"}</p>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-orange-200 drop-shadow-md font-light underline transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer "
          >
            {isRegister ? "Log In" : "Sign Up"}
          </button>
        </div>
      </div>

    </div>
  )
}


