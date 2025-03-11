
import { useCallback, useEffect, useState } from "react"
import SelectDate from "./ui/SelectDate"
import SelectLocation from "./ui/SelectLocation"
import axios from "axios"
import { registerUserDTO } from "../api/auth/register/(dtos)/register.dto"
import Buttom from "./ui/Buttom"
import SelectGender from "./ui/SelectGender"

interface RegisterFormData 
{
  name: string
  email: string
  password: string
  confirmPassword: string
  gender: string
  birthDate: string
  day: string  
  month: string
  year: string 
  country: string
  state: string
  city: string
}

export default function RegisterForm() 
{
  const [formErrors, setFormErrors] = useState<object>({})
  const [genderError, setGenderError] = useState<string>("")
  const [dateError, setDateError] = useState<string>("")
  const [locationError, setLocationError] = useState<boolean>(false)

  const [formData, setFormData] = useState<RegisterFormData>(() => 
  {
    const storedData = sessionStorage.getItem("registerFormData") /* Get data of in session storage and put they into input for user dont need retype */

    if (storedData) 
    {
      const data = JSON.parse(storedData)
      return { ...data, ...data, password: "" }
    }

    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      birthDate: "",
      day: "",  
      month: "", 
      year: "",
      country: "",
      state: "",
      city: "" 
    } 
  })

  useEffect(() => 
  {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, confirmPassword, ...safeData } = formData
    sessionStorage.setItem("registerFormData", JSON.stringify(safeData)) /* Save data of input when the user change to register page and back, except password */
  }, [formData])

  const handleGenderChange = useCallback((gender: string) => 
    {
      setGenderError("")
      console.log(gender)
      if(gender) 
      {
        console.log(gender)
        setFormData((prevState) => ({...prevState, gender: gender}))
      }
    }, [])

  const handleDateChange = useCallback((day: string, month: string, year: string) => 
  {
    setDateError("")
    setFormData((prevState) => ({
      ...prevState,
      day,
      month,
      year,
    }));

    if(day && month && year) 
    {
      setFormData((prevState) => ({...prevState,birthDate: `${year}-${month}-${day}`}))
    }
  }, [])

  const handleLocationChange = useCallback((country: string, state: string, city: string) => 
  {

    setLocationError(false)

      setFormData((prevData) => ({...prevData, country, state, city,}))

  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => 
    {
      const { name, value } = e.target

      setFormData((prev) => ({ ...prev, [name]: value }))
      
      if (formErrors[name]) /* When exists a formError with the name of input define error undefined */
      {
          setFormErrors((prevErrors) => ({...prevErrors,[name]: undefined}))
      }
    }, [formErrors])

  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault()

    const validatedData = registerUserDTO.safeParse(formData)

    if (!validatedData.success) 
    {
      /* loops through the validation errors and gets the name of each field by path, and add the error message into field of error, example: errors{"email" = "Email is required"}  */
      const errors = Object.fromEntries(validatedData.error.errors.map((err) => [err.path[0], err.message]))
      console.log(formData)
      if(errors.gender) { 
        console.log(errors.gender)
        setGenderError(errors.gender) } 
      
      if(errors.birthDate) { setDateError(errors.birthDate) } 

      if(errors.country || errors.state || errors.city) { setLocationError(true) }

      return setFormErrors(errors)
    }

    const response = await axios.post("/api/auth/register", validatedData.data)
    console.log(response.data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {[
        {
          title: "Name",
          name: "name",
          type: "string",
          placeholder: "User Name Example ",
        },
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
        {
          title: "Confirm Password",
          name: "confirmPassword",
          type: "password",
          placeholder: "example12345aA*",
        },
      ].map((field) => (
        <div key={field.title}>

          <label
            htmlFor={field.name}
            className="block text-gradient font-serif"
          >
            {field.title}
          </label>

          <input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name as keyof RegisterFormData]}
            onChange={handleChange}
            className=
            {
              `w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400 
              ${
                formErrors[field.name as keyof RegisterFormData]
                ? "border-red-500"
                : "border-gray-300"
              }`
            }
          />

          {formErrors[field.name] && (<p className="text-red-500 text-sm">{formErrors[field.name]}</p>)}

        </div>
      ))}

      <SelectGender 
        onGenderChange={handleGenderChange} 
        genderError={genderError} 
        initialGender={formData.gender}
      />

      <SelectDate 
        onDateChange={handleDateChange} 
        dateError={dateError} 
        initialDay={formData.day} 
        initialMonth={formData.month} 
        initialYear={formData.year} 
      />

      <SelectLocation 
        onLocationChange={handleLocationChange} 
        locationError={locationError}
      />

      <Buttom text="Sign up account" />

    </form>
  )
}
