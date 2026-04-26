import { Link } from 'react-router-dom'
import { Footer } from '../../components/Footer'
import styles from './Contact.module.css'

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1>Contact us</h1>
          <p>
            Whether you are exploring a new initiative or need a partner for
            delivery, we would love to hear from you.
          </p>
        </div>
      </section>

      <section className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.iconTile} aria-hidden>
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path
                fill="currentColor"
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
              />
            </svg>
          </div>
          <h2>Email</h2>
          <p>hello@strategysolutions.example</p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconTile} aria-hidden>
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path
                fill="currentColor"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"
              />
            </svg>
          </div>
          <h2>Address</h2>
          <p>100 Market Street, Suite 400, San Francisco, CA</p>
        </div>
        <div className={styles.card}>
          <div className={styles.iconTile} aria-hidden>
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path
                fill="currentColor"
                d="M6.62 10.79a15.15 15.15 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"
              />
            </svg>
          </div>
          <h2>Phone</h2>
          <p>+1 (555) 010-2030</p>
        </div>
      </section>

      <section className={styles.mapSection}>
        <div className={styles.mapWrap}>
          <iframe
            title="Office location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019032779877!2d-122.4018726846813!3d37.78792597975754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807d7b5b7b5b%3A0x7b5b7b5b7b5b7b5b!2sMarket%20St%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <section className={styles.ctaBox}>
        <h2>Explore what we can do together</h2>
        <p>Browse our services catalog and find the right engagement model.</p>
        <Link to="/services" className={styles.cta}>
          View services
        </Link>
      </section>

      <Footer />
    </div>
  )
}
