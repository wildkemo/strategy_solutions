import React, { useState, useEffect } from "react";
import styles from "../data-management/ServiceDetail.module.css";
import Link from "next/link";
import Image from "next/image";
import LoadingScreen from "../../components/LoadingScreen";

export default function CyberSecurityService() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleRequestService = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost/strategy_solutions_backend/app/Controllers/get_current_user.php",
        // "http://localhost/www/oop_project/php_backend/app/Controllers/get_current_user.php",
        { credentials: "include" }
      );
      if (response.ok) {
        const userData = await response.json();
        if (userData && userData.length > 0) {
          window.location.href = "/request-service";
          return;
        }
      }
      setErrorMessage("You can't request a service unless you are signed in.");
    } catch {
      setErrorMessage("You can't request a service unless you are signed in.");
    }
  };

  return (
    <div className={styles.serviceDetailContainer}>
      <div className={styles.serviceDetailContent}>
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
            Cyber Security Service
          </h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              alignItems: "flex-start",
            }}
          >
            {/* Left: Security Features */}
            <div style={{ flex: 2, minWidth: 320 }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    marginBottom: 0,
                  }}
                >
                  Advanced Security
                </h2>
                <div style={{ color: "#fff", marginBottom: "1rem" }}>
                  Transparent data encryption of data at rest
                  <br />
                  Data redaction based on user name, IP address, application
                  context, and other factors
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    marginBottom: 0,
                  }}
                >
                  Audit Vault and Database Firewall
                </h2>
                <div style={{ color: "#fff", marginBottom: "1rem" }}>
                  Monitor user activity from network
                  <br />
                  Detect and block unauthorized activity and block SQL injection
                  attacks
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    marginBottom: 0,
                  }}
                >
                  Data Masking and Subsetting
                </h2>
                <div style={{ color: "#fff", marginBottom: "1rem" }}>
                  Replaces certain sensitive information with realistic values.
                  <br />
                  Allows some production data to be used for dev or test
                  environments
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    marginBottom: 0,
                  }}
                >
                  Database Vault
                </h2>
                <div style={{ color: "#fff", marginBottom: "1rem" }}>
                  Protects application data from being accessed by privileged
                  users.
                  <br />
                  Includes separation-of-duties, least privilege and other
                  preventive controls
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    marginBottom: 0,
                  }}
                >
                  Label Security
                </h2>
                <div style={{ color: "#fff", marginBottom: "1rem" }}>
                  Designed to protect, categorize and mediate access to data
                  based on its classification.
                  <br />
                  Allows data access management on a "need to know" basis
                </div>
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <h2
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "1.3rem",
                    marginBottom: 0,
                  }}
                >
                  Key Vault
                </h2>
                <div style={{ color: "#fff", marginBottom: "1rem" }}>
                  Centrally manages encryption keys, Oracle Wallets, Java
                  Keystores, and credential files
                </div>
              </div>
            </div>
            {/* Right: Security Areas Diagram */}
            <div
              style={{
                flex: 1,
                minWidth: 320,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 320,
                  height: 320,
                  background: "rgba(120,180,180,0.10)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 140,
                    left: 90,
                    textAlign: "center",
                    color: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "1.2rem" }}>
                    Database
                    <br />
                    security
                  </div>
                  <svg
                    width="60"
                    height="40"
                    viewBox="0 0 60 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <ellipse
                      cx="30"
                      cy="20"
                      rx="28"
                      ry="12"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <ellipse
                      cx="30"
                      cy="30"
                      rx="28"
                      ry="12"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                    <ellipse
                      cx="30"
                      cy="40"
                      rx="28"
                      ry="12"
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                {/* Security Areas */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 120,
                    background: "#3a5c6e",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                  }}
                >
                  Network security
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 60,
                    left: 220,
                    background: "#3a5c6e",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                  }}
                >
                  SIEM
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 200,
                    left: 220,
                    background: "#3a5c6e",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                  }}
                >
                  Endpoint security
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 270,
                    left: 120,
                    background: "#3a5c6e",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                  }}
                >
                  Operating system security
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 270,
                    left: 10,
                    background: "#3a5c6e",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                  }}
                >
                  Application and web security
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 200,
                    left: -60,
                    background: "#3a5c6e",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                  }}
                >
                  Email security
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 60,
                    left: -60,
                    background: "#3a5c6e",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                  }}
                >
                  Mobile security
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 120,
                    left: -80,
                    background: "#3a5c6e",
                    color: "#fff",
                    borderRadius: 8,
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    width: 160,
                    textAlign: "center",
                  }}
                >
                  Authentication and user security
                </div>
              </div>
            </div>
          </div>
          {errorMessage && (
            <div
              style={{
                color: "#fff",
                background: "#e74c3c",
                padding: "0.75rem 1.25rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {errorMessage}
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <button
                  onClick={() => {
                    setErrorMessage("");
                    window.location.href = "/?showSignIn=1";
                  }}
                  style={{
                    background: "#fff",
                    color: "#e74c3c",
                    padding: "0.5rem 1.2rem",
                    borderRadius: "6px",
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                >
                  Sign In
                </button>
                <Link
                  href="/services"
                  style={{
                    background: "transparent",
                    color: "#fff",
                    padding: "0.5rem 1.2rem",
                    borderRadius: "6px",
                    fontWeight: 600,
                    textDecoration: "none",
                    border: "1.5px solid #fff",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onClick={() => setErrorMessage("")}
                >
                  Return to Service Page
                </Link>
              </div>
            </div>
          )}
          <div className={styles.buttonWrapper} style={{ marginTop: "2.5rem" }}>
            <button
              onClick={handleRequestService}
              className={styles.requestButton}
            >
              Request a Service
            </button>
            <Link href="/services" className={styles.contactButton}>
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
