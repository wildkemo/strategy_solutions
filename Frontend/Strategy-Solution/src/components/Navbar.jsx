import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUserOrdersQuery } from '../lib/queries'
import { Modal } from './Modal'
import { ThemeToggle } from './ThemeToggle'
import brandLogo from '../assets/SS-logo-small-removebg-preview.png'
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

  const { data: allOrders = [] } = useUserOrdersQuery()

  const recentOrders = allOrders.slice(0, 3)

  const [logoutOpen, setLogoutOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

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
                  to="/admin_dashboard"
                  onClick={() => setPanelOpen(false)}
                  className={styles.panelBtnAdmin}
                >
                  Admin Dashboard
                </Link>
              ) : null}
              <button
                type="button"
                className={styles.panelBtnGhost}
                onClick={() => setLogoutOpen(true)}
              >
                Logout
              </button>
            </div>
          </aside>
        </>
      ) : null}

      <Modal
        open={logoutOpen}
        title="Sign out?"
        onClose={() => setLogoutOpen(false)}
        actions={
          <>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => setLogoutOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={async () => {
                await logout()
                setLogoutOpen(false)
                setPanelOpen(false)
                navigate('/')
              }}
            >
              Sign out
            </button>
          </>
        }
      >
        <p>Are you sure you want to log out of your account?</p>
      </Modal>
    </>
  )
}
