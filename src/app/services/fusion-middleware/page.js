import React, { useState, useEffect } from "react";
import styles from "./ServiceDetail.module.css";
import Link from "next/link";
import Image from "next/image";
import LoadingScreen from "../../components/LoadingScreen";

export default function FusionMiddleware() {
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
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "2.5rem",
          }}
        >
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
  );
}
