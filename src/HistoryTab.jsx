import { useState } from "react";
import { loadHistory, clearHistory, formatDate, getRatingColor } from "./utils.js";
import { EmptyState } from "./components.jsx";
import Results from "./Results.jsx";

export default function HistoryTab() {
  const [history, setHistory] = useState(() => loadHistory());
  const [selected, setSelected] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  function handleClear() {
    if (!confirmClear) { setConfirmClear(true); return; }
    clearHistory();
    setHistory([]);
    setSelected(null);
    setConfirmClear(false);
  }

  if (history.length === 0) {
    return <EmptyState icon="📭" title="No history yet" sub="Analyze some code and it'll show up here." />;
  }

  if (selected) {
    const entry = history.find(h => h.id === selected);
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
          <button onClick={() => setSelected(null)} style={{ background: "#1c2128", border: "1px solid #30363d", color: "#e6edf3", padding: "6px 14px", borderRadius: 7, fontSize: 13, cursor: "pointer" }}>
            ← Back
          </button>
          <div style={{ fontSize: 13, color: "#7d8590", fontFamily: "monospace" }}>
            {entry.language || entry.lang} · {formatDate(entry.id)} · {entry.problem || "No problem description"}
          </div>
        </div>
        {entry.problem && (
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "12px 16px", marginBottom: "1rem", fontSize: 13, color: "#c9d1d9" }}>
            <span style={{ color: "#7d8590", fontFamily: "monospace", fontSize: 11, marginRight: 8 }}>PROBLEM</span>
            {entry.problem}
          </div>
        )}
        <Results analysis={entry.analysis} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.2rem" }}>
        <div style={{ fontSize: 13, color: "#7d8590" }}>{history.length} saved {history.length === 1 ? "analysis" : "analyses"}</div>
        <button
          onClick={handleClear}
          style={{ background: confirmClear ? "#2a0f0f" : "transparent", border: `1px solid ${confirmClear ? "#f85149" : "#30363d"}`, color: confirmClear ? "#f85149" : "#7d8590", padding: "5px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}
        >
          {confirmClear ? "Click again to confirm" : "Clear All"}
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {history.map(entry => {
          const rc = getRatingColor(entry.analysis?.efficiency_rating || 0);
          return (
            <div
              key={entry.id}
              onClick={() => setSelected(entry.id)}
              style={{
                background: "#161b22", border: "1px solid #30363d", borderRadius: 10,
                padding: "14px 16px", cursor: "pointer",
                transition: "border-color 0.15s",
                display: "flex", alignItems: "center", gap: 14
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#f0a500"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#30363d"}
            >
              <div style={{ fontSize: 22, fontWeight: 700, color: rc, fontFamily: "monospace", minWidth: 44, textAlign: "center" }}>
                {entry.analysis?.efficiency_rating ?? "?"}<span style={{ fontSize: 11, color: "#484f58" }}>/10</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", marginBottom: 3, fontFamily: "monospace" }}>
                  {entry.analysis?.approach_name || "Unknown approach"}
                </div>
                <div style={{ fontSize: 11, color: "#7d8590", display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span>{entry.language || entry.lang}</span>
                  <span>·</span>
                  <span>{entry.analysis?.time_complexity}</span>
                  <span>·</span>
                  <span>{entry.analysis?.space_complexity}</span>
                  {entry.problem && <><span>·</span><span style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.problem}</span></>}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#484f58", fontFamily: "monospace", flexShrink: 0 }}>
                {formatDate(entry.id)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
