# CodeMap 技能重构指南

> **版本**: 2.0  
> **日期**: 2026-01-18  
> **状态**: 正式发布

---

## 📋 目录

- [概述](#概述)
- [架构设计](#架构设计)
- [技术栈](#技术栈)
- [实施计划](#实施计划)
- [核心功能](#核心功能)
- [配置指南](#配置指南)
- [快速开始](#快速开始)

---

## 概述

### 重构目标

将 CodeMap 技能从当前架构（Bun + Hono + Lit）迁移到新架构（Bun + Hono + Vue 3.6+），实现以下目标：

1. **性能提升**: 利用 Vue 3 Vapor Mode 提升渲染性能 30-50%
2. **开发体验**: 使用 Vue 3 Composition API 提升开发效率
3. **代码质量**: 使用 TypeScript 实现类型安全
4. **功能增强**: 添加代码查看功能（Monaco Editor）
5. **渲染优化**: 使用 markdown-it 插件实现服务端渲染

### 核心变更

| 模块 | 当前架构 | 新架构 | 提升 |
|------|----------|--------|------|
| 前端框架 | Lit HTML | Vue 3.6+ Composition API | ✅ |
| 渲染模式 | 客户端渲染 | SSR + Vapor Mode | ✅ |
| 代码编辑器 | 无 | Monaco Editor | ✅ 新增 |
| Markdown | CDN | markdown-it 插件 | ✅ |
| 状态管理 | 本地状态 | Pinia | ✅ |
| 路由 | 服务端 | Vue Router | ✅ |

---

## 架构设计

### 系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        客户端（Vue 3.6+）                        │
├─────────────────────────────────────────────────────────────────┤
│  Vue Router (客户端路由)                                         │
│  ├── /                    → Dashboard.vue                       │
│  ├── /project/:path       → Project.vue                         │
│  ├── /view/:id            → View.vue                            │
│  └── /infographic/:id     → Infographic.vue                     │
├─────────────────────────────────────────────────────────────────┤
│  Views (页面组件)                                                │
│  ├── Dashboard.vue        (首页)                                 │
│  ├── Project.vue          (项目页)                               │
│  ├── View.vue             (详情页)                               │
│  └── Infographic.vue      (信息图页)                             │
├─────────────────────────────────────────────────────────────────┤
│  Components (Vue 3 组件)                                        │
│  ├── CodeMapViewer.vue    (核心可视化组件)                      │
│  ├── MermaidView.vue      (Mermaid 渲染)                        │
│  ├── InfographicView.vue  (信息图渲染)                          │
│  ├── TracesView.vue       (追踪链路)                            │
│  ├── CodeBrowser.vue      (Monaco 编辑器)                       │
│  ├── CodePanel.vue        (代码面板)                             │
│  └── CodeNodeLink.vue     (代码节点链接)                        │
├─────────────────────────────────────────────────────────────────┤
│  Stores (Pinia 状态管理)                                         │
│  ├── projects.ts          (项目状态)                            │
│  ├── codemaps.ts          (CodeMap 状态)                        │
│  ├── codeViewer.ts        (代码查看器状态)                      │
│  └── ui.ts                (UI 状态)                             │
├─────────────────────────────────────────────────────────────────┤
│  Composables (组合式函数)                                       │
│  ├── useMermaid.ts        (Mermaid 渲染)                        │
│  ├── useInfographic.ts    (Infographic 渲染)                    │
│  └── useMonacoEditor.ts   (Monaco 编辑器逻辑)                  │
└─────────────────────────────────────────────────────────────────┘
                    ↕ HTTP (JSON API)
┌─────────────────────────────────────────────────────────────────┐
│                      后端（Bun + Hono）                          │
├─────────────────────────────────────────────────────────────────┤
│  HTTP Router (Hono)                                             │
│  ├── /api/v1/projects/*    (项目管理 API)                      │
│  ├── /api/v1/codemaps/*    (CodeMap API)                       │
│  ├── /api/v1/files/*        (文件 API)                          │
│  └── /assets/*             (静态资源)                            │
├─────────────────────────────────────────────────────────────────┤
│  Middleware (中间件)                                            │
│  ├── CORS                 (跨域处理)                            │
│  └── Error Handler        (统一错误处理)                        │
├─────────────────────────────────────────────────────────────────┤
│  Storage Layer (文件系统)                                       │
│  ├── projects.json        (项目注册信息)                        │
│  └── codemaps/*.json      (CodeMap 数据)                        │
└─────────────────────────────────────────────────────────────────┘
```

### 项目结构

```
codemap/
├── server/                      # 后端（Bun + Hono）
│   ├── index.ts                # HTTP 服务器入口
│   ├── storage.ts              # 存储层
│   ├── api/                    # API 路由
│   │   ├── projects.ts
│   │   ├── codemaps.ts
│   │   └── files.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── markdown.ts
│   └── types/
│       └── index.ts
│
├── client/                      # 前端（Vue 3.6+）
│   ├── src/
│   │   ├── main.ts             # 应用入口
│   │   ├── App.vue             # 根组件
│   │   ├── router/
│   │   │   └── index.ts        # 路由配置
│   │   ├── views/
│   │   │   ├── Dashboard.vue
│   │   │   ├── Project.vue
│   │   │   ├── View.vue
│   │   │   └── Infographic.vue
│   │   ├── components/
│   │   │   ├── codemap/
│   │   │   │   ├── CodeMapViewer.vue
│   │   │   │   ├── MermaidView.vue
│   │   │   │   ├── InfographicView.vue
│   │   │   │   └── TracesView.vue
│   │   │   ├── code/
│   │   │   │   ├── CodePanel.vue
│   │   │   │   ├── CodeBrowser.vue
│   │   │   │   └── CodeNodeLink.vue
│   │   │   └── layout/
│   │   │       ├── Header.vue
│   │   │       └── Sidebar.vue
│   │   ├── stores/
│   │   │   ├── projects.ts
│   │   │   ├── codemaps.ts
│   │   │   ├── codeViewer.ts
│   │   │   └── ui.ts
│   │   ├── composables/
│   │   │   ├── useMermaid.ts
│   │   │   ├── useInfographic.ts
│   │   │   └── useMonacoEditor.ts
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── projects.ts
│   │   │   ├── codemaps.ts
│   │   │   └── files.ts
│   │   └── types/
│   │       └── index.ts
│   ├── vite.config.ts          # Vite 配置
│   ├── tsconfig.json           # TypeScript 配置
│   └── package.json
│
├── shared/                      # 共享代码
│   └── types/
│       └── index.ts            # TypeScript 类型定义
│
├── storage/                     # 数据存储
│   ├── projects.json
│   └── codemaps/
│
├── assets/                      # 静态资源
│   └── infographic.min.js
│
└── package.json
```

---

## 技术栈

### 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | ^3.6.0 | 前端框架（支持 Vapor Mode） |
| Vue Router | ^4.4.0 | 路由管理 |
| Pinia | ^2.2.0 | 状态管理 |
| Monaco Editor | ^0.50.0 | 代码编辑器 |
| @guolao/vue-monaco-editor | ^1.5.0 | Monaco Vue 3 封装 |
| markdown-it | ^14.1.0 | Markdown 解析 |
| @md-reader/markdown-it-mermaid | ^0.6.0-beta.0 | Mermaid 插件 |
| markdown-it-infographic | ^1.0.0 | Infographic 插件 |
| lucide-vue-next | ^0.454.0 | 图标库 |
| Tailwind CSS | ^3.4.0 | 样式框架 |

### 后端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Bun | Latest | JavaScript 运行时 |
| Hono | ^4.0.0 | Web 框架 |
| markdown-it | ^14.1.0 | Markdown 解析 |
| @md-reader/markdown-it-mermaid | ^0.6.0-beta.0 | Mermaid 插件 |
| markdown-it-infographic | ^1.0.0 | Infographic 插件 |

### 开发工具

| 工具 | 版本 | 用途 |
|------|------|------|
| Vite | ^6.0.0 | 构建工具 |
| TypeScript | ^5.3.0 | 类型检查 |
| Vitest | ^2.0.0 | 测试框架 |
| @vue/test-utils | ^2.4.0 | Vue 组件测试 |

---

## 实施计划

### 8 个阶段（22 天）

| 阶段 | 内容 | 时间 | 优先级 |
|------|------|------|--------|
| Phase 1 | 基础设施搭建 | 2-3 天 | P0 |
| Phase 2 | 后端 API 优化 | 1-2 天 | P0 |
| Phase 3 | 核心组件迁移 | 3-4 天 | P0 |
| Phase 4 | 页面迁移 | 2-3 天 | P0 |
| Phase 5 | 状态管理优化 | 1-2 天 | P0 |
| Phase 6 | 性能优化 | 1-2 天 | P1 |
| Phase 7 | 代码查看功能 | 2-3 天 | P0 |
| Phase 8 | 测试和文档 | 2-3 天 | P0 |

### 里程碑

- **M1** (Day 3): 基础设施搭建完成
- **M2** (Day 5): 后端 API 优化完成
- **M3** (Day 9): 核心组件迁移完成
- **M4** (Day 12): 所有页面迁移完成
- **M5** (Day 14): 状态管理优化完成
- **M6** (Day 16): 性能优化完成
- **M7** (Day 19): 代码查看功能完成
- **M8** (Day 22): 测试和文档完成，项目交付

---

## 核心功能

### 1. CodeMap 可视化

三种视图模式：

- **流程图视图**: 使用 Mermaid.js 渲染 `mermaidDiagram`
- **信息图视图**: 使用 AntV Infographic 渲染步骤流程
- **追踪链路视图**: 展示 `traces` 数组，包含调用树和代码节点

### 2. 代码查看功能

- **Monaco Editor**: 专业代码编辑器
- **语法高亮**: 自动语言推断
- **行号跳转**: 自动跳转到指定行并高亮
- **代码面板**: 固定右侧，可关闭
- **文件导航**: 从追踪链路点击代码节点

### 3. Markdown 渲染

- **服务端渲染**: 使用 markdown-it 插件
- **Mermaid 支持**: `@md-reader/markdown-it-mermaid`
- **Infographic 支持**: `markdown-it-infographic`
- **无 CDN 依赖**: 所有库本地安装

### 4. Vapor Mode（可选）

- **版本要求**: Vue 3.6.0+
- **启用方式**: `vaporInteropPlugin`
- **性能提升**: 渲染速度 30-50%，内存占用 20-40%
- **控制方式**: 环境变量 `VITE_ENABLE_VAPOR`

---

## 配置指南

### 1. 安装依赖

```bash
cd codemap

# 后端依赖
bun add markdown-it@14.1.0
bun add @md-reader/markdown-it-mermaid@0.6.0-beta.0
bun add markdown-it-infographic@1.0.0

# 前端依赖
cd client
bun add vue@3.6.0 vue-router pinia
bun add monaco-editor @guolao/vue-monaco-editor lucide-vue-next
bun add markdown-it @md-reader/markdown-it-mermaid markdown-it-infographic

# 开发依赖
bun add -D @vitejs/plugin-vue typescript vite vitest @vue/test-utils
bun add -D tailwindcss postcss autoprefixer
```

### 2. Vite 配置

```typescript
// client/vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [
    vue({
      // Vapor Mode（可选，Vue 3.6+）
      vapor: import.meta.env.VITE_ENABLE_VAPOR === 'true',
      script: {
        vapor: import.meta.env.VITE_ENABLE_VAPOR === 'true'
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3456',
        changeOrigin: true
      }
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'monaco': ['monaco-editor', '@guolao/vue-monaco-editor'],
          'markdown': ['markdown-it', '@md-reader/markdown-it-mermaid', 'markdown-it-infographic']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['monaco-editor']
  }
});
```

### 3. 应用入口

```typescript
// client/src/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router';
import App from './App.vue';
import './styles/main.css';

const app = createApp(App);

// Vapor Mode（可选，Vue 3.6+）
if (import.meta.env.VITE_ENABLE_VAPOR === 'true') {
  try {
    const { vaporInteropPlugin } = await import('vue');
    app.use(vaporInteropPlugin);
    console.log('✅ Vapor Mode enabled');
  } catch (e) {
    console.warn('⚠️ Failed to enable Vapor Mode');
  }
}

app.use(createPinia());
app.use(router);

app.mount('#app');
```

### 4. 环境变量

```bash
# client/.env.development
VITE_ENABLE_VAPOR=false

# client/.env.production
VITE_ENABLE_VAPOR=true
```

### 5. Monaco Editor 配置

```typescript
// client/src/components/code/CodeBrowser.vue
import { loader } from '@guolao/vue-monaco-editor';

// 配置 Monaco 加载器
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/min/vs'
  }
});
```

### 6. Markdown 配置

```typescript
// server/lib/markdown.ts
import MarkdownIt from 'markdown-it';
import mermaidPlugin from '@md-reader/markdown-it-mermaid';
import infographicPlugin from 'markdown-it-infographic';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true
});

md.use(mermaidPlugin, {
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose'
});

md.use(infographicPlugin, {
  width: 800,
  height: 600
});

export function renderMarkdown(text: string): string {
  return md.render(text);
}
```

---

## 快速开始

### 步骤 1: 创建前端项目

```bash
cd codemap
bun create vite client -- --template vue-ts
cd client
bun install
```

### 步骤 2: 安装依赖

```bash
# 核心依赖
bun add vue@3.6.0 vue-router pinia
bun add monaco-editor @guolao/vue-monaco-editor lucide-vue-next
bun add markdown-it @md-reader/markdown-it-mermaid markdown-it-infographic

# 开发依赖
bun add -D tailwindcss postcss autoprefixer
bun add -D vitest @vue/test-utils
```

### 步骤 3: 配置 Tailwind CSS

```bash
bunx tailwindcss init -p
```

```css
/* client/src/styles/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 步骤 4: 创建基础组件

```typescript
// client/src/stores/projects.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Project } from '@shared/types';

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([]);
  const loading = ref(false);

  async function fetchAll() {
    loading.value = true;
    const data = await fetch('/api/projects').then(r => r.json());
    projects.value = data;
    loading.value = false;
  }

  return { projects, loading, fetchAll };
});
```

### 步骤 5: 创建路由

```typescript
// client/src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/views/Dashboard.vue') },
    { path: '/project/:path', component: () => import('@/views/Project.vue') },
    { path: '/view/:id', component: () => import('@/views/View.vue') }
  ]
});
```

### 步骤 6: 启动开发服务器

```bash
# 后端
bun run server/index.ts

# 前端
cd client
bun run dev

# 前端（Vapor Mode）
VITE_ENABLE_VAPOR=true bun run dev
```

---

## 性能目标

| 指标 | 当前值 | 目标值 | 提升 |
|------|--------|--------|------|
| 首屏加载时间 | ~2s | < 1s | 50%+ |
| 组件渲染时间 | ~100ms | < 20ms | 80%+ |
| 打包体积 | ~150KB | < 100KB | 33%+ |
| 运行时内存 | ~50MB | < 30MB | 40%+ |

---

## Vapor Mode 性能

| 特性 | 标准 Vue 3 | Vapor Mode | 提升 |
|------|-----------|-----------|------|
| 虚拟 DOM | ✅ 使用 | ❌ 无 | 零开销 |
| 渲染速度 | 基准 | 快 30-50% | ✅ |
| 内存占用 | 基准 | 低 20-40% | ✅ |
| 打包体积 | 基准 | 小 20-30% | ✅ |

---

## 重要提示

### Vapor Mode 使用

1. **版本要求**: Vue 3.6.0+
2. **实验性**: 不建议生产环境使用
3. **配置**: 通过 `vaporInteropPlugin` 启用
4. **控制**: 使用环境变量 `VITE_ENABLE_VAPOR`

### Monaco Editor

1. **使用 Vue 专用包**: `@guolao/vue-monaco-editor`
2. **不要使用**: `@monaco-editor/react`（React 专用）
3. **配置**: loader.config()

### Markdown 渲染

1. **使用 markdown-it 插件**
2. **服务端预渲染**
3. **避免 CDN 依赖**

---

## 常见问题

### Q1: Vapor Mode 如何启用？

A: 确保 Vue 版本 >= 3.6.0，然后在 `main.ts` 中导入 `vaporInteropPlugin` 并使用 `app.use(vaporInteropPlugin)`。

### Q2: Monaco Editor 为什么不使用 React 版本？

A: 项目使用 Vue 3，必须使用 Vue 3 专用的 Monaco Editor 封装。

### Q3: Markdown 渲染为什么不用 CDN？

A: 使用 markdown-it 插件实现服务端渲染，提升首屏性能和 SEO。

### Q4: Vapor Mode 稳定吗？

A: 目前仍处于实验阶段，建议在开发环境测试充分后再考虑生产环境使用。

---

## 文档

- [SKILL.md](./SKILL.md) - 技能文档
- [README.md](./README.md) - 项目说明

---

**文档版本**: 2.0  
**最后更新**: 2026-01-18  
**维护者**: Pi Agent