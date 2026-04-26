import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AppLayout } from './app/layout'
import { RequireAuth } from './app/RequireAuth'
import HomePage from './app/page'
import AboutPage from './app/about/page'
import ContactPage from './app/contact/page'
import ServicesPage from './app/services/page'
import ServiceDetailPage from './app/services/[slug]/page'
import RequestServicePage from './app/request-service/page'
import LoginPage from './app/login/page'
import RegisterPage from './app/register/page'
import ForgotPasswordPage from './app/forgot-password/page'
import ProfilePage from './app/profile/page'
import MyOrdersPage from './app/my-orders/page'
import AdminDashboardPage from './app/blank_admin/page'
import BlankCustomerPage from './app/blank_customer/page'
import ErrorTestPage from './app/error_test_page/page'

function GuestOnly({ children }) {
  const { user, loading, isAdmin, authBypass } = useAuth()
  if (authBypass) return children
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
  if (user) {
    return <Navigate to={isAdmin ? '/blank_admin' : '/services'} replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route
          path="/request-service"
          element={
            <RequireAuth>
              <RequestServicePage />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/my-orders"
          element={
            <RequireAuth>
              <MyOrdersPage />
            </RequireAuth>
          }
        />
        <Route
          path="/blank_admin"
          element={
            <RequireAuth adminOnly>
              <AdminDashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/blank_customer"
          element={
            <RequireAuth>
              <BlankCustomerPage />
            </RequireAuth>
          }
        />
        <Route path="/error_test_page" element={<ErrorTestPage />} />
      </Route>

      <Route
        path="/login"
        element={
          <AppLayout />
        }
      >
        <Route
          index
          element={
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          }
        />
      </Route>

      <Route path="/register" element={<AppLayout />}>
        <Route
          index
          element={
            <GuestOnly>
              <RegisterPage />
            </GuestOnly>
          }
        />
      </Route>

      <Route path="/forgot-password" element={<AppLayout />}>
        <Route index element={<ForgotPasswordPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
