export function renderSidebar(): string {
  return `
    <div class="layout-wrapper">
      <div class="sidebar">
        <div class="section-title" style="margin-top:0; font-size: 0.9rem;"><i class="fa-solid fa-folder"></i> docs/codemap</div>
        <div style="margin-bottom:12px;">
          <input type="text" id="codemap-search" placeholder="Search..." style="width:100%;padding:8px;border:1px solid #dee2e6;border-radius:4px;font-size:0.85rem;">
        </div>
        <div id="codemap-tree" class="codemap-tree">Loading...</div>
      </div>
      <div class="main-content">
  `;
}

export function closeSidebar(): string {
  return '</div></div>';
}
