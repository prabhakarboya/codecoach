"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import image from "../../assets/logo.png"; // Ensure this path is correct and file is in public or importable asset dir.
import { useAuth } from "../../context/AuthProvider"; // Ensure this is the right import.

export default function Header() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    setUser(null);
    router.push("/");
  };

  return (
    <header style={headerStyle}>
      <div style={logoContainerStyle}>
        <Link href="/" aria-label="Home">
          <Image
            src={image}
            alt="CodeCoach AI Logo"
            width={140}
            height={50}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>
        <h2 style={{ marginLeft: 16, color: "#2563eb", userSelect: "none" }}>
          CodeCoach AI
        </h2>
      </div>

      <nav>
        <ul style={navListStyle}>
          {!user ? (
            <>
              <li>
                <Link href="/" style={linkStyle} aria-label="Home">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/login" style={linkStyle} aria-label="Login">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" style={linkStyle} aria-label="Register">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/contact" style={linkStyle} aria-label="Contact Us">
                  Contact Us
                </Link>
              </li>
            </>
          ) : (
            <>
              <li style={greetingStyle}>
                Hello, {user.name ? user.name : "User"}
              </li>
              <li>
                <FaUserCircle
                  size={28}
                  color="#2563eb"
                  style={{ cursor: "pointer", marginRight: 16 }}
                  onClick={() => router.push("/settings/profile")}
                  title="User Profile"
                  aria-label="User Profile"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter") router.push("/settings/profile");
                  }}
                />
              </li>
              <li>
                <button
                  style={logoutButtonStyle}
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 40px",
  borderBottom: "1px solid #ddd",
  backgroundColor: "#f9fafb",
  position: "sticky",
  top: 0,
  zIndex: 100,
};

const logoContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
};

const navListStyle: React.CSSProperties = {
  display: "flex",
  listStyle: "none",
  gap: 24,
  margin: 0,
  padding: 0,
  alignItems: "center",
  fontFamily: "'Inter', sans-serif",
};

const linkStyle: React.CSSProperties = {
  fontWeight: 600,
  fontSize: "1rem",
  color: "#2563eb",
  textDecoration: "none",
};

const greetingStyle: React.CSSProperties = {
  fontWeight: 500,
  fontSize: "1rem",
  color: "#374151",
  userSelect: "none",
};

const logoutButtonStyle: React.CSSProperties = {
  padding: "5px 12px",
  cursor: "pointer",
  backgroundColor: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontWeight: 600,
};
