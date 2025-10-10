"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "../../../utils/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || ""; // get token from URL

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await resetPassword({ token, newPassword });
      setMessage(res.message || "Password reset successful!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: "65vh",
    backgroundColor: "#f9fafb",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "48px 20px 48px",
  };

  const boxStyle: React.CSSProperties = {
    width: "420px",
    backgroundColor: "#fff",
    borderRadius: 8,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
    padding: "36px 28px",
    fontFamily: "Inter, sans-serif",
    color: "#111827",
    display: "flex",
    flexDirection: "column",
  };

  const headingStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: "1.5rem",
    marginTop: 0,
    marginBottom: "16px",
  };

  const inputStyle: React.CSSProperties = {
    height: 44,
    padding: "0 14px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    fontSize: "1rem",
    outline: "none",
    color: "#374151",
    transition: "border-color 0.2s",
  };

  const buttonStyle: React.CSSProperties = {
    height: 44,
    backgroundColor: loading ? "#93c5fd" : "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontWeight: 600,
    cursor: loading ? "not-allowed" : "pointer",
    transition: "background-color 0.2s",
    marginTop: 16,
    marginBottom: 12,
  };

  const messageStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    marginBottom: 12,
    color: "green",
    textAlign: "center",
  };

  const errorStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    marginBottom: 12,
    color: "red",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h3 style={headingStyle}>Reset your password</h3>
        {message && <p style={messageStyle}>{message}</p>}
        {error && <p style={errorStyle} role="alert">{error}</p>}

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
          disabled={loading}
          autoComplete="new-password"
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
          disabled={loading}
          autoComplete="new-password"
        />

        <button onClick={handleReset} disabled={loading} style={buttonStyle} type="button">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
