"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingProblem, setAddingProblem] = useState(false);
  const [error, setError] = useState("");

  // Form states for admin
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("Medium");
  const [testCases, setTestCases] = useState([{ input: "", output: "" }]);

  // Admin view toggle
  const [adminView, setAdminView] = useState<"add" | "solve">("solve");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    }
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/problems`);
      setProblems(res.data);
    } catch {
      setError("Could not load problems");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProblem = async () => {
    if (
      !newTitle.trim() ||
      !newDescription.trim() ||
      testCases.length === 0 ||
      testCases.some((tc) => !tc.input.trim() || !tc.output.trim())
    ) {
      setError(
        "Please fill all input fields and add at least one complete test case"
      );
      return;
    }

    setError("");
    setAddingProblem(true);

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_BASE_URL}/problems/add`,
        {
          title: newTitle,
          description: newDescription,
          difficulty: newDifficulty,
          addedBy: user._id,
          testCases,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewTitle("");
      setNewDescription("");
      setNewDifficulty("Medium");
      setTestCases([{ input: "", output: "" }]);
      setAdminView("solve");
      fetchProblems();
    } catch (err: any) {
      console.error("Add problem error:", err.response?.data || err.message);
      setError(
        "Failed to add problem: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setAddingProblem(false);
    }
  };

  const addTestCase = () =>
    setTestCases([...testCases, { input: "", output: "" }]);
  const removeTestCase = (idx: number) =>
    setTestCases(testCases.filter((_, i) => i !== idx));
  const handleTestCaseChange = (
    idx: number,
    field: "input" | "output",
    val: string
  ) => {
    const updated = [...testCases];
    updated[idx][field] = val;
    setTestCases(updated);
  };
  const handleSolve = (id: string) => router.push(`/problem/${id}`);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 40, fontSize: 18, color: "#aaa" }}>
        Loading problems...
      </p>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#e0e0e0",
        padding: 20,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: user?.role === "admin" ? "row" : "column",
          gap: 20,
        }}
      >
        {user?.role === "admin" && (
          <aside
            style={{
              flex: "0 0 280px",
              background: "linear-gradient(180deg, #0f172a, #334155)",
              color: "#ffffff",
              padding: 30,
              borderRadius: 20,
              display: "flex",
              flexDirection: "column",
              gap: 15,
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            <button
              onClick={() => setAdminView("add")}
              style={{
                padding: 14,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                backgroundColor: adminView === "add" ? "#2563eb" : "#94a3b8",
                color: adminView === "add" ? "#fff" : "#1e293b",
                transition: "background-color 0.25s ease",
                fontWeight: "700",
                fontSize: 18,
              }}
            >
              Add Problem
            </button>
            <button
              onClick={() => setAdminView("solve")}
              style={{
                padding: 14,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                backgroundColor: adminView === "solve" ? "#2563eb" : "#94a3b8",
                color: adminView === "solve" ? "#fff" : "#1e293b",
                transition: "background-color 0.25s ease",
                fontWeight: "700",
                fontSize: 18,
              }}
            >
              Solve Problems
            </button>
          </aside>
        )}

        <section
          style={{
            flex: 1,
            backgroundColor: "#1e293b",
            borderRadius: 20,
            padding: 40,
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.8)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {user?.role === "admin" && adminView === "add" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddProblem();
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h2
                style={{
                  color: "#60a5fa",
                  marginBottom: 28,
                  fontWeight: "bold",
                  fontSize: 28,
                }}
              >
                Add New Problem
              </h2>

              {error && (
                <p
                  style={{
                    color: "#f87171",
                    marginBottom: 24,
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  {error}
                </p>
              )}

              <input
                type="text"
                placeholder="Problem Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={darkInputStyle}
              />
              <textarea
                placeholder="Problem Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                style={{ ...darkInputStyle, height: 140 }}
              />
              <select
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value)}
                style={darkInputStyle}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <h3
                style={{
                  marginTop: 36,
                  marginBottom: 16,
                  color: "#60a5fa",
                  fontWeight: "700",
                  fontSize: 22,
                }}
              >
                Test Cases
              </h3>
              {testCases.map((tc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: 12,
                    marginBottom: 18,
                  }}
                >
                  <input
                    placeholder="Input"
                    value={tc.input}
                    onChange={(e) =>
                      handleTestCaseChange(idx, "input", e.target.value)
                    }
                    style={{ ...darkInputStyle, flex: 1 }}
                  />
                  <input
                    placeholder="Output"
                    value={tc.output}
                    onChange={(e) =>
                      handleTestCaseChange(idx, "output", e.target.value)
                    }
                    style={{ ...darkInputStyle, flex: 1 }}
                  />
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(idx)}
                      style={darkRemoveButtonStyle}
                      title="Remove this test case"
                    >
                      &times;
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addTestCase}
                style={darkAddButtonStyle}
              >
                + Add Test Case
              </button>

              <button
                type="submit"
                disabled={addingProblem}
                style={{
                  ...darkSubmitButtonStyle,
                  opacity: addingProblem ? 0.6 : 1,
                  cursor: addingProblem ? "not-allowed" : "pointer",
                  marginTop: "auto",
                }}
              >
                {addingProblem ? "Adding..." : "Submit Problem"}
              </button>
            </form>
          ) : (
            <ProblemsList problems={problems} onSolve={handleSolve} />
          )}
        </section>
      </main>
    </div>
  );
}

