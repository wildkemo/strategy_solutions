import React, { useState, useEffect } from "react";
import styles from "./ServiceDetail.module.css";
import Link from "next/link";
import Image from "next/image";
import LoadingScreen from "../../components/LoadingScreen";

const DataManagement = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost/strategy_solutions_backend/app/Controllers/get_services.php"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const services = await response.json();
        const found = services.find(
          (s) => s.title.toLowerCase() === "data management solutions"
        );
        setService(found || null);
      } catch (err) {
        setError(err.message);
        setService(null);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className={styles.serviceDetailContainer}>
        <div className={styles.serviceDetailContent}>
          <h1 className={styles.serviceTitle}>Error</h1>
          <p>{error}</p>
          <Link href="/services" className={styles.requestButton}>
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className={styles.serviceDetailContainer}>
        <div className={styles.serviceDetailContent}>
          <h1 className={styles.serviceTitle}>Service Not Found</h1>
          <Link href="/services" className={styles.requestButton}>
            Back to Services
          </Link>
        </div>
      </div>
    );
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
