export function getDashboardScript(currentProject?: string): string {
  const baseScript = `
    async function deleteMap(e, id) {
      e.preventDefault(); e.stopPropagation();
      if (!confirm('Are you sure you want to delete this CodeMap?')) return;
      try { await fetch('/api/codemaps/' + id, { method: 'DELETE' }); window.location.reload(); }
      catch (e) { alert('Delete failed'); }
    }
    async function deleteProject(e, path) {
      e.preventDefault(); e.stopPropagation();
      if (!confirm('Are you sure you want to unregister this project?')) return;
      try { await fetch('/api/projects/' + path, { method: 'DELETE' }); window.location.reload(); }
      catch (e) { alert('Delete failed'); }
    }
  `;

  if (!currentProject) return baseScript;

  return baseScript + `
    function escapeHtml(text) { return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

    let codemapList = [];
    async function loadDocsCodemaps() {
      try {
        const res = await fetch('/api/projects/${encodeURIComponent(currentProject)}/docs-codemaps');
        codemapList = await res.json();
        const container = document.getElementById('codemap-tree');
        if (!codemapList.length) { container.innerHTML = '<div style="padding:10px;color:#6c757d;">No CodeMaps in docs/codemap</div>'; return; }
        renderCodemapList(codemapList);
      } catch (e) { document.getElementById('codemap-tree').innerHTML = '<div style="padding:10px;">Failed to load</div>'; }
    }

    function renderCodemapList(items) {
      const container = document.getElementById('codemap-tree');
      if (!items.length) { container.innerHTML = '<div style="padding:10px;color:#6c757d;font-size:0.9rem;">No results found</div>'; return; }
      container.innerHTML = items.map(item => \`
        <div class="codemap-item" data-path="\${escapeHtml(item.path)}" data-title="\${escapeHtml(item.title)}" data-desc="\${escapeHtml(item.description)}" onclick="selectCodemap(this, '\${escapeHtml(item.path)}')">
          <div class="codemap-item-title"><i class="fa-solid fa-diagram-project" style="margin-right:6px;"></i>\${escapeHtml(item.title)}</div>
          <div class="codemap-item-desc">\${escapeHtml(item.description)}</div>
        </div>
      \`).join('');
    }

    function filterCodemaps(query) {
      const q = query.toLowerCase().trim();
      if (!q) { renderCodemapList(codemapList); return; }
      const filtered = codemapList.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
      renderCodemapList(filtered);
    }

    let currentViewer = null;

    async function selectCodemap(el, path) {
      document.querySelectorAll('.codemap-item').forEach(i => i.classList.remove('active'));
      el.classList.add('active');
      const viewer = document.getElementById('inline-viewer');
      viewer.innerHTML = '<div class="inline-viewer-empty">Loading...</div>';
      try {
        const res = await fetch('/api/codemaps/from-file?path=' + encodeURIComponent(path));
        if (!res.ok) throw new Error('Load failed');
        const cm = await res.json();
        viewer.innerHTML = '';
        if (typeof CodeMapViewer !== 'undefined') {
          if (currentViewer) {
            currentViewer.destroy();
            currentViewer = null;
          }
          currentViewer = new CodeMapViewer(viewer, { codemap: cm, isFragment: true });
          if (typeof mermaid !== 'undefined') setTimeout(() => mermaid.init(undefined, viewer.querySelectorAll('.mermaid')), 100);
        } else {
          viewer.innerHTML = '<div class="inline-viewer-empty">Component not loaded</div>';
        }
      } catch (e) { viewer.innerHTML = '<div class="inline-viewer-empty">Failed to load CodeMap: ' + e.message + '</div>'; }
    }

    document.addEventListener('DOMContentLoaded', () => {
      loadDocsCodemaps();
      const searchInput = document.getElementById('codemap-search');
      if (searchInput) searchInput.addEventListener('input', (e) => filterCodemaps(e.target.value));
    });
  `;
}

export function getViewScript(): string {
  return `
    let viewViewer = null;
    document.addEventListener('DOMContentLoaded', () => {
      const viewerEl = document.getElementById('codemap-viewer');
      if (viewerEl && typeof CodeMapViewer !== 'undefined') {
        const codemapData = viewerEl.getAttribute('data-codemap');
        if (codemapData) {
          const codemap = JSON.parse(codemapData);
          viewViewer = new CodeMapViewer(viewerEl, { codemap: codemap, isFragment: false });
          if (typeof mermaid !== 'undefined') setTimeout(() => mermaid.init(undefined, viewerEl.querySelectorAll('.mermaid')), 100);
        }
      }
    });
    Prism.highlightAll();
  `;
}

export function getInfographicScript(title: string, syntax: string): string {
  return `
    const infographic = new AntVInfographic.Infographic({ container: '#container', width: '100%', height: '100%' });
    const syntax = \`${syntax}\`;
    infographic.render(syntax);
    document.fonts?.ready.then(() => infographic.render(syntax)).catch(console.error);
    async function exportSVG() {
      try {
        const svgDataUrl = await infographic.toDataURL({ type: 'svg' });
        const link = document.createElement('a'); link.href = svgDataUrl; link.download = '${title}-infographic.svg'; link.click();
      } catch (error) { console.error('Export failed:', error); alert('导出失败'); }
    }
  `;
}
