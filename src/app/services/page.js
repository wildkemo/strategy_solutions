import React from "react";
import styles from "./Services.module.css";
import Link from "next/link";

const Services = () => {
  return (
    <div className={styles.servicesContainer}>
      <div className={styles.servicesContent}>
        <h1 className={styles.servicesTitle}>Our Services</h1>
        <div className={styles.servicesGrid}>
          {/* First Row - 5 Services */}
          <div className={styles.firstRow}>
            <div className={styles.boxWrapper}>
              <div className={`${styles.serviceBox} ${styles.box1}`}>
                <h2>Data Management Solutions</h2>
                <ul>
                  <li>Data Analytics</li>
                  <li>Data Warehousing</li>
                  <li>Data Integration</li>
                  <li>Data Governance</li>
                </ul>
              </div>
              <p className={styles.explanation}>
                Comprehensive data management solutions to help you organize,
                analyze, and leverage your data effectively for better business
                decisions.
              </p>
            </div>

            <div className={styles.boxWrapper}>
              <div className={`${styles.serviceBox} ${styles.box2}`}>
                <h2>Cloud & Virtualization</h2>
                <ul>
                  <li>Cloud Migration</li>
                  <li>Virtual Infrastructure</li>
                  <li>Cloud Security</li>
                  <li>Hybrid Cloud Solutions</li>
                </ul>
              </div>
              <p className={styles.explanation}>
                Advanced cloud and virtualization services to optimize your IT
                infrastructure and enhance business scalability.
              </p>
            </div>

            <div className={styles.boxWrapper}>
              <div className={`${styles.serviceBox} ${styles.box3}`}>
                <h2>Oracle Database Technologies</h2>
                <ul>
                  <li>Database Administration</li>
                  <li>Performance Tuning</li>
                  <li>Database Migration</li>
                  <li>Oracle Cloud Solutions</li>
                </ul>
              </div>
              <p className={styles.explanation}>
                Expert Oracle database solutions to ensure optimal performance,
                security, and reliability of your database systems.
              </p>
            </div>

            <div className={styles.boxWrapper}>
              <div className={`${styles.serviceBox} ${styles.box4}`}>
                <h2>Hardware Infrastructure</h2>
                <ul>
                  <li>Network Setup</li>
                  <li>Server Management</li>
                  <li>Storage Solutions</li>
                  <li>Infrastructure Optimization</li>
                </ul>
              </div>
              <p className={styles.explanation}>
                Robust hardware infrastructure solutions to support your
                business operations with maximum efficiency and reliability.
              </p>
            </div>

            <div className={styles.boxWrapper}>
              <div className={`${styles.serviceBox} ${styles.box1}`}>
                <h2>Cyber Security Services</h2>
                <ul>
                  <li>Security Assessment</li>
                  <li>Threat Protection</li>
                  <li>Compliance Management</li>
                  <li>Security Monitoring</li>
                </ul>
              </div>
              <p className={styles.explanation}>
                Comprehensive cybersecurity solutions to protect your business
                from evolving threats and ensure data security.
              </p>
            </div>
          </div>

          {/* Second Row - 5 Services */}
          <div className={styles.secondRow}>
            <div className={styles.boxWrapper}>
              <div className={`${styles.serviceBox} ${styles.box2}`}>
                <h2>Business Continuity</h2>
                <ul>
                  <li>Disaster Recovery</li>
                  <li>Business Impact Analysis</li>
                  <li>Continuity Planning</li>
                  <li>Risk Management</li>
                </ul>
              </div>
              <p className={styles.explanation}>
                Strategic business continuity solutions to ensure your
                operations remain resilient in the face of disruptions.
              </p>
            </div>

            <div className={styles.boxWrapper}>
              <div className={`${styles.serviceBox} ${styles.box3}`}>
                <h2>ERP Solutions</h2>
                <ul>
                  <li>ERP Implementation</li>
                  <li>System Integration</li>
                  <li>Process Automation</li>
                  <li>ERP Customization</li>
                </ul>
              </div>
              <p className={styles.explanation}>
                Tailored ERP solutions to streamline your business processes and
                improve operational efficiency.
              </p>
            </div>

            <div className={styles.boxWrapper}>
              <div className={`${styles.serviceBox} ${styles.box4}`}>
                <h2>Project Management</h2>
                <ul>
                  <li>Project Planning</li>
                  <li>Resource Management</li>
                  <li>Risk Assessment</li>
                  <li>Quality Assurance</li>
                </ul>
              </div>
              <p className={styles.explanation}>
                Professional project management services to ensure successful
                delivery of your IT initiatives.
              </p>
            </div>

            <div className={styles.boxWrapper}>
              <div className={`${styles.serviceBox} ${styles.box1}`}>
                <h2>Fusion Middleware Technologies</h2>
                <ul>
                  <li>Integration Solutions</li>
                  <li>Application Development</li>
                  <li>API Management</li>
                  <li>Service-Oriented Architecture</li>
                </ul>
              </div>
              <p className={styles.explanation}>
                Advanced Fusion Middleware solutions to enhance your application
                integration and development capabilities.
              </p>
            </div>

            <div className={styles.boxWrapper}>
              <div className={`${styles.serviceBox} ${styles.box2}`}>
                <h2>Outsourcing & Support</h2>
                <ul>
                  <li>Managed Services</li>
                  <li>Technical Support</li>
                  <li>Help Desk Services</li>
                  <li>IT Staff Augmentation</li>
                </ul>
              </div>
              <p className={styles.explanation}>
                Comprehensive outsourcing and support services to help you focus
                on your core business while we handle your IT needs.
              </p>
            </div>
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
