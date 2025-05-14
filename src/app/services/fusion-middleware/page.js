import React from "react";
import styles from "./ServiceDetail.module.css";
import Link from "next/link";

export default function FusionMiddleware() {
  return (
    <div className={styles.serviceDetailContainer}>
      <div className={styles.serviceDetailContent}>
        <h1
          className={styles.serviceTitle}
          style={{
            color: "#ffb347",
            fontWeight: 800,
            textAlign: "left",
            marginBottom: "1.5rem",
          }}
        >
          Fusion Middleware Technologies
        </h1>
        <div className={styles.whatWeDoSection}>
          <div
            className={styles.serviceSubtitle}
            style={{ marginBottom: "1.2rem" }}
          >
            WHAT WE DO
          </div>
          <div className={styles.whatWeDoDescription}>
            We offer a full range of implementation across the Oracle Fusion
            Stack. We can complete the implementation with automation around
            configuration and data migration.
          </div>
          <ul className={styles.technologyList}>
            <li>OEM</li>
            <li>Weblogic Server</li>
            <li>Oracle Data Integrator (ODI)</li>
            <li>Oracle Business Intelligent Enterprise Edition (OBIEE)</li>
            <li>Oracle Analytics Server (OAS)</li>
            <li>Oracle Forms & Reports</li>
            <li>Oracle ADF</li>
            <li>Oracle SOA</li>
            <li>Oracle OHS</li>
          </ul>
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
    </div>
  );
}
