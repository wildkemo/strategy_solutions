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
          action="http://karim/oop_project/php_backend/handle_form.php" 
          method="POST"
          className={styles.form}
        >
          <div className={styles.formSection}>
            <h2>Personal Information</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                placeholder="John"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                placeholder="Doe"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                required
                min="18"
                max="120"
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

            <div className={styles.inputGroup}>
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength="8"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="preferredCurrency">Preferred Currency</label>
              <select id="preferredCurrency" name="preferredCurrency" required>
                <option value="">Select currency</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="billingAddress">Billing Address</label>
              <textarea
                id="billingAddress"
                name="billingAddress"
                required
                rows="3"
                placeholder="Enter your billing address..."
              ></textarea>
            </div>

            <div className={styles.inputGroup}>
              <label>
                <input
                  type="checkbox"
                  name="isSubscribedToNewsletter"
                  defaultChecked
                />
                Subscribe to Newsletter
              </label>
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
              <label htmlFor="price">Price (in selected currency)</label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="orderDescription">Service Requirements</label>
              <textarea
                id="orderDescription"
                name="orderDescription"
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