"use client";
import React, { useEffect, useState } from "react";
import styles from "./Services.module.css";
import Link from "next/link";

const colorClasses = [styles.box1, styles.box2, styles.box3, styles.box4];

const getSlug = (title) =>
  title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

function PopupNotification({ message, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0,0,0,0.3)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "#fff",
          color: "#222",
          padding: "2rem 1.5rem 1.5rem 1.5rem",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          maxWidth: 400,
          width: "90%",
          textAlign: "center",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 14,
            background: "none",
            border: "none",
            fontSize: 22,
            color: "#888",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h2 style={{ marginBottom: 12, color: "#0070f3" }}>Success</h2>
        <div style={{ fontSize: "1.1rem" }}>{message}</div>
      </div>
    </div>
  );
}

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://localhost/strategy_solutions_backend/app/Controllers/get_services.php"
          // "http://karim/oop_project/php_backend/app/Controllers/get_services.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Received data is not an array");
        }
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    // Check for ?requested=1 in the URL
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("requested") === "1") {
        setShowPopup(true);
        // Remove the param from the URL after showing
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Error loading services: {error}</p>
      </div>
    );
  }

  // Split services into rows of 5 (as in your screenshot)
  const servicesPerRow = 5;
  const rows = [];
  for (let i = 0; i < services.length; i += servicesPerRow) {
    rows.push(services.slice(i, i + servicesPerRow));
  }

  return (
    <div className={styles.servicesContainer}>
      {showPopup && (
        <PopupNotification
          message={
            "Your service has been requested successfully. Stay tuned for our company's response."
          }
          onClose={() => setShowPopup(false)}
        />
      )}
      <div className={styles.servicesContent}>
        <h1 className={styles.servicesTitle}>Our Services</h1>
        <div className={styles.servicesGrid}>
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={rowIndex === 0 ? styles.firstRow : styles.secondRow}
            >
              {row.map((service, idx) => (
                <div key={service.id} className={`${styles.boxWrapper}`}>
                  <Link
                    href={`/services/${getSlug(service.title)}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className={`${styles.serviceBox} ${
                        colorClasses[
                          (rowIndex * servicesPerRow + idx) %
                            colorClasses.length
                        ]
                      }`}
                    >
                      <h2>{service.title}</h2>
                      <ul>
                        {service.features.map((feature, i) => (
                          <li key={i}>{feature.name || feature}</li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
