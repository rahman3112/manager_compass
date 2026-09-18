import { useState } from 'react';
import { submitPlanFeedback } from '../api/client';

interface PlanFeedbackProps {
  planId: string;
}

export function PlanFeedback({ planId }: PlanFeedbackProps) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  async function choose(wasHelpful: boolean) {
    setSelected(wasHelpful);
    if (wasHelpful) {
      await submitPlanFeedback(planId, true);
      setSubmitted(true);
    }
  }

  async function sendComment() {
    if (selected === null) return;
    await submitPlanFeedback(planId, selected, comment.trim() || undefined);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="feedback-box">
        <p className="feedback-thanks">Thanks — that helps us improve this guide.</p>
      </div>
    );
  }

  return (
    <div className="feedback-box">
      <p>Was this plan helpful?</p>
      <div className="feedback-buttons">
        <button className={`feedback-btn ${selected === true ? 'selected' : ''}`} onClick={() => choose(true)}>👍 Yes</button>
        <button className={`feedback-btn ${selected === false ? 'selected' : ''}`} onClick={() => choose(false)}>👎 Not quite</button>
      </div>
      {selected === false && (
        <>
          <textarea
            className="feedback-comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="What was missing or unclear? (optional)"
          />
          <div className="task-form-actions">
            <button className="btn btn-primary" onClick={sendComment}>Send feedback</button>
          </div>
        </>
      )}
    </div>
  );
}
