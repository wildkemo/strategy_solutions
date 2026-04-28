import { Link } from 'react-router-dom'
import { useServicesQuery, useCategoriesQuery } from '../../lib/queries'
import { serviceImageUrl } from '../../lib/services'
import { servicePath } from '../../lib/slug'
import { Footer } from '../../components/Footer'
import heroServersImage from '../../assets/bb2af275-e7f6-4e3e-acc4-3f60fd7341d1.png'
import styles from './Home.module.css'

export default function HomePage() {
  const { data: services = [], isLoading: servicesLoading } = useServicesQuery()
  const { data: categories = [] } = useCategoriesQuery()

  // Select top 3 services for the core section
  const featuredServices = services.slice(0, 3)
  
  // Use categories as dynamic industry/sector entries
  const featuredCategories = categories.slice(0, 4)

  return (
    <div className={styles.page}>
      <section
        className={styles.hero}
        style={{ '--hero-image': `url(${heroServersImage})` }}
      >
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Empowering businesses with innovative strategies and solutions
          </h1>
          <p className={styles.heroSub}>
            We provide cutting-edge IT consulting, cloud computing, and
            cybersecurity services to help your business thrive in the digital
            age.
          </p>
          <Link to="/services" className={styles.cta}>
            Explore Our Services
          </Link>
        </div>
      </section>

      <section className={styles.sectionMuted}>
        <div className={styles.narrow}>
          <h2 className={styles.sectionTitle}>Strategy Solution</h2>
          <p className={styles.lead}>
            Strategy Solution is a distinguished provider of specialized Information Technology talent outsourcing and consultancy services, headquartered in Cairo, Egypt. With over two decades of experience in the regional IT sector, our team possesses the expertise and capabilities required to deliver a comprehensive suite of services.
          </p>
          <p className={styles.body}>
            We empower our clients by offering high-caliber resources in a cost-efficient and operationally effective manner, supporting the growth and success of their businesses and their customers.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <span className={styles.sectionEyebrow}>What we offer</span>
          <h2 className={styles.sectionTitleCenter}>Our Core Services</h2>
          <p className={styles.sectionSub}>
            Tailored technology solutions designed to meet the evolving needs of modern enterprises.
          </p>
          
          {servicesLoading ? (
            <div className={styles.loadingCenter}>Loading services...</div>
          ) : (
            <div className={styles.serviceGrid}>
              {featuredServices.length > 0 ? (
                featuredServices.map((s) => (
                  <Link key={s.id} to={`/services/${servicePath(s)}`} className={styles.serviceCard}>
                    <div 
                      className={styles.serviceImgPreview} 
                      style={{ backgroundImage: `url(${serviceImageUrl(s)})` }}
                    />
                    <h3>{s.title}</h3>
                    <p>{(s.description || '').slice(0, 90)}...</p>
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
        <section className={styles.sectionIndustries}>
          <div className={styles.wrap}>
            <h2 className={styles.sectionTitleCenter}>Specialized Categories</h2>
            <p className={styles.sectionSub}>
              Experience across sectors that demand precision and pace.
            </p>
            <div className={styles.industryGrid}>
              {featuredCategories.map((cat) => (
                <div key={cat.id} className={styles.industryCard}>
                  <div className={styles.catIcon}>
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path fill="currentColor" d="M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.86L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 13.5v9h9v-9H3zm7 7H5v-5h5v5z" />
                    </svg>
                  </div>
                  <h3>{cat.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.ctaBanner}>
        <h2>Ready to transform how your organization executes?</h2>
        <p>Talk to our team about your priorities and timeline.</p>
        <Link to="/contact" className={styles.ctaLight}>
          Contact us
        </Link>
      </section>

      <Footer />
    </div>
  )
}
