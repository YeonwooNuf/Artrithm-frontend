import React from 'react'

function Header() {
  return (
    <header className="bg-beige dark:bg-sand shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h2 className="text-2xl font-semibold">🎨 Gallery</h2>
        <nav className="space-x-4">
          <a href="#home" className="hover:underline">홈</a>
          <a href="#gallery" className="hover:underline">전시관</a>
          <a href="#about" className="hover:underline">소개</a>
        </nav>
      </div>
    </header>
  )
}

export default Header
