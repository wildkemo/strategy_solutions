import React from "react";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        <h1 className={styles.aboutTitle}>About Our Strategy Solution</h1>
        <div className={styles.aboutGrid}>
          <div className={styles.boxWrapper}>
            <div className={`${styles.aboutBox} ${styles.box1}`}>
              <h2>Our Mission</h2>
              <p>
                We are dedicated to helping businesses achieve their strategic
                goals through innovative solutions and expert guidance.
              </p>
            </div>
            <p className={styles.explanation}>
              Our mission drives everything we do. We work tirelessly to deliver
              exceptional results for our clients, ensuring their strategic
              objectives are met with precision and excellence.
            </p>
          </div>

          <div className={styles.boxWrapper}>
            <div className={`${styles.aboutBox} ${styles.box2}`}>
              <h2>Our Vision</h2>
              <p>
                To be the leading provider of strategic solutions, empowering
                organizations to reach their full potential.
              </p>
            </div>
            <p className={styles.explanation}>
              Our vision shapes our future. We aim to transform industries
              through innovative approaches and create lasting impact in every
              project we undertake.
            </p>
          </div>

          <div className={styles.boxWrapper}>
            <div className={`${styles.aboutBox} ${styles.box3}`}>
              <h2>Our Values</h2>
              <ul>
                <li>Excellence</li>
                <li>Integrity</li>
                <li>Innovation</li>
                <li>Client Focus</li>
                <li>Continuous Learning</li>
              </ul>
            </div>
            <p className={styles.explanation}>
              Our values are the foundation of our success. They guide our
              decisions, shape our culture, and ensure we deliver the highest
              quality service to our clients.
            </p>
          </div>

          <div className={styles.boxWrapper}>
            <div className={`${styles.aboutBox} ${styles.box4}`}>
              <h2>Our Approach</h2>
              <p>
                We combine industry expertise with cutting-edge technology to
                deliver customized solutions.
              </p>
            </div>
            <p className={styles.explanation}>
              Our approach is unique and effective. We blend traditional wisdom
              with modern innovation to create solutions that are both practical
              and forward-thinking.
            </p>
          </div>
        </div>

        <div className={styles.footerCta}>
          <h2 className={styles.footerTitle}>
            Ready to Transform Your Business?
          </h2>
          <p className={styles.footerSubtitle}>
            Let's discuss how we can help you achieve your goals
          </p>
          <a href="/contact" className={styles.contactButton}>
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
