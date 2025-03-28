import React from 'react'
import ReactDOM from 'react-dom/client' // ← 이 줄 추가!
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)