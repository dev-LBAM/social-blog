
import { useState } from "react";

interface SelectDateProps {
  onDateChange: (day: string, month: string, year: string) => void;
  initialDay: string
  initialMonth: string
  initialYear: string
  dateError: string
}

export default function SelectDate({ onDateChange, dateError, initialDay, initialMonth, initialYear}: SelectDateProps) {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 120; // Ano mínimo para idade de 130 anos
  const [selectedDay, setSelectedDay] = useState<string>(initialDay);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);

  // Gerar os dias de 1 a 31
  const days = Array.from({ length: 31 }, (_, index) => (index + 1).toString());

  // Gerar os meses de 1 a 12
  const months = Array.from({ length: 12 }, (_, index) => (index + 1).toString());

  // Gerar os anos desde o ano mínimo até o ano atual
  const years = Array.from(
    { length: currentYear - minYear + 1 },
    (_, index) => (minYear + index).toString()
  ).reverse();

  return (
    <div>
        <label
          htmlFor="birthdate"
          className="block text-gradient font-serif"
        >
          Birthdate
        </label>
      <div className="flex items-center gap-4 text-placeholder">


        {/* Select de Dia, Mês e Ano na mesma linha */}
        <div className="flex gap-4 w-full">
          {/* Select de Dia */}
          <div className="flex-1">
            <select
              required
              value={selectedDay}
              onChange={(e) => {
                setSelectedDay(e.target.value)
                onDateChange(selectedDay, selectedMonth, selectedYear)
              }}
              className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400
                ${dateError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="" disabled hidden>Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Select de Mês */}
          <div className="flex-1">
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value)
                onDateChange(selectedDay, selectedMonth, selectedYear)
              }}
              className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400
                ${dateError ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="" disabled hidden>Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Select de Ano */}
          <div className="flex-1">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value)
                onDateChange(selectedDay, selectedMonth, selectedYear)
              }}
              className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-400
                  ${dateError ? 'border-red-500' : 'border-gray-300'}`}
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
            <p className=" text-red-500 text-sm">{dateError}</p>
          )}
    </div>
  );
}
