import React from "react";
import styles from "../data-management/ServiceDetail.module.css";
import Link from "next/link";
import Image from "next/image";

export default function HardwareInfrastructure() {
  return (
    <div className={styles.serviceDetailContainer}>
      <div
        className={styles.serviceDetailContent}
        style={{ position: "relative" }}
      >
        <div className={styles.textContent}>
          <h1 className={styles.serviceTitle}>Hardware Infrastructure</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
            We provide different services according to the customer need and
            business model using wide range of main vendors infrastructure
            components.
          </p>

          {/* New Expertise Section */}
          <div style={{ margin: "2.5rem 0 3rem 0" }}>
            <h2
              style={{
                color: "#fff",
                fontWeight: 500,
                fontSize: "1.5rem",
                textAlign: "center",
                marginBottom: "2rem",
              }}
            >
              We provide wide range of expertise covering the infrastructure
              technology
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "3rem",
                flexWrap: "wrap",
              }}
            >
              {/* Servers and Operating systems */}
              <div style={{ textAlign: "center", minWidth: 150 }}>
                {/* SVG icon for computer, keyboard, and mouse */}
                <svg
                  width="80"
                  height="86"
                  viewBox="0 0 80 86"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginBottom: 16 }}
                >
                  <rect
                    x="8"
                    y="4"
                    width="64"
                    height="36"
                    rx="3"
                    stroke="#7ed6df"
                    strokeWidth="4"
                  />
                  <rect
                    x="24"
                    y="44"
                    width="32"
                    height="8"
                    rx="2"
                    stroke="#7ed6df"
                    strokeWidth="4"
                  />
                  <rect
                    x="16"
                    y="56"
                    width="48"
                    height="8"
                    rx="2"
                    stroke="#7ed6df"
                    strokeWidth="4"
                  />
                  <rect
                    x="8"
                    y="68"
                    width="64"
                    height="8"
                    rx="2"
                    stroke="#7ed6df"
                    strokeWidth="4"
                  />
                  <ellipse
                    cx="70"
                    cy="80"
                    rx="6"
                    ry="4"
                    stroke="#7ed6df"
                    strokeWidth="4"
                  />
                </svg>
                <div
                  style={{ color: "#b2f6ff", fontSize: "1.2rem", marginTop: 8 }}
                >
                  Servers and
                  <br />
                  Operating systems
                </div>
              </div>
              {/* Networking and Security */}
              <div style={{ textAlign: "center", minWidth: 150 }}>
                {/* Placeholder icon: 3 cubes */}
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginBottom: 16 }}
                >
                  <rect
                    x="10"
                    y="10"
                    width="15"
                    height="15"
                    stroke="#b2f6ff"
                    strokeWidth="2"
                  />
                  <rect
                    x="35"
                    y="10"
                    width="15"
                    height="15"
                    stroke="#b2f6ff"
                    strokeWidth="2"
                  />
                  <rect
                    x="22.5"
                    y="35"
                    width="15"
                    height="15"
                    stroke="#b2f6ff"
                    strokeWidth="2"
                  />
                </svg>
                <div
                  style={{ color: "#b2f6ff", fontSize: "1.2rem", marginTop: 8 }}
                >
                  Networking
                  <br />
                  and Security
                </div>
              </div>
              {/* Storage */}
              <div style={{ textAlign: "center", minWidth: 150 }}>
                {/* Placeholder icon: Storage box */}
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginBottom: 16 }}
                >
                  <rect
                    x="10"
                    y="20"
                    width="40"
                    height="25"
                    stroke="#b2f6ff"
                    strokeWidth="2"
                  />
                  <rect
                    x="20"
                    y="10"
                    width="20"
                    height="10"
                    stroke="#b2f6ff"
                    strokeWidth="2"
                  />
                </svg>
                <div
                  style={{ color: "#b2f6ff", fontSize: "1.2rem", marginTop: 8 }}
                >
                  Storage
                </div>
              </div>
              {/* Backup and Data Protection */}
              <div style={{ textAlign: "center", minWidth: 150 }}>
                {/* Placeholder icon: Cylinder (database) */}
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginBottom: 16 }}
                >
                  <ellipse
                    cx="30"
                    cy="20"
                    rx="18"
                    ry="8"
                    stroke="#b2f6ff"
                    strokeWidth="2"
                  />
                  <rect
                    x="12"
                    y="20"
                    width="36"
                    height="20"
                    stroke="#b2f6ff"
                    strokeWidth="2"
                  />
                  <ellipse
                    cx="30"
                    cy="40"
                    rx="18"
                    ry="8"
                    stroke="#b2f6ff"
                    strokeWidth="2"
                  />
                </svg>
                <div
                  style={{ color: "#b2f6ff", fontSize: "1.2rem", marginTop: 8 }}
                >
                  Backup
                  <br />
                  and Data Protection
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              justifyContent: "center",
            }}
          >
            {/* Access Section */}
            <div style={{ minWidth: 250, flex: 1 }}>
              <div
                style={{
                  background: "#7ed6df",
                  borderRadius: 50,
                  padding: "0.5rem 2rem",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "#222f3e",
                }}
              >
                Access
              </div>
              <ul style={{ color: "#fff", fontSize: "1rem" }}>
                <li>Identify the current pains</li>
                <li>Define performance expectations</li>
                <li>
                  Collect and analyze the usage data for the selected
                  environment
                </li>
                <li>Root cause analysis</li>
                <li>Identify improvements</li>
              </ul>
            </div>
            {/* Deploy Section */}
            <div style={{ minWidth: 250, flex: 1 }}>
              <div
                style={{
                  background: "#ffe29a",
                  borderRadius: 50,
                  padding: "0.5rem 2rem",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "#222f3e",
                }}
              >
                Deploy
              </div>
              <ul style={{ color: "#fff", fontSize: "1rem" }}>
                <li>Data Center preparation</li>
                <li>Hardware Installation</li>
                <li>Software Implementation</li>
                <li>Performance tuning</li>
                <li>Handover Documentation</li>
              </ul>
            </div>
            {/* Operate & Support Section */}
            <div style={{ minWidth: 250, flex: 1 }}>
              <div
                style={{
                  background: "#b2bec3",
                  borderRadius: 50,
                  padding: "0.5rem 2rem",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                  color: "#222f3e",
                }}
              >
                Operate & Support
              </div>
              <ul style={{ color: "#fff", fontSize: "1rem" }}>
                <li>
                  Providing a proper operation and support module according to
                  the customer required SLA and business needs
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.buttonWrapper} style={{ marginTop: "2.5rem" }}>
            <Link href="/request-service" className={styles.requestButton}>
              Request a Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
