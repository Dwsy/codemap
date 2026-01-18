# Phase 2: 后端 API 优化 - 任务清单

## 任务目标

优化现有后端 API，为 Vue 3 前端提供完整的 RESTful API 支持。

## 任务清单

### 1. API 路由重构
- [ ] 统一 API 路由前缀为 `/api/v1/`
- [ ] 创建独立的 API 路由模块
- [ ] 添加 API 版本管理

### 2. Projects API
- [ ] GET /api/v1/projects - 获取所有项目
- [ ] GET /api/v1/projects/:path - 获取单个项目
- [ ] POST /api/v1/projects - 注册项目
- [ ] DELETE /api/v1/projects/:path - 删除项目
- [ ] GET /api/v1/projects/:path/codemaps - 获取项目的 CodeMaps
- [ ] GET /api/v1/projects/:path/files - 扫描项目文件

### 3. CodeMaps API
- [ ] GET /api/v1/codemaps - 获取所有 CodeMaps
- [ ] GET /api/v1/codemaps/:id - 获取单个 CodeMap
- [ ] POST /api/v1/codemaps - 创建 CodeMap
- [ ] DELETE /api/v1/codemaps/:id - 删除 CodeMap

### 4. Files API（新增）
- [ ] GET /api/v1/files?path=xxx - 读取文件内容
- [ ] GET /api/v1/files/tree?path=xxx - 获取文件树

### 5. Markdown 渲染优化
- [ ] 配置 markdown-it 插件
- [ ] 添加 Mermaid 插件支持
- [ ] 添加 Infographic 插件支持
- [ ] 服务端预渲染

### 6. 错误处理和响应格式
- [ ] 统一错误响应格式
- [ ] 添加 CORS 配置
- [ ] 添加请求日志

### 7. API 测试
- [ ] 测试所有 API 端点
- [ ] 验证响应格式
- [ ] 验证错误处理

## 验收标准

- [ ] 所有 API 路由使用 `/api/v1/` 前缀
- [ ] Projects API 完整实现
- [ ] CodeMaps API 完整实现
- [ ] Files API 完整实现
- [ ] Markdown 渲染支持 Mermaid 和 Infographic
- [ ] 错误处理统一
- [ ] 所有 API 端点测试通过

## 技术要求

- 使用 Hono 路由模块化
- 统一响应格式：`{ success: boolean, data?: any, error?: string }`
- 支持文件读取（用于代码查看）
- 使用 markdown-it 插件（@md-reader/markdown-it-mermaid, markdown-it-infographic）