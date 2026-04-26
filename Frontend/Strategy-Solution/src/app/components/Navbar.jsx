import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiFetch } from '../../lib/api'
import { Modal } from './Modal'
import { ThemeToggle } from './ThemeToggle'
import brandLogo from '../../assets/SS-logo-small-removebg-preview.png'
import styles from './Navbar.module.css'

function NavLinks({ onNavigate, showRequest }) {
  return (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? styles.active : undefined)}
        onClick={onNavigate}
      >
        Home
      </NavLink>
      <NavLink
        to="/services"
        className={({ isActive }) => (isActive ? styles.active : undefined)}
        onClick={onNavigate}
      >
        Services
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) => (isActive ? styles.active : undefined)}
        onClick={onNavigate}
      >
        About
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) => (isActive ? styles.active : undefined)}
        onClick={onNavigate}
      >
        Contact
      </NavLink>
      {showRequest ? (
        <NavLink
          to="/request-service"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
          onClick={onNavigate}
        >
          Request Service
        </NavLink>
      ) : null}
    </>
  )
}

export function Navbar() {
  const { user, loading, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [pendingOrders, setPendingOrders] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [deleteStep, setDeleteStep] = useState(null)
  const [deleteOtp, setDeleteOtp] = useState('')
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    if (!user || isAdmin) return
    let cancelled = false
    ;(async () => {
      const [p, o] = await Promise.all([
        apiFetch('/api/get_pending_otp_orders'),
        apiFetch('/api/get_user_orders'),
      ])
      if (cancelled) return
      if (p.ok && p.data?.pendingOrders)
        setPendingOrders(p.data.pendingOrders.slice(0, 3))
      if (o.ok && o.data?.orders)
        setRecentOrders(o.data.orders.slice(0, 3))
    })()
    return () => {
      cancelled = true
    }
  }, [user, isAdmin, panelOpen])

  const closeMobile = () => setMobileOpen(false)

  const openDeleteFlow = async () => {
    setDeleteError('')
    setDeleteStep('otp')
    setDeleteBusy(true)
    const { ok, data } = await apiFetch('/api/send_otp', {
      method: 'POST',
      json: { purpose: 'Delete Account' },
    })
    setDeleteBusy(false)
    if (!ok) setDeleteError(data?.message || 'Could not send OTP')
  }

  const goToConfirmDelete = () => {
    if (deleteOtp.length < 4) return
    setDeleteError('')
    setDeleteStep('confirm')
  }

  const finalizeDelete = async () => {
    setDeleteBusy(true)
    setDeleteError('')
    const { ok, data } = await apiFetch('/api/delete_account', {
      method: 'DELETE',
      json: { otp: deleteOtp, purpose: 'Delete Account' },
    })
    setDeleteBusy(false)
    if (ok) {
      await logout()
      setDeleteStep(null)
      setDeleteOtp('')
      setPanelOpen(false)
      navigate('/')
    } else {
      setDeleteStep('otp')
      setDeleteError(data?.message || 'Could not delete account')
    }
  }

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img
            src={brandLogo}
            alt="Strategy Solutions"
            className={styles.logoMark}
          />
          {/* <span className={styles.logoText}>Strategy Solutions</span> */}
        </Link>

        <nav className={styles.desktopNav} aria-label="Main">
          <NavLinks
            showRequest={!!user && !isAdmin}
            onNavigate={() => {}}
          />
        </nav>

        <div className={styles.right}>
          <ThemeToggle />
          {loading ? (
            <span className={styles.spinner} aria-label="Loading" />
          ) : user ? (
            <button
              type="button"
              className={styles.avatarBtn}
              aria-label="Account menu"
              onClick={() => setPanelOpen(true)}
            >
              <span className={styles.avatar}>
                {(user.name || user.email || '?').charAt(0).toUpperCase()}
              </span>
            </button>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.linkBtn}>
                Login
              </Link>
              <Link to="/register" className={styles.signUp}>
                Sign Up
              </Link>
            </div>
          )}

          <button
            type="button"
            className={styles.hamburger}
            aria-expanded={mobileOpen}
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          />
        </div>
      </header>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className={styles.overlay}
            aria-label="Close menu"
            onClick={closeMobile}
          />
          <div className={styles.mobileDrawer}>
            <div className={styles.mobileHead}>
              <span>Menu</span>
              <button
                type="button"
                className={styles.closeX}
                onClick={closeMobile}
                aria-label="Close"
              />
            </div>
            <nav className={styles.mobileNav} aria-label="Mobile">
              <NavLinks
                showRequest={!!user && !isAdmin}
                onNavigate={closeMobile}
              />
              {!user ? (
                <>
                  <Link to="/login" onClick={closeMobile}>
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMobile}>
                    Sign Up
                  </Link>
                </>
              ) : null}
            </nav>
          </div>
        </>
      ) : null}

      {panelOpen && user ? (
        <>
          <button
            type="button"
            className={styles.overlay}
            aria-label="Close panel"
            onClick={() => setPanelOpen(false)}
          />
          <aside className={styles.userPanel}>
            <div className={styles.panelHead}>
              <div>
                <strong>{user.name || 'Account'}</strong>
                <div className={styles.email}>{user.email}</div>
              </div>
              <button
                type="button"
                className={styles.closeX}
                onClick={() => setPanelOpen(false)}
                aria-label="Close"
              />
            </div>

            {!isAdmin && pendingOrders.length > 0 ? (
              <div className={styles.panelBlock}>
                <p className={styles.panelLabel}>Pending verification</p>
                <Link
                  to="/my-orders"
                  className={styles.verifyLink}
                  onClick={() => setPanelOpen(false)}
                >
                  Verify OTP for {pendingOrders.length} order(s)
                </Link>
              </div>
            ) : null}

            {!isAdmin && recentOrders.length > 0 ? (
              <div className={styles.panelBlock}>
                <p className={styles.panelLabel}>Recent orders</p>
                <ul className={styles.orderPreview}>
                  {recentOrders.map((o) => (
                    <li key={o.id}>
                      #{o.id} · {o.service_type || 'Service'}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className={styles.panelActions}>
              <Link
                to="/my-orders"
                onClick={() => setPanelOpen(false)}
                className={styles.panelBtn}
              >
                View All Orders
              </Link>
              <Link
                to="/profile"
                onClick={() => setPanelOpen(false)}
                className={styles.panelBtn}
              >
                Manage Profile
              </Link>
              {isAdmin ? (
                <Link
                  to="/blank_admin"
                  onClick={() => setPanelOpen(false)}
                  className={styles.panelBtnAdmin}
                >
                  Admin Dashboard
                </Link>
              ) : null}
              <button
                type="button"
                className={styles.panelBtnDanger}
                onClick={openDeleteFlow}
              >
                Delete account
              </button>
              <button
                type="button"
                className={styles.panelBtnGhost}
                onClick={async () => {
                  await logout()
                  setPanelOpen(false)
                  navigate('/')
                }}
              >
                Logout
              </button>
            </div>
          </aside>
        </>
      ) : null}

      <Modal
        open={deleteStep === 'otp'}
        title="Delete account"
        onClose={() => !deleteBusy && setDeleteStep(null)}
        actions={
          <>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => setDeleteStep(null)}
              disabled={deleteBusy}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={goToConfirmDelete}
              disabled={deleteBusy || deleteOtp.length < 4}
            >
              Continue
            </button>
          </>
        }
      >
        <p>Enter the OTP sent to your email.</p>
        {deleteError ? (
          <p className={styles.errText}>{deleteError}</p>
        ) : null}
        <input
          className={styles.otpInput}
          value={deleteOtp}
          onChange={(e) => setDeleteOtp(e.target.value)}
          placeholder="6-digit code"
          autoComplete="one-time-code"
        />
      </Modal>

      <Modal
        open={deleteStep === 'confirm'}
        title="Confirm deletion"
        onClose={() => !deleteBusy && setDeleteStep(null)}
        actions={
          <>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => setDeleteStep(null)}
              disabled={deleteBusy}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.btnDanger}
              onClick={finalizeDelete}
              disabled={deleteBusy}
            >
              Permanently delete
            </button>
          </>
        }
      >
        <p>
          This will remove your account and associated data. This cannot be
          undone.
        </p>
      </Modal>
    </>
  )
}
