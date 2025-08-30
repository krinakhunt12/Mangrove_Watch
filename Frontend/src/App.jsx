import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home.jsx'
import "./index.css";
import Landing from './pages/Landing.jsx'
import AppRoutes from './routes.jsx'
import GlobalBot from './components/GlobalBot.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRoutes/>
      <GlobalBot />
    </>
  )
}

export default App
