import React from "react";
import styles from "../data-management/ServiceDetail.module.css";
import Link from "next/link";
import Image from "next/image";

export default function BusinessContinuity() {
  return (
    <div className={styles.serviceDetailContainer}>
      <div
        className={styles.serviceDetailContent}
        style={{ position: "relative" }}
      >
        <div className={styles.textContent}>
          <h1
            className={styles.serviceTitle}
            style={{
              color: "#ffb347",
              fontSize: "2.8rem",
              fontWeight: 800,
              marginBottom: "2rem",
            }}
          >
            Business Continuity
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              margin: "2.5rem 0",
              flexWrap: "wrap",
            }}
          >
            {/* Assess */}
            <div
              style={{
                background: "rgba(255,179,71,0.15)",
                borderRadius: 10,
                minWidth: 280,
                flex: 1,
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "#ffb347",
                  color: "#222f3e",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  borderRadius: 4,
                  padding: "0.5rem 1.5rem",
                  textAlign: "center",
                  marginBottom: "1.2rem",
                }}
              >
                Assess
              </div>
              <ul
                style={{
                  color: "#fff",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  paddingLeft: 20,
                }}
              >
                <li>Disaster Recovery and Data protection Assessment</li>
                <li>
                  Assess workload environments for disaster recovery and Data
                  protection architecture with local backup, replication,
                  automation, and Full Stack Disaster Recovery readiness
                </li>
                <li>
                  Review disaster recovery and backup policies, RPO/RTO,
                  disaster recovery plan, and replication between Sites/Domains
                </li>
              </ul>
            </div>
            {/* Deploy */}
            <div
              style={{
                background: "rgba(71, 123, 139, 0.15)",
                borderRadius: 10,
                minWidth: 280,
                flex: 1,
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "#476b8b",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  borderRadius: 4,
                  padding: "0.5rem 1.5rem",
                  textAlign: "center",
                  marginBottom: "1.2rem",
                }}
              >
                Deploy
              </div>
              <ul
                style={{
                  color: "#fff",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  paddingLeft: 20,
                }}
              >
                <li>
                  Full Stack Disaster Recovery, data protection and backup
                  Deployment Service
                </li>
                <li>
                  Deploy disaster recovery plan using Full Stack Disaster
                  Recovery
                </li>
              </ul>
            </div>
            {/* Run and Operate */}
            <div
              style={{
                background: "rgba(71, 123, 139, 0.15)",
                borderRadius: 10,
                minWidth: 280,
                flex: 1,
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  background: "#7b8b8b",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  borderRadius: 4,
                  padding: "0.5rem 1.5rem",
                  textAlign: "center",
                  marginBottom: "1.2rem",
                }}
              >
                Run and Operate
              </div>
              <ul
                style={{
                  color: "#fff",
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  paddingLeft: 20,
                }}
              >
                <li>
                  Full Stack backup and Disaster Recovery Management Service
                </li>
                <li>
                  Periodically review and validate backup policies and disaster
                  recovery plans and orchestrate disaster recovery drills and
                  tests to verify recovery
                </li>
                <li>
                  Provide ongoing management of the implemented disaster
                  recovery solutions
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.buttonWrapper} style={{ marginTop: "2.5rem" }}>
            <Link href="/request-service" className={styles.requestButton}>
              Request a Service
            </Link>
            <Link href="/services" className={styles.contactButton}>
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
