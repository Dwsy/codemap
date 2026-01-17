interface CodeMap {
  id: string;
  title: string;
  description: string;
  mermaidDiagram: string;
  traces: any[];
}

interface CodeMapViewerOptions {
  codemap: CodeMap;
  isFragment?: boolean;
  initialViewMode?: 'diagram' | 'infographic' | 'traces';
}

class CodeMapViewer {
  private container: HTMLElement;
  private codemap: CodeMap | null = null;
  private viewMode: 'diagram' | 'infographic' | 'traces' = 'diagram';
  private isFragment = false;
  private infographicInstance: any = null;
  private boundHandleClick: (e: Event) => void;

  constructor(container: HTMLElement, options: CodeMapViewerOptions) {
    this.container = container;
    this.codemap = options.codemap || null;
    this.isFragment = options.isFragment || false;
    this.viewMode = options.initialViewMode || 'diagram';
    this.boundHandleClick = this.handleClick.bind(this);

    container.addEventListener('click', this.boundHandleClick);
    this.render();
  }

  setCodemap(codemap: CodeMap) {
    this.codemap = codemap;
    this.render();
  }

  setViewMode(mode: 'diagram' | 'infographic' | 'traces') {
    this.viewMode = mode;
    this.render();

    if (mode === 'infographic') {
      setTimeout(() => this.renderInfographic(), 100);
    }
  }

  private handleClick(e: Event) {
    const target = e.target as HTMLElement;
    const btn = target.closest('[data-view-mode]') as HTMLElement;
    if (btn) {
      const mode = btn.getAttribute('data-view-mode');
      if (mode === 'diagram' || mode === 'infographic' || mode === 'traces') {
        this.setViewMode(mode);
      }
      return;
    }

    const traceHeader = target.closest('[data-trace-id]') as HTMLElement;
    if (traceHeader) {
      const traceId = traceHeader.getAttribute('data-trace-id');
      if (traceId) {
        this.toggleTrace(traceId);
      }
    }
  }

  private async renderMermaid() {
    if (typeof window.mermaid === 'undefined' || !this.codemap) return;

    const mermaidElement = this.container.querySelector('.mermaid') as HTMLElement;
    if (mermaidElement) {
      mermaidElement.textContent = this.codemap.mermaidDiagram;
      mermaidElement.removeAttribute('data-processed');
      
      try {
        await window.mermaid.run({ 
          nodes: [mermaidElement],
          suppressErrors: false
        });
      } catch (error: any) {
        console.error('Mermaid render error:', error);
        // 显示友好的错误信息和原始图表代码
        mermaidElement.innerHTML = `
          <div style="padding: 20px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">⚠️ 图表渲染失败</h4>
            <p style="margin: 0 0 10px 0; color: #856404;">${this.escapeHtml(error.message || '未知错误')}</p>
            <details style="margin-top: 10px;">
              <summary style="cursor: pointer; color: #856404;">查看原始图表代码</summary>
              <pre style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px; overflow-x: auto;"><code>${this.escapeHtml(this.codemap.mermaidDiagram)}</code></pre>
            </details>
          </div>
        `;
      }
    }
  }

  private renderInfographic() {
    if (!this.codemap || typeof window.AntVInfographic === 'undefined') return;

    const infographicContainer = this.container.querySelector('#infographic-render');
    if (!infographicContainer) return;

    const syntax = this.convertToInfographicSyntax(this.codemap);

    if (this.infographicInstance) {
      try {
        this.infographicInstance.destroy();
      } catch (e) {
        // Ignore destroy errors
      }
    }

    this.infographicInstance = new window.AntVInfographic.Infographic({
      container: infographicContainer,
      width: '100%',
      height: '100%'
    });

    this.infographicInstance.render(syntax);

    document.fonts?.ready?.then(() => {
      this.infographicInstance?.render(syntax);
    }).catch(console.error);
  }

