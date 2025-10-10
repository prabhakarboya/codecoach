"use client";

import React, { useState } from "react";
import { useAuth } from "../../../context/AuthProvider";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // Update context with new user info
      setMessage("Profile updated successfully.");
    } catch (error: any) {
      setMessage(error.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: "600px", margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ marginBottom: "1rem" }}>Your Profile</h1>

      <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>
        Name:
      </label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
        style={{
          width: "100%",
          padding: "8px",
          fontSize: "1rem",
          marginBottom: "1rem",
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />

      <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>
        Email:
      </label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        style={{
          width: "100%",
          padding: "8px",
          fontSize: "1rem",
          marginBottom: "1rem",
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#ccc" : "#2563eb",
          color: "#fff",
          fontWeight: "bold",
          border: "none",
          borderRadius: 6,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {message && (
        <p style={{ marginTop: "1rem", color: message.includes("successfully") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </main>
  );
}
