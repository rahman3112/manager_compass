import { useEffect, useRef, useState } from 'react';
import { fetchCategories, fetchScenarios, generateGuide, resolveAssetUrl } from '../api/client';
import type { Category } from '../types/category';
import type { Guide } from '../types/guide';
import type { Scenario } from '../types/scenario';
import type { ManagerTask, TaskRequest } from '../types/task';
import { PlanFeedback } from './PlanFeedback';
import { TaskForm } from './TaskForm';

interface CompassViewProps {
  active: boolean;
  prefillToken: number;
  prefillText: string;
  categoryToken: number;
  prefillCategoryId: string | null;
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

const COUNTRIES = [
  { value: '', label: 'All countries' },
  { value: 'US', label: 'United States' },
  { value: 'PH', label: 'Philippines' },
];

function classifyAnswer(rawInput: string): AnswerContent {
  const value = rawInput.trim().toLowerCase();
  const isTimeAway = value.includes('time') || value.includes('leave') || value.includes('away');
  const isMovement = value.includes('movement') || value.includes('transfer') || value.includes('emr');
  if (isTimeAway) return TIME_AWAY_ANSWER;
  if (isMovement) return MOVEMENT_ANSWER;
  return PERFORMANCE_ANSWER;
}

function renderStep(step: string) {
  const match = step.match(/^([A-Za-z /]{2,25}):\s(.+)/);
  if (match) {
    return <><strong>{match[1]}:</strong> {match[2]}</>;
  }
  return step;
}

export function CompassView({ active, prefillToken, prefillText, categoryToken, prefillCategoryId, onNavigateHome }: CompassViewProps) {
  const [inputValue, setInputValue] = useState('');
  const [localAnswer, setLocalAnswer] = useState<AnswerContent | null>(null);
  const [country, setCountry] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedScenarioIds, setSelectedScenarioIds] = useState<Set<string>>(new Set());
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);
  const [guideError, setGuideError] = useState<string | null>(null);
  const [taskFormInitial, setTaskFormInitial] = useState<Partial<TaskRequest> | null>(null);
  const [createdTask, setCreatedTask] = useState<ManagerTask | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);
  const appliedCategoryToken = useRef(0);

  useEffect(() => {
    fetchCategories(country || undefined).then(setCategories).catch(() => setCategories([]));
    fetchScenarios(country || undefined).then(setScenarios).catch(() => setScenarios([]));
  }, [country]);

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

  // Category chosen from the Home tiles — wait for categories to load, then jump straight to step 2.
  useEffect(() => {
    if (categoryToken === 0 || categoryToken === appliedCategoryToken.current || !prefillCategoryId) {
      return;
    }
    const category = categories.find((c) => c.id === prefillCategoryId);
    if (category) {
      selectCategory(category);
      appliedCategoryToken.current = categoryToken;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryToken, categories, prefillCategoryId]);

  const scenariosForCategory = scenarios.filter((s) => s.categoryId === selectedCategoryId);
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null;

  function composeSituation(category: Category, scenarioIds: Set<string>) {
    const picked = scenarios.filter((s) => scenarioIds.has(s.id)).map((s) => s.description);
    return picked.length > 0 ? picked.join(' ') : category.defaultSituation;
  }

  function selectCategory(category: Category) {
    setSelectedCategoryId(category.id);
    setSelectedScenarioIds(new Set());
    setInputValue(category.defaultSituation);
    setGuide(null);
    setLocalAnswer(null);
    setGuideError(null);
    setCreatedTask(null);
  }

  function toggleScenario(scenario: Scenario, category: Category) {
    const next = new Set(selectedScenarioIds);
    if (next.has(scenario.id)) {
      next.delete(scenario.id);
    } else {
      next.add(scenario.id);
    }
    setSelectedScenarioIds(next);
    setInputValue(composeSituation(category, next));
    setGuide(null);
  }

  function handleChipClick(fill: string) {
    setSelectedCategoryId(null);
    setSelectedScenarioIds(new Set());
    setGuide(null);
    setInputValue(fill);
  }

  async function handleCreatePlan() {
    setCreatedTask(null);
    if (selectedCategoryId) {
      setGuideError(null);
      setIsLoadingGuide(true);
      try {
        const result = await generateGuide({ categoryId: selectedCategoryId, situation: inputValue.trim(), scenarioIds: Array.from(selectedScenarioIds) });
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

  function openTaskFormFromPlan() {
    if (!guide || guide.kind !== 'Guide' || !selectedCategoryId) return;
    setTaskFormInitial({
      name: guide.firstStep ?? 'Follow up on this plan',
      categoryId: selectedCategoryId,
      description: guide.situation ?? '',
      dueDate: null,
      priority: 'Medium',
      status: 'NotStarted',
      checklist: guide.prepareSteps.map((step) => ({ text: step, done: false })),
      sourcePlanId: guide.planId ?? null,
    });
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

          {selectedCategory && (
            <div className="selected-category-banner">
              <span>{selectedCategory.icon} <strong>{selectedCategory.name}</strong></span>
              <button className="link-btn" onClick={onNavigateHome}>Change category</button>
            </div>
          )}

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
            <button className="btn btn-primary" onClick={handleCreatePlan} disabled={isLoadingGuide || !inputValue.trim()}>
              {isLoadingGuide ? 'Creating plan…' : 'Create Plan'}
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
                  <h3>Here's your plan</h3>
                  <p>Here's what I heard: “{guide.situation}”</p>
                </div>
                <div className="answer-body">
                  <div className="answer-cols">
                    <div>
                      <h4>Step-by-step</h4>
                      <ol className="flow-timeline">
                        {(guide.firstStep ? [guide.firstStep, ...guide.prepareSteps] : guide.prepareSteps).map((step, index) => (
                          <li key={step}>
                            <span className={`flow-num ${index === 0 ? 'flow-num-first' : ''}`}>{index + 1}</span>
                            <span className="flow-content">{renderStep(step)}</span>
                          </li>
                        ))}
                      </ol>
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
                            <a href={resolveAssetUrl(item.url)} target="_blank" rel="noopener">{item.title}</a> <span className="tag">{item.type}</span>
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

                  {createdTask ? (
                    <p className="feedback-thanks create-task-btn">Plan "{createdTask.name}" saved — find it in the Plans tab.</p>
                  ) : (
                    <button className="btn btn-soft create-task-btn" onClick={openTaskFormFromPlan}>+ Save this to your plans</button>
                  )}

                  {guide.planId && <PlanFeedback planId={guide.planId} />}
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
            <h3>{selectedCategory ? `Documents · ${selectedCategory.name}` : 'Documents'}</h3>
            {selectedCategory ? (
              selectedCategory.documentation.length > 0 ? (
                <ul className="doc-list">
                  {selectedCategory.documentation.map((doc) => (
                    <li key={doc.title}>
                      <a href={resolveAssetUrl(doc.url)} target="_blank" rel="noopener">{doc.title}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="doc-empty">No source documents on file for this category yet.</p>
              )
            ) : (
              <p className="doc-empty">Pick a category to see its approved documents here.</p>
            )}
          </div>

          <div className="card country-filter">
            <label htmlFor="countryFilter">Country</label>
            <select id="countryFilter" value={country} onChange={(event) => setCountry(event.target.value)}>
              {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </aside>
      </div>

      {taskFormInitial && selectedCategory && (
        <TaskForm
          categories={categories}
          initial={taskFormInitial}
          onClose={() => setTaskFormInitial(null)}
          onSaved={(task) => {
            setTaskFormInitial(null);
            setCreatedTask(task);
          }}
        />
      )}
    </section>
  );
}
