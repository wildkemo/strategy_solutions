import { Link } from 'react-router-dom'
import { useServicesQuery, useCategoriesQuery } from '../../lib/queries'
import { serviceImageUrl } from '../../lib/services'
import { servicePath } from '../../lib/slug'
import { Footer } from '../../components/Footer'
import heroImage from '../../assets/bb2af275-e7f6-4e3e-acc4-3f60fd7341d1.png'
import styles from './Home.module.css'

export default function HomePage() {
  const { data: services = [], isLoading: servicesLoading } = useServicesQuery()
  const { data: categories = [] } = useCategoriesQuery()

  const featuredServices = services.slice(0, 3)
  const featuredCategories = categories.slice(0, 4)

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
              Empowering your business with <span className={styles.textGradient}>innovative</span> strategies.
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
          
          {servicesLoading ? (
            <div className={styles.loadingCenter}>Loading services...</div>
          ) : (
            <div className={`${styles.serviceGrid} ${styles.staggerIn}`}>
              {featuredServices.length > 0 ? (
                featuredServices.map((s, idx) => (
                  <Link key={s.id} to={`/services/${servicePath(s)}`} className={styles.serviceCard} style={{ animationDelay: `${idx * 0.15}s` }}>
                    <div className={styles.cardImageWrap}>
                      <div 
                        className={styles.serviceImgPreview} 
                        style={{ backgroundImage: `url(${serviceImageUrl(s)})` }}
                      />
                      <div className={styles.cardOverlay}></div>
                    </div>
                    <div className={styles.cardContent}>
                      <h3>{s.title}</h3>
                      <p>{(s.description || '').slice(0, 110)}...</p>
                      <span className={styles.cardLink}>
                        Learn more <span className={styles.cardArrow}>→</span>
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className={styles.loadingCenter}>No services available at the moment.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {featuredCategories.length > 0 && (
        <section className={styles.industriesSection}>
          <div className={styles.wrap}>
            <div className={styles.sectionHeaderCenter}>
              <span className={styles.sectionEyebrow}>Industries</span>
              <h2 className={styles.sectionTitleCenter}>Sectors We Transform</h2>
            </div>
            <div className={`${styles.industryGrid} ${styles.staggerIn}`}>
              {featuredCategories.map((cat, idx) => (
                <div key={cat.id} className={styles.industryCard} style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className={styles.catIconWrap}>
                    <div className={styles.catIconGlow}></div>
                    <div className={styles.catIcon}>
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 13.5v9h9v-9H3zm7 7H5v-5h5v5z" />
                      </svg>
                    </div>
                  </div>
                  <h3>{cat.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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