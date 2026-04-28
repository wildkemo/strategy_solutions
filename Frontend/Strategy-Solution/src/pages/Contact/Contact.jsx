import { Link } from 'react-router-dom'
import { Footer } from '../../components/Footer'
import styles from './Contact.module.css'

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <div className={styles.orb1} aria-hidden></div>
      <div className={styles.orb2} aria-hidden></div>

      <section className={styles.hero}>
        <div className={`${styles.heroInner} animate-slide-up`}>
          <h1>Contact us</h1>
          <p>
            Whether you are exploring a new initiative or need a partner for
            delivery, we would love to hear from you.
          </p>
        </div>
      </section>

      <section className={`${styles.cards} ${styles.staggerIn}`}>
        <div className={styles.card} style={{ animationDelay: '0.1s' }}>
          <div className={styles.iconTile} aria-hidden>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
              />
            </svg>
          </div>
          <h2>Email</h2>
          <p>amr.elshimy@strategy-solution.com</p>
        </div>
        <div className={styles.card} style={{ animationDelay: '0.2s' }}>
          <div className={styles.iconTile} aria-hidden>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"
              />
            </svg>
          </div>
          <h2>Address</h2>
          <p>Capital Mall, Unit 27, 5th Settlement</p>
        </div>
        <div className={styles.card} style={{ animationDelay: '0.3s' }}>
          <div className={styles.iconTile} aria-hidden>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
              />
            </svg>
          </div>
          <h2>Phone</h2>
          <p>20 123 456 7890</p>
        </div>
      </section>

      <section className={`${styles.mapSection} animate-slide-up`}>
        <div className={styles.mapWrap}>
          <iframe
            title="Office location"
            src="https://www.google.com/maps/embed/v1/place?q=Egypt%20%2C%20new%20cairo%20%2C%205th%20settlement%20court%20%2C%20al%20nasr%20mall&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBox}>
          <div className={styles.ctaContent}>
            <h2>Explore what we can do together</h2>
            <p>Browse our services catalog and find the right engagement model.</p>
            <Link to="/services" className={styles.cta}>
              View services
            </Link>
          </div>
          <div className={styles.ctaBackgroundShape}></div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
