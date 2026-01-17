import { escapeHtml } from '../../lib/utils.js';

interface HeaderProps {
  projectCount: number;
  codemapCount: number;
  currentProject?: string;
}

export function renderHeader({ projectCount, codemapCount, currentProject }: HeaderProps): string {
  const backBtn = currentProject ? '<a href="/" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Dashboard</a>' : '';
  const projectStat = !currentProject ? `
    <div class="stat-item">
      <div class="stat-value">${projectCount}</div>
      <div class="stat-label">Projects</div>
    </div>
  ` : '';

  return `
    <header>
      <div class="header-left">
        ${backBtn}
        <div class="logo">CodeMap<span>.Server</span></div>
      </div>
      <div class="stats">
        ${projectStat}
        <div class="stat-item">
          <div class="stat-value">${codemapCount}</div>
          <div class="stat-label">CodeMaps</div>
        </div>
      </div>
    </header>
  `;
}
