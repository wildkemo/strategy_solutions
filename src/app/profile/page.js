"use client";
import { useEffect, useState } from "react";

export default function Profile({ userId }) {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://backend/app/Controllers/get_user_profile.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          }
        );
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    try {
      const response = await fetch(
        "http://backend/app/Controllers/update_user_profile.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, ...profile }),
        }
      );
      if (!response.ok) throw new Error("Failed to update profile");
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error)
    return <div style={{ padding: 32, color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: 32, maxWidth: 480, margin: "0 auto" }}>
      <h1>Manage My Profile</h1>
      <form onSubmit={handleSave} style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            padding: "0.7rem 2rem",
            background: "#4a90e2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: "1.1rem",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
        {success && (
          <div style={{ color: "green", marginTop: 16 }}>{success}</div>
        )}
      </form>
    </div>
  );
}
