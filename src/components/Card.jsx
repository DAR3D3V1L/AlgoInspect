export default function Card({ title, children, extra }) {
  return (
    <div className="glass-card">
      <div className="glass-card-header">
        <div className="glass-card-title-section">
          <h3 className="glass-card-title">{title}</h3>
          <div className="glass-card-title-line" />
        </div>
        {extra && <div>{extra}</div>}
      </div>
      <div className="glass-card-content">
        {children}
      </div>
    </div>
  );
}
