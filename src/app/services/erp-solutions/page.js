import React from "react";
import styles from "../data-management/ServiceDetail.module.css";
import Link from "next/link";
import Image from "next/image";

export default function ERPSolutions() {
  return (
    <div className={styles.serviceDetailContainer}>
      <div
        className={styles.serviceDetailContent}
        style={{ flexDirection: "column" }}
      >
        {/* Title Section */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1
            className={styles.serviceTitle}
            style={{
              color: "#ffb347",
              fontSize: "2.8rem",
              fontWeight: 800,
              marginBottom: "1.5rem",
            }}
          >
            ERP Solutions (Technical and Function)
          </h1>
          <hr
            style={{
              border: 0,
              borderTop: "3px solid #ffb347",
              width: "60%",
              margin: "1.5rem auto",
            }}
          />
          <div
            style={{
              color: "#fff",
              fontSize: "1.3rem",
              marginBottom: "1.5rem",
            }}
          >
            Oracle E-Business Suite (Oracle EBS, SaaS, OAF, VBCS, OIC)
            <br />
            Oracle Hyperion
            <br />
            SAP BASIS (ERP)
          </div>
        </div>

        {/* What We Do Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            alignItems: "flex-start",
            marginBottom: "3rem",
          }}
        >
          <div style={{ flex: 2, minWidth: 320 }}>
            <h2
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.3rem",
                marginBottom: "1.5rem",
              }}
            >
              WHAT WE DO
            </h2>
            <ul
              style={{
                color: "#fff",
                fontSize: "1.1rem",
                lineHeight: 1.7,
                paddingLeft: 24,
              }}
            >
              <li>
                Transform Your Business with Oracle EBS: Expert Implementation
                and Support Services
              </li>
              <li>
                Unlock the Full Potential of Oracle EBS: Our Expert Services for
                Maximum ROI
              </li>
              <li>Optimize, Automate, and Innovate Your Business Processes</li>
              <li>
                Maximize Your Oracle EBS Investment: Our Comprehensive Service
                Portfolio
              </li>
              <li>Implementation, Support, and Optimization Solutions</li>
            </ul>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 320,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/images/Picture1.png"
              alt="ERP What We Do Chart"
              width={500}
              height={300}
              style={{
                borderRadius: 16,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                maxWidth: "100%",
              }}
              priority
            />
          </div>
        </div>

        {/* Dashboards for ERP Section */}
        <div style={{ margin: "3rem 0" }}>
          <h1
            className={styles.serviceTitle}
            style={{
              color: "#ffb347",
              fontSize: "2.2rem",
              fontWeight: 800,
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Dashboards for ERP
          </h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            {/* Legacy complex processes */}
            <div style={{ flex: 1, minWidth: 280, textAlign: "center" }}>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  marginBottom: "1rem",
                }}
              >
                Legacy complex processes
              </h3>
              <Image
                src="/images/Picture1.png"
                alt="Legacy complex processes"
                width={300}
                height={180}
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  maxWidth: "100%",
                }}
                priority
              />
            </div>
            {/* Consolidated visualization */}
            <div style={{ flex: 1, minWidth: 280, textAlign: "center" }}>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  marginBottom: "1rem",
                }}
              >
                Consolidated visualization
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    background: "#476b8b",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "0.7rem 1.2rem",
                    margin: "0.2rem",
                  }}
                >
                  Payables
                </div>
                <div
                  style={{
                    background: "#476b8b",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "0.7rem 1.2rem",
                    margin: "0.2rem",
                  }}
                >
                  Receivables
                </div>
                <div
                  style={{
                    background: "#476b8b",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "0.7rem 1.2rem",
                    margin: "0.2rem",
                  }}
                >
                  Fixed Assets
                </div>
                <div
                  style={{
                    background: "#476b8b",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "0.7rem 1.2rem",
                    margin: "0.2rem",
                  }}
                >
                  Projects
                </div>
                <div
                  style={{
                    background: "#476b8b",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "0.7rem 1.2rem",
                    margin: "0.2rem",
                  }}
                >
                  Cost Management
                </div>
                <div
                  style={{
                    background: "#476b8b",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "0.7rem 1.2rem",
                    margin: "0.2rem",
                  }}
                >
                  Budgetary Control
                </div>
                <div
                  style={{
                    background: "#476b8b",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "0.7rem 1.2rem",
                    margin: "0.2rem",
                  }}
                >
                  Expenses
                </div>
                <div
                  style={{
                    background: "#476b8b",
                    color: "#fff",
                    borderRadius: 6,
                    padding: "0.7rem 1.2rem",
                    margin: "0.2rem",
                  }}
                >
                  General Ledger
                </div>
              </div>
            </div>
            {/* New end-to-end visibility and guidance */}
            <div style={{ flex: 1, minWidth: 280, textAlign: "center" }}>
              <h3
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.2rem",
                  marginBottom: "1rem",
                }}
              >
                New end-to-end visibility and guidance
              </h3>
              <Image
                src="/images/Picture3.png"
                alt="New end-to-end visibility and guidance"
                width={300}
                height={180}
                style={{
                  borderRadius: 12,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  maxWidth: "100%",
                }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Packaged Apps DBA Section - Technical Migration & Upgrade (Redesigned) */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "center",
            margin: "3rem 0",
          }}
        >
          {/* Technical Migration Card */}
          <div
            style={{
              flex: 1,
              minWidth: 320,
              background: "rgba(255,179,71,0.10)",
              borderRadius: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              padding: "2rem",
              maxWidth: 500,
            }}
          >
            <h2
              style={{
                color: "#ffb347",
                fontWeight: 800,
                fontSize: "2rem",
                textAlign: "center",
                borderBottom: "2px solid #ffb347",
                paddingBottom: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              Technical Migration
            </h2>
            <p
              style={{
                color: "#fff",
                fontSize: "1.1rem",
                marginBottom: "1rem",
              }}
            >
              Migrate Oracle Packaged Applications at on-premise and Oracle
              Cloud Infrastructure.
            </p>
            <ul
              style={{
                color: "#fff",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                paddingLeft: 20,
              }}
            >
              <li>
                Technical Migration at On-Premises (New Hardware / PCA-Exadata /
                DC Move etc.)
              </li>
              <li>Architecture design & Infrastructure setup (OCI)</li>
              <li>
                Migrate existing Packaged Applications to Oracle Cloud
                Infrastructure
              </li>
              <li>
                IP Assets and TCM Solution Sets to Accelerate the Migration
                Process.
              </li>
            </ul>
          </div>

          {/* Technical Upgrade Card */}
          <div
            style={{
              flex: 1,
              minWidth: 320,
              background: "rgba(71, 123, 139, 0.10)",
              borderRadius: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              padding: "2rem",
              maxWidth: 500,
            }}
          >
            <h2
              style={{
                color: "#ffb347",
                fontWeight: 800,
                fontSize: "2rem",
                textAlign: "center",
                borderBottom: "2px solid #ffb347",
                paddingBottom: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              Technical Upgrade
            </h2>
            <p
              style={{
                color: "#fff",
                fontSize: "1.1rem",
                marginBottom: "1rem",
              }}
            >
              Technical Upgrade of Oracle Packaged Applications at on-premise
              and Oracle Cloud Infrastructure
            </p>
            <ul
              style={{
                color: "#fff",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                paddingLeft: 20,
              }}
            >
              <li>
                Upgrade services, along with re-platforming to new h/w or cloud
              </li>
              <li>EBS upgrade to R12.2.x, Database upgrade to 19c.</li>
              <li>Siebel upgrade to IP21, Upgrade Oracle Database to 19c.</li>
              <li>
                Hyperion upgrade to 11.2.x, Upgrade Oracle Database to 19c
              </li>
              <li>
                PeopleSoft Tools & Applications Technical Upgrade to PT 8.6x &
                9.2, Upgrade Oracle Database to 19c
              </li>
              <li>Add on configurations like ECC, SSO, SSL, DR, Mobile Apps</li>
              <li>Post Upgrade stabilization support</li>
            </ul>
          </div>
        </div>

        {/* Packaged Apps DBA Section - Application Deployment & Support (Redesigned) */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "3rem 0",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "rgba(71, 123, 139, 0.10)",
              borderRadius: 16,
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              padding: "2rem",
              maxWidth: 700,
              width: "100%",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                color: "#ffb347",
                fontWeight: 800,
                fontSize: "2rem",
                textAlign: "center",
                borderBottom: "2px solid #ffb347",
                paddingBottom: "0.5rem",
                marginBottom: "1.5rem",
                width: "100%",
              }}
            >
              Application Deployment & Support
            </h2>
            <p
              style={{
                color: "#fff",
                fontSize: "1.1rem",
                marginBottom: "1rem",
                textAlign: "center",
                width: "100%",
              }}
            >
              Design Robust Architecture at on-premise and Oracle Cloud
              Infrastructure
            </p>
            <ul
              style={{
                color: "#fff",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                paddingLeft: 20,
                width: "100%",
              }}
            >
              <li>
                Fresh Installation, Provisioning / Deployment of Packaged
                Applications (on-premises and OCI)
              </li>
              <li>
                Applications DBA Support (patching, cloning, troubleshooting)
                during project lifecycle.
              </li>
              <li>
                High Availability Setups (Multi-Node Configurations, DMZ setup,
                Database RAC, PCP)
              </li>
              <li>
                Architecture Design, Security Configuration (TDE, SSO, SSL/TLS)
                Disaster Recovery, Backup Solutions
              </li>
              <li>Health Check Assessment</li>
              <li>Security and performance assessment</li>
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
  );
}
