"use client";

import { useState } from "react";
import styles from "../request-service/RequestService.module.css";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setSuccess(true);
    // Add authentication logic here
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Sign In</h2>
        {success ? (
          <div className={styles.success}>Signed in successfully!</div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Username</label>
              <input
                className={styles.input}
                name="username"
                value={form.username}
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
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.button}>
              Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
