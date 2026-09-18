interface HowItWorksViewProps {
  active: boolean;
  onNavigateHome: () => void;
}

const JOURNEY = [
  {
    icon: '🏠',
    title: 'Start on Home',
    text: 'Pick a category tile, or grab one of the quick-start questions.',
  },
  {
    icon: '🧭',
    title: 'Tell Compass what\'s going on',
    text: 'Check the boxes that fit — or just describe it in your own words.',
  },
  {
    icon: '🪄',
    title: 'Hit Create Plan',
    text: 'Real steps, real documents, and the right contact — built from what you told it.',
  },
  {
    icon: '📋',
    title: 'Save it and check things off',
    text: 'One click sends the plan to your dashboard, ready to track.',
  },
];

const BRANCHES = [
  {
    bg: 'var(--navy-900)',
    text: '#fff',
    icon: '✅',
    title: 'Normal situation',
    body: 'You get a full plan: steps, the real document it came from, and who to talk to if you need more.',
  },
  {
    bg: 'var(--coral)',
    text: '#fff',
    icon: '🚨',
    title: 'Serious situation',
    body: 'Harassment, threats, self-harm, legal language — no plan, no steps. Straight to Employee Relations.',
  },
];

const ANYTIME = [
  {
    bg: 'var(--aqua-surface)',
    text: 'var(--ink)',
    icon: '📁',
    title: 'Resources',
    body: 'Browse every real approved document, organized by category.',
  },
  {
    bg: 'var(--coral-surface)',
    text: 'var(--ink)',
    icon: '📋',
    title: 'Plans',
    body: 'See what\'s open, overdue, or due soon — and everything Compass has helped you prepare.',
  },
];

const TRUST_POINTS = [
  { accent: 'var(--aqua-deep)', icon: '🔍', title: 'Grounded, not invented', body: 'Every step and document traces back to a real approved source — nothing is made up.' },
  { accent: 'var(--coral)', icon: '👁️', title: 'Shows its work', body: 'You always see exactly which document a plan came from, and who to contact next.' },
  { accent: 'var(--navy-700)', icon: '🚦', title: 'Knows its limits', body: 'Serious situations route straight to a person, automatically — it never guesses.' },
];

const GUARDRAILS = [
  { icon: '⚖️', text: 'No legal advice' },
  { icon: '💰', text: 'No pay decisions' },
  { icon: '🚫', text: 'No firing calls' },
  { icon: '📄', text: 'No new policy' },
  { icon: '🔍', text: 'Always a real source' },
  { icon: '🤷', text: '"I don\'t know" beats guessing' },
];

export function HowItWorksView({ active, onNavigateHome }: HowItWorksViewProps) {
  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-help" aria-labelledby="help-title">
      <div className="view-header">
        <div>
          <p className="eyebrow">How Manager Compass works</p>
          <h2 id="help-title">The idea, and the whole journey.</h2>
          <p>Why this exists, then exactly what happens when you use it.</p>
        </div>
        <button type="button" className="btn btn-quiet" onClick={onNavigateHome}>← Back to home</button>
      </div>

      <div className="hero hero-compact">
        <div className="hero-copy">
          <p className="eyebrow">The pitch</p>
          <h2>Managers hit people questions every day — and rarely know where the real answer lives.</h2>
          <p>Manager Compass is a navigation layer, not a decision-maker. It points to the real approved document, drafts a starting plan, and knows exactly when to hand things to a person instead.</p>
        </div>
      </div>

      <div className="trust-tile-row">
        {TRUST_POINTS.map((point) => (
          <div className="card trust-tile" style={{ borderTopColor: point.accent }} key={point.title}>
            <span className="trust-tile-icon">{point.icon}</span>
            <h3>{point.title}</h3>
            <p>{point.body}</p>
          </div>
        ))}
      </div>

      <div className="section-heading">
        <div>
          <h2>One flow. Four stops.</h2>
          <p>Here's the whole journey, start to finish.</p>
        </div>
      </div>
      <div className="card flow-card">
        <ol className="flow-timeline">
          {JOURNEY.map((step, index) => (
            <li key={step.title}>
              <span className={`flow-num ${index === 0 ? 'flow-num-first' : ''}`}>{step.icon}</span>
              <span className="flow-content">
                <strong>{step.title}.</strong> {step.text}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="section-heading">
        <div>
          <h2>What "Create Plan" actually does</h2>
          <p>It reads what you wrote and picks one of two paths — every time.</p>
        </div>
      </div>
      <div className="tile-grid-2">
        {BRANCHES.map((branch) => (
          <div className="card category-tile" style={{ background: branch.bg, color: branch.text }} key={branch.title}>
            <span className="category-tile-icon">{branch.icon}</span>
            <h3>{branch.title}</h3>
            <p>{branch.body}</p>
          </div>
        ))}
      </div>

      <div className="section-heading">
        <div>
          <h2>Available anytime</h2>
          <p>You don't need a plan in progress to use these.</p>
        </div>
      </div>
      <div className="tile-grid-2">
        {ANYTIME.map((item) => (
          <div className="card category-tile" style={{ background: item.bg, color: item.text }} key={item.title}>
            <span className="category-tile-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        ))}
      </div>

      <div className="section-heading">
        <div>
          <h2>The rules that never change</h2>
          <p>No matter what screen you're on.</p>
        </div>
      </div>
      <div className="guardrail-chip-row">
        {GUARDRAILS.map((rule) => (
          <span className="guardrail-chip" key={rule.text}>
            <span>{rule.icon}</span> {rule.text}
          </span>
        ))}
      </div>
    </section>
  );
}
