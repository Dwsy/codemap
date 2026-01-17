import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true });

const originalFence = md.renderer.rules.fence || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.fence = function(tokens, idx, options, env, self) {
  const token = tokens[idx];
  const info = token.info.trim();

  if (info === 'infographic') {
    const syntax = token.content;
    const containerId = `infographic-${Math.random().toString(36).substr(2, 9)}`;

    return `
<div id="${containerId}" style="width: 100%; min-height: 400px; margin: 20px 0; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; background: #f8f9fa;">
  <div style="text-align: center; color: #495057;"><p><i class="fa-solid fa-chart-pie" style="font-size:24px; margin-right:10px;"></i>Loading chart...</p></div>
</div>
<script>
  (function() {
    function initInfographic() {
      const container = document.getElementById('${containerId}');
      if (!container) return;
      
      // 检查 AntVInfographic 是否加载（支持多种全局命名）
      const AntVInfographic = window.AntVInfographic || (typeof V !== 'undefined' && V.AntVInfographic);
      
      if (!AntVInfographic) {
        setTimeout(initInfographic, 100);
        return;
      }
      container.innerHTML = '';
      try {
        const infographic = new AntVInfographic.Infographic({ container: '#${containerId}', width: '100%', height: '100%' });
        infographic.render(\`${syntax}\`);
        document.fonts?.ready.then(() => {
          try { infographic.render(\`${syntax}\`); } catch(e) { console.error('Font render failed:', e); }
        }).catch(console.error);
      } catch (e) {
        console.error('Infographic init failed:', e);
        container.innerHTML = '<div style="color:red;padding:20px;">Failed to render chart: ' + e.message + '</div>';
      }
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initInfographic);
    } else {
      setTimeout(initInfographic, 50);
    }
  })();
</script>`;
  }

  return originalFence(tokens, idx, options, env, self);
};

export function renderMarkdown(text: string): string {
  return md.render(text);
}

export function getInfographicScriptPath(): string {
  return '/assets/infographic.min.js';
}
