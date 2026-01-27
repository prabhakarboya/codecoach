"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

declare global {
  interface Window {
    puter: any;
  }
}

export default function FeedbackPage() {
  const params = useParams();
  const id = params?.id;

  const [feedback, setFeedback] = useState("");
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [evaluation, setEvaluation] = useState("");
  const [loading, setLoading] = useState(false);
  const [puterLoaded, setPuterLoaded] = useState(false);

  // Load Puter.js script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    script.onload = () => setPuterLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Fetch feedback function wrapped in useCallback to avoid useEffect warning
  const fetchFeedback = useCallback(
    async (title: string, description: string, code: string) => {
      if (!puterLoaded || !window.puter) return;

      setLoading(true);
      try {
        const prompt = `
You are an expert coding interviewer AI.
Evaluate the user's code submission and give detailed feedback.
Then, generate 7-8 follow-up interview questions based on the code submitted.
Include code snippets if question requires them.

Problem Title: ${title}
Problem Description: ${description}
Submitted Code:
${code}

Format your response clearly:
<FEEDBACK>
Your feedback here.

Follow-up Questions:
1. First question
2. Second question
...
`;

        const response = await window.puter.ai.chat(prompt, { model: "gpt-5-nano" });

        let text = "";
        if (typeof response === "string") {
          text = response;
        } else if (response?.message?.content) {
          text = response.message.content;
        }

        // Parse feedback and questions
        const splitIndex = text.indexOf("Follow-up Questions:");
        if (splitIndex === -1) {
          setFeedback(text.trim());
          setFollowUps([]);
        } else {
          const feedbackText = text
            .substring(0, splitIndex)
            .replace(/<FEEDBACK>/gi, "")
            .trim();
          const questionsText = text
            .substring(splitIndex + "Follow-up Questions:".length)
            .trim();

          setFeedback(feedbackText);

          const questions = questionsText
            .split(/\n\d+\.\s+/)
            .filter((q) => q.trim() !== "");
          setFollowUps(questions.slice(0, 8));
        }
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setFeedback("Error fetching feedback. Please try again.");
        setFollowUps([]);
      }
      setLoading(false);
    },
    [puterLoaded]
  );

  // Run fetchFeedback when id or puterLoaded changes
  useEffect(() => {
    if (id && puterLoaded) {
      const code = localStorage.getItem("submittedCode") || "";
      const title = localStorage.getItem("problemTitle") || "";
      const description = localStorage.getItem("problemDescription") || "";
      fetchFeedback(title, description, code);
    }
  }, [id, puterLoaded, fetchFeedback]);

  const handleAnswerChange = (index: number, value: string) => {
    setAnswers({ ...answers, [index]: value });
  };

  const submitAnswers = async () => {
    if (!puterLoaded || !window.puter) return;

    try {
      const joinedAnswers = followUps
        .map((q, i) => `Q: ${q}\nA: ${answers[i] || "Not answered"}`)
        .join("\n\n");

      const evalPrompt = `
Evaluate the user's answers to your follow-up questions.
Provide constructive feedback and a short score (out of 10).
Do not include any instructions, extra text, or conversational language.
Focus on clarity, precision, and usefulness of each answer. If answer is wrong or not answered, give simple and correct solution for each question.
${joinedAnswers}
`;

      const result = await window.puter.ai.chat(evalPrompt, { model: "gpt-5-nano" });

      let evalText = "";
      if (typeof result === "string") evalText = result;
      else if (result?.message?.content) evalText = result.message.content;

      setEvaluation(evalText);
    } catch (err) {
      console.error("Error evaluating answers:", err);
      setEvaluation("Error evaluating answers. Try again.");
    }
  };

  if (!puterLoaded)
    return (
      <p style={{ fontStyle: "italic", color: "#666" }}>Loading AI engine...</p>
    );
  if (loading)
    return <p style={{ fontStyle: "italic", color: "#666" }}>Loading feedback...</p>;

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "auto",
        padding: 20,
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        color: "#222",
      }}
    >
      <h2
        style={{
          borderBottom: "2px solid #0070f3",
          paddingBottom: 8,
        }}
      >
        Feedback
      </h2>
      <pre
        style={{
          backgroundColor: "#f9f9f9",
          padding: 15,
          borderRadius: 6,
          whiteSpace: "pre-wrap",
          lineHeight: 1.5,
          overflowWrap: "break-word",
          border: "1px solid #ccc",
          boxShadow: "inset 0 0 5px #eee",
          maxHeight: 180,
          overflowY: "auto",
        }}
      >
        {feedback}
      </pre>

      <h3
        style={{
          marginTop: 30,
          borderBottom: "1px solid #ddd",
          paddingBottom: 6,
        }}
      >
        Follow-up Questions
      </h3>
      {followUps.length === 0 && <p>No follow-up questions generated.</p>}

      {followUps.map((q, i) => (
        <div
          key={i}
          style={{
            marginBottom: 24,
            borderRadius: 8,
            border: "1px solid #a0d8f7",
            backgroundColor: "#cfe5ff",
            padding: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            wordWrap: "break-word",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontWeight: "700",
              fontSize: "1rem",
              color: "#0b3d91",
              marginBottom: 12,
              wordBreak: "break-word",
            }}
            title={q}
          >
            {i + 1}. {q}
          </div>
          <textarea
            rows={5}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "2px solid #80b4ff",
              fontSize: "1rem",
              fontFamily: "Consolas, monospace",
              backgroundColor: "#ebf3ff",
              color: "#1a1a1a",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.08)",
              resize: "vertical",
              minHeight: 90,
              boxSizing: "border-box",
            }}
            value={answers[i] || ""}
            onChange={(e) => handleAnswerChange(i, e.target.value)}
            placeholder="Type your answer here..."
          />
        </div>
      ))}

      {followUps.length > 0 && (
        <button
          onClick={submitAnswers}
          style={{
            backgroundColor: "#005cd1",
            color: "#fff",
            border: "none",
            padding: "14px 28px",
            borderRadius: 10,
            cursor: "pointer",
            fontSize: "1.1rem",
            fontWeight: "700",
            marginTop: 10,
            boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
            transition: "background-color 0.3s ease",
            width: "100%",
            maxWidth: 320,
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0044a3")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#005cd1")}
          aria-label="Submit your follow-up answers"
        >
          Submit Answers
        </button>
      )}

      {evaluation && (
        <div
          style={{
            marginTop: 30,
            backgroundColor: "#f0f4ff",
            padding: 20,
            borderRadius: 10,
            color: "#1a237e",
            whiteSpace: "pre-wrap",
            fontFamily: "Consolas, monospace",
            fontSize: "1rem",
            maxWidth: "90vw",
            maxHeight: "60vh",
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            border: "1px solid #a0b9ff",
            wordBreak: "break-word",
          }}
          aria-label="Evaluation of user answers"
        >
          <strong>Evaluation:</strong>
          <pre style={{ marginTop: 10 }}>{evaluation}</pre>
        </div>
      )}
    </div>
  );
}
