export function getDashboardStyles(): string {
  return `
    :root {
      --bg-body: #f8f9fa; --bg-card: #ffffff; --text-primary: #212529;
      --text-secondary: #6c757d; --accent-cyan: #0d6efd; --accent-orange: #fd7e14;
      --border: #dee2e6; --hover: #f1f3f5; --shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Space Grotesk', -apple-system, sans-serif; background: var(--bg-body); color: var(--text-primary); min-height: 100vh; padding: 40px; }
    .container { max-width: 1400px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding: 20px 30px; background: var(--bg-card); border-radius: 12px; box-shadow: var(--shadow); border: 1px solid var(--border); }
    .header-left { display: flex; align-items: center; gap: 20px; }
    .back-btn { text-decoration: none; color: var(--text-secondary); font-weight: 500; display: flex; align-items: center; }
    .back-btn:hover { color: var(--accent-cyan); }
    .logo { font-family: 'JetBrains Mono', monospace; font-size: 1.5rem; font-weight: 700; color: var(--text-primary); letter-spacing: -1px; }
    .logo span { color: var(--accent-cyan); }
    .stats { display: flex; gap: 40px; }
    .stat-item { text-align: right; }
    .stat-value { font-family: 'JetBrains Mono', monospace; font-size: 1.8rem; font-weight: 700; line-height: 1; color: var(--text-primary); }
    .stat-label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px; }
    .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 25px; transition: all 0.2s ease; position: relative; box-shadow: var(--shadow); display: flex; flex-direction: column; text-decoration: none; color: inherit; }
    .card:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0,0,0,0.08); border-color: var(--accent-cyan); }
    a.card { cursor: pointer; }
    .layout-wrapper { display: flex; gap: 30px; min-height: calc(100vh - 120px); }
    .sidebar { width: 300px; flex-shrink: 0; background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 20px; overflow-y: auto; max-height: calc(100vh - 120px); }
    .main-content { flex-grow: 1; min-width: 0; }
    .codemap-tree { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--text-secondary); }
    .codemap-item { padding: 10px 12px; margin: 4px 0; border-radius: 6px; cursor: pointer; border-left: 3px solid transparent; transition: all 0.15s; }
    .codemap-item:hover { background: var(--hover); border-left-color: var(--accent-cyan); }
    .codemap-item.active { background: #e7f1ff; border-left-color: var(--accent-cyan); }
    .codemap-item-title { font-weight: 600; color: var(--text-primary); margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
    .codemap-item-desc { font-size: 0.75rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-type { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--accent-cyan); margin-bottom: 8px; display: block; font-weight: 600; text-transform: uppercase; }
    .card-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 8px; line-height: 1.3; color: var(--text-primary); }
    .card-meta { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px; font-family: 'JetBrains Mono', monospace; word-break: break-all; }
    .card-actions { display: flex; gap: 10px; margin-top: auto; }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 8px 14px; background: transparent; border: 1px solid var(--border); color: var(--text-primary); text-decoration: none; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; border-radius: 6px; transition: all 0.2s; cursor: pointer; font-weight: 500; }
    .btn:hover { background: var(--hover); border-color: var(--text-secondary); }
    .btn-primary { background: var(--accent-cyan); color: white; border-color: var(--accent-cyan); }
    .btn-primary:hover { background: #0b5ed7; border-color: #0a58ca; }
    .btn-danger { color: #dc3545; border-color: #f8d7da; background: #fdfdfe; }
    .btn-danger:hover { background: #dc3545; color: white; border-color: #dc3545; }
    .empty-state { grid-column: 1 / -1; text-align: center; padding: 60px 0; color: var(--text-secondary); background: var(--bg-card); border: 1px dashed var(--border); border-radius: 8px; }
    .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin: 50px 0 20px; display: flex; align-items: center; gap: 15px; }
    .section-title::after { content: ''; height: 1px; background: var(--border); flex-grow: 1; }
    .inline-viewer { background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 25px; min-height: 400px; }
    .inline-viewer-empty { display: flex; align-items: center; justify-content: center; height: 300px; color: var(--text-secondary); }
    .inline-viewer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--border); }
    .inline-viewer-title { font-size: 1.4rem; font-weight: 600; }
    .inline-viewer-content { overflow: auto; }
    .inline-viewer-actions { display: flex; gap: 10px; }
    .btn.active { background: var(--accent-cyan); color: white; border-color: var(--accent-cyan); }
    .view-mode { display: none; }
    .view-mode.active { display: block; }
    .section { margin-bottom: 15px; padding: 20px; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border); }
    .section-title { margin-bottom: 15px; font-size: 1.1rem; font-weight: 600; color: var(--text-primary); }
    .mermaid-container { background: var(--bg-secondary, #f8f9fa); padding: 20px; border-radius: 8px; }
    .mermaid-container pre { margin: 0; }
    .infographic-container { width: 100%; min-height: 400px; background: var(--bg-secondary, #f8f9fa); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .infographic-container #infographic-render { width: 100%; height: 100%; }
    .trace { border: 1px solid var(--border); border-radius: 8px; margin-bottom: 20px; overflow: hidden; }
    .trace-header { background: var(--bg-secondary, #f8f9fa); padding: 15px 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: background 0.2s; }
    .trace-header:hover { background: #e9ecef; }
    .trace-header h3 { margin: 0; font-size: 1.2rem; color: var(--text-primary); }
    .trace-toggle { font-size: 1.5rem; transition: transform 0.3s; color: var(--text-secondary); }
    .trace-toggle.collapsed { transform: rotate(-90deg); }
    .trace-content { padding: 20px; }
    .trace-content.collapsed { display: none; }
    .subsection-title { font-size: 1.1rem; margin: 20px 0 10px 0; font-weight: 600; color: var(--text-primary); }
    .location-item { background: var(--bg-secondary, #f8f9fa); padding: 15px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid var(--accent-cyan); }
    .location-id { background: var(--accent-cyan); color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; }
    .location-path { font-size: 0.85rem; color: var(--text-secondary); margin: 5px 0; }
    .location-code { background: #f8f9fa; padding: 12px; border-radius: 6px; overflow-x: auto; margin-top: 5px; }
    .location-code pre { margin: 0; }
  `;
}

