'use client'

import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'

const ThemeToggleButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isEnglish, setIsEnglish] = useState(true)

  const toggleLanguage = () => {

    setIsEnglish((prev) => !prev)
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setIsDarkMode(false)
    }
  }, [])

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="flex items-center">
        <SunIcon className="w-6 h-6 text-yellow-500" />
        <button
          onClick={toggleTheme}
          className=" cursor-pointer relative mx-2 w-12 h-6 rounded-full transition-colors duration-300 bg-neutral-200 dark:bg-neutral-600"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-300 transform bg-neutral-100 shadow-md ${
              isDarkMode ? 'translate-x-6' : ''
            }`}
          />
        </button>
        <MoonIcon className="w-6 h-6 text-gray-500" />
      </div>
      <div className="flex items-center mt-1">

      <span className=" w-5 ml-1 text-xs text-color" aria-label="English" title="English">
        EN
      </span>
      <button
        onClick={toggleLanguage}
        className="cursor-pointer relative mx-2 w-12 h-6 rounded-full transition-colors duration-300 bg-neutral-200 dark:bg-neutral-600"
        aria-label="Toggle language"
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-300 transform bg-neutral-100 shadow-md ${
            isEnglish ? "" : "translate-x-6"
          }`}
        />
      </button>

      <span className="text-xs ml-1 text-color" aria-label="Português" title="Português">
        PT
      </span>
    </div>

    </div>
  )
}

export default ThemeToggleButton
