
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { loginUserDTO } from "../api/auth/login/(dtos)/login-user.dto"
import Button from "./ui/Button"
import { useRouter } from "next/navigation"

interface LoginFormData 
{
  email: string
  password: string
}

export default function LoginForm() 
{
  const router = useRouter()

  const [formErrors, setFormErrors] = useState<object>({})
  const [formSucessColor, setFormSucessColor] = useState<boolean | null>(null)
  const [formSucessText, setFormSucessText] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<LoginFormData>(() => 
  {
    if (typeof window !== "undefined") 
    {
      const storedData = sessionStorage.getItem("loginFormData") /* Get data of in session storage and put they into input for user dont need retype */

      if (storedData) 
      {
        const data = JSON.parse(storedData)
        return { ...data, password: "" }
      }
    }
    return { email: "", password: "" } 
  })

  useEffect(() => 
  {
    if (typeof window !== "undefined") 
    {
      //eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...safeData } = formData

      sessionStorage.setItem("loginFormData", JSON.stringify(safeData)) /* Save data of input when the user change to register page and back, except password */
    }
  }, [formData])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => 
  {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value })) 
    setFormSucessText("")
    if(formErrors[name]) /* When exists a formError with the name of input hide error */
    {
      setFormErrors((prevErrors) => ({...prevErrors, [name]: undefined}))
    }
  },[formErrors])


  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault()
    setLoading(true)
    const validatedData = loginUserDTO.safeParse(formData)

    if (!validatedData.success) 
    {
      /* loops through the validation errors and gets the name of each field by path, and add the error message into field of error, example: errors{"email" = "Email is required"}  */
      const errors = Object.fromEntries(validatedData.error.errors.map((err) => [err.path[0], err.message]))
      return setTimeout(() => 
        {
          setFormErrors(errors)
          setLoading(false)
        }, 1000)
    }

    try
    {
      const res = await axios.post("/api/auth/login", validatedData.data, {withCredentials: true})
      setFormSucessColor(true)
      setFormSucessText(res.data.message)
      
      return setTimeout(() => 
      {

      router.push('/feed');
        setLoading(false)
      }, 1000)
    }
    catch
    {
      setFormSucessColor(false)
      setFormSucessText("Email or password incorrect")
      return setTimeout(() => 
      {
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl " noValidate>

      {[
        {
          title: "Email",
          name: "email",
          type: "email",
          placeholder: "you@example.com",
        },
        {
          title: "Password",
          name: "password",
          type: "password",
          placeholder: "example12345aA*",
        },
      ].map((field) => (
        <div key={field.title}>
          <label htmlFor={field.name} className="block text-input-title">
            {field.title}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            className={`${formErrors[field.name] ? "input-style-error" : "input-style-standard"}`}
          />
          {formErrors[field.name] && <p className="text-error">{formErrors[field.name]}</p>}
        </div>
      ))}
      {formSucessText && <p className={`${formSucessColor ? "text-success" : "text-error"}`}>{formSucessText}</p>}
      <Button 
        disabled={loading}
        text="Log in Social Blog" 
      />
    </form>
  )
}
