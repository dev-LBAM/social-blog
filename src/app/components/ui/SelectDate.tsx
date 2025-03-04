"use client";

import { useEffect, useState } from "react";

interface SelectDateProps {
  onDateChange: (day: string, month: string, year: string) => void;
}

export default function SelectDate({ onDateChange }: SelectDateProps) {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 120; // Ano mínimo para idade de 130 anos
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  // Gerar os dias de 1 a 31
  const days = Array.from({ length: 31 }, (_, index) => (index + 1).toString());

  // Gerar os meses de 1 a 12
  const months = Array.from({ length: 12 }, (_, index) => (index + 1).toString());

  // Gerar os anos desde o ano mínimo até o ano atual
  const years = Array.from(
    { length: currentYear - minYear + 1 },
    (_, index) => (minYear + index).toString()
  );

  // Enviar os dados de data para o componente pai sempre que algum valor mudar
  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      onDateChange(selectedDay, selectedMonth, selectedYear);
    }
  }, [selectedDay, selectedMonth, selectedYear, onDateChange]);

  return (
    <div>
              <label
          htmlFor="birthdate"
          className="block text-gradient font-serif"
        >
          Birthdate
        </label>
      <div className="flex items-center gap-4">


        {/* Select de Dia, Mês e Ano na mesma linha */}
        <div className="flex gap-4 w-full">
          {/* Select de Dia */}
          <div className="flex-1">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Day</option>
              {days.map((day) => (
                <option key={day} value={day} className="bg-indigo-400">
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Select de Mês */}
          <div className="flex-1">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Month</option>
              {months.map((month) => (
                <option key={month} value={month} className="bg-indigo-400">
                  {month}
                </option>
              ))}
            </select>
          </div>

          {/* Select de Ano */}
          <div className="flex-1">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option className="bg-blue-500" value="">Year</option>
              {years.map((year) => (
                <option 
                  key={year} 
                  value={year}
                  className="bg-indigo-400">
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