export function getViewStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root { --bg-primary: #fff; --bg-secondary: #f8f9fa; --text-primary: #212529; --text-secondary: #495057; --border-color: #dee2e6; --accent-color: #0d6efd; --shadow: 0 2px 8px rgba(0,0,0,0.1); }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg-secondary); color: var(--text-primary); line-height: 1.6; padding: 20px; }
    .container { max-width: 1400px; margin: 0 auto; }
    header { background: var(--bg-primary); padding: 30px; border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 20px; }
    .back-link { display: inline-block; margin-bottom: 15px; color: var(--accent-color); text-decoration: none; font-weight: 500; }
    .back-link:hover { text-decoration: underline; }
    h1 { font-size: 2rem; margin-bottom: 10px; }
    .description { color: var(--text-secondary); font-size: 1.1rem; }
    .section { background: var(--bg-primary); padding: 25px; border-radius: 12px; box-shadow: var(--shadow); margin-bottom: 20px; }
    .section-title { font-size: 1.5rem; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid var(--border-color); }
    .mermaid-container { background: var(--bg-secondary); padding: 20px; border-radius: 8px; }
    .trace { border: 1px solid var(--border-color); border-radius: 8px; margin-bottom: 20px; overflow: hidden; }
    .trace-header { background: var(--bg-secondary); padding: 15px 20px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
    .trace-header:hover { background: #e9ecef; }
    .trace-header h3 { margin: 0; font-size: 1.2rem; }
    .trace-toggle { font-size: 1.5rem; transition: transform 0.3s; }
    .trace-toggle.collapsed { transform: rotate(-90deg); }
    .trace-content { padding: 20px; }
    .trace-content.collapsed { display: none; }
    .subsection-title { font-size: 1.1rem; margin: 20px 0 10px 0; font-weight: 600; }
    .text-diagram { background: var(--bg-secondary); padding: 15px; border-radius: 6px; border: 1px solid var(--border-color); font-family: monospace; font-size: 0.9rem; overflow-x: auto; }
    .locations { margin-top: 20px; }
    .location-item { background: var(--bg-secondary); padding: 15px; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid var(--accent-color); }
    .location-id { background: var(--accent-color); color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 0.85rem; }
    .location-path { font-size: 0.85rem; color: var(--text-secondary); margin: 5px 0; }
    .location-code { background: #f8f9fa; padding: 12px; border-radius: 6px; overflow-x: auto; margin-top: 5px; }
    .location-code pre { margin: 0; }
    .location-code code { background: transparent !important; padding: 0 !important; }
    .guide-content { margin-top: 20px; }
    .guide-content h2 { font-size: 1.2rem; margin: 20px 0 10px 0; }
    .guide-content h3 { font-size: 1.1rem; margin: 15px 0 8px 0; }
    .guide-content p { margin-bottom: 10px; }
    .guide-content code { background: var(--bg-secondary); padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    pre[class*="language-"] { margin: 0 !important; padding: 0 !important; background: transparent !important; }
  `;
}

export function getInfographicStyles(): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8f9fa; padding-top: 60px; }
    #container { width: 100vw; min-height: calc(100vh - 60px); }
    .btn { position: sticky; top: 20px; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); z-index: 1000; text-decoration: none; font-weight: 500; transition: all 0.2s; }
    .export-btn { right: 20px; background: #06b6d4; color: #0f172a; border: 1px solid #06b6d4; }
    .export-btn:hover { background: #0891b2; border-color: #0891b2; }
    .back-btn { left: 20px; background: #1e293b; color: white; border: 1px solid #334155; }
    .back-btn:hover { background: #334155; }
  `;
}
