import type { Project, CodeMap } from '../types/index.js';
import { wrapHtmlDocument } from '../components/layout/html-document.js';
import { renderHeader } from '../components/layout/header.js';
import { renderProjectList } from '../components/cards/project-card.js';
import { renderCodeMapList } from '../components/cards/codemap-card.js';

export function generateDashboardPage(projects: Project[], codemaps: CodeMap[]): string {
  const header = renderHeader({ projectCount: projects.length, codemapCount: codemaps.length });
  const codemapList = renderCodeMapList(codemaps);
  const projectList = renderProjectList(projects);

  return wrapHtmlDocument({
    title: 'CodeMap Server',
    type: 'dashboard',
    content: `${header}${codemapList}${projectList}`
  });
}
