import type { Category } from '../types/category';
import type { Guide, GuideRequest } from '../types/guide';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5171';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function fetchCategories(): Promise<Category[]> {
  return request<Category[]>('/api/categories');
}

export function generateGuide(guideRequest: GuideRequest): Promise<Guide> {
  return request<Guide>('/api/guides', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(guideRequest),
  });
}
