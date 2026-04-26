import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AppLayout } from './layouts/AppLayout'
import { RequireAuth } from './components/RequireAuth'
import HomePage from './pages/Home/Home'
import AboutPage from './pages/About/About'
import ContactPage from './pages/Contact/Contact'
import ServicesPage from './pages/Services/Services'
import ServiceDetailPage from './pages/ServiceDetail/ServiceDetail'
import RequestServicePage from './pages/RequestService/RequestService'
import LoginPage from './pages/Login/Login'
import RegisterPage from './pages/Register/Register'
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPassword'
import ProfilePage from './pages/Profile/Profile'
import MyOrdersPage from './pages/MyOrders/MyOrders'
import AdminDashboardPage from './pages/AdminDashboard/AdminDashboard'
import BlankCustomerPage from './pages/BlankCustomer/BlankCustomer'
import ErrorTestPage from './pages/ErrorTest/ErrorTest'

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
