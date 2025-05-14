import React from "react";
import styles from "./ServiceDetail.module.css";
import Link from "next/link";

export default function ProjectManagement() {
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
          Project Management
        </h1>
        <p
          style={{
            fontSize: "1.35rem",
            color: "#fff",
            marginBottom: "2.5rem",
            maxWidth: 900,
          }}
        >
          We provide <b>End-To-End project management service</b> through our
          professional Project Manager that work close to the customer team to
          meet the business requirements.
        </p>
        <div
          className={styles.sectionHeader}
          style={{ marginTop: "2rem", marginBottom: "0.5rem" }}
        >
          PROJECT PHASES
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.projectPhasesTable}>
            <thead>
              <tr>
                <th>TECHNICAL ARCHITECTURE DESIGN</th>
                <th>ARCHITECTURE IMPLEMENTATION / DEPLOYMENT</th>
                <th>SOLUTION DESIGN</th>
                <th>SOLUTION IMPLEMENTATION</th>
                <th>VALIDATION / TESTING</th>
                <th>CHANGE MGMT / PROCESS OPTIMIZATION / CLOUD ADOPTION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Assist the partner in designing a cohesive architectures
                  across multiple technical domains and multiple projects to
                  implement a consistent cloud strategy.
                  <br />
                  Secure the right architecture to map security standard, allow
                  capacity scaling and maximize infrastructure performances.
                </td>
                <td>
                  Assist in deploying / setup of the cloud environments
                  consistent with the overall cloud strategy and architecture
                  design.
                </td>
                <td>
                  Assist the partner in the solution design leveraging Oracle
                  Reference Architectures, OC assets, methods and best
                  practices.
                  <br />
                  Contribute to design test strategies & plans optimized for
                  Cloud environments.
                </td>
                <td>
                  Work together with partner's team to mentor on how effectively
                  exploit Oracle products & technologies to ensures that all
                  technical efforts follow a safe, consistent and repeatable set
                  of principles.
                  <br />
                  Contribute to implement test strategies & plans for the main
                  test levels (system, integration, performance).
                  <br />
                  If required by the partner, the Competence Centre service
                  could include (or detach as separated engagements) some
                  Implementation Services.
                </td>
                <td>&nbsp;</td>
                <td>
                  Help the partner to identify and implement the right model to
                  manage effectively the cloud solutions and adopt / optimized
                  software lifecycle for the Cloud.
                </td>
              </tr>
            </tbody>
          </table>
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
