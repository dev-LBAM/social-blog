import { useCallback, useEffect, useState } from "react";
import axios from "axios";

interface LoginFormData {
  email: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email:""
  });

  useEffect(() => { 
    const { ...safeData } = formData;
    sessionStorage.setItem("loginFormData", JSON.stringify(safeData));
  }, [formData]);


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.post("/api/auth/login", formData)
    
    console.log("Form data login submitted", response.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {[
      { title:"Email", name: "email", type: "email", placeholder: "you@example.com"},
      { title:"Password", name: "password", type: "password", placeholder: "example12345aA*"},
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
            value={formData[field.name as keyof LoginFormData]}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      ))}
      <button type="submit" className="w-full py-2 bg-gradient-to-r font-serif from-background to-indigo-400 text-zinc-200 rounded-md transition-transform duration-200 ease-in-out transform hover:scale-102 cursor-pointer hover:from-background hover:to-indigo-500">
        Sign in Social Blog
      </button>
    </form>
  );
}
