"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("showSignIn")) {
      setShowModal(true);
    }
  }, [searchParams]);

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
        // "http://localhost/strategy_solutions_backend/app/Controllers/login.php",
        "http://localhost/oop_project/php_backend/app/Controllers/login.php",
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
        } else if (loginResponse.status == "fail") {
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
        // "http://localhost/strategy_solutions_backend/app/Controllers/login.php",
        "http://localhost/oop_project/php_backend/app/Controllers/login.php",
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
        } else if (loginResponse.status == "fail") {
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
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Strategy Solution</h1>
          <p className={styles.heroSubtitle}>
            Empowering businesses with innovative strategies and solutions
          </p>
          <div className={styles.ctas}>
            <button onClick={handleOpenModal} className={styles.primary}>
              Get Started
            </button>
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

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <h2>Ready to Transform Your Business?</h2>
        <p>Let's discuss how we can help you achieve your goals</p>
        <a href="#contact" className={styles.primary}>
          Contact Us
        </a>
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
    // <div className={styles.page}>
    //   <main className={styles.main}>
    //     <Image
    //       className={styles.logo}
    //       src="/next.svg"
    //       alt="Next.js logo"
    //       width={180}
    //       height={38}
    //       priority
    //     />
    //     <ol>
    //       <li>
    //         Get started by editing <code>src/app/page.js</code>.
    //       </li>
    //       <li>Save and see your changes instantly.</li>
    //     </ol>

    //     <div className={styles.ctas}>
    //       <a
    //         className={styles.primary}
    //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //       >
    //         <Image
    //           className={styles.logo}
    //           src="/vercel.svg"
    //           alt="Vercel logomark"
    //           width={20}
    //           height={20}
    //         />
    //         Deploy now
    //       </a>
    //       <a
    //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className={styles.secondary}
    //       >
    //         Read our docs
    //       </a>
    //     </div>
    //   </main>
    //   <footer className={styles.footer}>
    //     <a
    //       href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/file.svg"
    //         alt="File icon"
    //         width={16}
    //         height={16}
    //       />
    //       Learn
    //     </a>
    //     <a
    //       href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/window.svg"
    //         alt="Window icon"
    //         width={16}
    //         height={16}
    //       />
    //       Examples
    //     </a>
    //     <a
    //       href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       <Image
    //         aria-hidden
    //         src="/globe.svg"
    //         alt="Globe icon"
    //         width={16}
    //         height={16}
    //       />
    //       Go to nextjs.org →
    //     </a>
    //   </footer>
    // </div>
  );
}
