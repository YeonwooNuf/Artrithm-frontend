import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Gallery3D from './components/Gallery3D'
import DarkModeToggle from './components/DarkModeToggle'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen transition-all duration-500 bg-light dark:bg-primary text-primary dark:text-light">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        <h1 className="text-4xl font-bold text-center mb-10">🖼️ Artrithm</h1>
        <Gallery3D />
      </div>
    </div>
  )
}

export default App
