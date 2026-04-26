import { Link } from 'react-router-dom'
import { Footer } from './components/Footer'
import heroServersImage from '../assets/bb2af275-e7f6-4e3e-acc4-3f60fd7341d1.png'
import styles from './page.module.css'

const serviceCards = [
  {
    title: 'Cloud Computing',
    desc: 'Scalable and secure cloud solutions to optimize your infrastructure and reduce costs.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
        <path
          fill="currentColor"
          d="M19 18H7a4 4 0 010-8 5.5 5.5 0 0110.7-1.8A3.5 3.5 0 1119 18zm0-2a1.5 1.5 0 100-3h-2l-.2-1.2A3.5 3.5 0 0013.3 9a3.5 3.5 0 00-3.3 2.3L9.6 12H7a2 2 0 100 4h12z"
        />
      </svg>
    ),
  },
  {
    title: 'Cybersecurity',
    desc: 'Robust cybersecurity measures to protect your data and ensure business continuity.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2l7 3v6c0 5-3.4 9.7-7 11-3.6-1.3-7-6-7-11V5l7-3zm0 2.2L7 6v5c0 3.9 2.5 7.6 5 8.8 2.5-1.2 5-4.9 5-8.8V6l-5-1.8z"
        />
      </svg>
    ),
  },
  {
    title: 'IT Consulting',
    desc: 'Expert IT consulting to align your technology with your business goals.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden>
        <path
          fill="currentColor"
          d="M19.4 13a7.7 7.7 0 000-2l2-1.6-2-3.4-2.4 1a8.5 8.5 0 00-1.7-1L15 3h-4l-.3 2a8.5 8.5 0 00-1.7 1l-2.4-1-2 3.4 2 1.6a7.7 7.7 0 000 2l-2 1.6 2 3.4 2.4-1a8.5 8.5 0 001.7 1l.3 2h4l.3-2a8.5 8.5 0 001.7-1l2.4 1 2-3.4-2-1.6zM12 15.2A3.2 3.2 0 1112 8.8a3.2 3.2 0 010 6.4z"
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
          Strategy Solution is a distinguished provider of specialized Information Technology talent outsourcing and consultancy services, headquartered in Cairo, Egypt. With over two decades of experience in the regional IT sector, our team possesses the expertise and capabilities required to deliver a comprehensive suite of services. We empower our clients by offering high-caliber resources in a cost-efficient and operationally effective manner, supporting the growth and success of their businesses and their customers.
          </p>
          <p className={styles.body}>
          Our service portfolio is underpinned by a long-standing commitment to the development and enablement of Egyptian IT professionals. Over the past 20 years, we have cultivated privileged access to Egypt's extensive pool of technology talent, allowing us to deliver customized solutions that align precisely with our clients' strategic objectives.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <span className={styles.sectionEyebrow}>What we offer</span>
          <h2 className={styles.sectionTitleCenter}>Our Core Services</h2>
          <p className={styles.sectionSub}>
            We offer a comprehensive suite of services designed to meet the evolving needs of modern businesses.
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
