import { useState } from "react"

interface SelectGenderProps {
  onGenderChange: (gender: string) => void
  genderError: string
  initialGender: string
}

export default function SelectGender({ onGenderChange, genderError, initialGender = "" }: SelectGenderProps) {
  const [selectedGender, setSelectedGender] = useState<string>(initialGender)

  return (
    <div>
      <label htmlFor="gender" className="block text-input-title">
        Gender
      </label>

      <div className="flex items-center gap-4">
        <div className="flex gap-4 w-full">
          <div className="flex-1">
            <select
              required
              value={selectedGender} 
              onChange={(e) =>{
                setSelectedGender(e.target.value)
                onGenderChange(e.target.value)
              }}
              className={`${genderError ? "input-style-error bg-box" : "input-style-standard bg-box"}`}
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
      {genderError && <p className="text-error">{genderError}</p>}
    </div>
  )
}
