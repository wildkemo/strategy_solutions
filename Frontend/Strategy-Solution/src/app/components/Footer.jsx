import { Link } from 'react-router-dom'
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
      <div className={styles.links}>
        <Link to="/contact">Contact</Link>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
      <div className={styles.credit}>
        <span className={styles.vortex}>Developed by Vortex</span>
      </div>
    </footer>
  )
}
