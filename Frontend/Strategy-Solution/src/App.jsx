import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AppLayout } from './layouts/AppLayout'
import { RequireAuth } from './components/RequireAuth'
import HomePage from './pages/Home/Home'
import AboutPage from './pages/About/About'
import ContactPage from './pages/Contact/Contact'
import ServicesPage from './pages/Services/Services'
import ServiceDetailPage from './pages/ServiceDetail/ServiceDetail'
import LoginPage from './pages/Login/Login'
import RegisterPage from './pages/Register/Register'
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPassword'
import ProfilePage from './pages/Profile/Profile'
import MyOrdersPage from './pages/MyOrders/MyOrders'
import AdminDashboardPage from './pages/AdminDashboard/AdminDashboard'
import BlankCustomerPage from './pages/BlankCustomer/BlankCustomer'
import ErrorTestPage from './pages/ErrorTest/ErrorTest'

function GuestOnly({ children }) {
  const { user, loading, isAdmin } = useAuth()
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
    return <Navigate to={isAdmin ? '/admin_dashboard' : '/services'} replace />
  }
  return children
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
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
            path="/admin_dashboard"
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
    </>
  )
}
