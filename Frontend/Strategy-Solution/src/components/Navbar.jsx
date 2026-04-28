import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useUserOrdersQuery } from '../lib/queries'
import { Modal } from './Modal'
import { ThemeToggle } from './ThemeToggle'
import brandLogo from '../assets/SS-logo-small-removebg-preview.png'
import styles from './Navbar.module.css'

function orderStatusClass(status) {
  const s = (status || '').toLowerCase()
  if (s.includes('done') || s.includes('complete')) return styles.statusDone
  if (s.includes('reject')) return styles.statusRejected
  if (s.includes('pending')) return styles.statusPending
  if (s.includes('active')) return styles.statusActive
  return styles.statusMuted
}

function NavLinks({ onNavigate }) {
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
  const activeOrders = allOrders.filter((order) => {
    const status = (order.status || '').toLowerCase()
    return status.includes('pending') || status.includes('active')
  }).length

  const [logoutOpen, setLogoutOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoBadge}>
            <img
              src={brandLogo}
              alt="Strategy Solutions"
              className={styles.logoMark}
            />
          </span>
          <span className={styles.logoTextWrap}>
            <span className={styles.logoText}>Strategy Solutions</span>
            <span className={styles.logoSubtext}>Digital services</span>
          </span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Main">
          <NavLinks onNavigate={() => {}} />
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
              <span className={styles.avatarMeta}>
                <strong>{isAdmin ? 'Admin' : user.name || 'Account'}</strong>
                <small>{isAdmin ? 'Control panel' : 'Open profile'}</small>
              </span>
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
          >
            <span />
          </button>
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
              <div className={styles.mobileHeadBrand}>
                <span className={styles.mobileHeadTitle}>Menu</span>
                <span className={styles.mobileHeadText}>Strategy Solutions</span>
              </div>
              <button
                type="button"
                className={styles.closeX}
                onClick={closeMobile}
                aria-label="Close"
              />
            </div>
            <nav className={styles.mobileNav} aria-label="Mobile">
              <NavLinks onNavigate={closeMobile} />
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
            <div className={styles.panelCloseRow}>
              <span className={styles.panelEyebrow}>Account</span>
              <button
                type="button"
                className={styles.closeX}
                onClick={() => setPanelOpen(false)}
                aria-label="Close"
              />
            </div>
            
            <div className={styles.panelHero}>
              <div className={styles.panelUserSection}>
                <div className={styles.panelAvatarLarge}>
                  {(user.name || user.email || '?').charAt(0).toUpperCase()}
                </div>
                <div className={styles.panelUserInfo}>
                  <div className={styles.panelUserTopRow}>
                    <strong>{user.name || 'Account'}</strong>
                    <span className={styles.roleBadge}>{isAdmin ? 'Admin' : 'Client'}</span>
                  </div>
                  <div className={styles.email}>{user.email}</div>
                </div>
              </div>

              <div className={styles.panelStats}>
                {isAdmin ? (
                  <>
                    <div className={styles.panelStatCard}>
                      <span>Access</span>
                      <strong>Full control</strong>
                    </div>
                    <div className={styles.panelStatCard}>
                      <span>Workspace</span>
                      <strong>Admin tools</strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.panelStatCard}>
                      <span>Total orders</span>
                      <strong>{allOrders.length}</strong>
                    </div>
                    <div className={styles.panelStatCard}>
                      <span>Open now</span>
                      <strong>{activeOrders}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>

            {!isAdmin && (
              <div className={styles.panelBlock}>
                <p className={styles.panelLabel}>Recent orders</p>
                {recentOrders.length > 0 ? (
                  <ul className={styles.orderPreview}>
                    {recentOrders.map((o) => (
                      <li key={o.id} className={styles.orderItem}>
                        <div className={styles.orderItemTop}>
                          <span className={styles.orderId}>Order #{o.id}</span>
                          <span className={`${styles.orderStatus} ${orderStatusClass(o.status)}`}>
                            {o.status || 'Unknown'}
                          </span>
                        </div>
                        <span className={styles.orderSvc}>{o.service_type || 'Service request'}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.emptyText}>No recent orders</p>
                )}
              </div>
            )}

            <div className={styles.panelActions}>
              <p className={styles.panelLabel}>Shortcuts</p>
              {!isAdmin && (
                <Link
                  to="/my-orders"
                  onClick={() => setPanelOpen(false)}
                  className={styles.panelBtn}
                >
                  <span>View all orders</span>
                  <small>Track requests and updates</small>
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setPanelOpen(false)}
                className={styles.panelBtn}
              >
                <span>Manage profile</span>
                <small>Update account details</small>
              </Link>
              {isAdmin ? (
                <Link
                  to="/admin_dashboard"
                  onClick={() => setPanelOpen(false)}
                  className={styles.panelBtnAdmin}
                >
                  <span>Admin dashboard</span>
                  <small>Services, orders, customers</small>
                </Link>
              ) : null}
              <div className={styles.panelFooter}>
                <button
                  type="button"
                  className={styles.panelBtnLogout}
                  onClick={() => setLogoutOpen(true)}
                >
                  <span>Logout</span>
                  <small>End this session</small>
                </button>
              </div>
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
