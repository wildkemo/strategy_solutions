"use client";
import { useEffect, useState } from "react";
import styles from "../data-management/ServiceDetail.module.css";
import Link from "next/link";
import Image from "next/image";

export default function ERPSolutions() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          // "http://backend/app/Controllers/get_services.php"
          "http://karim/oop_project/php_backend/app/Controllers/get_services.php"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch services");
        }

        const services = await response.json();
        const erpService = services.find(
          (s) => s.title.toLowerCase() === "erp solutions"
        );

        if (erpService) {
          setService(erpService);
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
          <p className={styles.serviceDescription}>{service.description}</p>
          <h2 className={styles.serviceSubtitle}>Features</h2>
          <ul className={styles.featureList}>
            {service.features.map((feature, idx) => (
              <li className={styles.featureItem} key={idx}>
                {feature}
              </li>
            ))}
          </ul>
          <div className={styles.buttonWrapper}>
            <Link href="/request-service" className={styles.requestButton}>
              Request a Service
            </Link>
            <Link href="/services" className={styles.contactButton}>
              Back to Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
