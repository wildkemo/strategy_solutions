"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import styles from "./RequestService.module.css";

const validateSession = async () => {
  // const response2 = await fetch(
  //   "http://localhost/oop_project/php_backend/app/Controllers/validate_request.php",
  //   { headers: { "Content-Type": "application/json" }, credentials: "include" }
  // );

  const response2 = await fetch(
    "http://localhost/strategy_solutions_backend/app/Controllers/validate_request.php",
    { headers: { "Content-Type": "application/json" }, credentials: "include" }
  );

  if (!response2.ok) throw new Error("Failed to fetch services");

  let result = await response2.json();

  if (result.status != "success") {
    return false;
    throw new Error("Permission required");
  } else {
    return true;
  }
};

export default function RequestService() {
  // const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const isValid = await validateSession();
      if (!isValid) {
        window.location.href = "/"; // redirect here if not allowed
      } else {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  const validateForm = () => {
    return true;
  };

  const handleSubmit = async (e) => {
    //e.preventDefault();

    const response = await fetch(
       "http://localhost/strategy_solutions_backend/app/Controllers/request_service.php",
      // "http://localhost/oop_project/php_backend/app/Controllers/request_service.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          service_type: formData.serviceType,
          service_description: formData.description,
        }),
      }
    );

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      );
    }

    const result = await response.json();

    if (result.status == "success") {
      alert("Service request submitted successfully");
    } else if (result.status == "error") {
      alert(result.message);
    }

    // if (true) {
    //   try {
    //     // console.log("Sending form data:", formData);
    //   } catch (error) {
    //     console.error("Error:", error.message);
    //     alert("An error occurred while submitting the form.");
    //   }
    // }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (checkingSession) return <div className={styles.loading}>Loading...</div>;

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
                <option value="data-management">Data Management Solutions</option>
                <option value="cloud-virtualization">Cloud & Virtualization</option>
                <option value="oracle-database">Oracle Database Technologies</option>
                <option value="hardware-infrastructure">Hardware Infrastructure</option>
                <option value="cyber-security">Cyber Security Services</option>
                <option value="business-continuity">Business Continuity</option>
                <option value="erp-solutions">ERP Solutions</option>
                <option value="project-management">Project Management</option>
                <option value="fusion-middleware">Fusion Middleware Technologies</option>
                <option value="outsourcing-support">Outsourcing & Support</option>
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
