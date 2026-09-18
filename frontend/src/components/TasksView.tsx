import { useEffect, useState } from 'react';
import { fetchCategories, fetchDashboardSummary, fetchTasks, updateTask } from '../api/client';
import type { Category } from '../types/category';
import type { DashboardSummary, ManagerTask, ManagerTaskStatus } from '../types/task';
import { TaskForm } from './TaskForm';

interface TasksViewProps {
  active: boolean;
  onNavigateHome: () => void;
}

type FilterMode = 'active' | 'history';

const STATUS_LABELS: Record<ManagerTaskStatus, string> = {
  NotStarted: 'Not Started',
  InProgress: 'In Progress',
  Completed: 'Completed',
  Blocked: 'Blocked',
};

const ALL_STATUSES: ManagerTaskStatus[] = ['NotStarted', 'InProgress', 'Completed', 'Blocked'];

export function TasksView({ active, onNavigateHome }: TasksViewProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tasks, setTasks] = useState<ManagerTask[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('active');
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ManagerTask | null>(null);

  function refreshAll() {
    fetchTasks().then(setTasks).catch(() => setTasks([]));
    fetchDashboardSummary().then(setSummary).catch(() => setSummary(null));
  }

  useEffect(() => {
    if (!active) return;
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  async function handleStatusChange(task: ManagerTask, status: ManagerTaskStatus) {
    const updated = await updateTask(task.id, {
      name: task.name,
      categoryId: task.categoryId,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status,
      checklist: task.checklist,
      sourcePlanId: task.sourcePlanId,
    });
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    fetchDashboardSummary().then(setSummary).catch(() => {});
  }

  function categoryName(categoryId: string) {
    return categories.find((c) => c.id === categoryId)?.name ?? categoryId;
  }

  const visibleTasks = tasks.filter((t) => (filterMode === 'active' ? t.status !== 'Completed' : t.status === 'Completed'));

  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-tasks" aria-labelledby="tasks-title">
      <div className="view-header">
        <div>
          <p className="eyebrow">Your workload</p>
          <h2 id="tasks-title">Your plans, in one place.</h2>
          <p>Everything created from Compass, plus anything you've added yourself.</p>
        </div>
        <button className="btn btn-quiet" onClick={onNavigateHome}>← Back to home</button>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <div className="stat-value">{summary?.openTasks ?? '–'}</div>
          <div className="stat-label">Open plans assigned</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{summary?.overdue ?? '–'}</div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{summary?.dueWithinThreeDays ?? '–'}</div>
          <div className="stat-label">Due within 3 days</div>
        </div>
        <div className="stat-tile">
          <div className="stat-value">{summary?.totalPlans ?? '–'}</div>
          <div className="stat-label">Total plans created</div>
        </div>
      </div>

      <div className="tasks-toolbar">
        <div className="segment">
          <button className={filterMode === 'active' ? 'active' : ''} onClick={() => setFilterMode('active')}>Active</button>
          <button className={filterMode === 'history' ? 'active' : ''} onClick={() => setFilterMode('history')}>History</button>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New plan</button>
      </div>

      {visibleTasks.length === 0 ? (
        <div className="card empty-tasks">
          {filterMode === 'active' ? 'No active plans. Create one, or generate a plan in Compass.' : 'No completed plans yet.'}
        </div>
      ) : (
        <div className="task-list">
          {visibleTasks.map((task) => {
            const doneCount = task.checklist.filter((c) => c.done).length;
            return (
              <div className="card task-card task-card-clickable" key={task.id} onClick={() => setSelectedTask(task)}>
                <div className="task-card-main">
                  <h3>{task.name}</h3>
                  <div className="task-card-meta">
                    <span className={`badge badge-priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <span>{categoryName(task.categoryId)}</span>
                    {task.dueDate && <span>Due {task.dueDate}</span>}
                    {task.checklist.length > 0 && <span className="task-progress">{doneCount}/{task.checklist.length} tasks done</span>}
                  </div>
                </div>
                <select
                  className="task-select"
                  value={task.status}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => handleStatusChange(task, event.target.value as ManagerTaskStatus)}
                >
                  {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <TaskForm
          categories={categories}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            refreshAll();
          }}
        />
      )}

      {selectedTask && (
        <TaskForm
          categories={categories}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSaved={() => {
            setSelectedTask(null);
            refreshAll();
          }}
        />
      )}
    </section>
  );
}
