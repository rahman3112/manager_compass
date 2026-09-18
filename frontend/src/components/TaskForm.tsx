import { useState, type FormEvent } from 'react';
import type { Category } from '../types/category';
import type { ChecklistItem, ManagerTask, ManagerTaskStatus, TaskPriority, TaskRequest } from '../types/task';
import { createTask, updateTask } from '../api/client';

interface TaskFormProps {
  categories: Category[];
  initial?: Partial<TaskRequest>;
  task?: ManagerTask;
  onClose: () => void;
  onSaved: (task: ManagerTask) => void;
}

const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES: ManagerTaskStatus[] = ['NotStarted', 'InProgress', 'Completed', 'Blocked'];

const STATUS_LABELS: Record<ManagerTaskStatus, string> = {
  NotStarted: 'Not Started',
  InProgress: 'In Progress',
  Completed: 'Completed',
  Blocked: 'Blocked',
};

export function TaskForm({ categories, initial, task, onClose, onSaved }: TaskFormProps) {
  const isEditing = Boolean(task);
  const seed = task ?? initial;
  const [name, setName] = useState(seed?.name ?? '');
  const [categoryId, setCategoryId] = useState(seed?.categoryId ?? categories[0]?.id ?? '');
  const [description, setDescription] = useState(seed?.description ?? '');
  const [dueDate, setDueDate] = useState(seed?.dueDate ?? '');
  const [priority, setPriority] = useState<TaskPriority>(seed?.priority ?? 'Medium');
  const [status, setStatus] = useState<ManagerTaskStatus>(seed?.status ?? 'NotStarted');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(seed?.checklist ?? []);
  const [newChecklistText, setNewChecklistText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addChecklistItem() {
    const text = newChecklistText.trim();
    if (!text) return;
    setChecklist([...checklist, { text, done: false }]);
    setNewChecklistText('');
  }

  function removeChecklistItem(index: number) {
    setChecklist(checklist.filter((_, i) => i !== index));
  }

  function toggleChecklistItem(index: number) {
    setChecklist(checklist.map((item, i) => (i === index ? { ...item, done: !item.done } : item)));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !categoryId) {
      setError('Plan name and category are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const request: TaskRequest = {
      name: name.trim(),
      categoryId,
      description: description.trim(),
      dueDate: dueDate || null,
      priority,
      status,
      checklist,
      sourcePlanId: task?.sourcePlanId ?? initial?.sourcePlanId ?? null,
    };
    try {
      const saved = isEditing && task ? await updateTask(task.id, request) : await createTask(request);
      onSaved(saved);
    } catch {
      setError('Could not save this plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const checklistField = (
    <div className="task-field">
      <span>Tasks</span>
      {checklist.map((item, index) => (
        <div className="task-checklist-item" key={index}>
          <input type="checkbox" checked={item.done} onChange={() => toggleChecklistItem(index)} />
          <input type="text" value={item.text} onChange={(event) => {
            const text = event.target.value;
            setChecklist(checklist.map((it, i) => (i === index ? { ...it, text } : it)));
          }} />
          <button type="button" className="task-remove-btn" onClick={() => removeChecklistItem(index)} aria-label="Remove item">×</button>
        </div>
      ))}
      <div className="task-add-row">
        <input
          type="text"
          value={newChecklistText}
          onChange={(event) => setNewChecklistText(event.target.value)}
          placeholder="Add a task"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addChecklistItem();
            }
          }}
        />
        <button type="button" className="btn btn-quiet" onClick={addChecklistItem}>Add</button>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <p className="eyebrow">{isEditing ? 'Edit plan' : 'New plan'}</p>
        <h2>{isEditing ? name || 'Edit plan' : 'Create a plan'}</h2>
        <form className="task-form" onSubmit={handleSubmit}>
          <label className="task-field">
            <span>Plan name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Follow up on payroll dispute" required />
          </label>

          {isEditing ? (
            checklistField
          ) : (
            <>
              <div className="task-row">
                <label className="task-field">
                  <span>Category</span>
                  <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.icon} {category.name}</option>
                    ))}
                  </select>
                </label>
                <label className="task-field">
                  <span>Due date</span>
                  <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
                </label>
              </div>

              <label className="task-field">
                <span>Description</span>
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What needs to happen?" />
              </label>

              <div className="task-row">
                <label className="task-field">
                  <span>Priority</span>
                  <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </label>
                <label className="task-field">
                  <span>Status</span>
                  <select value={status} onChange={(event) => setStatus(event.target.value as ManagerTaskStatus)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </label>
              </div>

              {checklistField}
            </>
          )}

          {error && <p className="task-form-error">{error}</p>}

          <div className="task-form-actions">
            <button type="button" className="btn btn-quiet" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Save plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
