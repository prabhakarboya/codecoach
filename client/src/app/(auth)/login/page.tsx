"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthProvider"; // Adjust path if needed
import { loginUser } from "../../../utils/api";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(form);
      if (!data || !data.email) throw new Error("Invalid login response");

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data); // Update context for header
      }
      router.push("/"); // Navigate to home
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => router.push("/register");
  const goToForgotPassword = () => router.push("/forgot-password");

  return (
    <main
      style={{
        minHeight: "65vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "48px 20px 48px",
      }}
    >
      <div
        style={{
          width: "420px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
          padding: "36px 28px",
          fontFamily: "Inter, sans-serif",
          color: "#111827",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: "1.5rem", marginTop: 0, marginBottom: 8 }}>
          Welcome back
        </h3>
        <p style={{ color: "#6b7280", marginTop: 0, marginBottom: 16 }}>
          Please enter your details
        </p>

        {error && (
          <div
            role="alert"
            style={{
              marginBottom: 20,
              color: "#dc2626",
              fontWeight: 600,
              fontSize: "0.875rem",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            autoFocus
            style={{
              height: 44,
              padding: "0 14px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              color: "#374151",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            style={{
              height: 44,
              padding: "0 14px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              color: "#374151",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
          />

          <div
            onClick={goToForgotPassword}
            style={{
              fontSize: "0.875rem",
              color: "#2563eb",
              cursor: "pointer",
              textAlign: "right",
            }}
          >
            Forgot password
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              height: 44,
              backgroundColor: loading ? "#93c5fd" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              marginTop: 24,
              marginBottom: 12,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ fontSize: "0.875rem", color: "#6b7280", textAlign: "center", margin: 0 }}>
          Not registered yet?{" "}
          <button
            type="button"
            onClick={goToRegister}
            style={{
              border: "none",
              background: "none",
              color: "#2563eb",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: 500,
              padding: 0,
            }}
          >
            Register
          </button>
        </p>
      </div>
    </main>
  );
}
