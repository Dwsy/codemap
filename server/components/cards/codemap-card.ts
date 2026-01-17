import { escapeHtml } from '../../lib/utils.js';
import type { CodeMap } from '../../types/index.js';

export function renderCodeMapCard(map: CodeMap): string {
  const date = new Date(map.createdAt).toLocaleDateString();
  const projectName = escapeHtml(map.projectPath.split('/').pop() || 'Unknown Project');
  return `
    <div class="card">
      <span class="card-type">CODEMAP // ${escapeHtml(map.id)}</span>
      <h3 class="card-title">${escapeHtml(map.title)}</h3>
      <div class="card-meta">${date}<br>${projectName}</div>
      <div class="card-actions">
        <a href="/view/${map.id}" class="btn btn-primary">VIEW</a>
        <button onclick="deleteMap(event, '${map.id}')" class="btn btn-danger">DELETE</button>
      </div>
    </div>
  `;
}

export function renderCodeMapList(codemaps: CodeMap[], noMargin = false): string {
  const titleStyle = noMargin ? 'style="margin-top:0;"' : '';
  const empty = codemaps.length === 0 ? '<div class="empty-state">No CodeMaps found. Use the CLI to upload one.</div>' : '';
  const cards = codemaps.map(renderCodeMapCard).join('');

  return `
    <div class="section-title" ${titleStyle}>CODEMAPS</div>
    <div class="grid">${empty}${cards}</div>
  `;
}
