import { useState, useRef } from "react";
import { SUPPORTED_LANGUAGES, GROQ_API_KEY, GROQ_API_URL, SYSTEM_PROMPT, buildPrompt, saveToHistory } from "./utils.js";
import { Spinner, toast } from "./components.jsx";
import Results from "./Results.jsx";
import Card from "./components/Card.jsx";

const LOADING_MESSAGES = [
  "Parsing your code...",
  "Detecting patterns...",
  "Computing complexity...",
  "Building suggestions...",
  "Finalizing..."
];

export default function AnalyzerTab() {
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState("");
  const [language, setLanguage] = useState("Python");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");
  
  const loadingIntervalRef = useRef(null);

  async function analyzeCode() {
    if (!code.trim()) {
      setError("Please paste your solution first");
      return;
    }
    
    if (!GROQ_API_KEY) {
      setError("API key not configured. Check your .env file");
      return;
    }

    setError("");
    setIsAnalyzing(true);
    setAnalysis(null);

    let step = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);
    loadingIntervalRef.current = setInterval(() => {
      step = (step + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[step]);
    }, 900);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 2000,
          temperature: 0.2,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildPrompt(language, problem, code) }
          ]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `API error: ${response.status}`);
      }

      const content = data.choices?.[0]?.message?.content || "";
      // Clean up markdown code blocks if present
      const jsonText = content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(jsonText);
      
      setAnalysis(parsed);
      saveToHistory({ language, problem, code, analysis: parsed });
      toast("Analysis complete!");
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err.message || "Failed to analyze code");
    } finally {
      clearInterval(loadingIntervalRef.current);
      setIsAnalyzing(false);
    }
  }

  function clearForm() {
    setCode("");
    setProblem("");
    setAnalysis(null);
    setError("");
  }

  const lineCount = code ? code.split("\n").length : 0;
  const canAnalyze = code.trim().length > 0;

  return (
    <div className="analyzer-container">
      <Card title="Problem Context" extra={<span className="text-muted">optional</span>}>
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Paste problem title or description..."
          className="glass-textarea"
          style={{ minHeight: 68 }}
        />
      </Card>

      <Card 
        title="Your Solution"
        extra={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="lang-selector"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            {code && (
              <button onClick={clearForm} className="clear-btn">
                clear
              </button>
            )}
          </div>
        }
      >
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          placeholder={`Paste your ${language} solution here...`}
          className="code-textarea"
        />
        {code && (
          <div className="code-stats">
            <span>{lineCount} lines</span>
            <span>{code.length} chars</span>
          </div>
        )}
      </Card>

      <button
        className={`analyze-btn ${isAnalyzing ? 'loading' : ''} ${!canAnalyze ? 'disabled' : ''}`}
        onClick={analyzeCode}
        disabled={isAnalyzing || !canAnalyze}
      >
        <div className="analyze-btn-content">
          {isAnalyzing ? (
            <>
              <Spinner size={16} />
              <span>{loadingMessage}</span>
            </>
          ) : (
            <>
              <span>⚡</span>
              <span>Analyze Code</span>
            </>
          )}
        </div>
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {analysis && <Results analysis={analysis} />}
    </div>
  );
}
