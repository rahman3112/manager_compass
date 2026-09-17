import { useState, type KeyboardEvent } from 'react';
import type { ViewName } from './Rail';

interface HomeViewProps {
  active: boolean;
  onGoToCompass: (text: string) => void;
  onNavigate: (view: ViewName) => void;
  onShowToast: (message: string) => void;
}

const CONVERSATION_PREFILL = 'I need to prepare for a performance conversation.';
const QUESTION_PREFILL = 'I have an HR policy or process question.';

export function HomeView({ active, onGoToCompass, onNavigate, onShowToast }: HomeViewProps) {
  const [searchValue, setSearchValue] = useState('');

  function submitSearch() {
    onGoToCompass(searchValue.trim() || 'I need help navigating an HR question.');
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      submitSearch();
    }
  }

  function browseSourceLibrary() {
    onNavigate('resources');
    onShowToast('Source library opened in the full pilot experience.');
  }

  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-home" aria-labelledby="home-title">
      <div className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A first step, with confidence</p>
          <h1 id="home-title">People questions.<br /><em>Clear next moves.</em></h1>
          <p>Manager Compass helps you find the right starting point for everyday people moments—grounded in approved RealPage guidance, with HR review when the situation is sensitive or unclear.</p>
        </div>
        <div className="hero-stamp"><strong>Human<br />by design</strong>Guidance that knows when to bring in HR.</div>
      </div>

      <div className="search-card" role="search">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input
          type="search"
          aria-label="Ask Manager Compass"
          placeholder="Ask a people question in your own words…"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
        <button className="btn btn-primary" onClick={submitSearch}>Find my first step</button>
      </div>

      <div className="section-heading">
        <div>
          <h2>Where do you want to start?</h2>
          <p>Choose a guided path for the situation in front of you.</p>
        </div>
      </div>
      <div className="grid-3">
        <button className="card path-card" onClick={() => onGoToCompass(CONVERSATION_PREFILL)}>
          <span className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6l-4 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
              <path d="M7 8h10M7 12h6" />
            </svg>
          </span>
          <h3>Prepare for a people conversation</h3>
          <p>Get a neutral prep plan for coaching, goals, or development.</p>
          <span className="path-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </button>
        <button className="card path-card" onClick={() => onGoToCompass(QUESTION_PREFILL)}>
          <span className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
              <path d="M4 5.5v16M8 7h8M8 11h8M8 15h5" />
            </svg>
          </span>
          <h3>Find a policy or process</h3>
          <p>Start with the approved source of truth for a day-to-day HR question.</p>
          <span className="path-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </button>
        <button className="card path-card" onClick={() => onNavigate('insights')}>
          <span className="card-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 19V5M4 19h17" />
              <path d="M7 15 10 9l3 3 5-7" />
            </svg>
          </span>
          <h3>Understand a team trend</h3>
          <p>Explore sanitized aggregate data and know when HRBP review is needed.</p>
          <span className="path-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </button>
      </div>

      <div className="section-heading">
        <div>
          <h2>What managers ask most</h2>
          <p>Try one of the common starting points.</p>
        </div>
        <button className="link-btn" onClick={() => onNavigate('compass')}>Open guided compass →</button>
      </div>
      <div className="grid-2">
        <div className="card question-list">
          <button className="question-row" onClick={() => onGoToCompass(CONVERSATION_PREFILL)}>
            <span className="question-dot" />
            <span className="question-text">How do I prepare for a performance conversation?</span>
            <span className="question-meta">Training &amp; development</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </button>
          <button className="question-row" onClick={() => onGoToCompass(QUESTION_PREFILL)}>
            <span className="question-dot" style={{ background: 'var(--aqua-deep)' }} />
            <span className="question-text">Where do I start if an employee needs time away?</span>
            <span className="question-meta">Benefits &amp; leave</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </button>
          <button className="question-row" onClick={() => onGoToCompass(QUESTION_PREFILL)}>
            <span className="question-dot" style={{ background: 'var(--navy-700)' }} />
            <span className="question-text">What is the right path for an employee movement request?</span>
            <span className="question-meta">Talent Services</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
        <div className="card source-card">
          <div className="source-head">
            <div>
              <p className="eyebrow">Designed for reviewability</p>
              <h3>Approved guidance, visible at every step</h3>
            </div>
            <span className="source-badge">INTERNAL PILOT</span>
          </div>
          <p>Every answer shows its source, recommended owner, and the point where a human HR partner should review.</p>
          <div className="source-line">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
              <path d="M4 5.5v16" />
            </svg>
            <button className="source-link" onClick={browseSourceLibrary}>Browse source library</button>
          </div>
          <div className="source-line">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3a9 9 0 1 0 9 9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <span>Last content check · Sep 16, 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
