---
name: codemap
description: CodeMap HTTP 服务器 - 使用 Bun + Hono 构建的代码地图可视化服务。支持项目注册、CodeMap 上传、Web 可视化查看、AntV Infographic 信息图渲染。当需要在浏览器中查看代码流程分析结果时使用。
---

# CodeMap Server

CodeMap HTTP 服务器，提供代码地图的存储、管理和可视化服务。

## CodeMap JSON 格式

你是高级代码架构分析师和可视化专家，负责分析系统业务流程并生成结构化的 CodeMap JSON。

### 目标

将复杂的代码执行流转化为清晰的、分步骤的追踪链路（Traces），并提供多种可视化表达（文本图、Mermaid 图、Markdown 指南）。

### 约束条件

- **语言**：所有描述性文本必须使用中文
- **格式**：输出必须是严格的 JSON 格式，不包含 markdown 代码块标记
- **准确性**：引用的文件路径、行号和代码内容必须真实存在于提供的上下文中

### JSON Schema 结构

```json
{
  "schemaVersion": 1,
  "title": "流程标题",
  "description": "流程的简要概述",
  "mermaidDiagram": "全局视角的 Mermaid graph TB 流程图代码",
  "traces": [
    {
      "id": "序号 (e.g., 1, 2)",
      "title": "步骤标题",
      "description": "步骤简述",
      "locations": [
        {
          "id": "节点ID (e.g., 1a, 1b)",
          "path": "文件绝对路径",
          "lineNumber": 整数行号,
          "lineContent": "关键代码行内容",
          "title": "节点行为标题",
          "description": "在该行发生了什么（简短说明）"
        }
      ],
      "traceTextDiagram": "基于文本的树状调用图，清晰展示该步骤内的调用栈层级 (使用 ASCII 字符如 ├── └─)",
      "traceGuide": "Markdown 格式的详细指南，必须包含 '## Motivation' (设计动机) 和 '## Details' (实现细节) 两个章节"
    }
  ]
}
```

### 详细生成规则

#### Traces（追踪链路）

- 将用户查询的功能全流程拆解为 3-5 个逻辑阶段（例如：提交 → 审批 → 回调）
- 每个 Trace 代表一个独立的执行阶段
- 确保各 Trace 之间有清晰的逻辑衔接

#### Locations（关键节点）

- 筛选出该流程中最具代表性的代码行：
  - Controller 入口
  - Service 核心逻辑
  - Mapper 数据库操作
  - 关键分支判断
- 忽略样板代码（Getter/Setter、简单的转换）

#### TraceTextDiagram（文本调用图）

- 生成类似 tree 命令的层级图
- 标注出文件名、方法名和关键逻辑
- 在节点后引用 locations 中的 ID (e.g., < -- 1a)

#### TraceGuide（指南文档）

- **## Motivation**: 解释为什么需要这个流程？解决了什么业务问题？核心难点是什么？
- **## Details**: 详细描述数据是如何流转的。引用节点 ID (e.g., [1a]) 来关联具体的代码操作

#### MermaidDiagram（全局图表）

- 将所有 Traces 串联起来
- 使用 subgraph 对前端、后端 Controller、Service、Database 等进行分层
- 节点文本中包含 ID 和简述

### 生成流程

1. **理解查询** → 分析用户要追踪的业务流程
2. **代码搜索** → 使用 ace-tool 进行语义搜索，ast-grep 进行语法分析
3. **流程拆解** → 将大流程拆解为 3-5 个逻辑阶段
4. **节点定位** → 精确定位关键代码节点（文件路径、行号、代码内容）
5. **可视化生成** → 生成文本图、Mermaid 图、指南文档
6. **JSON 输出** → 生成符合 Schema 的 CodeMap

### 示例

**用户输入**: "资产报废全流程"

**思考路径**:
1. 识别前端入口（Vue 组件）
2. 追踪后端 API 接口（Controller）
3. 分析 Service 层校验逻辑（残值校验）
4. 追踪数据持久化（Insert/Update）
5. 识别触发的异步流程或审批流（Audit）
6. 识别状态变更和最终的资产注销（Action）

