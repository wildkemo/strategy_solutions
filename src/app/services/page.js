"use client";
import React, { useEffect, useState } from "react";
import styles from "./Services.module.css";
import Link from "next/link";

const getSlug = (title) =>
  title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

const Services = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://karim/oop_project/php_backend/app/Controllers/get_services.php');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Received data is not an array');
        }
        
        setServices(data);
      } catch (err) {
        console.error("Fetch error:", err);
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

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Our Services</h1>
      
      <div className={styles.servicesGrid}>
        {services.map((service) => (
          <div key={service.id} className={styles.serviceCard}>
            <div className={styles.cardHeader}>
              <h2>{service.title}</h2>
              <div className={`${styles.icon} ${styles[service.icon] || styles.defaultIcon}`}></div>
            </div>
            
            <div className={styles.cardBody}>
              <p className={styles.description}>{service.description}</p>
              
              <h3>Features:</h3>
              <ul className={styles.featuresList}>
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            
            <Link href={`/services/${getSlug(service.title)}`} className={styles.learnMoreLink}>
              Learn More →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;