import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const STORAGE_DIR = process.env.CODEMAP_STORAGE || './storage';
const PROJECTS_FILE = join(STORAGE_DIR, 'projects.json');
const CODEMAPS_DIR = join(STORAGE_DIR, 'codemaps');

// 确保存储目录存在
function ensureStorage() {
  if (!existsSync(STORAGE_DIR)) {
    mkdirSync(STORAGE_DIR, { recursive: true });
  }
  if (!existsSync(CODEMAPS_DIR)) {
    mkdirSync(CODEMAPS_DIR, { recursive: true });
  }
  if (!existsSync(PROJECTS_FILE)) {
    writeFileSync(PROJECTS_FILE, JSON.stringify({}, null, 2));
  }
}

// 读取项目列表
function getProjects(): Record<string, { path: string; registeredAt: string }> {
  ensureStorage();
  try {
    const data = readFileSync(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// 保存项目列表
function saveProjects(projects: Record<string, any>) {
  writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

export const storage = {
  // 获取所有项目
  getAllProjects() {
    const projects = getProjects();
    return Object.values(projects);
  },

  // 添加项目
  addProject(path: string) {
    ensureStorage();
    const projects = getProjects();
    const normalizedPath = path.replace(/\/$/, '');

    if (projects[normalizedPath]) {
      return projects[normalizedPath];
    }

    const project = {
      path: normalizedPath,
      registeredAt: new Date().toISOString()
    };

    projects[normalizedPath] = project;
    saveProjects(projects);

    return project;
  },

  // 删除项目
  deleteProject(path: string) {
    const projects = getProjects();
    delete projects[path];
    saveProjects(projects);
  },

  // 保存 CodeMap
  saveCodeMap(projectPath: string, codemap: any) {
    ensureStorage();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const codemapData = {
      id,
      projectPath,
      ...codemap,
      createdAt: new Date().toISOString()
    };

    const filePath = join(CODEMAPS_DIR, `${id}.json`);
    writeFileSync(filePath, JSON.stringify(codemapData, null, 2));

    return codemapData;
  },

  // 获取项目的所有 CodeMap
  getCodeMaps(projectPath: string) {
    ensureStorage();
    const codemaps: any[] = [];

    try {
      const files = require('fs').readdirSync(CODEMAPS_DIR);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = join(CODEMAPS_DIR, file);
          const data = JSON.parse(readFileSync(filePath, 'utf-8'));
          if (data.projectPath === projectPath) {
            codemaps.push(data);
          }
        }
      }
    } catch (e) {
      console.error('读取 CodeMap 失败:', e);
    }

    return codemaps.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // 获取单个 CodeMap
  getCodeMap(id: string) {
    ensureStorage();
    const filePath = join(CODEMAPS_DIR, `${id}.json`);

    if (!existsSync(filePath)) {
      return null;
    }

    try {
      return JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.error('读取 CodeMap 失败:', e);
      return null;
    }
  },

  // 删除 CodeMap
  deleteCodeMap(id: string) {
    const filePath = join(CODEMAPS_DIR, `${id}.json`);
    if (existsSync(filePath)) {
      require('fs').unlinkSync(filePath);
    }
  }
};