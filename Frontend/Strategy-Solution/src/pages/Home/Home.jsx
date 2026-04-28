import { Link } from 'react-router-dom'
import { Footer } from '../../components/Footer'
import heroImage from '../../assets/bb2af275-e7f6-4e3e-acc4-3f60fd7341d1.png'
import styles from './Home.module.css'

const coreServices = [
  {
    title: 'Cloud Computing',
    description: 'Scalable cloud infrastructure and migration support for modern business operations.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M7.5 18.5A5.5 5.5 0 0 1 7 7.52a7 7 0 0 1 13.21 3.09A4.01 4.01 0 0 1 19 18.5H7.5Zm0-2H19a2 2 0 0 0 .34-3.97l-1.08-.18-.12-1.09A5 5 0 0 0 8.65 9.4l-.44.98-1.07-.12A3.5 3.5 0 0 0 7.5 16.5Z" />
      </svg>
    ),
  },
  {
    title: 'Security',
    description: 'Cybersecurity services that help protect systems, data, and digital workflows.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 22a10.77 10.77 0 0 1-6.48-4.12A12.2 12.2 0 0 1 3 10.39V5l9-3 9 3v5.39a12.2 12.2 0 0 1-2.52 7.49A10.77 10.77 0 0 1 12 22Zm0-2.13a8.72 8.72 0 0 0 4.9-3.23A10.25 10.25 0 0 0 19 10.39V6.44l-7-2.33-7 2.33v3.95a10.25 10.25 0 0 0 2.1 6.25 8.72 8.72 0 0 0 4.9 3.23Zm-1.06-5.3-3.18-3.18 1.41-1.41 1.77 1.76 4.24-4.24 1.42 1.42-5.66 5.65Z" />
      </svg>
    ),
  },
  {
    title: 'IT Consulting',
    description: 'Strategic technology guidance to align IT decisions with business goals.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4Zm2 0h2V4h-2v2Zm8 5.5V8H5v3.5h5v-1h4v1h5Zm-7 1a1 1 0 0 1-1-1v4h2v-4a1 1 0 0 1-1 1Zm7 1h-5V16h-4v-2.5H5V18h14v-4.5Z" />
      </svg>
    ),
  },
]

const industries = [
  {
    name: 'Financial Services & Banking',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path fill="currentColor" d="M3 10.5 12 4l9 6.5V12H3v-1.5Zm3 3.5h2v5h2v-5h4v5h2v-5h2v5h2v2H4v-2h2v-5Zm1.15-4h9.7L12 6.5 7.15 10Z" />
      </svg>
    ),
  },
  {
    name: 'Retail & Ecommerce',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path fill="currentColor" d="M7 22a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm10 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM5.3 5l1.12 8h10.93l1.65-6H7.07l-.28-2H3V3h5.5l.28 2H21l-2.75 10H4.7L3.3 5h2Z" />
      </svg>
    ),
  },
  {
    name: 'Manufacturing and Logistics',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path fill="currentColor" d="M3 6h10v8h1.5l2-3H21v7h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3V6Zm2 2v8.27A2 2 0 0 1 8.73 16H12V8H5Zm11 5-1.33 2H19v-2h-3ZM7 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM7 10h3v2H7v-2Z" />
      </svg>
    ),
  },
  {
    name: 'Telecommunications',
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
        <path fill="currentColor" d="M12 20a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2Zm-4-4 1.5-7h5L16 16H8Zm3.12-9L12 3l.88 4h-1.76ZM6.64 8.64 5.22 7.22a9.6 9.6 0 0 1 13.56 0l-1.42 1.42a7.6 7.6 0 0 0-10.72 0Zm2.83 2.83-1.42-1.42a5.6 5.6 0 0 1 7.9 0l-1.42 1.42a3.6 3.6 0 0 0-5.06 0Z" />
      </svg>
    ),
  },
]

export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* Decorative Background Orbs */}
      <div className={styles.orb1} aria-hidden></div>
      <div className={styles.orb2} aria-hidden></div>

      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>Strategy Solution</span>
            <h1 className={styles.heroTitle}>
              Empowering your <span className={styles.textGradient}>business</span> with <span className={styles.textGradient}>innovative</span> strategies.
            </h1>
            <p className={styles.heroSub}>
              Cutting-edge IT consulting, cloud computing, and cybersecurity services designed to help you thrive in the digital age.
            </p>
            <div className={styles.heroActions}>
              <Link to="/services" className={styles.ctaPrimary}>
                Explore Services
                <svg viewBox="0 0 24 24" width="20" height="20" className={styles.arrowIcon}>
                  <path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/contact" className={styles.ctaSecondary}>
                Contact Us
              </Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.imageGlow}></div>
            <img src={heroImage} alt="Technology Servers" className={styles.heroImg} />
          </div>
        </div>
      </section>

      <section className={styles.trustSection}>
        <div className={styles.trustInner}>
          <h2 className={styles.sectionTitleCenter}>A Legacy of Excellence</h2>
          <p className={styles.leadText}>
            Headquartered in Cairo, Egypt, Strategy Solution brings over two decades of specialized IT talent outsourcing and consultancy. We deliver high-caliber resources in a cost-efficient manner, fueling the growth of our partners worldwide.
          </p>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className={styles.wrap}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>What We Do</span>
            <h2 className={styles.sectionTitle}>Our Core Expertise</h2>
            <p className={styles.sectionSub}>Tailored technology solutions designed for modern, agile enterprises.</p>
          </div>
          
          <div className={`${styles.serviceGrid} ${styles.staggerIn}`}>
            {coreServices.map((service, idx) => (
              <Link key={service.title} to="/services" className={styles.serviceCard} style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className={styles.cardContent}>
                  <div className={styles.coreServiceIcon}>{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className={styles.cardLink}>
                    Learn more <span className={styles.cardArrow}>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.industriesSection}>
        <div className={styles.wrap}>
          <div className={styles.sectionHeaderCenter}>
            <span className={styles.sectionEyebrow}>Industries</span>
            <h2 className={styles.sectionTitleCenter}>Sectors We Transform</h2>
          </div>
          <div className={`${styles.industryGrid} ${styles.staggerIn}`}>
            {industries.map((industry, idx) => (
              <div key={industry.name} className={styles.industryCard} style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className={styles.catIconWrap}>
                  <div className={styles.catIconGlow}></div>
                  <div className={styles.catIcon}>
                    {industry.icon}
                  </div>
                </div>
                <h3>{industry.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaBanner}>
          <div className={styles.ctaContent}>
            <h2>Ready to transform how your organization executes?</h2>
            <p>Talk to our team about your priorities and timeline.</p>
            <Link to="/contact" className={styles.ctaButton}>
              Get in Touch
            </Link>
          </div>
          <div className={styles.ctaBackgroundShape}></div>
        </div>
      </section>

      <Footer />
    </div>
  )
}