function ProblemsList({
  problems,
  onSolve,
}: {
  problems: any[];
  onSolve: (id: string) => void;
}) {
  return (
    <>
      <h2
        style={{
          color: "#60a5fa",
          marginBottom: 24,
          fontWeight: "bold",
          fontSize: 26,
        }}
      >
        Available Problems
      </h2>
      {problems.length === 0 ? (
        <p style={{ fontSize: 18, fontWeight: "500", color: "#aaa" }}>
          No problems available.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {problems.map((p) => (
            <article
              key={p._id}
              style={{
                backgroundColor: "#284b63",
                borderRadius: 16,
                padding: 24,
                color: "#def2f1",
                boxShadow:
                  "0 3px 18px rgba(0, 0, 0, 0.25)",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onClick={() => onSolve(p._id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0 6px 28px rgba(0,0,0,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 3px 18px rgba(0, 0, 0, 0.25)";
              }}
            >
              <h4
                style={{
                  marginBottom: 16,
                  fontWeight: "600",
                  fontSize: 22,
                  textShadow: "0px 1px 3px rgba(0,0,0,0.7)",
                }}
              >
                {p.title}
              </h4>
              <p style={{ flex: 1, marginBottom: 16, fontSize: 16 }}>
                {p.description}
              </p>
              <p
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  color:
                    p.difficulty === "Easy"
                      ? "#2dd36f"
                      : p.difficulty === "Medium"
                      ? "#f3a53d"
                      : "#f44336",
                }}
              >
                Difficulty: {p.difficulty}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSolve(p._id);
                }}
                style={{
                  marginTop: "auto",
                  backgroundColor: "#0277bd",
                  color: "#fff",
                  border: "none",
                  padding: "10px 14px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: 16,
                  transition: "background-color 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#014f86";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#0277bd";
                }}
              >
                Solve
              </button>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

const darkInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #3a5068",
  backgroundColor: "#1b262c",
  color: "#def2f1",
  marginBottom: 16,
  fontSize: 16,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  boxShadow: "inset 0 1px 3px rgb(0 0 0 / 0.6)",
  transition: "border-color 0.3s ease",
};

const darkRemoveButtonStyle: React.CSSProperties = {
  backgroundColor: "#d72631",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  padding: "8px 14px",
  fontWeight: "700",
  fontSize: 22,
  lineHeight: "22px",
  alignSelf: "center",
  userSelect: "none",
  transition: "background-color 0.3s ease",
};

const darkAddButtonStyle: React.CSSProperties = {
  ...darkRemoveButtonStyle,
  backgroundColor: "#45aaf2",
  fontSize: 18,
  padding: "12px 16px",
  fontWeight: "600",
  marginBottom: 24,
};

const darkSubmitButtonStyle: React.CSSProperties = {
  backgroundColor: "#45aaf2",
  color: "white",
  padding: "14px 24px",
  borderRadius: 16,
  fontWeight: "700",
  fontSize: 18,
  marginTop: 36,
  transition: "opacity 0.3s ease",
  cursor: "pointer",
};
