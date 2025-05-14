import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import Button from "../ui/Button"
import { verifyEmailDTO } from "../../api/auth/verify-email/(dtos)/verify-email.dto"
import RegisterForm from "./RegisterForm"
import { successToast } from "../ui/Toasts"

interface EmailData 
{
  email: string
}

export default function CheckEmail() 
{
  const [formErrors, setFormErrors] = useState<object>({})
  const [emailCode, setEmailCode] = useState<boolean>(false)
  const [codeInput, setCodeInput] = useState<string>("")
  const [continueRegister, setContinueRegister] = useState<boolean>(false)
  const [resendTime, setResendTime] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [formSucessText, setFormSucessText] = useState<string>("")
  const [formSucessColor, setFormSucessColor] = useState<boolean | null>(null)


  const [formData, setFormData] = useState<EmailData>(() => 
  {
    if (typeof window !== "undefined") 
    {
      const storedData = sessionStorage.getItem("registerFormData")

      if (storedData) 
      {
        const data = JSON.parse(storedData)
        return { ...data }
      }
    }
    return { email: "" }
  })

  useEffect(() => 
  {
    sessionStorage.setItem("registerFormData", JSON.stringify(formData)) /* Save data of input when the user change to register page and back, except password */
  }, [formData])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => 
  {
    const { name, value } = e.target
    
    setCodeInput((prevCode) => 
    {
      const index = parseInt(name.replace('n', ''), 10) - 1
      return prevCode.slice(0, index) + value + prevCode.slice(index + 1)
    })

    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) 
    {
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }))
    }

    setFormSucessText("")
  }, [formErrors])

  const handleSubmit = async (e: React.FormEvent) => 
  {
    setLoading(true)
    e.preventDefault()
    const validatedData = verifyEmailDTO.safeParse(formData)

    if (!validatedData.success) 
    {
      const errors = Object.fromEntries(validatedData.error.errors.map((err) => [err.path[0], err.message]))
      return setTimeout(() => 
        {
          setFormErrors(errors)
          setLoading(false)
        }, 1000)
    }

    try
    {
      const response = await axios.post("/api/auth/verify-email/send", { email: formData.email})
      setFormSucessColor(true)
      setFormSucessText(response.data.message)
      return setTimeout(()=> 
      {
        setFormSucessText("")
        setCodeInput("")
        setEmailCode(true)
        setLoading(false)
      }, 1000)
    }
    catch
    {
      setFormSucessColor(false)
      setFormSucessText("Email already exists...Try other!")
      return setTimeout(()=> 
      {
        setLoading(false)
      }, 1000)
    }
  }

  const handleSubmitCode = async (e: React.FormEvent) => 
  {
    e.preventDefault()
    const validatedData = verifyEmailDTO.safeParse(formData)

    if (!validatedData.success) 
    {
      const errors = Object.fromEntries(validatedData.error.errors.map((err) => [err.path[0], err.message]))
      return setTimeout(() => 
        {
          setFormErrors(errors)
          setLoading(false)
        }, 1000)
    }
    
    try
    {
      await axios.post("/api/auth/verify-email/check", { email: formData.email, code: codeInput })
      setFormSucessColor(true)
      setFormSucessText("Code confirmed successfully")
      return setTimeout(()=> 
      {
        setFormSucessText("")
        setContinueRegister(true)
        setLoading(false)
      }, 1000)
    }
    catch
    {
      setFormSucessColor(false)
      setFormSucessText("Invalid code!")
      return setTimeout(()=> 
      {
        setLoading(false)
      }, 1000)
    }
  }

  useEffect(() => 
  {
    let timer
    if (resendTime > 0) 
    {
      timer = setInterval(() => 
      {
        setResendTime(prevTime => prevTime - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [resendTime])

  const handleClickResend = async (e: React.FormEvent) => 
  {
    e.preventDefault()
    try
    {
      await axios.post("/api/auth/verify-email/send", { email: formData.email})

      successToast("Resending Code", "Your code was sent again sucessfully")
      setFormSucessColor(true)
      setFormSucessText("Code resend sucessfully")
      setResendTime(60)
    }
    catch
    {
      setFormSucessColor(false)
      setFormSucessText("Failed to send email code!")
    }
  }

  const handleAutoFocus = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => 
  {
    const isBackspace = event.key === "Backspace"
    const inputElement = event.target as HTMLInputElement
  
    if(isBackspace && !inputElement.value) 
    {
      
      const prevInput = document.querySelector(`input[name="n${index}"]`) /* Back to input when user press Backspace */
      if (prevInput) 
      {
        (prevInput as HTMLInputElement).focus()
      }
    } 
    else if(!isBackspace && inputElement.value) /* Move to next fild */
    {
      const nextInput = document.querySelector(`input[name="n${index + 2}"]`)
      if(nextInput) 
      {
        (nextInput as HTMLInputElement).focus()
      }
    }
  }
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, ) => /* When user paste the code fill in the all fields */
  {
    const pastedValue = e.clipboardData.getData("Text")
    if (pastedValue.length === 6) 
    {
      setFormSucessText("")
      return setCodeInput(pastedValue)
    }
  }
  return (
    !continueRegister ? 
    (

      !emailCode ? 
      (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl p-" noValidate>
          <div>

            <label htmlFor={"email"} className="block text-input-title">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleChange(e)}
              className={`${formErrors["email"] ? "input-style-error" : "input-style-standard"}`}
            />
            {formErrors["email"] && <p className="text-error">{formErrors["email"]}</p>}

          </div>
          {formSucessText && <p className={`${formSucessColor ? "text-success" : "text-error"}`}>{formSucessText}</p>}
          <Button
            disabled={loading}
            text="Send Code"
          />

        </form>
      ) : 
      (
        <form className="space-y-4 rounded-xl " noValidate>

          <div>

            <label htmlFor={"email"} className="text-input-title block text-center">
              The code was send to email:
              <div className="items-center justify-center pt-1 rounded-x1 text-center">

                <p className="block text-color font-serif">{formData.email.toLowerCase()}</p>

                <div className="flex gap-2 pt-3">
                  <p>Not your email?</p>
                  <button 
                    type="button"
                    className=" text-color drop-shadow-sm font-light text-center underline transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer"
                    onClick={() => 
                    {
                      setEmailCode(false)
                      setFormSucessText("")
                    }}
                  >
                    Back
                  </button>
                </div>

                <div className="flex gap-2 ">
                  <p >Dont receive the code?</p>
                  <button 
                    type="button"
                    disabled={resendTime >= 1}
                    className={`text-color drop-shadow-sm font-light text-center underline 
                    ${resendTime >= 1 ? 'opacity-50 cursor-not-allowed' : 'transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer'}`}
                    onClick={handleClickResend} 
                  >
                    {`${resendTime <= 0 ? `Resend` : `Resend in ${resendTime}s`}`}
                  </button>
                </div>

              </div>

            </label>

          </div>


          <div className="flex justify-center space-x-2">
            {['n1', 'n2', 'n3', 'n4', 'n5', 'n6'].map((inputName, index) => (
              <input
                key={index}
                name={inputName}
                type="text"
                maxLength={1}
                value={codeInput[index] || ""}
                onChange={handleChange}
                onKeyUp={(e) => handleAutoFocus(e, index)} 
                onPaste={(e) => handlePaste(e)} 
                className={`${formSucessText && formSucessColor === false ? "input-style-error" : "input-style-standard"} text-center`}
              />
            ))}
          </div>

          {formSucessText && <p className={`${formSucessColor ? "text-success" : "text-error"}`}>{formSucessText}</p>}

          <Button
            text="Continue to register"
            disabled={loading}
            onClick={(e) => 
            {
                setLoading(true)
                handleSubmitCode(e)
            }}
          />

        </form>
      )
    ) : 
    (
      <RegisterForm />
    )
  )
}
