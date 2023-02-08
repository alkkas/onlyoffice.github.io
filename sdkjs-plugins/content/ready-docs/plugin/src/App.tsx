import { useState } from 'react'
import './global.styles.scss'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import { ToastContainer, Slide } from 'react-toastify'
export default function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem('access_token'))
  return (
    <main className="container">
      {isAuth ? <Home /> : <Login />}{' '}
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        limit={3}
        hideProgressBar={true}
        transition={Slide}
      />
    </main>
  )
}
