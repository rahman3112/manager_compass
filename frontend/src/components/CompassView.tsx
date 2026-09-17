import { useEffect, useRef, useState } from 'react';
import { fetchCategories, fetchScenarios, generateGuide } from '../api/client';
import type { Category } from '../types/category';
import type { Guide } from '../types/guide';
import type { Scenario } from '../types/scenario';

interface CompassViewProps {
  active: boolean;
  prefillToken: number;
  prefillText: string;
  onNavigateHome: () => void;
}

interface AnswerContent {
  title: string;
  sub: string;
  routeTitle: string;
  routeText: string;
}

const PERFORMANCE_ANSWER: AnswerContent = {
  title: 'Prepare a performance conversation',
  sub: 'Use approved performance guidance to create a neutral, specific conversation plan.',
  routeTitle: 'Talent Services · manager guidance',
  routeText: 'If the situation may involve misconduct, retaliation, a protected concern, or a formal corrective action, pause and contact HR/Employee Relations before proceeding.',
};

const TIME_AWAY_ANSWER: AnswerContent = {
  title: 'Start with the approved leave path',
  sub: 'Confirm the employee’s location and the type of time away before selecting the right policy or intake route.',
  routeTitle: 'Benefits / Payroll · location-specific review',
  routeText: 'Do not interpret eligibility or make a commitment from the guide alone. Route exceptions, medical details, or unclear cases to the appropriate HR owner.',
};

const MOVEMENT_ANSWER: AnswerContent = {
  title: 'Start with Talent Services intake',
  sub: 'Use the Employee Movement Report path and capture only the information the intake requires.',
  routeTitle: 'Talent Services · PH intake path',
  routeText: 'For offboarding, sensitive context, or unclear ownership, pause and use the HR/ER escalation path before submitting anything.',
};

const CHIPS = [
  { label: 'Performance conversation', fill: 'I need to prepare for a performance conversation.' },
  { label: 'Time away', fill: 'An employee needs time away from work.' },
  { label: 'Employee movement', fill: 'I need to start an employee movement request.' },
];

function classifyAnswer(rawInput: string): AnswerContent {
  const value = rawInput.trim().toLowerCase();
  const isTimeAway = value.includes('time') || value.includes('leave') || value.includes('away');
  const isMovement = value.includes('movement') || value.includes('transfer') || value.includes('emr');
  if (isTimeAway) return TIME_AWAY_ANSWER;
  if (isMovement) return MOVEMENT_ANSWER;
  return PERFORMANCE_ANSWER;
}

