import { escapeHtml } from '../../lib/utils.js';
import type { Project } from '../../types/index.js';

export function renderProjectCard(project: Project): string {
  const projectName = escapeHtml(project.path.split('/').pop() || 'Unknown');
  return `
    <a href="/project/${encodeURIComponent(project.path)}" class="card">
      <span class="card-type" style="color: var(--accent-orange);">PROJECT</span>
      <h3 class="card-title">${projectName}</h3>
      <div class="card-meta">${escapeHtml(project.path)}</div>
      <div class="card-actions">
        <span class="btn">OPEN</span>
        <button onclick="deleteProject(event, '${encodeURIComponent(project.path)}')" class="btn btn-danger">UNREGISTER</button>
      </div>
    </a>
  `;
}

export function renderProjectList(projects: Project[]): string {
  const empty = projects.length === 0 ? '<div class="empty-state">No projects registered.</div>' : '';
  const cards = projects.map(renderProjectCard).join('');

  return `
    <div class="section-title">PROJECTS</div>
    <div class="grid">${empty}${cards}</div>
  `;
}
