import { Footer } from '../../components/Footer'
import aboutTeamImage from '../../assets/Gemini_Generated_Image_lyolodlyolodlyol.png'
import styles from './About.module.css'

const values = [
  {
    title: 'Client-Centric Approach',
    text: "We prioritize our clients' needs and strive to exceed their expectations.",
  },
  {
    title: 'Commitment to Quality',
    text: 'We uphold the highest standards of quality in all our services.',
  },
  {
    title: 'Continuous Improvement',
    text: 'We embrace innovation and constantly seek ways to enhance our offerings.',
  },
]

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <div className={styles.narrow}>
          <h1>About Us</h1>
          <p className={styles.lead}>
            Strategy Solution is a leading IT talent outsourcing and consultancy
            firm in Egypt, with over two decades of experience. We are
            dedicated to excellence, client satisfaction, and the growth of
            Egyptian IT professionals.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <h2>Who We Are</h2>
          <p>
            With a rich history spanning over 20 years, Strategy Solution has
            established itself as a trusted partner for businesses seeking
            top-tier IT talent and strategic consultancy. Our deep understanding
            of the Egyptian market, combined with our global expertise, allows
            us to deliver tailored solutions that drive success. We are a team
            of seasoned professionals committed to bridging the gap between
            exceptional IT talent and organizations striving for digital
            transformation.
          </p>
        </div>
      </section>

      <section className={styles.aboutImageSection}>
        <div className={styles.narrow}>
          <img
            src={aboutTeamImage}
            alt="Strategy Solution team collaborating in a meeting"
            className={styles.aboutImage}
          />
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.narrow}>
          <h2>Our Mission</h2>
          <p>
            Our mission is to empower businesses with the right IT talent and
            strategic insights to achieve their goals. We are committed to
            fostering a culture of innovation, collaboration, and continuous
            improvement, ensuring that our clients receive the highest quality
            service and support. We aim to be the catalyst for growth,
            connecting organizations with the skilled professionals they need to
            thrive in today's dynamic digital landscape.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.narrow}>
          <h2>Our Values</h2>
          <div className={styles.valueGrid}>
            {values.map((v) => (
              <article key={v.title} className={styles.valueCard}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.legacy}>
        <div className={styles.narrow}>
          <h2>Our Legacy</h2>
          <p>
            Over the past two decades, Strategy Solution has played a pivotal
            role in shaping the IT landscape in Egypt. We have successfully
            partnered with numerous organizations, helping them realize complex
            projects and achieve sustainable growth. Driven by our unwavering
            commitment to trust, integrity, and relentless excellence, we are
            proud to have contributed to the development of countless IT
            professionals and the success of businesses across various sectors.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
