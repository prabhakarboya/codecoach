"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword, resetPassword } from "../../../utils/api";

export default function ResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await forgotPassword({ email });
      setMessage(res.message || "OTP sent successfully");
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!otp || !newPassword) {
      setError("Please enter OTP and new password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await resetPassword({ email, otp, newPassword });
      setMessage(res.message || "Password reset successful");
      setStep(3);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => router.push("/login");

  // Shared styles matching your project's palette and fonts
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
  const headerStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: "1.5rem",
    marginTop: 0,
    marginBottom: "8px",
  };
  const subTextStyle: React.CSSProperties = {
    color: "#6b7280",
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
    padding: "0 14px",
    borderRadius: 6,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    color: "#fff",
    backgroundColor: "#2563eb",
    transition: "background-color 0.2s",
    marginTop: 16,
  };
  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
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
        <h3 style={headerStyle}>Reset your password</h3>
        {message && <p style={messageStyle}>{message}</p>}
        {error && <p style={errorStyle} role="alert">{error}</p>}

        {step === 1 && (
          <>
            <p style={subTextStyle}>Please enter your email to receive an OTP</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              disabled={loading}
              autoComplete="email"
              autoFocus
            />
            <button
              onClick={handleSendOtp}
              style={loading ? disabledButtonStyle : buttonStyle}
              disabled={loading}
              type="button"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={subTextStyle}>Enter the OTP and your new password below</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={inputStyle}
              disabled={loading}
              autoFocus
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              onClick={handleReset}
              style={loading ? disabledButtonStyle : buttonStyle}
              disabled={loading}
              type="button"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p style={{ ...messageStyle, marginTop: 20 }}>Password reset successful! You can now login.</p>
            <button onClick={goToLogin} style={buttonStyle} type="button">
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
