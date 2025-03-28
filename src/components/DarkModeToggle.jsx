import React from 'react'

function DarkModeToggle({ darkMode, setDarkMode }) {
  return (
    <div className="flex justify-end mb-6">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-sand dark:bg-beige px-4 py-2 rounded-md shadow-md transition"
      >
        {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  )
}

export default DarkModeToggle
