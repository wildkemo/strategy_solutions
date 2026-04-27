import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function RequireAuth({ children, adminOnly }) {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '40vh',
          color: 'var(--color-text-muted)',
        }}
      >
        Loading…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/services" replace />
  }

  return children
}
