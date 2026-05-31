import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = sessionStorage.getItem('hd_admin')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (adminData) => {
    setAdmin(adminData)
    sessionStorage.setItem('hd_admin', JSON.stringify(adminData))
  }

  const logout = () => {
    setAdmin(null)
    sessionStorage.removeItem('hd_admin')
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
