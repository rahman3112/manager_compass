interface TopbarProps {
  onHelp: () => void;
}

export function Topbar({ onHelp }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="crumb"><strong>Manager Compass</strong><span> / HR guidance hub</span></div>
      <div className="top-actions">
        <button className="icon-btn" aria-label="Help" onClick={onHelp}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.7 9a2.35 2.35 0 1 1 3.9 1.76c-1.05.88-1.6 1.2-1.6 2.74M12 17h.01" />
          </svg>
        </button>
        <div className="profile-pill">
          <div className="avatar">SA</div>
          <span>ShynenJoy Abanador</span>
        </div>
      </div>
    </header>
  );
}
