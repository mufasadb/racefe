import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/user/`,
      {
        credentials: 'include'
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data) {
          setIsLoggedIn(true)
        }
      })
  }, [])

  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/auth/discord`
  }

  const handleLogout = () => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${process.env.REACT_APP_BACKEND_PORT}/auth/logout`,
      {
        credentials: 'include'
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data) {
          setIsLoggedIn(false)
        }
      })
  }

  return (
    <div>
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login with Discord</button>
      )}
    </div>
  )
}

export default LoginPage
