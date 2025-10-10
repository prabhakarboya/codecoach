import axios from "axios";
import InteractiveProblem from "../../_components/InteractiveProblem";

export const metadata = {
  title: "Problem Details - CodeCoach AI",
  description: "Practice problems and coding challenges",
};

interface TestCase {
  input: string;
  output: string;
}

interface Problem {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  testCases: TestCase[];
}

interface Props {
  params: Promise<{ id: string }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default async function ProblemPage({ params }: Props) {
  const { id } = await params;
  const res = await axios.get(`${API_BASE_URL}/problems/${id}`);
  const problem: Problem = res.data;

  if (!problem) {
    throw new Error("Problem not found");
  }

  return (
    <div style={{ display: "flex", gap: 20 }}>
      <section style={{ flex: 1, borderRight: "1px solid #ccc", paddingRight: 20, overflowY: "auto" }}>
        <h1 style={{ color: "#333" }}>{problem.title}</h1>
        <p style={{ fontSize: "1.1em" }}>{problem.description}</p>
        <p>
          <strong>Difficulty:</strong> {problem.difficulty}
        </p>
        <h3 style={{ marginTop: 20 }}>Test Cases</h3>
        {problem.testCases.map((tc, idx) => (
          <div key={idx} style={{ marginBottom: 12, backgroundColor: "#eef2f7", padding: 10, borderRadius: 5 }}>
            <p>
              <strong>Input:</strong> <code>{tc.input}</code>
            </p>
            <p>
              <strong>Output:</strong> <code>{tc.output}</code>
            </p>
          </div>
        ))}
      </section>
      <section style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "80vh" }}>
        {/* Ensure InteractiveProblem is a client component */}
        <InteractiveProblem problem={problem} />
      </section>
    </div>
  );
}
