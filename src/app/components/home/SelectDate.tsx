
import { useState } from "react"

interface SelectDateProps {
  onDateChange: (day: string, month: string, year: string) => void
  initialDay: string
  initialMonth: string
  initialYear: string
  dateError: string
}

export default function SelectDate({ onDateChange, dateError, initialDay, initialMonth, initialYear}: SelectDateProps) {
  const currentYear = new Date().getFullYear()
  const minYear = currentYear - 120 
  const [selectedDay, setSelectedDay] = useState<string>(initialDay)
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth)
  const [selectedYear, setSelectedYear] = useState<string>(initialYear)

  const days = Array.from({ length: 31 }, (_, index) => (index + 1).toString())

  const months = Array.from({ length: 12 }, (_, index) => (index + 1).toString())

  const years = Array.from(
    { length: currentYear - minYear + 1 },
    (_, index) => (minYear + index).toString()
  ).reverse()

  return (
    <div>
        <label
          htmlFor="birthdate"
          className="block text-input-title"
        >
          Birthdate
        </label>
      <div className="flex items-center gap-4 text-placeholder">


        <div className="flex gap-4 w-full">
          {/* Select Day */}
          <div className="flex-1">
            <select
              required
              value={selectedDay}
              onChange={(e) => {
                setSelectedDay(e.target.value)
                onDateChange(e.target.value, selectedMonth, selectedYear)
              }}
              className={`${dateError ? 'input-style-error bg-box' : 'input-style-standard bg-box'}`}
            >
              <option value="" disabled hidden>Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Select Month */}
          <div className="flex-1">
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value)
                onDateChange(selectedDay, e.target.value, selectedYear)
              }}
              className={`${dateError ? 'input-style-error bg-box' : 'input-style-standard bg-box'}`}
            >
              <option value="" disabled hidden>Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Select Year */}
          <div className="flex-1">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value)
                onDateChange(selectedDay, selectedMonth, e.target.value)
              }}
              className={`${dateError ? 'input-style-error bg-box' : 'input-style-standard bg-box'}`}
            >
              <option value="" disabled hidden>Year</option>
              {years.map((year) => (
                <option 
                  key={year} 
                  value={year}
                  >
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>
      {dateError && (
            <p className=" text-error">{dateError}</p>
          )}
    </div>
  )
}
