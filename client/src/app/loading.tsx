// src/app/loading.tsx
"use client";

export default function Loading() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "1.5rem",
      }}
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      Loading...
    </div>
  );
}
