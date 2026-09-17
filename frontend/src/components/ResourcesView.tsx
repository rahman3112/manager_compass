interface ResourcesViewProps {
  active: boolean;
  onNavigateHome: () => void;
}

const FILE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 3h10l4 4v14H5z" />
    <path d="M15 3v5h5M8 12h8M8 16h8" />
  </svg>
);

const FOLDER_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
    <path d="M4 5.5v16M8 7h8M8 11h8" />
  </svg>
);

const RESOURCES = [
  { icon: FILE_ICON, title: 'Manager Resources', description: 'Change Management Toolkit, Team Discussion Framework, and character modules.', tag: '5 references' },
  { icon: FILE_ICON, title: 'PH Handbook & Policies', description: 'Attendance, code of conduct, flexible work, PTO, return-to-work, and clearance.', tag: '12 references' },
  { icon: FILE_ICON, title: 'Training & Development', description: 'Performance Conversation, SMART goals, manager assessment, and new leader toolkits.', tag: '17 references' },
  { icon: FILE_ICON, title: 'Payroll · Philippines', description: 'Timekeeping, final pay, 13th month, special payout, and payroll procedures.', tag: '10 references' },
  { icon: FILE_ICON, title: 'Employee Relations & guardrails', description: 'Resignation, offboarding, employee movement, and incentive request guides.', tag: '4 references' },
  { icon: FOLDER_ICON, title: 'Talent Services & intake routing', description: 'Global, India, PH, and US paths for onboarding, offboarding, and EMR.', tag: '4 region paths' },
];

export function ResourcesView({ active, onNavigateHome }: ResourcesViewProps) {
  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-resources" aria-labelledby="resources-title">
      <div className="view-header">
        <div>
          <p className="eyebrow">Approved internal library</p>
          <h2 id="resources-title">Your source of truth, organized.</h2>
          <p>Reference paths shown here mirror the hackathon resource set. Prototype links are illustrative.</p>
        </div>
        <button className="btn btn-quiet" onClick={onNavigateHome}>← Back to home</button>
      </div>

      <div className="resources-grid">
        {RESOURCES.map((resource) => (
          <div className="card resource-card" key={resource.title}>
            <div className="file-icon">{resource.icon}</div>
            <div>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>
              <span className="tag">{resource.tag}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="section-heading">
        <div>
          <h2>Sanitized data for the prototype</h2>
          <p>Used only to demonstrate safe aggregate insight behavior.</p>
        </div>
      </div>
      <div className="card source-card">
        <div className="source-head">
          <div>
            <h3>10_Sample HR Dataset</h3>
            <p>active_fte.xlsx · exits.xlsx · requisitions.xlsx · contractors_interns_fact_consultants.xlsx</p>
          </div>
          <span className="source-badge">DEMO ONLY</span>
        </div>
        <p style={{ marginBottom: 0 }}>Small-cell suppression and employee-detail exclusions are part of the prototype guardrails. No real employee records are used in this wireframe.</p>
      </div>
    </section>
  );
}
