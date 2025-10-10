"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthProvider"; // Adjust path if needed
import { registerUser } from "../../../utils/api";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState<RegisterForm>({ name: "", email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await registerUser(form);
      if (!data || !data.name || !data.email) {
        throw new Error("Invalid registration response");
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data); // Update context for Header
      }
      router.push("/"); // Redirect to home
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => router.push("/login");

  return (
    <div
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
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
          padding: "36px 28px",
          fontFamily: "Inter, sans-serif",
          color: "#111827",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3 style={{ fontWeight: 700, fontSize: "1.5rem", marginTop: 0, marginBottom: "8px" }}>
          Create an account
        </h3>
        <p style={{ color: "#6b7280", marginTop: 0, marginBottom: "16px" }}>
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
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
            autoComplete="name"
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
            autoComplete="new-password"
          />

          <button type="submit" disabled={loading} style={{ ...buttonStyle, backgroundColor: loading ? "#93c5fd" : "#2563eb" }}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <p style={{ fontSize: "0.875rem", color: "#6b7280", textAlign: "center", margin: 0 }}>
          Already have an account?{" "}
          <button
            onClick={goToLogin}
            style={{
              border: "none",
              background: "none",
              color: "#2563eb",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: 500,
              padding: 0,
            }}
            type="button"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

// ---------------- Styles ----------------
const inputStyle = {
  height: 44,
  padding: "0 14px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: "1rem",
  outline: "none",
  color: "#374151",
  transition: "border-color 0.2s",
} as const;

const buttonStyle = {
  height: 44,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
  cursor: "pointer",
  transition: "background-color 0.2s",
  marginTop: 24,
  marginBottom: 12,
} as const;
