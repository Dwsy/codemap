# Phase 3: 核心组件迁移 - 任务文档

> **优先级**: P0
> **预计时间**: 3-4 天
> **前置条件**: Phase 1 & Phase 2 已完成

## 任务目标

将 CodeMap 的核心可视化组件从 Lit 迁移到 Vue 3.6+ Composition API，实现三种视图模式的渲染功能。

## 前置条件检查

必须确认以下条件已完成：

- [x] Phase 1: 基础设施搭建完成
  - client/ 目录结构完整
  - Vue 3.6+ 项目已初始化
  - 路由和状态管理已配置
  - Tailwind CSS 已配置

- [x] Phase 2: 后端 API 优化完成
  - API v1 路由已实现
  - Projects API 已实现
  - CodeMaps API 已实现
  - Files API 已实现
  - Markdown 渲染插件已配置

## 任务清单

### 1. CodeMapViewer.vue（核心容器组件）
- [ ] 创建 `client/src/components/codemap/CodeMapViewer.vue`
- [ ] 实现视图切换逻辑（Mermaid / Infographic / Traces）
- [ ] 集成三个子视图组件
- [ ] 添加加载状态
- [ ] 添加错误处理
- [ ] 响应式布局

### 2. MermaidView.vue（Mermaid 流程图渲染）
- [ ] 创建 `client/src/components/codemap/MermaidView.vue`
- [ ] 使用 mermaid.js 渲染流程图
- [ ] 支持缩放和平移
- [ ] 添加导出功能（SVG/PNG）
- [ ] 响应式尺寸调整

### 3. InfographicView.vue（AntV Infographic 渲染）
- [ ] 创建 `client/src/components/codemap/InfographicView.vue`
- [ ] 使用 AntV Infographic 渲染信息图
- [ ] 解析 infographicSteps 数据
- [ ] 添加导出功能
- [ ] 响应式尺寸调整

### 4. TracesView.vue（追踪链路渲染）
- [ ] 创建 `client/src/components/codemap/TracesView.vue`
- [ ] 渲染 traces 数组（树形结构）
- [ ] 实现代码节点链接（CodeNodeLink）
- [ ] 支持展开/折叠
- [ ] 与 Monaco Editor 集成

### 5. CodeNodeLink.vue（代码节点链接）
- [ ] 创建 `client/src/components/code/CodeNodeLink.vue`
- [ ] 显示文件路径和行号
- [ ] 点击跳转到 Monaco Editor
- [ ] 高亮显示目标行

### 6. CodePanel.vue（Monaco Editor 面板）
- [ ] 创建 `client/src/components/code/CodePanel.vue`
- [ ] 集成 @guolao/vue-monaco-editor
- [ ] 实现行号高亮
- [ ] 支持语法高亮
- [ ] 支持关闭面板

### 7. CodeBrowser.vue（文件浏览器）
- [ ] 创建 `client/src/components/code/CodeBrowser.vue`
- [ ] 显示文件树
- [ ] 支持文件导航
- [ ] 与 CodePanel 集成

### 8. Composables（组合式函数）
- [ ] 创建 `client/src/composables/useMermaid.ts`
  - Mermaid 初始化
  - 渲染流程图
  - 缩放和平移控制

- [ ] 创建 `client/src/composables/useInfographic.ts`
  - Infographic 初始化
  - 渲染信息图
  - 数据解析

- [ ] 创建 `client/src/composables/useMonacoEditor.ts`
  - Monaco Editor 初始化
  - 代码加载
  - 行号高亮

### 9. 集成到视图页面
- [ ] 更新 `client/src/views/View.vue` 使用 CodeMapViewer
- [ ] 更新 `client/src/views/Infographic.vue` 使用 InfographicView
- [ ] 测试路由和参数传递

### 10. 样式和主题
- [ ] 创建组件特定样式
- [ ] 实现响应式布局
- [ ] 添加过渡动画
- [ ] 支持深色模式（可选）

## 验收标准

