"use client";
import { useEffect, useState } from "react";

export default function Profile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost/strategy_solutions_backend/app/Controllers/get_current_user.php",
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
          newPassword: "",
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
    if (formData.newPassword !== formData.confirmPassword) {
      setUpdateError("New passwords do not match");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost/strategy_solutions_backend/app/Controllers/update_user_info.php",
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
        setUpdateSuccess(true);
        setUpdateError(null);
        // Refresh user data
        const userResponse = await fetch(
          "http://localhost/strategy_solutions_backend/app/Controllers/get_current_user.php",
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
            newPassword: "",
            confirmPassword: "",
          });
        }
      } else {
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
      {updateSuccess && (
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
            name="newPassword"
            value={formData.newPassword}
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
