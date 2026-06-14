import { getRatingColor, getRatingLabel, getQualityColor, getQualityBg } from "./utils.js";
import { Badge, SectionCard } from "./components.jsx";
import { toast } from "./components.jsx";

function MetricCard({ label, value, note, color, extra }) {
  return (
    <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "16px", animation: "fadeUp 0.3s ease" }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color, fontFamily: "monospace", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: "monospace", letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#7d8590", marginTop: 4, lineHeight: 1.5 }}>{note}</div>
      {extra}
    </div>
  );
}

function TagList({ items, color }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
      {(items || []).map((d, i) => (
        <span key={i} style={{
          background: "#1c2128", border: "1px solid #30363d",
          borderRadius: 6, padding: "3px 10px",
          fontFamily: "monospace", fontSize: 12, color: color || "#e6edf3"
        }}>{d}</span>
      ))}
    </div>
  );
}

function BulletList({ items, color }) {
  return (
    <ul style={{ paddingLeft: "1.2rem", fontSize: 13, color: "#c9d1d9", lineHeight: 1.85, margin: 0 }}>
      {(items || []).map((item, i) => (
        <li key={i} style={{ marginBottom: 2 }}>
          {color && <span style={{ color, marginRight: 4 }}>›</span>}
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Results({ analysis, showCopy = true }) {
  const ratingColor = getRatingColor(analysis.efficiency_rating);
  const qualityColor = getQualityColor(analysis.code_quality);
  const qualityBg = getQualityBg(analysis.code_quality);

  function handleCopy() {
    const sections = [
      `=== LeetCode Analysis ===`,
      `Approach: ${analysis.approach_name} (${analysis.algorithm_paradigm})`,
      `Time: ${analysis.time_complexity} — ${analysis.time_complexity_note}`,
      `Space: ${analysis.space_complexity} — ${analysis.space_complexity_note}`,
      `Efficiency: ${analysis.efficiency_rating}/10 (${getRatingLabel(analysis.efficiency_rating)})`,
      `Code Quality: ${analysis.code_quality}`,
    ];
    
    if (analysis.optimizations?.length) {
      sections.push(`\nOptimizations:\n${analysis.optimizations.map((o, i) => `${i + 1}. ${o}`).join("\n")}`);
    }
    
    if (analysis.edge_cases?.length) {
      sections.push(`\nEdge Cases:\n${analysis.edge_cases.map((e, i) => `${i + 1}. ${e}`).join("\n")}`);
    }
    
    if (analysis.bug_risks?.length) {
      sections.push(`\nBug Risks:\n${analysis.bug_risks.map((b, i) => `${i + 1}. ${b}`).join("\n")}`);
    }
    
    if (analysis.similar_problems?.length) {
      sections.push(`\nSimilar Problems: ${analysis.similar_problems.join(", ")}`);
    }
    
    navigator.clipboard.writeText(sections.join("\n"))
      .then(() => toast("Analysis copied to clipboard"))
      .catch(() => toast("Failed to copy", "error"));
  }

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes barGrow { from { width:0 } to { width: var(--w); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes toastIn { from { opacity:0; transform:translateY(16px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
      `}</style>

      {/* TC + SC */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <MetricCard
          label="⏱ Time Complexity" value={analysis.time_complexity}
          note={analysis.time_complexity_note} color="#00b4ff"
          extra={analysis.can_be_optimal && analysis.optimal_tc !== analysis.time_complexity
            ? <div style={{ marginTop: 8, fontSize: 11, color: "#a78bfa", fontFamily: "monospace" }}>Better possible: {analysis.optimal_tc}</div>
            : null}
        />
        <MetricCard label="💾 Space Complexity" value={analysis.space_complexity} note={analysis.space_complexity_note} color="#6b2ff2" />
      </div>

      {/* Efficiency bar */}
      <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "16px 18px", marginBottom: "1rem", animation: "fadeUp 0.35s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: ratingColor, fontFamily: "monospace" }}>
            ⚡ Efficiency Rating
            <Badge label={getRatingLabel(analysis.efficiency_rating)} color={ratingColor} bg={analysis.efficiency_rating >= 8 ? "#0f2a17" : analysis.efficiency_rating >= 5 ? "#2a1f00" : "#2a0f0f"} />
          </span>
          {showCopy && (
            <button onClick={handleCopy} style={{
              background: "transparent", border: "1px solid #2979ff44",
              borderRadius: 6, color: "#2979ff", padding: "4px 10px",
              fontSize: 11, cursor: "pointer", fontFamily: "monospace",
              transition: "border-color 0.15s"
            }}>
              copy results
            </button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: ratingColor, fontFamily: "monospace", letterSpacing: -1, flexShrink: 0 }}>
            {analysis.efficiency_rating}<span style={{ fontSize: 14, color: "#484f58" }}>/10</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 6, background: "#21262d", borderRadius: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: (analysis.efficiency_rating / 10 * 100) + "%",
                background: `linear-gradient(90deg, #00b4ff, #2979ff, #6b2ff2)`,
                borderRadius: 3,
                transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)"
              }} />
            </div>
            <div style={{ fontSize: 11, color: "#7d8590", marginTop: 8, fontFamily: "monospace" }}>
              Paradigm: <span style={{ color: "#c9d1d9" }}>{analysis.algorithm_paradigm}</span>
              {" · "}Code Quality:
              <Badge label={analysis.code_quality} color={qualityColor} bg={qualityBg} />
            </div>
            {analysis.code_quality_notes && <div style={{ fontSize: 12, color: "#7d8590", marginTop: 5 }}>{analysis.code_quality_notes}</div>}
          </div>
        </div>
      </div>

      <SectionCard label="Algorithm Approach" color="#a78bfa">
        <div style={{ fontSize: 15, fontWeight: 700, color: "#a78bfa", fontFamily: "monospace", marginBottom: 8 }}>{analysis.approach_name}</div>
        <div style={{ fontSize: 13, color: "#c9d1d9", lineHeight: 1.8 }}>{analysis.approach_explanation}</div>
        {analysis.data_structures?.length > 0 && <TagList items={analysis.data_structures} color="#e6edf3" />}
      </SectionCard>

      <SectionCard label="Optimization Suggestions" color="#2979ff">
        <BulletList items={analysis.optimizations} color="#2979ff" />
      </SectionCard>

      <SectionCard label="Edge Cases to Consider" color="#00b4ff">
        <BulletList items={analysis.edge_cases} color="#00b4ff" />
      </SectionCard>

      {analysis.bug_risks?.length > 0 && (
        <SectionCard label="⚠ Potential Bug Risks" color="#f85149">
          <BulletList items={analysis.bug_risks} color="#f85149" />
        </SectionCard>
      )}

      {analysis.similar_problems?.length > 0 && (
        <SectionCard label="Similar Problems" color="#3fb950">
          <TagList items={analysis.similar_problems} color="#3fb950" />
        </SectionCard>
      )}
    </div>
  );
}
