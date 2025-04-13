import { useState } from "react";

interface SelectGenderProps {
  onGenderChange: (gender: string) => void;
  genderError: string;
  initialGender: string;
}

export default function SelectGender({ onGenderChange, genderError, initialGender = "" }: SelectGenderProps) {
  const [selectedGender, setSelectedGender] = useState<string>(initialGender)

  return (
    <div>
      <label htmlFor="gender" className="block text-gradient font-serif">
        Gender
      </label>

      <div className="flex items-center gap-4 text-placeholder">
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <select
              required
              value={selectedGender} 
              onChange={(e) =>{
                setSelectedGender(e.target.value)
                onGenderChange(selectedGender)
              }}
              className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400
                ${genderError ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="" disabled hidden>
                Select a gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
      {genderError && <p className="text-red-500 text-sm">{genderError}</p>}
    </div>
  );
}
