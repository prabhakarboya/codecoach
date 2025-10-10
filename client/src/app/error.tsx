"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service or console
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "tomato",
        color: "white",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      role="alert"
    >
      <h2>Something went wrong!</h2>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          maxWidth: "600px",
          backgroundColor: "#cc4b39",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "20px",
          width: "100%",
          overflowX: "auto",
        }}
      >
        {error.message}
      </pre>
      <button
        onClick={() => reset()}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#fff",
          color: "tomato",
          fontWeight: "bold",
        }}
      >
        Try again
      </button>
    </div>
  );
}
