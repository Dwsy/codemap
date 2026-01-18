# 信息图渲染问题修复方案

## 问题诊断

### 根本原因
`InfographicView.vue` 组件虽然导入了 `@antv/infographic`，但**未注册 `markdown-it-infographic` 插件**，导致 ` ```infographic` 代码块被当作普通代码块处理，无法渲染为可视化图表。

### 技术细节
1. `markdown-it-infographic` 插件依赖浏览器 DOM API
2. 插件创建临时 DOM 元素，使用 `Infographic` 类渲染，提取 SVG
3. 当前实现只是简单的 Markdown 渲染，缺少插件注册

## 修复方案

### 已完成的修复
修改 `client/src/components/codemap/InfographicView.vue`：
- 删除未使用的 `@antv/infographic` 导入
- 添加 `markdown-it-infographic` 插件导入
- 在 MarkdownIt 实例上调用 `md.use(infographicPlugin)`

### 验证步骤
1. 启动开发服务器：`bun run dev:client`
2. 访问：`http://localhost:5173/infographic/1768625796651-trja7mm6j`
3. 检查信息图是否正常渲染

### 预期结果
- ` ```infographic` 代码块应渲染为 SVG 图表
- 页面应显示四个信息图（渲染引擎、存储流程、页面结构、技术栈对比）

## 备选方案

如果上述修复无效，可能需要：
1. 确保 `@antv/infographic` 在客户端正确加载
2. 检查是否有 SSR 冲突
3. 考虑使用动态导入延迟加载插件

## 测试文件
已创建 `client/test-infographic.html` 用于独立测试插件功能。