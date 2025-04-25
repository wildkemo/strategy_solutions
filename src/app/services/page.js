import React from "react";
import styles from "./Services.module.css";
import Link from "next/link";

const Services = () => {
  return (
    <div className={styles.servicesContainer}>
      <div className={styles.servicesContent}>
        <h1 className={styles.servicesTitle}>Our Services</h1>
        <div className={styles.servicesGrid}>
          <div className={styles.boxWrapper}>
            <div className={`${styles.serviceBox} ${styles.box1}`}>
              <h2>Hardware Services</h2>
              <ul>
                <li>IT Infrastructure Setup</li>
                <li>Hardware Maintenance</li>
                <li>Hardware Upgrades</li>
                <li>System Optimization</li>
              </ul>
            </div>
            <p className={styles.explanation}>
              Comprehensive hardware solutions to keep your systems running at
              peak performance. From initial setup to ongoing maintenance, we've
              got you covered.
            </p>
          </div>

          <div className={styles.boxWrapper}>
            <div className={`${styles.serviceBox} ${styles.box2}`}>
              <h2>Software Services</h2>
              <ul>
                <li>Custom Software Development</li>
                <li>Software Integration</li>
                <li>Software Maintenance</li>
                <li>Cloud Solutions</li>
              </ul>
            </div>
            <p className={styles.explanation}>
              Tailored software solutions designed to meet your specific
              business needs. We create, integrate, and maintain software that
              drives your success.
            </p>
          </div>

          <div className={styles.boxWrapper}>
            <div className={`${styles.serviceBox} ${styles.box3}`}>
              <h2>Consulting Services</h2>
              <ul>
                <li>IT Strategy</li>
                <li>Digital Transformation</li>
                <li>Security Assessment</li>
                <li>Process Optimization</li>
              </ul>
            </div>
            <p className={styles.explanation}>
              Expert guidance to help you navigate the complex world of
              technology. We provide strategic insights to drive your business
              forward.
            </p>
          </div>

          <div className={styles.boxWrapper}>
            <div className={`${styles.serviceBox} ${styles.box4}`}>
              <h2>Support Services</h2>
              <ul>
                <li>24/7 Technical Support</li>
                <li>Remote Assistance</li>
                <li>On-site Support</li>
                <li>Training Programs</li>
              </ul>
            </div>
            <p className={styles.explanation}>
              Reliable support when you need it most. Our team is always ready
              to help, ensuring your systems run smoothly and your team stays
              productive.
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
          <div className={styles.buttonGroup}>
            <Link href="/request-service" className={styles.requestButton}>
              Request a Service
            </Link>
            <Link href="/contact" className={styles.contactButton}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
