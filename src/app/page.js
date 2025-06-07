"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Fetch user data to determine if signed in
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost/strategy_solutions_backend/app/Controllers/get_current_user.php",
          { method: "GET", credentials: "include" }
        );
        if (response.ok) {
          const userData = await response.json();
          if (userData && userData.length > 0) {
            setUser(userData[0]);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
    setForm({ email: "", password: "" });
    setFormError("");
    setFormSuccess(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Simple validation
    if (!form.email.trim() || !form.password.trim()) {
      setFormError("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setFormError("Invalid email address.");
      return;
    }

    // You can add further logic here (e.g., send to backend)

    if (form.email != "admin@gmail.com") {
      const loginRequest = await fetch(
        "http://localhost/strategy_solutions_backend/app/Controllers/login.php",
        // "http://localhost/www/oop_project/php_backend/app/Controllers/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            action: "login",
            email: form.email,
            password: form.password,
          }),
          // credentials: 'include'
        }
      );

      if (!loginRequest.ok) {
        let errorText = await loginRequest.text();
        throw new Error(
          `HTTP error! Status: ${loginRequest.status}, Message: ${errorText}`
        );
      } else {
        const loginResponse = await loginRequest.json();

        if (loginResponse.status == "sucess-user") {
          // alert(loginResponse.message);
          setFormError("");
          setFormSuccess(true);
          window.location.href = "/services";
        } else if (loginResponse.status == "sucess-admin") {
          setFormError("");
          setFormSuccess(true);
          window.location.href = "/blank_admin";
        } else if (loginResponse.status == "error") {
          //alert(loginResponse.message);
          setFormError(loginResponse.message);
          setFormSuccess(false);
        } else {
          setFormError("An Unknown error occured");
          setFormSuccess(false);
        }
      }
    } else {
      const loginRequest = await fetch(
        "http://localhost/strategy_solutions_backend/app/Controllers/login.php",
        // "http://localhost/www/oop_project/php_backend/app/Controllers/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            action: "login-as-admin",
            email: form.email,
            password: form.password,
          }),
          // credentials: 'include'
        }
      );

      if (!loginRequest.ok) {
        let errorText = await loginRequest.text();
        throw new Error(
          `HTTP error! Status: ${loginRequest.status}, Message: ${errorText}`
        );
      } else {
        const loginResponse = await loginRequest.json();

        if (loginResponse.status == "sucess-user") {
          // alert(loginResponse.message);
          setFormError("");
          setFormSuccess(true);
          window.location.href = "/services";
        } else if (loginResponse.status == "sucess-admin") {
          setFormError("");
          setFormSuccess(true);
          window.location.href = "/blank_admin";
        } else if (loginResponse.status == "error") {
          //alert(loginResponse.message);
          setFormError(loginResponse.message);
          setFormSuccess(false);
        } else {
          setFormError("An Unknown error occured");
          setFormSuccess(false);
        }
      }
    }
  };

  return (
    <>
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>Strategy Solution</h1>
            <p className={styles.heroSubtitle}>
              Empowering businesses with innovative strategies and solutions
            </p>
            <div className={styles.ctas}>
              {!isLoading && !user && (
                <button onClick={handleOpenModal} className={styles.primary}>
                  Get Started
                </button>
              )}
              <a href="/services" className={styles.secondary}>
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.featuresHeader}>
            <Image
              src="/images/server1.png"
              alt="Server Rack"
              width={80}
              height={80}
              className={styles.solutionsImage}
              priority
            />
            <h2>Our Solutions</h2>
          </div>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>Strategic Planning</h3>
              <p>
                Comprehensive business strategy development and implementation
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Digital Transformation</h3>
              <p>
                Modernize your business with cutting-edge technology solutions
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Performance Optimization</h3>
              <p>Enhance efficiency and productivity across your organization</p>
            </div>
          </div>
        </section>

        {/* Modal Validation Form */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={handleCloseModal}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.closeButton}
                onClick={handleCloseModal}
                aria-label="Close"
              >
                ×
              </button>
              <h2>Sign In</h2>
              {formSuccess ? (
                <div className={styles.successMessage}>
                  Thank you! We'll contact you soon.
                  <br />
                  <a href="/register" className={styles.registerLink}>
                    Go to Register Form
                  </a>
                </div>
              ) : (
                <form
                  onSubmit={handleFormSubmit}
                  className={styles.validationForm}
                >
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      required
                      type="email"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Password</label>
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleFormChange}
                      required
                      type="password"
                    />
                  </div>
                  {formError && (
                    <div className={styles.formError}>{formError}</div>
                  )}
                  <button type="submit" className={styles.saveButton}>
                    Submit
                  </button>
                  <a href="/register" className={styles.registerLink}>
                    Go to Register Form
                  </a>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
      <footer
        style={{
          width: "100vw",
          background: "#000",
          color: "#fff",
          textAlign: "center",
          padding: "1rem 0",
          fontSize: "1.3rem",
          fontWeight: 500,
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
          marginTop: "2.5rem",
          left: 0,
          right: 0
        }}
      >
        Copyright © 2025 Strategy Solution - All Rights Reserved.
      </footer>
    </>
  );
}
