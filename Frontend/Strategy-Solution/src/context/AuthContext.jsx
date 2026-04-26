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
const AUTH_BYPASS = import.meta.env.DEV || import.meta.env.VITE_AUTH_BYPASS === 'true'
const BYPASS_USER = {
  id: 'dev-user',
  name: 'Dev User',
  email: 'dev@local.test',
  isAdmin: true,
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (AUTH_BYPASS ? BYPASS_USER : null))
  const [loading, setLoading] = useState(!AUTH_BYPASS)

  const refreshUser = useCallback(async () => {
    if (AUTH_BYPASS) {
      setUser(BYPASS_USER)
      return BYPASS_USER
    }
    const { ok, data } = await apiFetch('/api/get_current_user')
    if (ok && data?.user) {
      setUser(data.user)
      return data.user
    }
    setUser(null)
    return null
  }, [])

  useEffect(() => {
    if (AUTH_BYPASS) {
      setLoading(false)
      return
    }
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
      if (AUTH_BYPASS) {
        setUser({
          ...BYPASS_USER,
          email: email || BYPASS_USER.email,
          name: email ? email.split('@')[0] : BYPASS_USER.name,
        })
        return { ok: true, isAdmin: true }
      }
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
    if (AUTH_BYPASS) {
      setUser(BYPASS_USER)
      return
    }
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
      authBypass: AUTH_BYPASS,
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
