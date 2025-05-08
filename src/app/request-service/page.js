"use client";

import { useState } from "react";
import styles from "./RequestService.module.css";

export default function RequestService() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.serviceType) {
      newErrors.serviceType = "Please select a service type";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Please provide a description";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        console.log("Sending form data:", formData);
  
        const response = await fetch("http://karim/oop_project/php_backend/public/handle_form.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service_type: formData.serviceType,
            service_description: formData.description,
          }),
        });
  
        console.log("Response status:", response.status);
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
  
        const result = await response.text();
        console.log("Success:", result);
  
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          serviceType: "",
          description: "",
        });
      } catch (error) {
        console.error("Error:", error.message);
        alert("An error occurred while submitting the form.");
      }
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Request a Service</h1>
        <p className={styles.subtitle}>
          Fill out the form below and we'll get back to you within 24 hours
        </p>

        {isSubmitted ? (
          <div className={styles.success}>
            <h2>Thank you for your request!</h2>
            <p>We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`${styles.input} ${errors.name ? styles.error : ""}`}
              />
              {errors.name && (
                <span className={styles.error}>{errors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.email ? styles.error : ""
                }`}
              />
              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`${styles.input} ${
                  errors.phone ? styles.error : ""
                }`}
              />
              {errors.phone && (
                <span className={styles.error}>{errors.phone}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="serviceType" className={styles.label}>
                Service Type
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className={`${styles.input} ${styles.select} ${
                  errors.serviceType ? styles.error : ""
                }`}
              >
                <option value="">Select a service</option>
                <option value="data-management">
                  Data Management Solutions
                </option>
                <option value="cloud-virtualization">
                  Cloud & Virtualization
                </option>
                <option value="oracle-database">
                  Oracle Database Technologies
                </option>
                <option value="hardware-infrastructure">
                  Hardware Infrastructure
                </option>
                <option value="cyber-security">Cyber Security Services</option>
                <option value="business-continuity">Business Continuity</option>
                <option value="erp-solutions">ERP Solutions</option>
                <option value="project-management">Project Management</option>
                <option value="fusion-middleware">
                  Fusion Middleware Technologies
                </option>
                <option value="outsourcing-support">
                  Outsourcing & Support
                </option>
                <option value="other">Other</option>
              </select>
              {errors.serviceType && (
                <span className={styles.error}>{errors.serviceType}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Service Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${styles.textarea} ${
                  errors.description ? styles.error : ""
                }`}
                rows="5"
              />
              {errors.description && (
                <span className={styles.error}>{errors.description}</span>
              )}
            </div>

            <button type="submit" className={styles.button}>
              Submit Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
