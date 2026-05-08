import { useMemo } from "react";
import { loadHistory, getRatingColor } from "./utils.js";
import { EmptyState } from "./components.jsx";

function StatBox({ label, value, sub, color }) {
  return (
    <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "18px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: color || "#7d8590", fontFamily: "monospace", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || "#e6edf3", fontFamily: "monospace" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#7d8590", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function StatsTab() {
  const history = useMemo(() => loadHistory(), []);

  if (history.length === 0) {
    return <EmptyState icon="📊" title="No data yet" sub="Run a few analyses to see your stats here." />;
  }

  const ratings = history.map(h => h.analysis?.efficiency_rating || 0).filter(r => r > 0);
  const avgRating = ratings.length ? (ratings.reduce((a,b) => a + b, 0) / ratings.length).toFixed(1) : "–";

  const langCount = {};
  history.forEach(h => { langCount[h.lang] = (langCount[h.lang] || 0) + 1; });
  const topLang = Object.entries(langCount).sort((a,b) => b[1] - a[1])[0];

  const paradigms = {};
  history.forEach(h => {
    const p = h.analysis?.algorithm_paradigm;
    if (p) paradigms[p] = (paradigms[p] || 0) + 1;
  });
  const topParadigm = Object.entries(paradigms).sort((a,b) => b[1] - a[1])[0];

  const qualityCounts = { Good: 0, Acceptable: 0, "Needs Improvement": 0 };
  history.forEach(h => {
    const q = h.analysis?.code_quality;
    if (q && qualityCounts[q] !== undefined) qualityCounts[q]++;
  });

  const best = [...history].sort((a,b) => (b.analysis?.efficiency_rating||0) - (a.analysis?.efficiency_rating||0))[0];

  const avgColor = getRatingColor(parseFloat(avgRating));

  // last 10 ratings for a small chart
  const recent = ratings.slice(0, 10).reverse();
  const maxR = Math.max(...recent, 10);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <StatBox label="Total Analyses" value={history.length} sub="since you started" color="#00b4ff" />
        <StatBox label="Avg Rating" value={avgRating + "/10"} sub="across all solutions" color={avgColor} />
        <StatBox label="Favorite Lang" value={topLang?.[0] || "–"} sub={topLang ? `${topLang[1]} uses` : ""} color="#a78bfa" />
        <StatBox label="Top Paradigm" value={topParadigm?.[0] || "–"} sub={topParadigm ? `${topParadigm[1]} times` : ""} color="#6b2ff2" />
      </div>

      {/* mini bar chart of recent ratings */}
      {recent.length > 0 && (
        <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "18px", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#7d8590", fontFamily: "monospace", marginBottom: 14 }}>
            Last {recent.length} Ratings
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
            {recent.map((r, i) => {
              const pct = (r / maxR) * 100;
              const c = getRatingColor(r);
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                    <div title={`${r}/10`} style={{ width: "100%", height: pct + "%", background: "linear-gradient(180deg, #00b4ff88, #6b2ff299)", borderRadius: "3px 3px 0 0", minHeight: 4, transition: "height 0.8s ease" }} />
                  </div>
                  <div style={{ fontSize: 10, color: c, fontFamily: "monospace" }}>{r}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Code quality breakdown */}
      <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "18px", marginBottom: "1.5rem" }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#7d8590", fontFamily: "monospace", marginBottom: 14 }}>Code Quality Breakdown</div>
        {[["Good", "#3fb950", "#0f2a17"], ["Acceptable", "#d29922", "#2a1f00"], ["Needs Improvement", "#f85149", "#2a0f0f"]].map(([label, color, bg]) => {
          const count = qualityCounts[label];
          const pct = history.length ? Math.round((count / history.length) * 100) : 0;
          return (
            <div key={label} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color }}>{label}</span>
                <span style={{ color: "#7d8590", fontFamily: "monospace" }}>{count} ({pct}%)</span>
              </div>
              <div style={{ height: 5, background: "#21262d", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 3, transition: "width 0.9s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Best solution */}
      {best && (
        <div style={{ background: "#161b22", border: "1px solid #2979ff", borderRadius: 10, padding: "18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#00b4ff", fontFamily: "monospace", marginBottom: 10 }}>🏆 Best Solution So Far</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e6edf3", marginBottom: 4, fontFamily: "monospace" }}>
            {best.analysis?.approach_name} — {best.analysis?.efficiency_rating}/10
          </div>
          <div style={{ fontSize: 12, color: "#7d8590" }}>
            {best.lang} · {best.analysis?.time_complexity} · {best.analysis?.space_complexity}
            {best.problem && ` · "${best.problem}"`}
          </div>
        </div>
      )}
    </div>
  );
}
