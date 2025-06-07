import styles from "./About.module.css";

export default function About() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>About Strategy Solution</h1>
        <p className={styles.heroSubtitle}>
          Empowering businesses through innovative technology solutions
        </p>
      </section>

      <section className={styles.aboutContent}>
        <div className={styles.aboutSection}>
          <h2>Our Story</h2>
          <p>
            Strategy Solution was founded with a vision to transform businesses
            through cutting-edge technology solutions. We understand that in
            today's fast-paced digital world, companies need reliable partners
            who can provide both hardware and software solutions to stay
            competitive.
          </p>
        </div>

        <div className={styles.aboutSection}>
          <h2>Our Mission</h2>
          <p>
            Our mission is to help businesses thrive in the digital age by
            providing comprehensive IT solutions. We combine technical expertise
            with strategic thinking to deliver solutions that drive growth,
            efficiency, and innovation.
          </p>
        </div>

        <div className={styles.aboutSection}>
          <h2>Our Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <h3>Innovation</h3>
              <p>
                We constantly explore new technologies and approaches to deliver
                cutting-edge solutions.
              </p>
            </div>
            <div className={styles.valueCard}>
              <h3>Reliability</h3>
              <p>
                We build trust through consistent, high-quality service and
                support.
              </p>
            </div>
            <div className={styles.valueCard}>
              <h3>Customer Focus</h3>
              <p>
                We put our clients' needs first, delivering tailored solutions
                that drive their success.
              </p>
            </div>
            <div className={styles.valueCard}>
              <h3>Excellence</h3>
              <p>
                We maintain the highest standards in everything we do, from
                service delivery to customer support.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.aboutSection}>
          <h2>Our Team</h2>
          <p>
            Our team consists of experienced professionals with diverse
            backgrounds in hardware engineering, software development, and IT
            consulting. We bring together technical expertise and business
            acumen to deliver solutions that make a real difference to our
            clients.
          </p>
        </div>

        <div className={styles.ctaSection}>
          <h2>Ready to Work With Us?</h2>
          <p>Let's discuss how we can help transform your business</p>
          <a href="/request-service" className={styles.primary}>
            Get in Touch
          </a>
        </div>
      </section>
    </main>
  );
}
