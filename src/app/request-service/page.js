"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function RequestService() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    serviceType: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    alert("Thank you for your request! We will contact you soon.");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1>Request a Service</h1>
        <p className={styles.heroSubtitle}>
          Let us know how we can help your business grow
        </p>
      </section>

      <section className={styles.formSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company">Company Name</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="serviceType">Service Type</label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
            >
              <option value="">Select a service</option>
              <option value="hardware">Hardware Services</option>
              <option value="software">Software Services</option>
              <option value="both">Both Hardware and Software</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Project Details</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Please describe your project requirements..."
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit Request
          </button>
        </form>
      </section>
    </main>
  );
}