export function CompassView({ active, prefillToken, prefillText, onNavigateHome }: CompassViewProps) {
  const [inputValue, setInputValue] = useState('');
  const [localAnswer, setLocalAnswer] = useState<AnswerContent | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<Set<string>>(new Set());
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);
  const [guideError, setGuideError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchScenarios().then(setScenarios).catch(() => setScenarios([]));
  }, []);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    setInputValue(prefillText);
    setLocalAnswer(null);
    setGuide(null);
    setSelectedCategoryId(null);
    setSelectedScenarioIds(new Set());
    const timer = setTimeout(() => textareaRef.current?.focus(), 380);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillToken]);

  useEffect(() => {
    if (guide || localAnswer) {
      answerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [guide, localAnswer]);

  const scenariosForCategory = scenarios.filter((s) => s.categoryId === selectedCategoryId);

  function selectCategory(category: Category) {
    setSelectedCategoryId(category.id);
    setSelectedScenarioIds(new Set());
    setInputValue(category.defaultSituation);
    setGuide(null);
    setLocalAnswer(null);
    setGuideError(null);
  }

  function toggleScenario(scenario: Scenario, category: Category) {
    const next = new Set(selectedScenarioIds);
    if (next.has(scenario.id)) {
      next.delete(scenario.id);
    } else {
      next.add(scenario.id);
    }
    setSelectedScenarioIds(next);

    const picked = scenarios.filter((s) => next.has(s.id));
    setInputValue(picked.length > 0 ? picked.map((s) => s.description).join(' ') : category.defaultSituation);
    setGuide(null);
  }

  function handleChipClick(fill: string) {
    setSelectedCategoryId(null);
    setSelectedScenarioIds(new Set());
    setGuide(null);
    setInputValue(fill);
  }

  async function handlePreparePlan() {
    if (selectedCategoryId) {
      setGuideError(null);
      setIsLoadingGuide(true);
      try {
        const result = await generateGuide({ categoryId: selectedCategoryId, situation: inputValue.trim() });
        setGuide(result);
        setLocalAnswer(null);
      } catch {
        setGuideError('Could not reach Manager Compass to build a plan for that category. Please try again.');
        setGuide(null);
      } finally {
        setIsLoadingGuide(false);
      }
      return;
    }
    setGuide(null);
    setLocalAnswer(classifyAnswer(inputValue));
  }

  const isUrgent = guide?.kind === 'Escalate';
  const hasPlan = Boolean(guide) || Boolean(localAnswer);
  const wizardStep = selectedCategoryId === null ? 1 : hasPlan ? 3 : 2;
  const stepClass = (step: number) => (wizardStep > step ? 'done' : wizardStep === step ? 'active' : '');

  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-compass" aria-labelledby="compass-title">
      <div className="view-header">
        <div>
          <p className="eyebrow">Guided first step</p>
          <h2 id="compass-title">Tell us what’s in front of you.</h2>
          <p>Use plain language. Compass will organize the next move—not make the HR decision.</p>
        </div>
        <button className="btn btn-quiet" onClick={onNavigateHome}>← Back to home</button>
      </div>

      <div className="flow-shell">
        <div className="card flow-main">
          <div className="stepper">
            <div className={`step ${stepClass(1)}`}><span className="step-num">1</span><span>Category</span></div>
            <div className={`step ${stepClass(2)}`}><span className="step-num">2</span><span>Specifics</span></div>
            <div className={`step ${stepClass(3)}`}><span className="step-num">3</span><span>Prepare</span></div>
          </div>

          <h3>1. What category is this?</h3>
          <div className="prompt-box">
            <div className="chips category-chips">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`chip ${selectedCategoryId === category.id ? 'chip-selected' : ''}`}
                  onClick={() => selectCategory(category)}
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>
          </div>

          {selectedCategoryId && (
            <>
              <h3>2. What specifically is going on? Check what applies.</h3>
              <div className="prompt-box">
                {scenariosForCategory.length > 0 ? (
                  <div className="specifics-list">
                    {scenariosForCategory.map((scenario) => {
                      const category = categories.find((c) => c.id === selectedCategoryId)!;
                      return (
                        <label key={scenario.id} className="specifics-item">
                          <input
                            type="checkbox"
                            checked={selectedScenarioIds.has(scenario.id)}
                            onChange={() => toggleScenario(scenario, category)}
                          />
                          <span className="specifics-icon">{scenario.icon}</span>
                          <span className="specifics-text">
                            <strong>{scenario.title}</strong>
                            <span>{scenario.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  <p className="muted" style={{ fontSize: '13px', margin: 0 }}>No specific situations listed for this category yet — describe it below.</p>
                )}
              </div>

              <div className="prompt-box">
                <label htmlFor="compassInput">Anything else to add? (edit freely)</label>
                <textarea
                  id="compassInput"
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Add any detail that's specific to your situation."
                />
              </div>
            </>
          )}

          {!selectedCategoryId && (
            <div className="prompt-box">
              <label htmlFor="compassInput">Or just describe it in your own words</label>
              <textarea
                id="compassInput"
                ref={textareaRef}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Example: I need to talk with someone about missed goals, but I want to prepare fairly."
              />
              <div className="chips">
                {CHIPS.map((chip) => (
                  <button key={chip.label} className="chip" onClick={() => handleChipClick(chip.fill)}>
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flow-actions">
            <button className="btn btn-quiet" onClick={onNavigateHome}>Cancel</button>
            <button className="btn btn-primary" onClick={handlePreparePlan} disabled={isLoadingGuide || !inputValue.trim()}>
              {isLoadingGuide ? 'Preparing your plan…' : 'Prepare my plan'}
            </button>
          </div>

          {guideError && <p className="form-error">{guideError}</p>}

          <div className={`answer-panel ${hasPlan ? 'visible' : ''} ${isUrgent ? 'urgent' : ''}`} ref={answerRef} aria-live="polite">
            {guide?.kind === 'Escalate' && (
              <>
                <div className="answer-top">
                  <p className="eyebrow">Escalate now</p>
                  <h3>This needs a person, not a self-serve guide.</h3>
                  <p>{guide.escalationMessage}</p>
                </div>
                <div className="answer-body">
                  {guide.contact && (
                    <div className="route-box">
                      <strong>{guide.contact.role}</strong>
                      <p>{guide.contact.when}</p>
                    </div>
                  )}
                </div>
              </>
            )}
            {guide?.kind === 'NoGuideFound' && (
              <>
                <div className="answer-top">
                  <p className="eyebrow">Nothing here yet</p>
                  <h3>No guide for this yet</h3>
                  <p>{guide.noGuideMessage}</p>
                </div>
                {guide.contact && (
                  <div className="answer-body">
                    <div className="route-box">
                      <strong>{guide.contact.role}</strong>
                      <p>{guide.contact.when}</p>
                    </div>
                  </div>
                )}
              </>
            )}
            {guide?.kind === 'Guide' && (
              <>
                <div className="answer-top">
                  <p className="eyebrow">Recommended starting point</p>
                  <h3>{guide.firstStep}</h3>
                  <p>Here's what I heard: “{guide.situation}”</p>
                </div>
                <div className="answer-body">
                  <div className="answer-cols">
                    <div>
                      <h4>Manager-ready prep plan</h4>
                      <ul className="checklist">
                        {guide.prepareSteps.map((step) => (
                          <li key={step}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6" /></svg>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Route &amp; review</h4>
                      {guide.contact && (
                        <div className="route-box">
                          <strong>{guide.contact.role}</strong>
                          <p>{guide.contact.when}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {guide.faqs.length > 0 && (
                    <div className="faq-list">
                      <h4>FAQs</h4>
                      {guide.faqs.map((faq) => (
                        <details key={faq.question}>
                          <summary>{faq.question}</summary>
                          <p>{faq.answer}</p>
                        </details>
                      ))}
                    </div>
                  )}

                  {guide.learningMaterials.length > 0 && (
                    <div className="materials-list">
                      <h4>Learning materials</h4>
                      <ul>
                        {guide.learningMaterials.map((item) => (
                          <li key={item.title}>
                            <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a> <span className="tag">{item.type}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {guide.documentation.length > 0 && (
                    <div className="source-foot">
                      <strong>Source of truth:</strong> {guide.documentation.map((doc) => doc.title).join(' · ')} <span>· approved internal reference</span>
                    </div>
                  )}
                </div>
              </>
            )}
            {!guide && localAnswer && (
              <>
                <div className="answer-top">
                  <p className="eyebrow">Recommended starting point</p>
                  <h3>{localAnswer.title}</h3>
                  <p>{localAnswer.sub}</p>
                </div>
                <div className="answer-body">
                  <div className="answer-cols">
                    <div>
                      <h4>Manager-ready prep plan</h4>
                      <ul className="checklist">
                        <li>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6" /></svg>
                          <span>Start with observable facts, impact, and the expectation—not assumptions about intent.</span>
                        </li>
                        <li>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6" /></svg>
                          <span>Invite the employee’s perspective and ask what support would help.</span>
                        </li>
                        <li>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6" /></svg>
                          <span>Agree on one or two clear next steps and a follow-up date.</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4>Route &amp; review</h4>
                      <div className="route-box">
                        <strong>{localAnswer.routeTitle}</strong>
                        <p>{localAnswer.routeText}</p>
                      </div>
                    </div>
                  </div>
                  <div className="source-foot">
                    <strong>Source of truth:</strong> 07_Training and Development / Performance Management / Manager User Guide - Performance Conversation.pdf <span>· approved internal reference</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <aside>
          <div className="card side-card">
            <h3>Human review guardrails</h3>
            <div className="guardrail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3 4 6v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V6l-8-3Z" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span>No final disciplinary, termination, compensation, or legal decisions.</span>
            </div>
            <div className="guardrail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="8" r="3" />
                <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
              </svg>
              <span>Use anonymized details. Do not paste case files or private messages.</span>
            </div>
            <div className="guardrail">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
                <path d="M4 5.5v16" />
              </svg>
              <span>Every suggestion points back to an approved source.</span>
            </div>
          </div>
          <div className="card side-card">
            <p className="eyebrow">Pilot principle</p>
            <h3>Make the next move easier, not the decision for them.</h3>
            <p className="muted" style={{ fontSize: '12px', marginBottom: 0 }}>Compass is a navigation layer for everyday questions. Complex, sensitive, or uncertain situations stay with the right HR owner.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
