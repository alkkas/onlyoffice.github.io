import { useState } from 'react'
import './global.styles.scss'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'

export default function App() {
  const [isAuth, setIsAuth] = useState(false)
  return <main className="container">{isAuth ? <Home /> : <Login />}</main>
}
