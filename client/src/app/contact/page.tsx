"use client";

export default function ContactPage() {
  return (
    <main
      style={{
        maxWidth: 600,
        margin: "3rem auto",
        padding: "1rem",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <h1>Contact Us</h1>

      <p style={{ marginTop: 20, fontSize: "1.1rem" }}>
        If you have any queries, feedback, or need any kind of support,
        feel free to reach out to us.
      </p>

      <p style={{ marginTop: 15, fontSize: "1.1rem" }}>
        You can contact us anytime at:
      </p>

      <p
        style={{
          marginTop: 10,
          fontSize: "1.2rem",
          fontWeight: "bold",
          color: "#2563eb",
        }}
      >
        📧 codecoach9392@gmail.com
      </p>

      <p style={{ marginTop: 20, color: "#555" }}>
        We’ll get back to you as soon as possible.
      </p>
    </main>
  );
}
