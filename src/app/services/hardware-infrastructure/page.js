"use client";
import { useEffect, useState } from "react";
import styles from "../data-management/ServiceDetail.module.css";
import Link from "next/link";

export default function HardwareInfrastructure() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost/strategy_solutions_backend/app/Controllers/get_services.php"
          // "http://localhost/www/oop_project/php_backend/app/Controllers/get_services.php"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }
        const services = await response.json();
        const hardwareService = services.find(
          (s) => s.title.toLowerCase() === "hardware infrastructure"
        );
        if (hardwareService) {
          setService(hardwareService);
        } else {
          setService(null);
        }
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(err.message);
        setService(null);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, []);

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

  if (loading) {
    return (
      <div className={styles.serviceDetailContainer}>
        <div className={styles.serviceDetailContent}>
          <h1 className={styles.serviceTitle}>Loading...</h1>
        </div>
      </div>
    );
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

  return (
    <div className={styles.serviceDetailContainer}>
      <div className={styles.serviceDetailContent}>
        <div className={styles.textContent}>
          <h1 className={styles.serviceTitle}>{service.title}</h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#fff",
              margin: "0 0 2rem 0",
              maxWidth: 700,
            }}
          >
            {service.description}
          </p>
          <h2
            className={styles.serviceSubtitle}
            style={{
              fontWeight: 700,
              fontSize: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            Features
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginBottom: "2.5rem",
            }}
          >
            {service.features.map((feature, idx) => (
              <div
                key={idx}
                className={styles.featureCardFadeIn}
                style={{
                  background: "#18191c",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "1rem 1.5rem",
                  fontSize: "1.15rem",
                  fontWeight: 500,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                  border: "none",
                  animationDelay: `${0.1 * idx}s`,
                  animationFillMode: "both",
                }}
              >
                {feature}
              </div>
            ))}
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
            style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}
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
    </div>
  );
}
