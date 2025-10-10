"use client";

import React from "react";

const Footer: React.FC = () => {
  const footerStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "20px 0",
    backgroundColor: "#eef2ff", // subtle light indigo background
    marginTop: "40px",
    fontSize: "0.9em",
    color: "#4b5563", // cool gray text color
    fontFamily: "'Inter', sans-serif",
    borderTop: "1px solid #c7d2fe", // subtle border for separation
  };

  return (
    <footer style={footerStyle} aria-label="Site Footer">
      <p>© {new Date().getFullYear()} CodeCoach AI. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
