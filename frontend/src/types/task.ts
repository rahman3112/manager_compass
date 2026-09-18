export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type ManagerTaskStatus = 'NotStarted' | 'InProgress' | 'Completed' | 'Blocked';

export interface ChecklistItem {
  text: string;
  done: boolean;
}

export interface ManagerTask {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  dueDate: string | null;
  priority: TaskPriority;
  status: ManagerTaskStatus;
  checklist: ChecklistItem[];
  createdAt: string;
  sourcePlanId?: string | null;
}

export interface TaskRequest {
  name: string;
  categoryId: string;
  description: string;
  dueDate: string | null;
  priority: TaskPriority;
  status: ManagerTaskStatus;
  checklist: ChecklistItem[];
  sourcePlanId?: string | null;
}

export interface DashboardSummary {
  openTasks: number;
  overdue: number;
  dueWithinThreeDays: number;
  totalPlans: number;
}
