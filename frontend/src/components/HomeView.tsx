import { useEffect, useState } from 'react';
import { fetchCategories } from '../api/client';
import type { Category } from '../types/category';
import type { ViewName } from './Rail';
import { colorForCategory } from '../utils/categoryColors';

interface HomeViewProps {
  active: boolean;
  onGoToCompass: (text: string) => void;
  onGoToCompassWithCategory: (categoryId: string) => void;
  onNavigate: (view: ViewName) => void;
  onShowToast: (message: string) => void;
}

const CONVERSATION_PREFILL = 'I need to prepare for a performance conversation.';
const QUESTION_PREFILL = 'I have an HR policy or process question.';

export function HomeView({ active, onGoToCompass, onGoToCompassWithCategory, onNavigate, onShowToast }: HomeViewProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

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

      <div className="section-heading">
        <div>
          <h2>What category is this?</h2>
          <p>Pick a category to jump straight into the specifics.</p>
        </div>
        <button className="link-btn" onClick={() => onNavigate('tasks')}>Track your plans →</button>
      </div>
      <div className="category-tile-grid">
        {categories.map((category, index) => {
          const color = colorForCategory(index);
          return (
            <button
              key={category.id}
              className="card category-tile"
              style={{ background: color.bg, color: color.text }}
              onClick={() => onGoToCompassWithCategory(category.id)}
            >
              <span className="category-tile-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <span className="path-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          );
        })}
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
              <circle cx="12" cy="12" r="9" />
              <path d="M9.7 9a2.35 2.35 0 1 1 3.9 1.76c-1.05.88-1.6 1.2-1.6 2.74M12 17h.01" />
            </svg>
            <button className="source-link" onClick={() => onNavigate('help')}>View user guide</button>
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
