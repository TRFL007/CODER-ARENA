import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { API_URL } from "../config/api";

/*
Default code templates per language
*/
const CODE_TEMPLATES = {
  cpp: `#include<iostream>
using namespace std;

int main() {
    // your code here
    return 0;
}
`,
  c: `#include<stdio.h>

int main() {
    // your code here
    return 0;
}
`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // your code here
    }
}
`,
  python: `import sys
input = sys.stdin.readline

# your code here
`,
  javascript: `const lines = require('fs').readFileSync('/dev/stdin','utf8').trim().split('\\n');
// your code here
`
};

const LANGUAGE_LABELS = {
  cpp: "C++",
  c: "C",
  java: "Java",
  python: "Python",
  javascript: "JavaScript"
};

const SharedCodeEditor = ({
  problemId,
  onAccepted = () => {},
  disabled = false,
  guest = false,
  onAuthRequest = () => {}
}) => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(CODE_TEMPLATES["cpp"]);
  const [output, setOutput] = useState("");
  const [compiling, setCompiling] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /*
  Update boilerplate when language changes
  */
  useEffect(() => {
    setCode(CODE_TEMPLATES[language] || "");
    setOutput("");
  }, [language]);

  /*
  =========================
  COMPILE
  =========================
  */
  const compileCode = async () => {
    if (!code.trim()) {
      setOutput("Please write some code first.");
      return;
    }

    try {
      setCompiling(true);
      setOutput("Compiling...");

      const res = await fetch(`${API_URL}/api/code/compile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language })
      });

      const data = await res.json();

      if (data.success === false) {
        setOutput(`❌ Compilation Error:\n\n${data.error}`);
        return;
      }

      setOutput(`✅ ${data.message || "Compilation Successful"}`);
    } catch (err) {
      setOutput(`Network Error: ${err.message}`);
    } finally {
      setCompiling(false);
    }
  };

  /*
  =========================
  SUBMIT
  =========================
  */
  const submitCode = async () => {
    if (!problemId) {
      setOutput("No problem selected.");
      return;
    }

    if (!code.trim()) {
      setOutput("Please write some code first.");
      return;
    }

    try {
      setSubmitting(true);
      setOutput("Submitting...");

      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/code/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ problemId, code, language })
      });

      const data = await res.json();

      if (!res.ok) {
        setOutput(`Error: ${data.error || "Submission failed"}`);
        return;
      }

      const verdictLine = `${data.verdict || "Result"}\n\nPassed: ${
        data.passed ?? 0
      }/${data.total ?? 0}`;

      /*
      Show per-test details if available
      */
      const details =
        data.results
          ?.map(
            (r, i) =>
              `\nTest ${i + 1}: ${r.status}${
                r.status !== "Accepted"
                  ? `\n  Expected: ${r.expected}\n  Got:      ${r.output}`
                  : ""
              }`
          )
          .join("") ?? "";

      setOutput(verdictLine + details);

      if (data.verdict === "Accepted") {
        await onAccepted(data);
      }
    } catch (err) {
      setOutput(`Network Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = compiling || submitting;

  const handleCompileClick = () => {
    if (guest) {
      onAuthRequest();
      return;
    }
    compileCode();
  };

  const handleSubmitClick = () => {
    if (guest) {
      onAuthRequest();
      return;
    }
    submitCode();
  };

  return (
    <div>
      {/* CONTROLS */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-zinc-800 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
        >
          {Object.entries(LANGUAGE_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        <button
          onClick={handleCompileClick}
          disabled={isBusy}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed px-5 py-2 rounded text-sm font-medium"
        >
          {compiling ? "Compiling..." : "Compile"}
        </button>

        <button
          onClick={handleSubmitClick}
          disabled={isBusy}
          className="bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed px-5 py-2 rounded text-sm font-medium"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>

        {guest && (
          <span className="text-amber-300 text-sm self-center">
            Login to compile and submit code.
          </span>
        )}
        {disabled && (
          <span className="text-zinc-500 text-sm self-center">
            (Battle ended)
          </span>
        )}
      </div>

      {/* MONACO EDITOR */}
      <Editor
        height="450px"
        theme="vs-dark"
        language={language === "cpp" ? "cpp" : language}
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          readOnly: disabled
        }}
      />

      {/* OUTPUT */}
      <div className="mt-4 p-4 rounded border border-[#3e3e3e]/50 bg-[#141414]">
        <h3 className="font-bold mb-2 text-zinc-300 text-sm">Output</h3>

        <pre
          className={`whitespace-pre-wrap text-sm font-mono ${
            output.startsWith("❌") || output.includes("Error")
              ? "text-red-400"
              : output.startsWith("✅") || output.startsWith("Accepted")
              ? "text-green-400"
              : "text-zinc-300"
          }`}
        >
          {output || "Run or submit your code to see results here."}
        </pre>
      </div>
    </div>
  );
};

export default SharedCodeEditor;
