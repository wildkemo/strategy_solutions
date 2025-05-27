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

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          // "http://karim/oop_project/php_backend/app/Controllers/get_services.php"
          "http://localhost/strategy_solutions_backend/app/Controllers/get_services.php"
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
