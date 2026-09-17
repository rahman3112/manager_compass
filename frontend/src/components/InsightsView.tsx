interface InsightsViewProps {
  active: boolean;
  onNavigateHome: () => void;
}

const BAR_HEIGHTS: [number, number][] = [
  [52, 42],
  [63, 55],
  [47, 49],
  [72, 62],
  [58, 61],
  [44, 48],
];

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export function InsightsView({ active, onNavigateHome }: InsightsViewProps) {
  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-insights" aria-labelledby="insights-title">
      <div className="view-header">
        <div>
          <p className="eyebrow">Sanitized team view</p>
          <h2 id="insights-title">Understand the trend. Protect the people.</h2>
          <p>Aggregate signals can help a manager know when to ask HRBP a better question.</p>
        </div>
        <button className="btn btn-quiet" onClick={onNavigateHome}>← Back to home</button>
      </div>

      <div className="card data-card">
        <div className="data-head">
          <div>
            <h3>Voluntary attrition · Business unit example</h3>
            <p className="muted" style={{ fontSize: '13px', margin: '7px 0 0' }}>A mock, aggregate view for demo purposes only.</p>
          </div>
          <span className="source-badge">MOCK DATA</span>
        </div>
        <div className="metric-grid">
          <div className="metric">
            <div className="label">Voluntary attrition</div>
            <div className="value">4.8%</div>
            <div className="trend">↓ 0.7 pts vs prior 3 mo</div>
          </div>
          <div className="metric">
            <div className="label">Rolling 12-month trend</div>
            <div className="value">5.4%</div>
            <div className="trend">Stable within range</div>
          </div>
          <div className="metric">
            <div className="label">HRBP review signal</div>
            <div className="value">Low</div>
            <div className="trend">No action inferred</div>
          </div>
        </div>
        <div className="chart-wrap">
          <div className="chart-labels">
            <span>Voluntary terms</span>
            <span>Jan – Jun 2026 · refresh 16 Sep 2026</span>
          </div>
          <div className="bar-chart" aria-label="Mock voluntary attrition bar chart">
            {BAR_HEIGHTS.map(([main, alt], index) => (
              <div className="bar-group" key={index}>
                <span className="bar" style={{ height: `${main}%` }} />
                <span className="bar alt" style={{ height: `${alt}%` }} />
              </div>
            ))}
          </div>
          <div className="chart-labels">
            {MONTH_LABELS.map((month) => <span key={month}>{month}</span>)}
          </div>
        </div>
        <div className="data-note">
          <strong>Human review reminder:</strong> This view is intentionally aggregate. It does not show names, employee IDs, manager-level cuts, protected demographic detail, ER cases, medical data, or individual attrition predictions. Discuss context and next steps with HRBP.
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h2>What this can help you ask</h2>
          <p>Turn a signal into a constructive conversation with HR.</p>
        </div>
      </div>
      <div className="grid-3">
        <div className="card source-card">
          <p className="eyebrow">Ask HRBP</p>
          <h3>What context should we look at before taking action?</h3>
          <p style={{ marginBottom: 0 }}>Movement, staffing, role family, location, and approved aggregate comparisons.</p>
        </div>
        <div className="card source-card">
          <p className="eyebrow">Ask your team</p>
          <h3>What themes are you hearing from the group?</h3>
          <p style={{ marginBottom: 0 }}>Use listening and manager conversation—not individual risk scores.</p>
        </div>
        <div className="card source-card">
          <p className="eyebrow">Escalate when</p>
          <h3>The trend points to a sensitive or unclear issue.</h3>
          <p style={{ marginBottom: 0 }}>HRBP, ER, Talent Services, Payroll, Benefits, or Compensation can provide the right review.</p>
        </div>
      </div>
    </section>
  );
}
