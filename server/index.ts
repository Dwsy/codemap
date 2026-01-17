import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import { storage } from './storage.js';
import { scanDirectory, scanDocsCodeMap } from './lib/utils.js';
import { generateDashboardPage } from './pages/dashboard.js';
import { generateProjectPage } from './pages/project.js';
import { generateViewPage, generateInfographicPage, generateHtmlFragment } from './pages/view.js';

const app = new Hono();

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type'] }));

// Static files
app.use('/assets/*', serveStatic({ root: process.cwd() }));
app.use('/components/*', serveStatic({ root: './dist' }));

// Pages
app.get('/', (c) => {
  const projects = storage.getAllProjects();
  const allCodemaps = projects.flatMap(p => storage.getCodeMaps(p.path));
  return c.html(generateDashboardPage(projects, allCodemaps));
});

app.get('/project/:path', (c) => {
  const path = decodeURIComponent(c.req.param('path'));
  const codemaps = storage.getCodeMaps(path);
  return c.html(generateProjectPage(path, codemaps));
});

app.get('/view/:id', (c) => {
  const codemap = storage.getCodeMap(c.req.param('id'));
  if (!codemap) return c.text('CodeMap 不存在', 404);
  return c.html(generateViewPage(codemap));
});

app.get('/infographic/:id', (c) => {
  const codemap = storage.getCodeMap(c.req.param('id'));
  if (!codemap) return c.text('CodeMap 不存在', 404);
  return c.html(generateInfographicPage(codemap));
});

// API - Projects
app.get('/api/projects/:path/files', (c) => {
  const path = decodeURIComponent(c.req.param('path'));
  return c.json(scanDirectory(path));
});

app.get('/api/projects/:path/docs-codemaps', (c) => {
  const path = decodeURIComponent(c.req.param('path'));
  return c.json(scanDocsCodeMap(path));
});

app.get('/api/projects/:path/codemaps', (c) => {
  const path = decodeURIComponent(c.req.param('path'));
  return c.json(storage.getCodeMaps(path));
});

app.post('/api/projects', async (c) => {
  const { path } = await c.req.json<{ path: string }>();
  if (!path) return c.json({ error: '路径不能为空' }, 400);
  return c.json(storage.addProject(path));
});

app.delete('/api/projects/:path', (c) => {
  storage.deleteProject(decodeURIComponent(c.req.param('path')));
  return c.json({ success: true });
});

// API - CodeMaps (static routes first)
app.get('/api/codemaps/from-file', async (c) => {
  const filePath = c.req.query('path');
  if (!filePath) return c.json({ error: '缺少 path 参数' }, 400);

  try {
    const fileContent = await Bun.file(filePath).text();
    const codemapData = JSON.parse(fileContent);
    if (!codemapData.title || !codemapData.mermaidDiagram) return c.json({ error: '无效的 CodeMap 格式' }, 400);

    const projectPath = filePath.substring(0, filePath.lastIndexOf('/docs/codemap'));
    const existingCodemaps = storage.getCodeMaps(projectPath);
    const existing = existingCodemaps.find(cm => cm.title === codemapData.title && cm.description === codemapData.description);
    if (existing) return c.json(existing);

    return c.json(storage.saveCodeMap(projectPath, codemapData));
  } catch (e: any) {
    return c.json({ error: '加载失败: ' + e.message }, 500);
  }
});

app.get('/api/codemaps/:id/html-fragment', (c) => {
  const codemap = storage.getCodeMap(c.req.param('id'));
  if (!codemap) return c.text('Not found', 404);
  return c.html(generateHtmlFragment(codemap));
});

app.get('/api/codemaps/:id', (c) => {
  return c.json(storage.getCodeMap(c.req.param('id')));
});

app.post('/api/codemap', async (c) => {
  const { projectPath, codemap } = await c.req.json();
  if (!projectPath || !codemap) return c.json({ error: '缺少参数' }, 400);
  return c.json(storage.saveCodeMap(projectPath, codemap));
});

app.delete('/api/codemaps/:id', (c) => {
  storage.deleteCodeMap(c.req.param('id'));
  return c.json({ success: true });
});

export default { port: 3456, fetch: app.fetch };
