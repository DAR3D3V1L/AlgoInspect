import logoImg from "../assets/logo.png";

const TABS = ["Analyzer", "History", "Stats"];

function NavTab({ label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`nav-tab ${active ? 'active' : ''}`}
    >
      <span className="nav-tab-text">{label}</span>
      {badge != null && badge > 0 && (
        <span className="nav-tab-badge">{badge}</span>
      )}
      <div className="nav-tab-indicator" />
    </button>
  );
}

export default function Navbar({ tab, setTab, historyCount }) {
  return (
    <nav className="floating-navbar">
      <div className="navbar-container">
        {/* Header Section */}
        <div className="navbar-header">
          <div className="brand-section">
            <img
              src={logoImg}
              alt="AlgoInspect logo"
              className="brand-logo"
            />
            <div className="brand-subtitle">
              complexity · approach · optimizations · history
            </div>
          </div>
          <div className="powered-by">
            powered by llama-3.3-70b
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          {TABS.map(t => (
            <NavTab
              key={t}
              label={t}
              active={tab === t}
              onClick={() => setTab(t)}
              badge={t === "History" ? historyCount : null}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
