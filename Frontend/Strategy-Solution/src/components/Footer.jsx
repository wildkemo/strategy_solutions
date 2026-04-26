import { Link } from 'react-router-dom'
import vortexLogo from '../assets/Vortex6_logo-removebg-preview.png'
import styles from './Footer.module.css'

export function Footer({ variant = 'full' }) {
  if (variant === 'minimal') {
    return (
      <footer className={styles.minimal}>
        <Link to="/contact">Contact</Link>
        <span aria-hidden="true">·</span>
        <span>Privacy</span>
        <span aria-hidden="true">·</span>
        <span>Terms</span>
      </footer>
    )
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <div className={styles.links}>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <p className={styles.copy}>
          &copy; {new Date().getFullYear()} Strategy Solutions. All rights reserved.
        </p>
      </div>

      <a
        href="https://vortex-systems.tech/"
        target="_blank"
        rel="noreferrer"
        className={styles.brandCard}
      >
        <img src={vortexLogo} alt="Vortex" className={styles.brandLogo} />
        <span className={styles.brandText}>Developed by Vortex</span>
      </a>
    </footer>
  )
}
