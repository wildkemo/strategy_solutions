import { Link } from 'react-router-dom'
import vortexLogo from '../assets/Vortex6_logo-removebg-preview.png'
import brandLogo from '../assets/SS-logo-small-removebg-preview.png'
import styles from './Footer.module.css'

export function Footer({ variant = 'full' }) {
  if (variant === 'minimal') {
    return (
      <footer className={styles.minimal}>
        <Link to="/contact">Contact Support</Link>
        <Link to="#">Privacy Policy</Link>
        <Link to="#">Terms of Service</Link>
      </footer>
    )
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        <div className={styles.brandInfo}>
          <img src={brandLogo} alt="Strategy Solutions" className={styles.brandLogo} />
          <p className={styles.brandDesc}>
            Empowering businesses through strategic digital solutions and expert consulting services.
          </p>
        </div>

        <div className={styles.footerColumn}>
          <h4 className={styles.columnTitle}>Platform</h4>
          <nav className={styles.linkList}>
            <Link to="/">Home</Link>
            <Link to="/services">Services</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        <div className={styles.footerColumn}>
          <h4 className={styles.columnTitle}>Services</h4>
          <nav className={styles.linkList}>
            <Link to="/services">All Services</Link>
            <Link to="/request-service">Request Custom</Link>
            <Link to="/my-orders">Track Orders</Link>
          </nav>
        </div>

        <div className={styles.footerColumn}>
          <h4 className={styles.columnTitle}>Legal</h4>
          <nav className={styles.linkList}>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Cookie Policy</Link>
          </nav>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} Strategy Solutions. All rights reserved.
        </p>

        <a
          href="https://vortex-systems.tech/"
          target="_blank"
          rel="noreferrer"
          className={styles.vortexCard}
        >
          <span className={styles.vortexText}>Powered by</span>
          <img src={vortexLogo} alt="Vortex Systems" className={styles.vortexLogo} />
        </a>
      </div>
    </footer>
  )
}
