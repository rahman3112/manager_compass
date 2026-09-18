import type { Category } from '../types/category';
import type { Guide, GuideRequest } from '../types/guide';
import type { Scenario } from '../types/scenario';
import type { DashboardSummary, ManagerTask, TaskRequest } from '../types/task';
import type { ResourceNode } from '../types/resource';

// In dev, the Vite server and the API run on different ports, so default to the
// local API port. In a production build served from the same origin as the API
// (see the root Dockerfile), default to '' — a relative path — so no CORS or
// base-URL configuration is needed at all. VITE_API_BASE_URL overrides either case.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:5171' : '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

function jsonInit(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

/** Documentation URLs come back as paths relative to the API (e.g. /assets/raw/...). */
export function resolveAssetUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `${API_BASE_URL}${url}`;
}

export function fetchCategories(country?: string): Promise<Category[]> {
  const query = country ? `?country=${encodeURIComponent(country)}` : '';
  return request<Category[]>(`/api/categories${query}`);
}

export function fetchScenarios(country?: string): Promise<Scenario[]> {
  const query = country ? `?country=${encodeURIComponent(country)}` : '';
  return request<Scenario[]>(`/api/scenarios${query}`);
}

export function generateGuide(guideRequest: GuideRequest): Promise<Guide> {
  return request<Guide>('/api/guides', jsonInit('POST', guideRequest));
}

export function submitPlanFeedback(planId: string, wasHelpful: boolean, comment?: string): Promise<void> {
  return request<void>(`/api/plans/${planId}/feedback`, jsonInit('POST', { wasHelpful, comment }));
}

export function fetchDashboardSummary(): Promise<DashboardSummary> {
  return request<DashboardSummary>('/api/plans/summary');
}

export function fetchTasks(): Promise<ManagerTask[]> {
  return request<ManagerTask[]>('/api/tasks');
}

export function createTask(taskRequest: TaskRequest): Promise<ManagerTask> {
  return request<ManagerTask>('/api/tasks', jsonInit('POST', taskRequest));
}

export function updateTask(id: string, taskRequest: TaskRequest): Promise<ManagerTask> {
  return request<ManagerTask>(`/api/tasks/${id}`, jsonInit('PUT', taskRequest));
}

export function fetchResources(): Promise<ResourceNode[]> {
  return request<ResourceNode[]>('/api/resources');
}
