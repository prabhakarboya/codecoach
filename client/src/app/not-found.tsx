import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "20px" }}>404 - Page Not Found</h1>
      <p style={{ fontSize: "1.25rem", marginBottom: "40px" }}>
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "#fff",
          borderRadius: "5px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Go Home
      </Link>
    </main>
  );
}
