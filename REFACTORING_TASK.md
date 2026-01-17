# CodeMap 重构任务

## 任务目标

将 CodeMap 技能从当前架构（Bun + Hono + Lit）迁移到新架构（Bun + Hono + Vue 3.6+）。

## 实施范围

按照 `REFACTORING_GUIDE.md` 中的 8 个阶段实施重构。

## 当前进度

- ✅ 规划和设计完成
- ✅ 文档整理完成
- ⏳ 等待开始实施

## 下一步行动

开始 **Phase 1: 基础设施搭建**（2-3 天）

### Phase 1 任务清单

- [ ] 创建 client/ 目录结构
- [ ] 初始化 Vite + Vue 3.6+ 项目
- [ ] 配置 TypeScript
- [ ] 配置 Vue Router
- [ ] 配置 Pinia
- [ ] 配置 Tailwind CSS
- [ ] 配置 Vapor Mode（可选）
- [ ] 创建基础布局组件（Header, Sidebar）
- [ ] 创建全局样式
- [ ] 验证开发服务器正常启动

### 验收标准

- [ ] `client/` 目录结构完整
- [ ] `bun run dev` 正常启动前端开发服务器
- [ ] Vue Router 导航正常
- [ ] Pinia store 可以正常使用
- [ ] Tailwind CSS 样式生效
- [ ] 可以通过代理访问后端 API

### 参考资源

- `REFACTORING_GUIDE.md` - 完整重构指南
- `README.md` - 项目说明
- `SKILL.md` - 技能文档

## 技术要求

- Vue 版本: ^3.6.0
- 使用 `@guolao/vue-monaco-editor`（不要用 React 版本）
- 使用 markdown-it 插件（不要用 CDN）
- Vapor Mode 通过环境变量控制

## 注意事项

1. **不要删除现有代码**: 保留 server/ 目录的所有代码
2. **增量开发**: 在 client/ 目录下创建新代码
3. **类型安全**: 使用 TypeScript，充分利用类型检查
4. **遵循规范**: 使用 Vue 3 Composition API + `<script setup>`
5. **性能优先**: 考虑代码分割和懒加载

## 预期成果

完成 Phase 1 后，应该有：

1. 完整的 client/ 目录结构
2. 可运行的 Vue 3 开发环境
3. 基础的路由和状态管理配置
4. 基础的布局组件
5. 可以开始 Phase 2 的基础

## 开始时间

准备就绪，可以立即开始。