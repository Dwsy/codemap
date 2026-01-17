# CodeMap 技能

> **版本**: 2.0 (Vue 3 重构版)  
> **状态**: 重构中  

## 功能

- ✅ 项目注册和管理
- ✅ CodeMap JSON 上传和存储
- ✅ Web 可视化查看
- ✅ 代码语法高亮（Prism.js）
- ✅ Mermaid 流程图渲染（markdown-it 插件）
- ✅ AntV Infographic 信息图渲染
- ✅ **代码查看功能（Monaco Editor）** ⭐ 新增
- ✅ **Vue 3.6+ Vapor Mode 支持** ⭐ 新增
- ✅ JSON 文件存储

## 架构

```
后端: Bun + Hono
前端: Vue 3.6+ Composition API（可选 Vapor Mode）
存储: JSON 文件
```

## 快速开始

### 1. 安装依赖

```bash
# 后端依赖
bun install

# 前端依赖（重构后）
cd client
bun install
```

### 2. 启动服务器

```bash
# 后端
bun run server/index.ts

# 前端（标准模式）
cd client && bun run dev

# 前端（Vapor Mode）
cd client && VITE_ENABLE_VAPOR=true bun run dev
```

服务器将在 `http://localhost:3456` 启动。
前端开发服务器将在 `http://localhost:5173` 启动。

## 重构指南

详细的重构指南请查看 [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md)。

重构内容包括：

- Vue 3.6+ Composition API
- Vapor Mode 支持（可选）
- Monaco Editor 代码查看
- markdown-it 插件渲染
- Pinia 状态管理
- Vue Router 路由

## API 示例

```bash
# 注册项目
curl -X POST http://localhost:3456/api/projects \
  -H "Content-Type: application/json" \
  -d '{"path":"/path/to/project"}'

# 上传 CodeMap
curl -X POST http://localhost:3456/api/codemap \
  -H "Content-Type: application/json" \
  -d '{"projectPath":"/path/to/project","codemap":{...}}'

# 获取文件内容（新增）
curl -X POST http://localhost:3456/api/files/content \
  -H "Content-Type: application/json" \
  -d '{"path":"/path/to/file.ts"}'

# 查看可视化
open http://localhost:5173/view/{codemap_id}
```

## 目录结构

```
codemap/
├── server/                      # 后端（Bun + Hono）
│   ├── index.ts                # HTTP 服务器入口
│   ├── storage.ts              # 存储层
│   ├── api/                    # API 路由
│   ├── lib/
│   │   ├── utils.ts            # 工具函数
│   │   └── markdown.ts         # Markdown 解析
│   └── types/
│       └── index.ts
│
├── client/                      # 前端（Vue 3.6+）
│   ├── src/
│   │   ├── main.ts
│   │   ├── App.vue
│   │   ├── router/
│   │   ├── views/
│   │   ├── components/
│   │   ├── stores/
│   │   ├── composables/
│   │   └── api/
│   ├── vite.config.ts
│   └── package.json
│
├── shared/                      # 共享代码
│   └── types/
│
├── storage/                     # 数据存储
│   ├── projects.json
│   └── codemaps/
│
├── assets/                      # 静态资源
│   └── infographic.min.js
│
├── docs/                        # 文档
│   └── codemap/
│
├── REFACTORING_GUIDE.md        # 重构指南
├── SKILL.md                     # 技能文档
└── package.json
```

## 技术栈

### 后端

- Bun - JavaScript 运行时
- Hono - Web 框架
- markdown-it - Markdown 解析
- @md-reader/markdown-it-mermaid - Mermaid 插件
- markdown-it-infographic - Infographic 插件

### 前端

- Vue 3.6+ - 前端框架
- Vue Router - 路由管理
- Pinia - 状态管理
- Monaco Editor - 代码编辑器
- @guolao/vue-monaco-editor - Monaco Vue 3 封装
- markdown-it - Markdown 解析
- Tailwind CSS - 样式框架

## Vapor Mode

Vapor Mode 是 Vue 3.6+ 的实验性功能，通过编译时优化提升性能：

- **渲染速度**: 提升 30-50%
- **内存占用**: 降低 20-40%
- **打包体积**: 减少 20-30%

启用方式：

```bash
VITE_ENABLE_VAPOR=true bun run dev
```

详细的 Vapor Mode 配置请查看 [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md)。

## 性能目标

| 指标 | 当前值 | 目标值 | 提升 |
|------|--------|--------|------|
| 首屏加载 | ~2s | < 1s | 50%+ |
| 组件渲染 | ~100ms | < 20ms | 80%+ |
| 打包体积 | ~150KB | < 100KB | 33%+ |
| 运行时内存 | ~50MB | < 30MB | 40%+ |

## 文档

- [REFACTORING_GUIDE.md](./REFACTORING_GUIDE.md) - 重构指南
- [SKILL.md](./SKILL.md) - 技能文档

## 开发

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build

# 运行测试
bun run test
```

## License

MIT