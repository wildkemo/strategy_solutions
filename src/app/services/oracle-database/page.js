import React from "react";
import styles from "./ServiceDetail.module.css";
import Link from "next/link";
import Image from "next/image";

const DataManagement = () => {
  return (
    <div className={styles.serviceDetailContainer}>
      <div className={styles.serviceDetailContent}>
        <div className={styles.textContent}>
          <h1 className={styles.serviceTitle}>Oracle Database Technologies</h1>
          <h2 className={styles.serviceSubtitle}>WHAT WE DO</h2>
          <ul className={styles.whatWeDoList}>
            <li>
              Our services enable the best possible outcomes for Oracle Database
              Technologies. Whether we advise, lead, or jointly deliver the best
              practices cultivated from our most successful customer experiences
              <ul className={styles.subList}>
                  <li>Multitenant</li>
                  <li>In-Memory DB</li>
                  <li>Real Application Clusters</li>
                  <li>Data Guard and Golden Gate</li>
                  <li>Partitioning</li>
                  <li>Advanced Compression</li>
                  <li>Advanced Analytics, Spatial and Graph</li>
                  <li>Advanced Security, Label Security, DB Vault</li>
                  <li>Real Application Testing</li>
                  <li>Performance Tuning and diagnostic</li>
              </ul>
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
            src="/images/oracle1.png"
            alt="Oracle Database Illustration"
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
