import { Link } from 'react-router-dom'
import { Footer } from './components/Footer'
import styles from './page.module.css'

const serviceCards = [
  {
    title: 'Strategy & Planning',
    desc: 'Align leadership goals with actionable roadmaps and measurable outcomes.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
        <path
          fill="currentColor"
          d="M4 19h16v2H4v-2zm4-4h8v2H8v-2zm-2-4h12v2H6v-2zm4-4h4v2h-4V7zm-2-4h8v2H8V3z"
        />
      </svg>
    ),
  },
  {
    title: 'Operations Excellence',
    desc: 'Streamline processes, reduce waste, and improve delivery across teams.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18l6 3.75v7.14l-6 3.75-6-3.75V7.93l6-3.75z"
        />
      </svg>
    ),
  },
  {
    title: 'Digital Transformation',
    desc: 'Modernize systems and data practices to scale securely and efficiently.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2a7 7 0 017 7h-2a5 5 0 10-5 5v2a7 7 0 01-7-7h2a5 5 0 105-5V2h2z"
        />
      </svg>
    ),
  },
  {
    title: 'Change Management',
    desc: 'Support people through change with training, comms, and adoption metrics.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
        <path
          fill="currentColor"
          d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
        />
      </svg>
    ),
  },
]

const industries = [
  {
    title: 'Manufacturing',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
  },
  {
    title: 'Financial Services',
    img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
  },
  {
    title: 'Healthcare',
    img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
  },
  {
    title: 'Technology',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
  },
]

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
          Empowering businesses with innovative strategies and solutions
          </h1>
          <p className={styles.heroSub}>
            From boardroom vision to on-the-ground execution, we help teams
            prioritize, align, and deliver with clarity.
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
          Strategy Solution is a distinguished provider of specialized Information Technology talent outsourcing and consultancy services, headquartered in Cairo, Egypt. With over two decades of experience in the regional IT sector, our team possesses the expertise and capabilities required to deliver a comprehensive suite of services. We empower our clients by offering high-caliber resources in a cost-efficient and operationally effective manner, supporting the growth and success of their businesses and their customers.
          </p>
          <p className={styles.body}>
          Our service portfolio is underpinned by a long-standing commitment to the development and enablement of Egyptian IT professionals. Over the past 20 years, we have cultivated privileged access to Egypt's extensive pool of technology talent, allowing us to deliver customized solutions that align precisely with our clients' strategic objectives.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <h2 className={styles.sectionTitleCenter}>Core services</h2>
          <p className={styles.sectionSub}>
            Practical expertise across the lifecycle of strategy and delivery.
          </p>
          <div className={styles.serviceGrid}>
            {serviceCards.map((s) => (
              <article key={s.title} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sectionIndustries}>
        <div className={styles.wrap}>
          <h2 className={styles.sectionTitleCenter}>Industries</h2>
          <p className={styles.sectionSub}>
            Experience across sectors that demand precision and pace.
          </p>
          <div className={styles.industryGrid}>
            {industries.map((ind) => (
              <article key={ind.title} className={styles.industryCard}>
                <div
                  className={styles.industryImg}
                  style={{ backgroundImage: `url(${ind.img})` }}
                />
                <h3>{ind.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

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
