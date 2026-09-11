import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
  type Role,
  type User,
} from '../lib/auth'

interface AuthValue {
  user: User | null
  login: (email: string, password: string) => User
  register: (name: string, email: string, password: string, role: Role) => User
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => currentUser())

  const value = useMemo<AuthValue>(
    () => ({
      user,
      login: (email, password) => {
        const next = loginUser(email, password)
        setUser(next)
        return next
      },
      register: (name, email, password, role) => {
        const next = registerUser({ name, email, password, role })
        setUser(next)
        return next
      },
      logout: () => {
        logoutUser()
        setUser(null)
      },
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
