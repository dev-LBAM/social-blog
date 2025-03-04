import { useCallback, useEffect, useState } from "react";
import SelectDate from "./ui/SelectDate";
import SelectLocation from "./ui/SelectLocation";
import axios from "axios";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  country: string;
  state: string;
  city: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>(() => {
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("registerFormData");
      return storedData ? JSON.parse(storedData) : {
        name: "",
        email: "",
        birthDate: "",
        country: "",
        state: "",
        city: "",
      };
    }
    return {
      name: "",
      email: "",
      birthDate: "",
      country: "",
      state: "",
      city: "",
    };
  });

  useEffect(() => {
    const { ...safeData } = formData; // Removendo a senha antes de salvar
    sessionStorage.setItem("registerFormData", JSON.stringify(safeData));
  }, [formData]);

  const handleDateChange = useCallback((day: string, month: string, year: string) => {
    setFormData((prevState) => ({
      ...prevState,
      birthDate: `${year}-${month}-${day}`,
    }));
  }, []);

  const handleLocationChange = useCallback((country: string, state: string, city: string) => {
    setFormData((prevData) => ({
      ...prevData,
      country,
      state,
      city,
    }));
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.post("/api/auth/register", formData)
    
    console.log("Form data submitted", response.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {[
      { title:"Name", name: "name", type: "string", placeholder: "User Name Example "},
      { title:"Email", name: "email", type: "email", placeholder: "you@example.com"},
      { title:"Password", name: "password", type: "password", placeholder: "example12345aA*"},
      { title:"Confirm Password", type: "password", placeholder: "example12345aA*"},
        ].map((field) => (
        <div key={field.title}>
          <label htmlFor={field.title} className="block text-gradient font-serif">
          {field.title}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name as keyof RegisterFormData]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      ))}
      <SelectDate onDateChange={handleDateChange} />
      <SelectLocation onLocationChange={handleLocationChange} />
      <button type="submit" className="w-full py-2 bg-gradient-to-r font-serif from-background to-indigo-400 text-zinc-200 rounded-md transition-transform duration-200 ease-in-out transform hover:scale-102 cursor-pointer hover:from-background hover:to-indigo-500">
        Sign up account
      </button>
    </form>
  );
}
