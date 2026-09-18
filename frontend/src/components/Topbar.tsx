interface TopbarProps {
  onHelp: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Topbar({ onHelp, theme, onToggleTheme }: TopbarProps) {
  const isDark = theme === 'dark';
  return (
    <header className="topbar">
      <div className="brand-lockup" aria-label="RealPage Manager Compass">
        <span className="brand-lockup-primary">RealPage<span className="brand-dot">.</span></span>
        <span className="brand-lockup-secondary">Manager Compass</span>
      </div>
      <div className="top-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={onToggleTheme}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.5v2.2M12 19.3v2.2M4.4 4.4l1.55 1.55M18.05 18.05l1.55 1.55M2.5 12h2.2M19.3 12h2.2M4.4 19.6l1.55-1.55M18.05 5.95l1.55-1.55" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
            </svg>
          )}
        </button>
        <button type="button" className="icon-btn" aria-label="Help" onClick={onHelp}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.7 9a2.35 2.35 0 1 1 3.9 1.76c-1.05.88-1.6 1.2-1.6 2.74M12 17h.01" />
          </svg>
        </button>
      </div>
    </header>
  );
}
