import { useState } from "react";
import { useToasts, ToastContainer } from "./components.jsx";
import AnalyzerTab from "./AnalyzerTab.jsx";
import HistoryTab from "./HistoryTab.jsx";
import StatsTab from "./StatsTab.jsx";
import Navbar from "./components/Navbar.jsx";

export default function App() {
  const [tab, setTab] = useState("Analyzer");
  const toasts = useToasts();

  // Load history count using same key as utils.js
  let historyCount = 0;
  try {
    historyCount = JSON.parse(localStorage.getItem("algo_inspect_history") || "[]").length;
  } catch {}

  return (
    <div className="app-container">
      <div className="futuristic-bg" />
      <div className="noise-overlay" />
      <div className="mesh-gradient" />
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />
      
      <Navbar tab={tab} setTab={setTab} historyCount={historyCount} />

      <div className="content-container">
        {tab === "Analyzer" && <AnalyzerTab />}
        {tab === "History" && <HistoryTab />}
        {tab === "Stats" && <StatsTab />}
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
