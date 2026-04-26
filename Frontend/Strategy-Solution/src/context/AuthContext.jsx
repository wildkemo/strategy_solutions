import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { apiFetch } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const { ok, data } = await apiFetch('/api/get_current_user')
    if (ok && data?.user) {
      setUser(data.user)
      return data.user
    }
    setUser(null)
    return null
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      await refreshUser()
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [refreshUser])

  const login = useCallback(
    async (email, password) => {
      const { ok, data, status } = await apiFetch('/api/login', {
        method: 'POST',
        json: { email, password },
      })
      if (ok && data?.status === 'success') {
        await refreshUser()
        return { ok: true, isAdmin: !!data.isAdmin }
      }
      return {
        ok: false,
        message: data?.message || data?.error || `Login failed (${status})`,
      }
    },
    [refreshUser],
  )

  const logout = useCallback(async () => {
    await apiFetch('/api/logout', { method: 'POST' })
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: !!user?.isAdmin,
      refreshUser,
      login,
      logout,
      setUser,
    }),
    [user, loading, refreshUser, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook colocated with provider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
