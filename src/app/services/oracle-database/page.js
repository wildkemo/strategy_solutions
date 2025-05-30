import React, { useState, useEffect } from "react";
import styles from "./ServiceDetail.module.css";
import Link from "next/link";
import Image from "next/image";
import LoadingScreen from "../../components/LoadingScreen";

const OracleDatabase = () => {
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
          <div className={styles.buttonWrapper}>
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

export default OracleDatabase;
