
import { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { registerUserDTO } from "@/app/api/auth/register/(dtos)/register.dto"
import SelectGender from "./SelectGender"
import SelectDate from "./SelectDate"
import SelectLocation from "./SelectLocation"
import Buttom from "../ui/Button"
import { debounce } from "lodash"
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa"



interface RegisterFormData 
{
  username: string
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
  const router = useRouter()

  const [formErrors, setFormErrors] = useState<object>({})
  const [genderError, setGenderError] = useState<string>("")
  const [dateError, setDateError] = useState<string>("")
  const [locationError, setLocationError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [formSucessColor, setFormSucessColor] = useState<boolean | null>(null)
  const [formSucessText, setFormSucessText] = useState<string>("")
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
 const [verifyName, setVerifyName] = useState<boolean>(false)


  const [formData, setFormData] = useState<RegisterFormData>(() => 
  {    
    if (typeof window !== "undefined") 
    {
      const storedData = sessionStorage.getItem("registerFormData") /* Get data of in session storage and put they into input for user dont need retype */

      if (storedData) {
        const data = JSON.parse(storedData)

        return {
          username: data.username || "",
          name: data.name || "",
          email: data.email || "", 
          password: data.password || "",
          confirmPassword: data.confirmPassword || "",
          gender: data.gender || "",
          birthDate: data.birthDate || "",
          day: data.day || "",
          month: data.month || "",
          year: data.year || "",
          country: data.country || "",
          state: data.state || "",
          city: data.city || ""
        }
      }
    }
    return {
      username: "",
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
      if(gender) 
      {
        setFormData((prevState) => ({...prevState, gender: gender}))
      }
    }, [])

  const handleDateChange = useCallback((day: string, month: string, year: string) => 
  {
    setDateError("")
    setFormData((prevState) => ({...prevState, day, month, year,}))

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

const checkUsernameAvailability = useCallback(debounce(async (username: string) => {
  try {
    setVerifyName(true)
    const res = await axios.post("/api/auth/verify-username", { username })
    setVerifyName(false)
    setUsernameAvailable(res.data.available)
  } catch {
    setVerifyName(false)
    setUsernameAvailable(null)
  }
}, 500), [])

const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target

  setFormData((prev) => ({ ...prev, [name]: value ?? "" }))

  if (formErrors[name]) {
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }))
  }

  if (name === "username") {
    if (value.length >= 3) {
      checkUsernameAvailability(value)
    } else {
      setUsernameAvailable(null)
    }
  }
}, [formErrors, checkUsernameAvailability])

  const handleSubmit = async (e: React.FormEvent) => 
  {
    e.preventDefault()
    setLoading(true)
    const validatedData = registerUserDTO.safeParse(formData)
    if (!validatedData.success) 
    {
      /* loops through the validation errors and gets the name of each field by path, and add the error message into field of error, example: errors{"email" = "Email is required"}  */
      const errors = Object.fromEntries(validatedData.error.errors.map((err) => [err.path[0], err.message]))
      
      if(errors.gender) 
      { 
        setTimeout(() => 
        {
          setGenderError(errors.gender)
          setLoading(false)
        }, 1000)
      }
      if(errors.birthDate) 
      { 
       
        setTimeout(() => 
        {
          setDateError(errors.birthDate)
          setLoading(false)
        }, 1000)
      } 

      if(errors.country || errors.state || errors.city) 
      { 
        setTimeout(() => 
        {
          setLocationError(true)
          setLoading(false)
        }, 1000)
        
      }

      return setTimeout(() => 
      {
        setFormErrors(errors)
        setLoading(false)
      }, 1000)
    }
    
    try
    {
      const res = await axios.post("/api/auth/register", validatedData.data, {withCredentials: true})
      setFormSucessColor(true)
      setFormSucessText(res.data.message)
      return setTimeout(async () => 
      {
        setFormSucessText("")
        await axios.post("/api/auth/login", validatedData.data, {withCredentials: true})
        router.push('/feed')
        setLoading(false)
      }, 1000)
    }
    catch (error) 
    {
      if (error instanceof Error) 
      {
        setFormSucessColor(false)
        setFormSucessText(error.message)
      } 
      else 
      {
        setFormSucessColor(false)
        setFormSucessText("Unknown error!")
      }
      return setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {[
        {
          title: "Username",
          name: "username",
          type: "string",
          placeholder: "username$ex4mple",
        },
        {
          title: "Name",
          name: "name",
          type: "string",
          placeholder: "User Real Name Example",
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
            className="block text-input-title"
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
            className={`${formErrors[field.name as keyof RegisterFormData]? "input-style-error": "input-style-standard"}`}
          />

          {field.name === "username" && verifyName && <p className="flex items-center text-gray-500 gap-2 mt-1">
    <FaSpinner className="animate-spin" />
    Checking availability...
  </p>}
          {field.name === "username" && !verifyName && !formErrors[field.name] && formData.username.length >= 3 && (
          <p className={`${usernameAvailable === false ? "text-error" : "text-success"}`}>
            {usernameAvailable === false
              ? <p className="flex items-center gap-2 mt-1">
                    <FaTimesCircle  />
                    Username already exists...Try other!
                  </p>
              : usernameAvailable === true
              ?   <p className="flex items-center gap-2 mt-1">
                    <FaCheckCircle />
                    Username is available
                  </p>
              : ""}
          </p>
          )}
          {formErrors[field.name] && (<p className="text-error">{formErrors[field.name]}</p>)}

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
        initialDay={formData.day ? formData.day : ""} 
        initialMonth={formData.month ? formData.month : ""} 
        initialYear={formData.year ? formData.year : ""} 
      />

      <SelectLocation 
        onLocationChange={handleLocationChange} 
        locationError={locationError}
      />

      {formSucessText && <p className={`${formSucessColor ? "text-success" : "text-error"}`}>{formSucessText}</p>}

      <Buttom 
        disabled={loading}
        text="Sign up account" 
      />

    </form>
  )
}
