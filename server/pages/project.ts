import type { CodeMap } from '../types/index.js';
import { wrapHtmlDocument } from '../components/layout/html-document.js';
import { renderHeader } from '../components/layout/header.js';
import { renderSidebar, closeSidebar } from '../components/layout/sidebar.js';
import { renderInlineViewer } from '../components/views/codemap-inline.js';

export function generateProjectPage(projectPath: string, codemaps: CodeMap[]): string {
  const projectName = projectPath.split('/').pop() || 'Project';
  const header = renderHeader({ projectCount: 0, codemapCount: codemaps.length, currentProject: projectPath });
  const sidebar = renderSidebar();
  const viewer = renderInlineViewer();

  return wrapHtmlDocument({
    title: `Project: ${projectName}`,
    type: 'dashboard',
    content: `${header}${sidebar}${viewer}${closeSidebar()}`,
    currentProject: projectPath
  });
}
