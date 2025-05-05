import React from "react";
import styles from "./ServiceDetail.module.css";
import Link from "next/link";
import Image from "next/image";

const DataManagement = () => {
  return (
    <div className={styles.serviceDetailContainer}>
      <div className={styles.serviceDetailContent}>
        <div className={styles.textContent}>
          <h1 className={styles.serviceTitle}>Data Management Solutions</h1>
          <h2 className={styles.serviceSubtitle}>WHAT WE DO</h2>
          <ul className={styles.whatWeDoList}>
            <li>
              Provide a pool of experts to guide you in the best adoption of
              Data Management technologies primarily focused on
              <ul className={styles.subList}>
                <li>Efficiency and Transformation</li>
                <li>Insight and Innovation</li>
                <li>Security and Business Continuity</li>
              </ul>
            </li>
            <li>Guidance to implement solutions with new technologies</li>
            <li>
              Identify and apply actionable recommendations to improve with Data
              Management Technologies
            </li>
            <li>
              Mentor and lead your team to applying safe, consistent, and
              repeatable set of leading practices
            </li>
          </ul>
          <div className={styles.buttonWrapper}>
            <Link href="/request-service" className={styles.requestButton}>
              Request a Service
            </Link>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <Image
            src="/images/Data2.png"
            alt="Data Management Illustration"
            width={900}
            height={320}
            className={styles.headerImage}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
