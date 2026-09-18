import { useEffect, useState } from 'react';
import { fetchResources, resolveAssetUrl } from '../api/client';
import type { ResourceNode } from '../types/resource';

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

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Handbook & Policies': 'Attendance, code of conduct, flexible work, PTO, and return-to-work policies.',
  'Training & Development': 'Performance conversations, SMART goals, leader toolkits, and change management.',
  'Employee Relations & Guardrails': 'Resignation, offboarding, employee movement, and incentive request guides.',
  'Talent Services & Intake Routing': 'Global, PH, and US paths for onboarding, offboarding, and EMR.',
};

interface FlatFile {
  name: string;
  url: string;
  extension: string;
  path: string;
}

function flattenCategory(category: ResourceNode): FlatFile[] {
  const result: FlatFile[] = [];

  function walk(node: ResourceNode, trail: string[]) {
    const children = node.children ?? [];
    for (const child of children) {
      if (child.isFolder) {
        walk(child, [...trail, child.name]);
      } else if (child.url) {
        result.push({
          name: child.name,
          url: child.url,
          extension: child.extension ?? '',
          path: trail.join(' / '),
        });
      }
    }
  }

  walk(category, []);
  return result;
}

/** Groups an already-flattened file list back into its subfolder sections, in first-seen order. */
function groupByPath(files: FlatFile[]): { path: string; files: FlatFile[] }[] {
  const groups: { path: string; files: FlatFile[] }[] = [];
  for (const file of files) {
    const existing = groups.find((g) => g.path === file.path);
    if (existing) {
      existing.files.push(file);
    } else {
      groups.push({ path: file.path, files: [file] });
    }
  }
  return groups;
}

export function ResourcesView({ active, onNavigateHome }: ResourcesViewProps) {
  const [tree, setTree] = useState<ResourceNode[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchResources().then(setTree).catch(() => setTree([]));
  }, []);

  function toggleCategory(name: string) {
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  const totalFiles = tree.reduce((sum, category) => sum + flattenCategory(category).length, 0);

  return (
    <section className={`view ${active ? 'active' : ''}`} id="view-resources" aria-labelledby="resources-title">
      <div className="view-header">
        <div>
          <p className="eyebrow">Approved internal library</p>
          <h2 id="resources-title">Your source of truth, organized.</h2>
          <p>{totalFiles} real approved documents across {tree.length} categories — the same files Compass grounds its guides in.</p>
        </div>
        <button type="button" className="btn btn-quiet" onClick={onNavigateHome}>← Back to home</button>
      </div>

      <div className="resource-groups">
        {tree.map((category) => {
          const files = flattenCategory(category);
          const grouped = groupByPath(files);
          const isCollapsed = collapsed[category.name] ?? false;
          return (
            <div className="card resource-group" key={category.name}>
              <button
                type="button"
                className="resource-group-head resource-group-head-toggle"
                onClick={() => toggleCategory(category.name)}
                aria-expanded={!isCollapsed}
              >
                <div className="file-icon">{FILE_ICON}</div>
                <div className="resource-group-head-text">
                  <h3>{category.name}</h3>
                  <p>{CATEGORY_DESCRIPTIONS[category.name] ?? ''}</p>
                </div>
                <span className="tag">{files.length} document{files.length === 1 ? '' : 's'}</span>
                <svg
                  className={`resource-group-chevron ${isCollapsed ? '' : 'open'}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m7 10 5 5 5-5" />
                </svg>
              </button>

              {!isCollapsed && grouped.map((group) => (
                <div className="resource-subgroup" key={group.path || '__root'}>
                  {group.path && <p className="resource-subgroup-label">{group.path}</p>}
                  <ul className="resource-file-list">
                    {group.files.map((file, index) => (
                      <li key={index}>
                        <a href={resolveAssetUrl(file.url)} target="_blank" rel="noopener">
                          <span className="file-ext-badge">{file.extension}</span>
                          <span>{file.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
