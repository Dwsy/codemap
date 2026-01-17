import { escapeHtml, detectLanguage } from '../../lib/utils.js';
import { renderMarkdown } from '../../lib/markdown.js';
import type { CodeMap } from '../../types/index.js';

export function renderCodeMapDetail(codemap: CodeMap, isFragment = false): string {
  const { title, description, mermaidDiagram, traces } = codemap;

  const header = isFragment ? `
    <div class="inline-viewer-header">
      <h2 class="inline-viewer-title">${escapeHtml(title)}</h2>
      <a href="/view/${codemap.id}" class="btn" target="_blank"><i class="fa-solid fa-up-right-from-square"></i> Open in new tab</a>
    </div>
    <p style="color:var(--text-secondary);margin-bottom:20px;">${escapeHtml(description)}</p>
  ` : `
    <header>
      <a href="/" class="back-link"><i class="fa-solid fa-arrow-left"></i> Back to Dashboard</a>
      <h1>${escapeHtml(title)}</h1>
      <p class="description">${escapeHtml(description)}</p>
    </header>
  `;

  const tracesHtml = traces.map((trace) => `
    <div class="trace">
      <div class="trace-header" onclick="toggleTrace('${trace.id}')">
        <h3>${escapeHtml(trace.title)}</h3>
        <span class="trace-toggle" id="toggle-${trace.id}">▼</span>
      </div>
      <div class="trace-content" id="content-${trace.id}">
        ${trace.traceTextDiagram ? `<h4 class="subsection-title">调用树</h4><pre class="text-diagram">${escapeHtml(trace.traceTextDiagram)}</pre>` : ''}
        ${trace.locations?.length ? `
          <h4 class="subsection-title">关键代码节点</h4>
          <div class="locations">
            ${trace.locations.map((loc) => `
              <div class="location-item">
                <span class="location-id">${escapeHtml(loc.id)}</span>
                <div class="location-path">${escapeHtml(loc.path)}</div>
                <div class="location-line">行号: ${loc.lineNumber}</div>
                <div class="location-code"><pre><code class="language-${detectLanguage(loc.path)}">${escapeHtml(loc.lineContent)}</code></pre></div>
                <div style="margin-top:8px;color:var(--text-secondary);font-size:0.9rem;">${escapeHtml(loc.description)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${trace.traceGuide ? `<h4 class="subsection-title">详细指南</h4><div class="guide-content">${renderMarkdown(trace.traceGuide)}</div>` : ''}
      </div>
    </div>
  `).join('');

  if (isFragment) {
    return `
      ${header}
      <div class="section" style="margin-bottom:15px;padding:20px;">
        <h3 style="margin-bottom:15px;font-size:1.1rem;">全局流程图</h3>
        <div class="mermaid-container"><pre class="mermaid">${escapeHtml(mermaidDiagram)}</pre></div>
      </div>
      <div class="section" style="padding:20px;">
        <h3 style="margin-bottom:15px;font-size:1.1rem;">详细追踪链路</h3>
        ${tracesHtml}
      </div>
    `;
  }

  return `
    ${header}
    <div class="section">
      <h2 class="section-title">全局流程图</h2>
      <div class="mermaid-container"><pre class="mermaid">${escapeHtml(mermaidDiagram)}</pre></div>
    </div>
    <div class="section">
      <h2 class="section-title">详细追踪链路</h2>
      ${tracesHtml}
    </div>
  `;
}

export function convertToInfographicSyntax(codemap: CodeMap): string {
  const { title, description, traces } = codemap;
  let syntax = `infographic sequence-snake-steps-compact-card\ndata\n  title ${escapeHtml(title)}\n  desc ${escapeHtml(description || '')}\n  sequences`;

  traces.forEach((trace) => {
    syntax += `\n    - label ${escapeHtml(trace.title)}`;
    if (trace.description) syntax += `\n      desc ${escapeHtml(trace.description)}`;
  });

  syntax += `\ntheme\n  palette\n    - #3b82f6\n    - #8b5cf6\n    - #f97316\n    - #10b981\n    - #06b6d4`;
  return syntax;
}
