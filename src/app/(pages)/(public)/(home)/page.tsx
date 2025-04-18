'use client'

import { useState } from "react"
import React from "react"

import CheckEmail from "@/app/components/home/CheckEmail"
import LoginForm from "@/app/components/home/LoginForm"


export default function HomePage() 
{
  const[isRegister, setIsRegister] = useState(false)

  return (
    <div className="flex items-center justify-center h-screen bg-page">

      <div className="max-w-md w-full p-8 rounded-sm bg-box drop-shadow-lg" >
        
        {isRegister ? <CheckEmail /> : <LoginForm />}
        <div className="flex items-center gap-2 text-input-title pt-8 rounded-xl max-w-md w-full">
          <p>{isRegister ? "Already have an account?" : "Don't have an account?"}</p>
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-color  drop-shadow-md underline transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer "
          >
            {isRegister ? "Log In" : "Sign Up"}
          </button>
        </div>
      </div>

    </div>
  )
}


