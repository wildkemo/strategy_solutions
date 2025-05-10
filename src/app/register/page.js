"use client";

import { useState } from "react";
import styles from "../request-service/RequestService.module.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.email.trim() ||
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
    if (form.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    setFormError("");
    setFormSuccess(true);
    // You can add backend logic here
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Register</h2>
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
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                className={styles.input}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
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
