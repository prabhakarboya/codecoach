"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider"; // Adjust path to your AuthProvider
import SettingsPage from "./settings/page";

export default function HomePage() {
  const { user } = useAuth();
  const [view, setView] = useState<"home" | "problems">("home");

  useEffect(() => {
    setView("home");  // Reset view to home on mount
  }, []);

  if (!user) {
    // Public view with only app info text without buttons
    return (
      <main
        style={{
          maxWidth: 800,
          margin: "2rem auto",
          padding: "0 1rem",
          fontFamily: "Arial, sans-serif"
        }}
      >
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "1rem",
            textAlign: "center"
          }}
        >
          Welcome to CodeCoach
        </h1>
        <p>
          CodeCoach is an innovative web application designed to help
          developers improve their coding skills through hands-on problem
          solving, interactive feedback, and community collaboration.
        </p>
        <p>
          Whether you are a beginner looking to learn programming fundamentals
          or an experienced developer aiming to polish your skills, CodeCoach
          offers a wide range of coding challenges tailored to different skill
          levels and programming languages.
        </p>
        <p>Key features include:</p>
        <ul>
          <li>
            Practice coding problems classified by difficulty: easy, medium,
            and hard.
          </li>
          <li>
            Submit your solutions and get instant feedback based on real test
            cases.
          </li>
          <li>View detailed explanations and hints to understand tricky problems.</li>
          <li>
            Engage with other developers by sharing solutions and discussing
            strategies.
          </li>
          <li>Track your progress and receive personalized recommendations.</li>
        </ul>
        <p>
          Join the CodeCoach community and start your journey to becoming a
          better coder today!
        </p>
        <p
          style={{
            fontStyle: "italic",
            marginTop: "2rem",
            textAlign: "center"
          }}
        >
          "CodeCoach - Your personal coding mentor at your fingertips."
        </p>
      </main>
    );
  }

  // Logged in user view with navigation buttons
  return (
    <div>
      <header
        style={{
          padding: 20,
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>Welcome, {user.name}</div>
        <nav>
          <button
            onClick={() => setView("home")}
            style={view === "home" ? activeButtonStyle : buttonStyle}
          >
            Home
          </button>
          <button
            onClick={() => setView("problems")}
            style={view === "problems" ? activeButtonStyle : buttonStyle}
          >
            Problems
          </button>
        </nav>
      </header>

      <main style={{ padding: "1rem", maxWidth: 900, margin: "auto" }}>
        {view === "home" && (
          <>
            <h2>Welcome to CodeCoach</h2>
            <p>
              CodeCoach is an innovative web application designed to help
              developers improve their coding skills through hands-on problem
              solving, interactive feedback, and community collaboration.
            </p>
            <p>
              Whether you are a beginner looking to learn programming
              fundamentals or an experienced developer aiming to polish your
              skills, CodeCoach offers a wide range of coding challenges
              tailored to different skill levels and programming languages.
            </p>
            <p>Key features include:</p>
            <ul>
              <li>
                Practice coding problems classified by difficulty: easy, medium,
                and hard.
              </li>
              <li>
                Submit your solutions and get instant feedback based on real
                test cases.
              </li>
              <li>
                View detailed explanations and hints to understand tricky
                problems.
              </li>
              <li>
                Engage with other developers by sharing solutions and discussing
                strategies.
              </li>
              <li>
                Track your progress and receive personalized recommendations.
              </li>
            </ul>
            <p>
              Join the CodeCoach community and start your journey to becoming a
              better coder today!
            </p>
            <p
              style={{
                fontStyle: "italic",
                marginTop: "2rem",
                textAlign: "center"
              }}
            >
              "CodeCoach - Your personal coding mentor at your fingertips."
            </p>
          </>
        )}
        {view === "problems" && <SettingsPage />}
      </main>
    </div>
  );
}


const buttonStyle: React.CSSProperties = {
  padding: "8px 16px",
  marginLeft: 8,
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  backgroundColor: "#cbd5e1",
  color: "#000",
};

const activeButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  backgroundColor: "#3b82f6",
  color: "#fff",
};
