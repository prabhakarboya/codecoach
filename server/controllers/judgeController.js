import { exec } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

const RUN_TIMEOUT = 5000; // Timeout in ms

const languageConfig = {
  python: { ext: ".py", image: "python:3.10-alpine", cmd: (file) => `python ${file}` },
  javascript: { ext: ".js", image: "node:18-alpine", cmd: (file) => `node ${file}` },
  c: { ext: ".c", image: "gcc:latest", cmd: (file, output) => `gcc ${file} -o ${output} && ./${output}` },
  cpp: { ext: ".cpp", image: "gcc:latest", cmd: (file, output) => `g++ ${file} -o ${output} && ./${output}` },
  java: { ext: ".java", image: "openjdk:17-alpine", cmd: (file, output) => `javac ${file} && java ${output}` },
};

export async function runCode(req, res) {
  const { code, language, testCases } = req.body;

  if (!code || !language || !testCases?.length) {
    return res.status(400).json({ message: "Code, language, and testCases are required" });
  }

  const lang = language.toLowerCase();
  if (!languageConfig[lang]) {
    return res.status(400).json({ message: `Unsupported language: ${lang}` });
  }

  const results = [];
  const tmpDirBase = path.join(os.tmpdir(), "code_submissions");

  if (!fs.existsSync(tmpDirBase)) fs.mkdirSync(tmpDirBase, { recursive: true });

  for (const tc of testCases) {
    const id = uuidv4();
    const ext = languageConfig[lang].ext;

    // Use fixed filename for Java: 'Solution.java' to match class name
    const codeFileHost = path.resolve(tmpDirBase, lang === "java" ? `Solution${ext}` : `${id}${ext}`);
    const inputFileHost = path.resolve(tmpDirBase, `${id}.in`);
    const outputFileHost = path.resolve(tmpDirBase, `${id}.out`);
    const execOutput = path.resolve(tmpDirBase, `${id}.exe`); // for C/C++

    try {
      // Write code and input files
      fs.writeFileSync(codeFileHost, code);
      fs.writeFileSync(inputFileHost, tc.input);

      const image = languageConfig[lang].image;
      let cmd;

      if (lang === "c" || lang === "cpp") {
        cmd = `docker run --rm -v ${tmpDirBase}:/app -w /app --network none ${image} sh -c "timeout ${RUN_TIMEOUT / 1000}s sh -c '${languageConfig[lang].cmd(path.basename(codeFileHost), path.basename(execOutput))} < ${path.basename(inputFileHost)} > ${path.basename(outputFileHost)} 2>&1'"`;
      } else if (lang === "java") {
        const className = "Solution"; // fixed classname
        cmd = `docker run --rm -v ${tmpDirBase}:/app -w /app --network none ${image} sh -c "timeout ${RUN_TIMEOUT / 1000}s sh -c 'javac ${className}${ext} && java ${className} < ${path.basename(inputFileHost)} > ${path.basename(outputFileHost)} 2>&1'"`;
      } else {
        cmd = `docker run --rm -v ${tmpDirBase}:/app -w /app --network none ${image} sh -c "timeout ${RUN_TIMEOUT / 1000}s sh -c '${languageConfig[lang].cmd(path.basename(codeFileHost))} < ${path.basename(inputFileHost)} > ${path.basename(outputFileHost)} 2>&1'"`;
      }

      await new Promise((resolve) => {
        exec(cmd, (error, stdout, stderr) => {
          let output = "";
          try {
            output = fs.existsSync(outputFileHost) ? fs.readFileSync(outputFileHost, "utf8") : (stderr || stdout);
          } catch {
            output = stderr || stdout || "";
          }

          // Cleanup temp files
          [codeFileHost, inputFileHost, outputFileHost, execOutput].forEach((file) => {
            try {
              if (fs.existsSync(file)) fs.unlinkSync(file);
            } catch {}
          });

          if (error) {
            results.push({
              input: tc.input,
              expected: tc.output,
              output: output.trim(),
              error: output.trim(),
              status: "Error",
            });
          } else {
            results.push({
              input: tc.input,
              expected: tc.output,
              output: output.trim(),
              error: null,
              status: "Passed",
            });
          }
          resolve();
        });
      });
    } catch (err) {
      results.push({
        input: tc.input,
        expected: tc.output,
        output: "",
        error: "Execution failed",
        status: "Error",
      });
    }
  }

  const success = results.every((r) => r.status === "Passed");
  res.json({ success, results });
}
