import Header from "../_components/Header";
import Footer from "../_components/Footer";

export const metadata = {
  title: "Problem Section - CodeCoach AI",
  description: "Practice and solve DSA problems with CodeCoach AI",
};

export default function ProblemLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
     
      <main
        style={{
          padding: "40px 24px",
          background: "linear-gradient(to bottom right, #84fab0, #8fd3f4)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          color: "#0f1c2e",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          borderRadius: "16px 16px 0 0",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {children}
      </main>
   
    </>
  );
}
