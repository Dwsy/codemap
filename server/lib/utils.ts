import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { FileTreeNode, CodeMapFileInfo } from '../types/index.js';

export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function detectLanguage(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    vue: 'vue',
    py: 'python',
    rs: 'rust',
    go: 'go',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml'
  };
  return map[ext || ''] || 'plaintext';
}

const IGNORE_DIRS = ['.git', 'node_modules', '.DS_Store', 'dist', 'build', 'coverage', '.idea', '.vscode'];

export function scanDirectory(dirPath: string): FileTreeNode[] {
  let files;
  try {
    files = readdirSync(dirPath);
  } catch (e: any) {
    if (e.code === 'ENOENT') return [];
    return [];
  }

  const tree: FileTreeNode[] = [];

  for (const file of files) {
    if (IGNORE_DIRS.includes(file)) continue;

    const fullPath = join(dirPath, file);
    const stats = statSync(fullPath);
    const isDirectory = stats.isDirectory();

    const node: FileTreeNode = { name: file, path: fullPath, type: isDirectory ? 'dir' : 'file' };
    if (isDirectory) node.children = scanDirectory(fullPath);
    tree.push(node);
  }

  return tree.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'dir' ? -1 : 1;
  });
}

export function scanDocsCodeMap(projectPath: string): CodeMapFileInfo[] {
  const docsPath = join(projectPath, 'docs', 'codemap');
  if (!existsSync(docsPath)) return [];

  const results: CodeMapFileInfo[] = [];

  try {
    const files = readdirSync(docsPath);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const filePath = join(docsPath, file);
      try {
        const content = JSON.parse(readFileSync(filePath, 'utf-8'));
        if (content.title && content.mermaidDiagram) {
          results.push({
            path: filePath,
            title: content.title || file,
            description: content.description || ''
          });
        }
      } catch {}
    }
  } catch {}

  return results;
}
