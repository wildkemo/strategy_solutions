"use client";

import { useState } from "react";
import styles from "../request-service/RequestService.module.css";

function Popup({ message, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          color: "#d63031",
          padding: "2rem 2.5rem",
          borderRadius: 16,
          boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
          fontWeight: 600,
          fontSize: "1.2rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 22,
            color: "#888",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        {message}
      </div>
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    companyName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [showUserExists, setShowUserExists] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.companyName.trim() ||
      !form.phone.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
      setFormError("All fields are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setFormError("Invalid email address.");
      return;
    }
    if (form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const registerRequest = await fetch(
      "http://localhost/strategy_solutions_backend/app/Controllers/register.php",
      // "http://localhost/www/oop_project/php_backend/app/Controllers/register.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "register",
          name: form.name,
          email: form.email,
          phone: form.phone,
          // companyName: form.companyName,
          password: form.password,
          gender: form.gender,
          company_name: form.companyName,
        }),
      }
    );

    if (!registerRequest.ok) {
      let errorText = await registerRequest.text();
      throw new Error(
        `HTTP error! Status: ${registerRequest.status}, Message: ${errorText}`
      );
    } else {
      const registerResponse = await registerRequest.json();

      if (registerResponse.status == "success") {
        window.location.href = "/?showSignIn=1";
      } else if (registerResponse.status == "error") {
        if (
          registerResponse.message &&
          registerResponse.message.toLowerCase().includes("already exists")
        ) {
          setShowUserExists(true);
        } else {
          setFormError(registerResponse.message);
        }
      }
    }

    // if (!registerRequest.ok) {
    //   let errorText = await registerRequest.text();
    //   throw new Error(
    //     `HTTP error! Status: ${registerRequest.status}, Message: ${errorText}`
    //   );
    // }
    // else{
    //   const registerResponse = await registerRequest.json();

    //   if (registerResponse.status == "sucess") {
    //     alert(registerResponse.action);
    //   } else if (registerResponse.status == "fail") {
    //     alert(registerResponse.action);
    //   }
    // }

    // setFormError("");
    // setFormSuccess(true);

    // You can add backend logic here
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Register</h2>
        {showUserExists && (
          <Popup
            message="User already exists"
            onClose={() => setShowUserExists(false)}
          />
        )}
        {formSuccess ? (
          <div className={styles.success}>
            Registration successful! You can now log in.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Name</label>
              <input
                className={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                type="email"
                autoComplete="email"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Company Name</label>
              <input
                className={styles.input}
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Gender</label>
              <select
                className={styles.input}
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                className={styles.input}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                type="tel"
                autoComplete="tel"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                type="password"
                autoComplete="new-password"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Confirm Password</label>
              <input
                className={styles.input}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                type="password"
                autoComplete="new-password"
              />
            </div>
            {formError && <div className={styles.error}>{formError}</div>}
            <button type="submit" className={styles.button}>
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
