import { useState } from "react";

/* ── toast system ── */
let _setToasts = null;

export function useToasts() {
  const [toasts, setToasts] = useState([]);
  _setToasts = setToasts;
  return toasts;
}

export function toast(msg, type = "success") {
  if (!_setToasts) return;
  const id = Date.now();
  _setToasts(p => [...p, { id, msg, type }]);
  setTimeout(() => _setToasts(p => p.filter(t => t.id !== id)), 3200);
}

export function ToastContainer({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, display: "flex", flexDirection: "column", gap: 10, zIndex: 9999 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "error"
            ? "rgba(248,81,73,0.15)"
            : "rgba(0,180,255,0.12)",
          border: `1px solid ${t.type === "error" ? "rgba(248,81,73,0.4)" : "rgba(0,180,255,0.35)"}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          color: t.type === "error" ? "#f87171" : "#67e8f9",
          padding: "11px 18px", borderRadius: 12,
          fontSize: 13, fontWeight: 500,
          animation: "toastIn 0.25s ease",
          maxWidth: 320,
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)"
        }}>
          {t.type === "success" ? "✓ " : "✕ "}{t.msg}
        </div>
      ))}
    </div>
  );
}

/* ── badge ── */
export function Badge({ label, color, bg }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 20,
      fontSize: 10, fontWeight: 600, fontFamily: "monospace",
      letterSpacing: "0.6px", textTransform: "uppercase",
      background: bg, color, marginLeft: 8,
      border: `1px solid ${color}33`
    }}>{label}</span>
  );
}

/* ── spinner ── */
export function Spinner({ size = 16 }) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      border: "2px solid rgba(255,255,255,0.1)",
      borderTopColor: "#00b4ff",
      borderRadius: "50%",
      animation: "spin 0.75s linear infinite"
    }} />
  );
}

/* ── section card ── */
export function SectionCard({ label, color, children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: 18,
      padding: "20px 22px",
      marginBottom: "1rem",
      animation: "fadeUp 0.35s ease",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
    }}>
      <div style={{
        fontSize: 10, fontWeight: 700, textTransform: "uppercase",
        letterSpacing: "1.6px", color, fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 14, display: "flex", alignItems: "center", gap: 10
      }}>
        {label}
        <div style={{ flex: 1, height: 1, background: `${color}22` }} />
      </div>
      {children}
    </div>
  );
}

/* ── empty state ── */
export function EmptyState({ icon, title, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "72px 20px" }}>
      <div style={{ fontSize: 42, marginBottom: 16, filter: "grayscale(0.3)" }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>{sub}</div>
    </div>
  );
}
