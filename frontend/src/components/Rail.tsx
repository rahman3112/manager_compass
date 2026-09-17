import type { ReactNode } from 'react';

export type ViewName = 'home' | 'compass' | 'resources' | 'insights';

interface RailProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
}

export function Rail({ currentView, onNavigate }: RailProps) {
  const navItems: { view: ViewName; label: string; icon: ReactNode }[] = [
    {
      view: 'home',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" />
          <path d="M9 21v-6h6v6" />
        </svg>
      ),
    },
    {
      view: 'compass',
      label: 'Compass',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" />
        </svg>
      ),
    },
    {
      view: 'resources',
      label: 'Resources',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
          <path d="M4 5.5v16M8 7h8M8 11h8" />
        </svg>
      ),
    },
    {
      view: 'insights',
      label: 'Insights',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 19V5M4 19h17" />
          <path d="m7 15 3-4 3 2 5-7" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="rail" aria-label="Primary navigation">
      <div className="wordmark" aria-label="RealPage">RealPage</div>
      <div className="rail-divider" />
      <nav className="rail-nav">
        {navItems.map((item) => (
          <button
            key={item.view}
            className={`rail-btn ${currentView === item.view ? 'active' : ''}`}
            aria-label={item.label}
            title={item.label}
            onClick={() => onNavigate(item.view)}
          >
            {item.icon}
          </button>
        ))}
      </nav>
      <div className="rail-spacer" />
      <div className="avatar" aria-label="Signed in as SA">SA</div>
    </aside>
  );
}
