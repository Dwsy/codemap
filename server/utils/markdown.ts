import MarkdownIt from 'markdown-it'
import mermaidPlugin from '@md-reader/markdown-it-mermaid'
import infographicPlugin from 'markdown-it-infographic'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true
})

// 配置 Mermaid 插件
md.use(mermaidPlugin, {
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose'
})

// 配置 Infographic 插件
md.use(infographicPlugin, {
  width: 800,
  height: 600
})

export function renderMarkdown(text: string): string {
  return md.render(text)
}

export function getInfographicScriptPath(): string {
  return '/assets/infographic.min.js'
}