# CodeMap 测试数据

测试数据管理目录。

## 添加测试数据

使用以下命令添加示例 CodeMap 数据：

```bash
bun run add-test-data
```

## 当前测试数据

| ID | 标题 | 描述 |
|---|---|---|
| 1 | 用户登录流程 | 从用户输入凭据到登录成功的完整认证流程 |
| 2 | 订单创建流程 | 从用户下单到订单创建完成的完整流程 |
| 3 | 文件上传处理流程 | 从用户上传文件到存储并返回访问链接的完整流程 |

## 测试数据结构

每个测试 CodeMap 包含：

- **schemaVersion**: JSON Schema 版本号
- **title**: 流程标题
- **description**: 流程概述
- **mermaidDiagram**: 全局 Mermaid 流程图
- **traces**: 执行追踪链路（3-5 个阶段）
  - **locations**: 关键代码节点
  - **traceTextDiagram**: 文本调用图
  - **traceGuide**: 详细指南（Motivation + Details）

## 自定义测试数据

编辑 `scripts/add-test-data.ts` 添加新的测试数据模板：

```typescript
const testCodeMaps = [
  {
    schemaVersion: 1,
    title: "你的流程标题",
    description: "流程描述",
    mermaidDiagram: "graph TB...",
    traces: [...]
  }
];
```

## 查看测试数据

启动服务器后访问：

```bash
bun run start
# 访问 http://localhost:3456
```