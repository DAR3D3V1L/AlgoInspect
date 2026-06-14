import { useState, useRef } from "react";

const LANGS = ["Python", "Java", "C++", "JavaScript", "TypeScript", "Go", "Rust", "C", "C#", "Swift", "Kotlin"];

const getRatingColor = (r) => r >= 8 ? "#3fb950" : r >= 5 ? "#d29922" : "#f85149";
const getRatingLabel = (r) => r >= 8 ? "Optimal" : r >= 5 ? "Good" : "Suboptimal";

export default function LeetCodeAnalyzer() {
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState("");
  const [lang, setLang] = useState("Python");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  async function analyze() {
    if (!code.trim()) { setError("Paste your solution first."); return; }
    setError(""); setLoading(true); setAnalysis(null);

    const systemPrompt = `You are an expert competitive programmer specializing in LeetCode. Analyze the code solution precisely.

Return ONLY valid JSON (no markdown, no extra text):
{
  "time_complexity": "O(...)",
  "time_complexity_note": "one sentence",
  "space_complexity": "O(...)",
  "space_complexity_note": "one sentence",
  "efficiency_rating": <1-10 integer>,
  "approach_name": "Short name (e.g. Hash Map, Sliding Window, DP)",
  "approach_explanation": "3-5 sentences explaining the algorithm",
  "data_structures": ["list"],
  "algorithm_paradigm": "e.g. Greedy / Two Pointers / BFS / DP",
  "optimizations": ["2-4 specific suggestions"],
  "can_be_optimal": true/false,
  "optimal_tc": "O(...) if better possible, else same",
  "edge_cases": ["3-5 edge cases"],
  "code_quality": "Good / Acceptable / Needs Improvement",
  "code_quality_notes": "one sentence on readability"
}`;

    try {
      // Uses the Netlify proxy function in production, Vite dev proxy locally.
      // The API key is kept server-side and never exposed to the client.
      const resp = await fetch("/api/groq/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 2000,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Language: ${lang}\n${problem ? `Problem: ${problem}\n` : ""}Code:\n\`\`\`${lang}\n${code}\n\`\`\`` }
          ]
        })
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError("API Error: " + (data.error?.message || resp.statusText));
        return;
      }
      const text = data.choices?.[0]?.message?.content || "";
      const clean = text.replace(/```json|```/g, "").trim();
      setAnalysis(JSON.parse(clean));
    } catch (e) {
      setError("Analysis failed: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "#0d1117", minHeight: "100vh", padding: "0", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#e6edf3" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}>
          <div style={{ width: 40, height: 40, background: "#f0a500", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: "#0d1117", flexShrink: 0 }}>LC</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" }}>LeetCode Code Analyzer</div>
            <div style={{ fontSize: 11, color: "#7d8590", fontFamily: "monospace", marginTop: 2 }}>// TC · SC · Approach · Optimizations · Edge Cases</div>
          </div>
        </div>

        {/* Problem input */}
        <Panel title="Problem Context" extra={<span style={{ fontSize: 11, color: "#484f58", fontFamily: "monospace" }}>optional</span>}>
          <textarea
            value={problem}
            onChange={e => setProblem(e.target.value)}
            placeholder="Paste problem title or description (e.g. 'Two Sum – find indices of two numbers that add to target')..."
            style={{ width: "100%", minHeight: 70, background: "#0d1117", color: "#e6edf3", border: "none", outline: "none", fontFamily: "inherit", fontSize: 13, lineHeight: 1.7, padding: "14px 16px", resize: "vertical" }}
          />
        </Panel>

        {/* Code input */}
        <div style={{ marginTop: "1rem" }}>
          <Panel title="Your Solution" extra={
            <select value={lang} onChange={e => setLang(e.target.value)}
              style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, color: "#e6edf3", fontFamily: "monospace", fontSize: 11, padding: "4px 8px", cursor: "pointer", outline: "none" }}>
              {LANGS.map(l => <option key={l}>{l}</option>)}
            </select>
          }>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              placeholder={`# Paste your ${lang} solution here...`}
              style={{ width: "100%", minHeight: 220, background: "#0d1117", color: "#e6edf3", border: "none", outline: "none", fontFamily: "monospace", fontSize: 13, lineHeight: 1.7, padding: "16px", resize: "vertical" }}
            />
          </Panel>
        </div>

        {/* Button */}
        <button onClick={analyze} disabled={loading}
          style={{ width: "100%", padding: 13, marginTop: "1rem", marginBottom: "1.5rem", background: loading ? "#484f58" : "#f0a500", color: loading ? "#7d8590" : "#0d1117", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
          {loading ? <><Spinner /> Analyzing…</> : <>⚡ Analyze Code</>}
        </button>

        {error && <div style={{ background: "#1a0d0d", border: "1px solid #4a1919", borderRadius: 10, padding: "12px 16px", color: "#f85149", fontFamily: "monospace", fontSize: 12, marginBottom: "1rem" }}>// {error}</div>}

        {/* Results */}
        {analysis && <Results a={analysis} />}
      </div>
    </div>
  );
}

function Panel({ title, extra, children }) {
  return (
    <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 14px", borderBottom: "1px solid #30363d", background: "#1c2128" }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#7d8590", textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "monospace" }}>{title}</span>
        {extra}
      </div>
      {children}
    </div>
  );
}

function Spinner() {
  return <div style={{ width: 15, height: 15, border: "2px solid transparent", borderTopColor: "#7d8590", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />;
}

function Badge({ label, color, bg }) {
  return <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.5px", textTransform: "uppercase", background: bg, color, marginLeft: 6 }}>{label}</span>;
}

function Results({ a }) {
  const ratingColor = getRatingColor(a.efficiency_rating);
  const qualityColor = a.code_quality === "Good" ? "#3fb950" : a.code_quality === "Acceptable" ? "#d29922" : "#f85149";

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; } }`}</style>

      {/* TC + SC row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <MetricCard label="⏱ Time Complexity" value={a.time_complexity} note={a.time_complexity_note} color="#58a6ff"
          extra={a.can_be_optimal && a.optimal_tc !== a.time_complexity ? <div style={{ marginTop: 8, fontSize: 11, color: "#d29922", fontFamily: "monospace" }}>Better possible: {a.optimal_tc}</div> : null} />
        <MetricCard label="💾 Space Complexity" value={a.space_complexity} note={a.space_complexity_note} color="#3fb950" />
      </div>

      {/* Efficiency */}
      <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "16px 18px", marginBottom: "1rem" }}>
        <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: ratingColor, fontFamily: "monospace", marginBottom: 10 }}>
          ⚡ Efficiency Rating
          <Badge label={getRatingLabel(a.efficiency_rating)} color={ratingColor} bg={a.efficiency_rating >= 8 ? "#1a3a22" : a.efficiency_rating >= 5 ? "#3a2f00" : "#3a1919"} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: ratingColor, fontFamily: "monospace", letterSpacing: -1 }}>{a.efficiency_rating}<span style={{ fontSize: 14, color: "#484f58" }}>/10</span></div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 5, background: "#21262d", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: (a.efficiency_rating / 10 * 100) + "%", background: ratingColor, borderRadius: 3, transition: "width 1s ease" }} />
            </div>
            <div style={{ fontSize: 11, color: "#7d8590", marginTop: 8, fontFamily: "monospace" }}>
              Paradigm: <span style={{ color: "#c9d1d9" }}>{a.algorithm_paradigm}</span>
              {" · "}Code Quality:
              <Badge label={a.code_quality} color={qualityColor} bg={a.code_quality === "Good" ? "#1a3a22" : a.code_quality === "Acceptable" ? "#3a2f00" : "#3a1919"} />
            </div>
            {a.code_quality_notes && <div style={{ fontSize: 12, color: "#7d8590", marginTop: 6 }}>{a.code_quality_notes}</div>}
          </div>
        </div>
      </div>

      {/* Approach */}
      <FullCard accentColor="#d2a8ff" label="Algorithm Approach">
        <div style={{ fontSize: 16, fontWeight: 700, color: "#d2a8ff", fontFamily: "monospace", marginBottom: 8 }}>{a.approach_name}</div>
        <div style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.75 }}>{a.approach_explanation}</div>
        {a.data_structures?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            {a.data_structures.map(d => (
              <span key={d} style={{ display: "inline-block", background: "#1c2128", border: "1px solid #30363d", borderRadius: 6, padding: "4px 10px", fontFamily: "monospace", fontSize: 12, color: "#e6edf3", marginRight: 8, marginTop: 6 }}>{d}</span>
            ))}
          </div>
        )}
      </FullCard>

      {/* Optimizations */}
      <FullCard accentColor="#ffa657" label="Optimization Suggestions">
        <ul style={{ paddingLeft: "1.2rem", fontSize: 13, color: "#c9d1d9", lineHeight: 1.8 }}>
          {(a.optimizations || []).map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </FullCard>

      {/* Edge Cases */}
      <FullCard accentColor="#79c0ff" label="Edge Cases to Consider">
        <ul style={{ paddingLeft: "1.2rem", fontSize: 13, color: "#c9d1d9", lineHeight: 1.8 }}>
          {(a.edge_cases || []).map((e, i) => <li key={i}>{e}</li>)}
        </ul>
      </FullCard>
    </div>
  );
}

function MetricCard({ label, value, note, color, extra }) {
  return (
    <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "16px" }}>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color, fontFamily: "monospace", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "monospace", letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#7d8590", marginTop: 4, lineHeight: 1.5 }}>{note}</div>
      {extra}
    </div>
  );
}

function FullCard({ label, accentColor, children }) {
  return (
    <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "18px", marginBottom: "1rem" }}>
      <div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: accentColor, fontFamily: "monospace", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        {label}
        <div style={{ flex: 1, height: 1, background: "#30363d" }} />
      </div>
      {children}
    </div>
  );
}
