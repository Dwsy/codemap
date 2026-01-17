import { escapeHtml } from '../../lib/utils.js';
import { getDashboardStyles, getViewStyles, getInfographicStyles } from '../base/styles.js';
import { getDashboardScript, getViewScript, getInfographicScript } from '../base/scripts.js';
import { getInfographicScriptPath } from '../../lib/markdown.js';

interface HtmlDocOptions {
  title: string;
  type: 'dashboard' | 'view' | 'infographic';
  content: string;
  currentProject?: string;
}

export function wrapHtmlDocument({ title, type, content, currentProject }: HtmlDocOptions): string {
  const fonts = '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@300;400;600&display=swap" rel="stylesheet">';

  if (type === 'dashboard') {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${fonts}
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
  <style>${getDashboardStyles()}</style>
</head>
<body>
  <div class="container">${content}</div>
  <script src="${getInfographicScriptPath()}"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
  <script>
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({ 
        startOnLoad: false, 
        theme: 'default',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        securityLevel: 'loose',
        logLevel: 'error'
      });
    }
  </script>
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({ startOnLoad: false, theme: 'default' });
    }
  </script>
  <script type="module">
    import CodeMapViewer from '/components/codemap-viewer.js';
    window.CodeMapViewer = CodeMapViewer;
    console.log('Dashboard: CodeMapViewer loaded:', typeof CodeMapViewer, CodeMapViewer);
  </script>
  <script>${getDashboardScript(currentProject)}</script>
</body>
</html>`;
  }

  if (type === 'view') {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - CodeMap</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css" rel="stylesheet" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
  <style>${getViewStyles()}</style>
</head>
<body>
  <div class="container">${content}</div>
  <script src="${getInfographicScriptPath()}"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
  <script>
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({ 
        startOnLoad: false, 
        theme: 'default',
        flowchart: {
          useMaxWidth: true,
          htmlLabels: true,
          curve: 'basis'
        },
        securityLevel: 'loose',
        logLevel: 'error'
      });
    }
  </script>
  <script type="module">
    import CodeMapViewer from '/components/codemap-viewer.js';
    window.CodeMapViewer = CodeMapViewer;
    console.log('View: CodeMapViewer loaded:', typeof CodeMapViewer, CodeMapViewer);
  </script>
  <script>${getViewScript()}</script>
</body>
</html>`;
  }

  return '';
}

export function wrapInfographicDocument(title: string, syntax: string): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Infographic</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
  <style>${getInfographicStyles()}</style>
</head>
<body>
  <a href="/" class="btn back-btn"><i class="fa-solid fa-arrow-left"></i> Dashboard</a>
  <button class="btn export-btn" onclick="exportSVG()"><i class="fa-solid fa-download"></i> 导出 SVG</button>
  <div id="container"></div>
  <script src="https://unpkg.com/@antv/infographic@latest/dist/infographic.min.js"></script>
  <script>${getInfographicScript(escapeHtml(title), escapeHtml(syntax))}</script>
</body>
</html>`;
}
