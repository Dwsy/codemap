# CodeMap 重构项目交接文档

> **当前阶段**: Phase 3: 核心组件迁移
> **完成进度**: Phase 1 (100%) ✅ | Phase 2 (100%) ✅ | Phase 3 (0%) ⏳

## 项目状态

### 已完成阶段

#### Phase 1: 基础设施搭建 ✅
- 创建了完整的 client/ 目录结构
- 初始化 Vue 3.6.0-beta.3 项目（支持 Vapor Mode）
- 配置了 Vue Router、Pinia、Tailwind CSS
- 创建了基础布局组件（Header.vue, Sidebar.vue）
- 创建了 4 个 Pinia stores
- 开发服务器正常启动（http://localhost:5173）

**关键文件**:
- client/src/main.ts - 应用入口
- client/src/App.vue - 根组件
- client/src/router/index.ts - 路由配置
- client/src/stores/*.ts - 状态管理

#### Phase 2: 后端 API 优化 ✅
- 实现了 API v1 路由（/api/v1/）
- 实现了 16 个 API 端点
  - Projects API: 7 个端点
  - CodeMaps API: 5 个端点
  - Files API: 3 个端点（新增，用于代码查看）
  - Health API: 1 个端点
- 配置了 markdown-it 插件（Mermaid + Infographic）
- 统一了响应格式：`{ success, data, error }`
- 保留了向后兼容的旧版 API

**关键文件**:
- server/api/v1/index.ts - API 路由入口
- server/api/v1/projects.ts - Projects API
- server/api/v1/codemaps.ts - CodeMaps API
- server/api/v1/files.ts - Files API（新增）
- server/utils/markdown.ts - Markdown 渲染
- shared/types/index.ts - 共享类型定义

**API 测试结果**: 10/10 通过 (100%)

### 当前阶段

#### Phase 3: 核心组件迁移 ⏳
**预计时间**: 3-4 天
**优先级**: P0

**主要任务**:
1. 创建 CodeMapViewer.vue（核心容器组件）
2. 创建 MermaidView.vue（Mermaid 流程图渲染）
3. 创建 InfographicView.vue（AntV Infographic 渲染）
4. 创建 TracesView.vue（追踪链路渲染）
5. 创建 CodeNodeLink.vue（代码节点链接）
6. 创建 CodePanel.vue（Monaco Editor 面板）
7. 创建 CodeBrowser.vue（文件浏览器）
8. 创建 Composables（useMermaid, useInfographic, useMonacoEditor）
9. 集成到视图页面
10. 样式和主题

**详细任务清单**: 见 `PHASE3_TASKS.md`

## 技术栈

### 前端
- Vue 3.6.0-beta.3（支持 Vapor Mode）
- Vue Router 4.6.4
- Pinia 3.0.4
- Monaco Editor 0.50.0
- @guolao/vue-monaco-editor 1.5.0
- Tailwind CSS 3.4.0
- TypeScript 5.9.3
- Vite 7.3.1

### 后端
- Bun 1.3.4
- Hono 4.x
- markdown-it 14.1.0
- @md-reader/markdown-it-mermaid 0.6.0-beta.0
- markdown-it-infographic 1.0.0

### 渲染引擎
- Mermaid.js 10.x（流程图）
- AntV Infographic 0.2.10（信息图）
- Monaco Editor（代码编辑）

## 项目结构

```
codemap/
├── client/                      # Vue 3 前端
│   ├── src/
│   │   ├── api/                # API 客户端
│   │   ├── components/
│   │   │   ├── codemap/        # CodeMap 组件（待创建）
│   │   │   ├── code/           # 代码组件（待创建）
│   │   │   └── layout/         # 布局组件 ✅
│   │   ├── composables/        # 组合式函数（待创建）
│   │   ├── router/             # 路由 ✅
│   │   ├── stores/             # Pinia stores ✅
│   │   ├── styles/             # 全局样式 ✅
│   │   ├── types/              # 类型定义 ✅
│   │   ├── views/              # 页面组件 ✅
│   │   ├── App.vue             # 根组件 ✅
│   │   └── main.ts             # 应用入口 ✅
│   ├── vite.config.ts          # Vite 配置 ✅
│   └── package.json
│
├── server/                      # Bun + Hono 后端
│   ├── api/
│   │   └── v1/                 # API v1 路由 ✅
│   │       ├── index.ts
│   │       ├── projects.ts
│   │       ├── codemaps.ts
│   │       └── files.ts
│   ├── middleware/             # 中间件 ✅
│   ├── utils/                  # 工具函数 ✅
│   ├── index.ts                # 服务器入口 ✅
│   └── storage.ts              # 存储层 ✅
│
├── shared/                      # 共享代码
│   └── types/index.ts          # 类型定义 ✅
│
├── storage/                     # 数据存储
│   ├── projects.json
│   └── codemaps/
│
├── docs/                        # 文档
│   └── codemap/
│
├── PHASE1_COMPLETION_REPORT.md # Phase 1 报告 ✅
├── PHASE2_COMPLETION_REPORT.md # Phase 2 报告 ✅
├── PHASE3_TASKS.md             # Phase 3 任务清单 ⏳
├── REFACTORING_GUIDE.md        # 重构指南
└── README.md
```

## 快速开始

### 启动开发环境

```bash
# 1. 启动后端服务器
bun run server/index.ts

# 2. 启动前端开发服务器
cd client
bun run dev

# 3. 访问应用
# 前端: http://localhost:5173
# 后端: http://localhost:3456
```

### 验证 API

```bash
# 健康检查
curl http://localhost:3456/api/v1/health

# 获取所有项目
curl http://localhost:3456/api/v1/projects

# 获取所有 CodeMaps
curl http://localhost:3456/api/v1/codemaps

# 获取文件内容
curl "http://localhost:3456/api/v1/files?path=/path/to/file.ts"
```

### 测试现有功能

1. 访问 http://localhost:5173 - 查看 Dashboard
2. 点击项目 - 查看项目页
3. 点击 CodeMap - 查看详情页（待实现）

## 重要注意事项

### 1. Monaco Editor
- **必须使用**: @guolao/vue-monaco-editor（Vue 3 专用）
- **不要使用**: @monaco-editor/react（React 专用）

### 2. Vue 版本
- 当前使用 Vue 3.6.0-beta.3（支持 Vapor Mode）
- Vapor Mode 通过环境变量控制：
  - 开发环境: VITE_ENABLE_VAPOR=false
  - 生产环境: VITE_ENABLE_VAPOR=true

### 3. API 版本
- 新版 API: /api/v1/*（推荐使用）
- 旧版 API: /api/*（向后兼容）

### 4. 类型定义
- 共享类型定义在: shared/types/index.ts
- 前端类型定义在: client/src/types/index.ts
- 类型必须保持一致

### 5. 状态管理
- 使用 Pinia stores
- stores/ 目录下有 4 个 stores:
  - projects.ts - 项目状态
  - codemaps.ts - CodeMap 状态
  - codeViewer.ts - 代码查看器状态
  - ui.ts - UI 状态

## 测试数据

项目已有测试数据：
- 2 个项目
- 8 个 CodeMaps
- 测试文件: storage/codemaps/*.json

## 常用命令

```bash
# 前端
cd client
bun run dev          # 启动开发服务器
bun run build        # 构建生产版本
bun install          # 安装依赖

# 后端
bun run server/index.ts  # 启动服务器
bun install          # 安装依赖

# 验证
./verify-phase1.sh   # 验证 Phase 1
./verify-phase2.sh   # 验证 Phase 2
```

## 下一步行动

1. 阅读 `PHASE3_TASKS.md` 了解详细任务
2. 阅读 `REFACTORING_GUIDE.md` 了解整体架构
3. 阅读 `PHASE1_COMPLETION_REPORT.md` 了解 Phase 1
4. 阅读 `PHASE2_COMPLETION_REPORT.md` 了解 Phase 2
5. 开始创建 Phase 3 的组件

## 联系方式

如有问题，请参考：
- REFACTORING_GUIDE.md - 重构指南
- SKILL.md - 技能文档
- README.md - 项目说明

---

**交接时间**: 2026-01-18 03:26
**交接人**: Pi Agent (Phase 2 完成者)
**接收人**: Phase 3 执行 Agent
**项目状态**: Phase 1 ✅ | Phase 2 ✅ | Phase 3 ⏳