**生成的 JSON**:

```json
{
  "schemaVersion": 1,
  "title": "资产报废全流程",
  "description": "从用户提交报废申请到资产注销的完整流程",
  "mermaidDiagram": "graph TB\n    subgraph 前端\n        A[报废申请表单]\n    end\n    subgraph 后端\n        B[AssetController.submitDisposal] --> C[AssetService.validate]\n        C -->|通过| D[AssetService.createDisposal]\n        D --> E[AuditService.createAudit]\n        E -->|审批通过| F[AssetService.updateStatus]\n    end\n    subgraph 数据库\n        C -->|查询| DB1[(Asset表)]\n        D -->|插入| DB2[(Disposal表)]\n        F -->|更新| DB3[(Asset表)]\n    end",
  "traces": [
    {
      "id": "1",
      "title": "提交报废申请",
      "description": "用户在前端填写报废表单并提交",
      "locations": [
        {
          "id": "1a",
          "path": "/src/components/AssetDisposalForm.vue",
          "lineNumber": 45,
          "lineContent": "const handleSubmit = async () => { const result = await assetApi.submitDisposal(form); };",
          "title": "表单提交",
          "description": "处理用户提交的报废申请"
        }
      ],
      "traceTextDiagram": "前端表单\n└── handleSubmit < -- 1a",
      "traceGuide": "## Motivation\n\n允许用户发起资产报废申请，需要收集资产信息和报废原因。\n\n## Details\n\n用户填写表单后，调用后端 API [1a] 提交申请数据。"
    }
  ]
}
```

---

## 服务器使用

### 1. 安装依赖

```bash
bun install
```

### 2. 启动服务器

```bash
bun run server/index.ts
```

服务器将在 `http://localhost:3456` 启动。

### 3. 使用 API

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

### API 端点

- `POST /api/projects` - 注册新项目
- `POST /api/codemap` - 上传 CodeMap JSON
- `GET /api/projects/:path/codemaps` - 获取项目的所有 CodeMap
- `GET /api/codemaps/:id` - 获取单个 CodeMap
- `GET /view/:id` - 查看 CodeMap 可视化页面
- `DELETE /api/codemaps/:id` - 删除 CodeMap

## Infographic 信息图

在 CodeMap 的任何 Markdown 内容中都可以直接使用 ```infographic 代码块嵌入信息图：

### 使用位置

- **traceGuide** - 在详细指南中嵌入流程图
- **description** - 在描述中添加可视化
- **任何 Markdown 文本** - 支持所有支持 Markdown 的字段

### 使用示例

```markdown
## Details

详细描述数据流转过程，可以插入信息图：

```infographic
infographic sequence-snake-steps-compact-card
data
  title 流程步骤
  desc 完整的执行流程
  sequences
    - label 步骤 1
      desc 提示信息
    - label 步骤 2
      desc 提示信息
theme
  palette
    - #3b82f6
    - #10b981
```
```

### 常用模板

- `sequence-snake-steps-compact-card` - 蛇形步骤卡片
- `sequence-snake-steps-simple` - 蛇形步骤（简化版）
- `list-row-horizontal-icon-arrow` - 水平列表（带图标）
- `compare-quadrant-quarter-simple-card` - 四象限对比
- `hierarchy-tree-curved-line` - 树形结构

更多模板见：https://infographic.antv.vision/

## 存储

数据存储在 `./storage` 目录：

```
storage/
├── projects.json      # 项目注册信息
└── codemaps/          # CodeMap JSON 文件
```

## 技术栈

- **运行时**: Bun
- **Web 框架**: Hono
- **Markdown 解析**: markdown-it（自定义 infographic 渲染器）
- **语法高亮**: Prism.js（浅色主题）
- **流程图**: Mermaid.js
- **信息图**: AntV Infographic

## 环境变量

- `CODEMAP_STORAGE` - 存储目录（默认: `./storage`）