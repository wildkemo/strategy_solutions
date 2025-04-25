"use client";

import React from 'react';
import styles from './RequestService.module.css';

const RequestService = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Request a Service</h1>
        <p className={styles.subtitle}>Fill out the form below and we'll get back to you within 24 hours</p>

        <form 
          action="http://localhost:8000/api/request_service.php" 
          method="POST"
          className={styles.form}
        >
          <div className={styles.formSection}>
            <h2>Personal Information</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="John Doe"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="john@example.com"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h2>Service Details</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="service">Service Type</label>
              <select 
                id="service" 
                name="service" 
                required
              >
                <option value="">Select a service type</option>
                <option value="hardware">Hardware Services</option>
                <option value="software">Software Services</option>
                <option value="consulting">Consulting Services</option>
                <option value="support">Support Services</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message">Service Requirements</label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                placeholder="Please describe your service requirements in detail..."
              ></textarea>
            </div>
          </div>

          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={styles.submitButton}
            >
              Submit Request
            </button>
            <p className={styles.privacyText}>
              By submitting this form, you agree to our <a href="/privacy">Privacy Policy</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestService; 