  private convertToInfographicSyntax(codemap: CodeMap): string {
    const { title, description, traces } = codemap;
    let syntax = `infographic sequence-snake-steps-compact-card\ndata\n  title ${this.escapeHtml(title)}\n  desc ${this.escapeHtml(description || '')}\n  sequences`;

    traces.forEach((trace) => {
      syntax += `\n    - label ${this.escapeHtml(trace.title)}`;
      if (trace.description) syntax += `\n      desc ${this.escapeHtml(trace.description)}`;
    });

    syntax += `\ntheme\n  palette\n    - #3b82f6\n    - #8b5cf6\n    - #f97316\n    - #10b981\n    - #06b6d4`;
    return syntax;
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private toggleTrace(traceId: string) {
    const content = this.container.querySelector(`#content-${traceId}`);
    const toggle = this.container.querySelector(`#toggle-${traceId}`);

    content?.classList.toggle('collapsed');
    toggle?.classList.toggle('collapsed');
  }

  private getTemplate(): string {
    if (!this.codemap) {
      return '<div class="inline-viewer-empty">Select a CodeMap from the sidebar to view</div>';
    }

    const openLinkBtn = this.isFragment
      ? `<a href="/view/${this.codemap.id}" class="btn" target="_blank">
          <i class="fa-solid fa-up-right-from-square"></i> 新标签页打开
        </a>`
      : '';

    const tracesHtml = this.codemap.traces.map((trace) => {
      const traceTextDiagram = trace.traceTextDiagram
        ? `<h4 class="subsection-title">调用树</h4>
          <pre class="text-diagram">${this.escapeHtml(trace.traceTextDiagram)}</pre>`
        : '';

      const locations = trace.locations?.length
        ? `<h4 class="subsection-title">关键代码节点</h4>
          <div class="locations">
            ${trace.locations.map((loc: any) => `
              <div class="location-item">
                <span class="location-id">${this.escapeHtml(loc.id)}</span>
                <div class="location-path">${this.escapeHtml(loc.path)}</div>
                <div class="location-line">行号: ${loc.lineNumber}</div>
                <div class="location-code">
                  <pre><code class="language-typescript">${this.escapeHtml(loc.lineContent)}</code></pre>
                </div>
              </div>
            `).join('')}
          </div>`
        : '';

      return `
        <div class="trace">
          <div class="trace-header" data-trace-id="${trace.id}">
            <h3>${this.escapeHtml(trace.title)}</h3>
            <span class="trace-toggle" id="toggle-${trace.id}">▼</span>
          </div>
          <div class="trace-content" id="content-${trace.id}">
            ${traceTextDiagram}
            ${locations}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="inline-viewer-header">
        <h2 class="inline-viewer-title">${this.escapeHtml(this.codemap.title)}</h2>
        <div class="inline-viewer-actions">
          <button
            class="btn ${this.viewMode === 'diagram' ? 'active' : ''}"
            data-view-mode="diagram"
          >
            <i class="fa-solid fa-diagram-project"></i> 流程图
          </button>
          <button
            class="btn ${this.viewMode === 'infographic' ? 'active' : ''}"
            data-view-mode="infographic"
          >
            <i class="fa-solid fa-chart-pie"></i> 信息图
          </button>
          <button
            class="btn ${this.viewMode === 'traces' ? 'active' : ''}"
            data-view-mode="traces"
          >
            <i class="fa-solid fa-list"></i> 追踪链路
          </button>
          ${openLinkBtn}
        </div>
      </div>

      <div class="inline-viewer-content">
        <div class="view-mode ${this.viewMode === 'diagram' ? 'active' : ''}">
          <div class="section">
            <h3 class="section-title">全局流程图</h3>
            <div class="mermaid-container">
              <div class="mermaid"></div>
            </div>
          </div>
        </div>

        <div class="view-mode ${this.viewMode === 'infographic' ? 'active' : ''}">
          <div class="section">
            <h3 class="section-title">信息图视图</h3>
            <div class="infographic-container">
              <div id="infographic-render"></div>
            </div>
          </div>
        </div>

        <div class="view-mode ${this.viewMode === 'traces' ? 'active' : ''}">
          <div class="section">
            <h3 class="section-title">详细追踪链路</h3>
            ${tracesHtml}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    this.container.innerHTML = this.getTemplate();
    
    // 渲染完成后处理 Mermaid 和代码高亮
    setTimeout(() => {
      this.renderMermaid();
      if (typeof window.Prism !== 'undefined') {
        window.Prism.highlightAllUnder(this.container);
      }
    }, 0);
  }

  destroy() {
    this.container.removeEventListener('click', this.boundHandleClick);
    if (this.infographicInstance) {
      try {
        this.infographicInstance.destroy();
      } catch (e) {
        // Ignore destroy errors
      }
    }
  }
}

export function initCodeMapViewer(selector: string, options: CodeMapViewerOptions) {
  const container = document.querySelector(selector);
  if (!container) {
    console.error(`Container ${selector} not found`);
    return null;
  }
  return new CodeMapViewer(container as HTMLElement, options);
}

export default CodeMapViewer;