### 功能验收
- [ ] CodeMapViewer 可以切换三种视图
- [ ] MermaidView 正确渲染流程图
- [ ] InfographicView 正确渲染信息图
- [ ] TracesView 正确显示追踪链路
- [ ] 点击代码节点可以打开 Monaco Editor
- [ ] Monaco Editor 正确显示代码
- [ ] 行号高亮功能正常

### 性能验收
- [ ] 组件加载时间 < 2s
- [ ] Mermaid 渲染时间 < 1s
- [ ] Infographic 渲染时间 < 1s
- [ ] 切换视图无卡顿

### 兼容性验收
- [ ] 支持主流浏览器（Chrome, Firefox, Safari, Edge）
- [ ] 响应式布局（桌面端和平板）
- [ ] 错误处理完善

## 技术要求

### Vue 组件规范
- 使用 `<script setup>` 语法
- 使用 Composition API
- 使用 TypeScript
- 组件命名：PascalCase

### Mermaid.js
- 版本: ^10.0.0
- CDN: https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js
- 配置:
  - startOnLoad: false
  - theme: default
  - securityLevel: loose

### AntV Infographic
- 版本: ^0.2.10
- CDN: /assets/infographic.min.js
- 配置:
  - width: 100%
  - height: auto
  - 响应式布局

### Monaco Editor
- 使用 @guolao/vue-monaco-editor
- 配置:
  - readOnly: true
  - minimap: true
  - lineNumbers: on
  - 自动语言检测

### 样式规范
- 使用 Tailwind CSS
- 组件样式使用 scoped
- 响应式断点:
  - mobile: < 768px
  - tablet: 768px - 1024px
  - desktop: > 1024px

## 数据结构

### CodeMap 数据
```typescript
interface CodeMap {
  id: string
  projectPath: string
  name: string
  description?: string
  mermaidDiagram?: string
  infographicSteps?: string[]
  traces?: Trace[]
  createdAt: string
  updatedAt: string
}
```

### Trace 数据
```typescript
interface Trace {
  id: string
  name: string
  type: 'function' | 'class' | 'module' | 'file'
  description?: string
  traceTextDiagram?: string
  traceGuide?: string
  children?: Trace[]
  codeNode?: CodeNode
}
```

### CodeNode 数据
```typescript
interface CodeNode {
  file: string
  line: number
  column?: number
  snippet?: string
}
```

## 参考 API

### 获取 CodeMap
```typescript
GET /api/v1/codemaps/:id
Response: {
  success: true,
  data: CodeMap
}
```

### 获取文件内容
```typescript
GET /api/v1/files?path=/path/to/file.ts
Response: {
  success: true,
  data: {
    path: string,
    content: string,
    language: string
  }
}
```

### 获取文件指定行
```typescript
GET /api/v1/files/lines?path=/path/to/file.ts&line=10
Response: {
  success: true,
  data: {
    path: string,
    targetLine: number,
    contextLines: Array<{
      line: number,
      content: string,
      isTarget: boolean
    }>
  }
}
```

## 开发步骤

### 步骤 1: 创建 Composables
```bash
# 创建 useMermaid.ts
touch client/src/composables/useMermaid.ts

# 创建 useInfographic.ts
touch client/src/composables/useInfographic.ts

# 创建 useMonacoEditor.ts
touch client/src/composables/useMonacoEditor.ts
```

### 步骤 2: 创建基础组件
```bash
# 创建 CodeNodeLink.vue
touch client/src/components/code/CodeNodeLink.vue

# 创建 CodePanel.vue
touch client/src/components/code/CodePanel.vue

# 创建 CodeBrowser.vue
touch client/src/components/code/CodeBrowser.vue
```

### 步骤 3: 创建视图组件
```bash
# 创建 MermaidView.vue
touch client/src/components/codemap/MermaidView.vue

# 创建 InfographicView.vue
touch client/src/components/codemap/InfographicView.vue

# 创建 TracesView.vue
touch client/src/components/codemap/TracesView.vue

# 创建 CodeMapViewer.vue
touch client/src/components/codemap/CodeMapViewer.vue
```

