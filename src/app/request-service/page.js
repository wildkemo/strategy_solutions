"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import styles from "./RequestService.module.css";
import LoadingScreen from "../components/LoadingScreen";

const validateSession = async () => {
  // const response2 = await fetch(
  //   "http://localhost/oop_project/php_backend/app/Controllers/validate_request.php",
  //   { headers: { "Content-Type": "application/json" }, credentials: "include" }
  // );

  const response2 = await fetch(
    // "http://localhost/strategy_solutions_backend/app/Controllers/validate_request.php",
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

function PopupNotification({ message, onClose, error }) {
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
        <h2 style={{ marginBottom: 12, color: "#0070f3" }}>
          {error ? "Error" : "Success"}
        </h2>
        <div style={{ fontSize: "1.1rem" }}>{message}</div>
      </div>
    </div>
  );
}

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
  const [showPopup, setShowPopup] = useState(false);
  const [signedInEmail, setSignedInEmail] = useState("");
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        window.location.href = "/services?requested=1";
      }, 2000); // 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  useEffect(() => {
    // Fetch signed-in user's email
    const fetchSignedInEmail = async () => {
      try {
        const response = await fetch(
          "http://localhost/strategy_solutions_backend/app/Controllers/get_current_user.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data[0] && data[0].email) {
            setSignedInEmail(data[0].email);
          }
        }
      } catch {}
    };
    fetchSignedInEmail();
  }, []);

  const validateForm = () => {
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Check if entered email matches signed-in email
    if (
      signedInEmail &&
      formData.email.trim().toLowerCase() !== signedInEmail.trim().toLowerCase()
    ) {
      setShowEmailPopup(true);
      setLoading(false);
      return;
    }
    const response = await fetch(
      "http://localhost/strategy_solutions_backend/app/Controllers/request_service.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          service_type: formData.serviceType,
          service_description: formData.description,
        }),
      }
    );
    if (!response.ok) {
      const errorText = await response.text();
      setLoading(false);
      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${errorText}`
      );
    }
    const result = await response.json();
    setLoading(false);
    if (result.status == "success") {
      setShowPopup(true);
    } else if (result.status == "error") {
      alert(result.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (checkingSession) return <div className={styles.loading}>Loading...</div>;
  if (loading) return <LoadingScreen />;

  return (
    <div className={styles.container}>
      {showPopup && (
        <PopupNotification
          message={
            "Your service has been requested successfully. Stay tuned for our company's response."
          }
          onClose={() => setShowPopup(false)}
        />
      )}
      {showEmailPopup && (
        <PopupNotification
          message={"Enter your mail you have signed in with"}
          onClose={() => setShowEmailPopup(false)}
          error
        />
      )}
      {!isSubmitted && (
        <div className={styles.content}>
          <h1 className={styles.title}>Request a Service</h1>
          <p className={styles.subtitle}>
            Fill out the form below and we'll get back to you within 24 hours
          </p>
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
        </div>
      )}
    </div>
  );
}
