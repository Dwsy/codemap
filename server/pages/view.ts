import type { CodeMap } from '../types/index.js';
import { wrapHtmlDocument, wrapInfographicDocument } from '../components/layout/html-document.js';

export function generateViewPage(codemap: CodeMap): string {
  const content = `
    <codemap-viewer
      id="codemap-viewer"
      data-codemap='${JSON.stringify(codemap).replace(/'/g, "&#39;")}'
    ></codemap-viewer>
  `;

  return wrapHtmlDocument({ title: codemap.title, type: 'view', content });
}

export function generateInfographicPage(codemap: CodeMap): string {
  const { title, description, traces } = codemap;
  let syntax = `infographic sequence-snake-steps-compact-card\ndata\n  title ${escapeHtml(title)}\n  desc ${escapeHtml(description || '')}\n  sequences`;

  traces.forEach((trace) => {
    syntax += `\n    - label ${escapeHtml(trace.title)}`;
    if (trace.description) syntax += `\n      desc ${escapeHtml(trace.description)}`;
  });

  syntax += `\ntheme\n  palette\n    - #3b82f6\n    - #8b5cf6\n    - #f97316\n    - #10b981\n    - #06b6d4`;
  return wrapInfographicDocument(title, syntax);
}

export function generateHtmlFragment(codemap: CodeMap): string {
  return `
    <codemap-viewer
      id="codemap-viewer"
      is-fragment
      data-codemap='${JSON.stringify(codemap).replace(/'/g, "&#39;")}'
    ></codemap-viewer>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}