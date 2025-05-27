"use client";
import styles from "./profile.module.css";
import { useEffect, useState, useRef } from "react";

export default function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updatedFieldsMessage, setUpdatedFieldsMessage] = useState("");
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost/strategy_solutions_backend/app/Controllers/get_current_user.php",
          // "http://localhost/oop_project/php_backend/app/Controllers/get_current_user.php",
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUser(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          currentPassword: "",
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setUpdateError("New passwords do not match");
      return;
    }
    if (formData.password && formData.password.length < 8) {
      setUpdateError("New password must be at least 8 characters long");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost/strategy_solutions_backend/app/Controllers/update_user_info.php",
        // "http://localhost/oop_project/php_backend/app/Controllers/update_user_info.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("Failed to update user info");
      const result = await response.json();
      if (result.status === "success") {
        // Determine which fields were updated
        const updatedFields = [];
        if (formData.name !== user.name) updatedFields.push("Name");
        if (formData.phone !== user.phone) updatedFields.push("Phone Number");
        if (formData.password) updatedFields.push("Password");
        let message = result.message;
        if (updatedFields.length > 0) {
          message = `You have updated the following: ${updatedFields.join(
            ", "
          )}`;
        }
        setUpdatedFieldsMessage(message);
        setUpdateSuccess(true);
        setUpdateError(null);
        if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = setTimeout(() => {
          setUpdatedFieldsMessage("");
          setUpdateSuccess(false);
        }, 4000);
        // Refresh user data
        const userResponse = await fetch(
          "http://localhost/strategy_solutions_backend/app/Controllers/get_current_user.php",
          // "http://localhost/oop_project/php_backend/app/Controllers/get_current_user.php",
          {
            credentials: "include",
          }
        );
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          setFormData({
            name: userData.name || "",
            phone: userData.phone || "",
            currentPassword: "",
            password: "",
            confirmPassword: "",
          });
        }
      } else {
        alert(result.message);
        setUpdateError(result.message || "Update failed");
      }
    } catch (err) {
      setUpdateError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.profileContainer}>
      <h1>Manage My Profile</h1>
      {updatedFieldsMessage && (
        <div
          className={styles.successMessage}
          style={{ animation: "fadeIn 0.7s" }}
        >
          {updatedFieldsMessage}
        </div>
      )}
      {updateSuccess && !updatedFieldsMessage && (
        <div className={styles.successMessage}>
          Profile updated successfully!
        </div>
      )}
      {updateError && <div className={styles.errorMessage}>{updateError}</div>}
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>New Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className={styles.updateButton}>
          Update Profile
        </button>
      </form>
    </div>
  );
}
