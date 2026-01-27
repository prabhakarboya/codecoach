"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type * as monaco from "monaco-editor";
import { useMonaco } from "@monaco-editor/react";

// Dynamically import the Monaco editor to avoid SSR issues
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface TestCaseResult {
  input: string;
  expected: string;
  output: string;
  error?: string;
  status?: string;
  line?: number;
  column?: number;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  testCases: any[];
}

interface Props {
  problem: Problem;
}

export default function InteractiveProblem({ problem }: Props) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoInstance = useMonaco();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState<TestCaseResult[]>([]);
  const [loadingRun, setLoadingRun] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  // Starter template code for languages
  useEffect(() => {
    switch (language) {
      case "python":
        setCode(`# Write your Python code here\n`);
        break;
      case "cpp":
        setCode("// Write your C++ code here\n");
        break;
      case "c":
        setCode("// Write your C code here\n");
        break;
      case "java":
        setCode("// Write your Java code here\n");
        break;
      case "javascript":
        setCode("// Write your JS code here\n");
        break;
      default:
        setCode("// Write your code here\n");
    }
  }, [language]);

  // Set Monaco editor error markers based on output errors
  useEffect(() => {
    if (!editorRef.current || !monacoInstance) return;
    const model = editorRef.current.getModel();
    if (!model) return;

    const markers: monaco.editor.IMarkerData[] = output
      .filter((res) => !!res.error)
      .map((res) => ({
        severity: monacoInstance.MarkerSeverity.Error,
        message: res.error || "Error",
        startLineNumber: res.line ?? 1,
        startColumn: res.column ?? 1,
        endLineNumber: res.line ?? 1,
        endColumn: (res.column ?? 1) + 1,
      }));

    monacoInstance.editor.setModelMarkers(model, "owner", markers);
  }, [output, monacoInstance]);

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const handleRun = async () => {
    if (!problem || !code.trim()) return;
    setLoadingRun(true);
    try {
      const response = await fetch("`${process.env.NEXT_PUBLIC_API_URL}/judge/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, testCases: problem.testCases }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      setOutput(data.results || []);
      setShowLearnMore(!!data.success);
    } catch (err: any) {
      setOutput([
        {
          input: "",
          expected: "",
          output: "",
          error: err?.message || "Unknown error",
          status: "Error",
          line: 1,
          column: 1,
        },
      ]);
      setShowLearnMore(false);
    }
    setLoadingRun(false);
  };

  const handleSubmit = () => {
    if (!problem || !code.trim()) return;
    setLoadingSubmit(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("submittedCode", code);
      localStorage.setItem("problemId", problem._id);
      localStorage.setItem("problemTitle", problem.title);
      localStorage.setItem("problemDescription", problem.description);
      window.location.href = `/feedback/${problem._id}`;
    }
    setLoadingSubmit(false);
  };

  return (
    <>
      {/* Language selector */}
      <div
        style={{
          marginBottom: 10,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <label htmlFor="language" style={{ fontWeight: "bold" }}>
          Language:
        </label>
        <select
          id="language"
          aria-label="Select programming language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            padding: "5px 10px",
            borderRadius: 5,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="350px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(val) => setCode(val || "")}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
        loading={<p>Loading Editor...</p>}
      />

      {/* Buttons */}
      <div
        style={{ marginTop: 15, display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        <button
          onClick={handleRun}
          disabled={loadingRun || !code.trim()}
          aria-label="Run Test Cases"
          style={{
            padding: "10px 22px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loadingRun || !code.trim() ? "not-allowed" : "pointer",
            fontWeight: "bold",
            flex: 1,
          }}
        >
          {loadingRun ? "Running..." : "Run"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={loadingSubmit || !code.trim()}
          aria-label="Submit Solution"
          style={{
            padding: "10px 22px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loadingSubmit || !code.trim() ? "not-allowed" : "pointer",
            fontWeight: "bold",
            flex: 1,
          }}
        >
          {loadingSubmit ? "Submitting..." : "Submit"}
        </button>

        {showLearnMore && (
          <button
            onClick={() => (window.location.href = `/feedback/${problem._id}`)}
            style={{
              padding: "10px 22px",
              backgroundColor: "#fd7e14",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
              flex: 1,
            }}
            aria-label="Learn More"
          >
            Learn More
          </button>
        )}
      </div>

      {/* Output console */}
      <div
        style={{
          marginTop: 20,
          backgroundColor: "#1e1e1e",
          color: "#d4d4d4",
          padding: 15,
          borderRadius: 6,
          minHeight: 150,
          maxHeight: 300,
          overflowY: "auto",
          fontFamily: "'Courier New', Courier, monospace",
          whiteSpace: "pre-wrap",
        }}
        aria-live="polite"
      >
        {output.length === 0 && <p>No output yet</p>}
        {output.map((res, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <p>
              <strong>Input:</strong> <code>{res.input}</code>
            </p>
            <p>
              <strong>Expected:</strong> <code>{res.expected}</code>
            </p>
            <p>
              <strong>Output:</strong> <code>{res.output}</code>
            </p>
            {res.error && (
              <p style={{ color: "#ff6b6b" }}>
                <strong>Error:</strong> {res.error}
              </p>
            )}
            <p>
              <strong>Status:</strong> {res.status}
            </p>
            <hr style={{ borderColor: "#555" }} />
          </div>
        ))}
      </div>
    </>
  );
}