### 步骤 4: 集成到视图页面
```bash
# 更新 View.vue
# 更新 Infographic.vue
```

### 步骤 5: 测试和优化
```bash
# 启动开发服务器
cd client && bun run dev

# 启动后端服务器
bun run server/index.ts

# 测试各个功能
```

## 注意事项

### 1. Monaco Editor 配置
- 必须使用 @guolao/vue-monaco-editor（Vue 3 专用）
- 不要使用 @monaco-editor/react（React 专用）
- 配置 loader.config() 加载 Monaco

### 2. Mermaid 渲染
- 使用 CDN 加载 mermaid.js
- startOnLoad: false 手动控制渲染时机
- securityLevel: loose 允许更多功能

### 3. Infographic 渲染
- 使用本地 /assets/infographic.min.js
- 解析 infographicSteps 数据
- 处理渲染错误

### 4. 性能优化
- 使用 v-show 而不是 v-if 切换视图（保留 DOM）
- Monaco Editor 使用懒加载
- 大数据使用虚拟滚动

### 5. 错误处理
- 所有组件添加错误边界
- API 请求添加错误处理
- 用户友好的错误提示

## 测试用例

### 功能测试
1. 打开 CodeMap 详情页
2. 切换到 Mermaid 视图，验证流程图渲染
3. 切换到 Infographic 视图，验证信息图渲染
4. 切换到 Traces 视图，验证追踪链路显示
5. 点击代码节点，验证 Monaco Editor 打开
6. 验证行号高亮
7. 关闭代码面板

### 边界测试
1. 测试没有 mermaidDiagram 的 CodeMap
2. 测试没有 infographicSteps 的 CodeMap
3. 测试没有 traces 的 CodeMap
4. 测试不存在的文件
5. 测试超大 CodeMap

### 性能测试
1. 测试加载时间
2. 测试渲染时间
3. 测试切换视图性能
4. 测试内存占用

## 完成标准

Phase 3 完成需要满足：

- [ ] 所有组件已创建
- [ ] 所有功能已实现
- [ ] 所有测试用例通过
- [ ] 性能指标达标
- [ ] 代码符合规范
- [ ] 文档已更新

## 交付物

### 代码文件
- client/src/components/codemap/CodeMapViewer.vue
- client/src/components/codemap/MermaidView.vue
- client/src/components/codemap/InfographicView.vue
- client/src/components/codemap/TracesView.vue
- client/src/components/code/CodeNodeLink.vue
- client/src/components/code/CodePanel.vue
- client/src/components/code/CodeBrowser.vue
- client/src/composables/useMermaid.ts
- client/src/composables/useInfographic.ts
- client/src/composables/useMonacoEditor.ts

### 更新的文件
- client/src/views/View.vue
- client/src/views/Infographic.vue

### 文档
- PHASE3_COMPLETION_REPORT.md（完成报告）

## 参考资料

- [REFACTORING_GUIDE.md](../REFACTORING_GUIDE.md) - 重构指南
- [PHASE1_COMPLETION_REPORT.md](../PHASE1_COMPLETION_REPORT.md) - Phase 1 报告
- [PHASE2_COMPLETION_REPORT.md](../PHASE2_COMPLETION_REPORT.md) - Phase 2 报告
- [Mermaid.js 文档](https://mermaid.js.org/)
- [AntV Infographic 文档](https://antv.antgroup.com/)
- [Monaco Editor 文档](https://microsoft.github.io/monaco-editor/)
- [@guolao/vue-monaco-editor 文档](https://github.com/guolaol/vue-monaco-editor)

## 开始时间

准备就绪，可以立即开始。

---

**文档版本**: 1.0
**创建时间**: 2026-01-18 03:26
**创建者**: Pi Agent (Phase 2 完成者)
**接收者**: 下一个 Phase 3 执行 Agent