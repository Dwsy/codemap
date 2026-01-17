# CodeMap Server

使用 Bun + Hono 构建的代码地图可视化 HTTP 服务器。

## 功能

- ✅ 项目注册和管理
- ✅ CodeMap JSON 上传和存储
- ✅ Web 可视化查看
- ✅ 代码语法高亮（Prism.js）
- ✅ Mermaid 流程图渲染
- ✅ JSON 文件存储

## 快速开始

```bash
# 安装依赖
bun install

# 启动服务器
bun run server/index.ts
```

服务器将在 `http://localhost:3456` 启动。

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

# 查看可视化
open http://localhost:3456/view/{codemap_id}
```

## 目录结构

```
codemap-renderer/
├── server/
│   ├── index.ts      # 主服务器（路由 + HTML 生成）
│   └── storage.ts    # JSON 存储管理
├── package.json
├── SKILL.md
└── README.md
```

## 存储

数据存储在 `./storage` 目录：

```
storage/
├── projects.json      # 项目注册信息
└── codemaps/          # CodeMap JSON 文件
```

## 技术栈

- Bun - 运行时
- Hono - Web 框架
- Prism.js - 语法高亮
- Mermaid.js - 流程图渲染