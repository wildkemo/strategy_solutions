import React from "react";
import styles from "./ServiceDetail.module.css";
import Link from "next/link";

export default function OutsourcingSupport() {
  return (
    <div className={styles.serviceDetailContainer}>
      <div className={styles.serviceDetailContent}>
        {/* Left Column: Content Blocks */}
        <div className={styles.leftColumn}>
          <div className={styles.sectionBlock}>
            <span className={styles.sectionTitle}>OutSourcing</span>
            <span className={styles.sectionText}>
              Our technical engineer outsourcing service provides expert
              technical support and solutions to businesses, allowing them to
              tap into a pool of skilled professionals with specialized skills
              and expertise. Our outsourced technical engineers work closely
              with clients to understand their specific needs and deliver
              high-quality solutions, ensuring timely project completion and
              meeting technical requirements.
            </span>
          </div>
          <div className={styles.sectionBlock}>
            <span className={styles.sectionTitle}>Support</span>
            <span className={styles.sectionText}>
              Our after-implementation technical support service provides
              ongoing assistance and maintenance to ensure your system continues
              to run smoothly and efficiently. Our team of expert technicians is
              available to troubleshoot issues, provide updates, and optimize
              system performance, helping you maximize your investment and
              minimize downtime. With proactive monitoring and timely
              interventions, we help prevent problems before they occur,
              ensuring your system remains stable and secure. Our goal is to
              provide peace of mind, allowing you to focus on your core business
              activities while we handle the technical aspects.
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "2.5rem",
            }}
          >
            <Link href="/request-service" className={styles.requestButton}>
              Request a Service
            </Link>
            <Link href="/services" className={styles.contactButton}>
              Back to Services
            </Link>
          </div>
        </div>
        {/* Right Column: Title */}
        <div className={styles.rightColumn}>
          <div className={styles.highlightTitle}>
            OutSourcing
            <br />
            and Support
          </div>
        </div>
      </div>
    </div>
  );
}
