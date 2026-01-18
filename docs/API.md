# CodeMap API 文档

> CodeMap API 提供项目管理、CodeMap 管理和文件访问功能。

---

## 📚 目录

- [概述](#概述)
- [认证](#认证)
- [Projects API](#projects-api)
- [CodeMaps API](#codemaps-api)
- [Files API](#files-api)
- [错误码](#错误码)

---

## 概述

### Base URL

```
http://localhost:3456/api/v1
```

### 请求格式

所有 API 请求使用 JSON 格式：

```json
{
  "key": "value"
}
```

### 响应格式

成功响应：

```json
{
  "success": true,
  "data": {}
}
```

错误响应：

```json
{
  "success": false,
  "error": "错误信息"
}
```

---

## 认证

当前版本不需要认证。

---

## Projects API

### 获取所有项目

**请求**

```
GET /api/v1/projects
```

**响应**

```json
{
  "success": true,
  "data": [
    {
      "path": "/path/to/project",
      "name": "project-name",
      "description": "项目描述",
      "registeredAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**示例**

```bash
curl http://localhost:3456/api/v1/projects
```

```javascript
fetch('http://localhost:3456/api/v1/projects')
  .then(res => res.json())
  .then(data => console.log(data))
```

```python
import requests

response = requests.get('http://localhost:3456/api/v1/projects')
print(response.json())
```

---

### 注册项目

**请求**

```
POST /api/v1/projects
```

**请求体**

```json
{
  "path": "/path/to/project",
  "name": "project-name",
  "description": "项目描述"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "path": "/path/to/project",
    "name": "project-name",
    "description": "项目描述",
    "registeredAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**示例**

```bash
curl -X POST http://localhost:3456/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"path":"/path/to/project","name":"project-name","description":"项目描述"}'
```

---

### 获取项目详情

**请求**

```
GET /api/v1/projects/:path
```

**响应**

```json
{
  "success": true,
  "data": {
    "path": "/path/to/project",
    "name": "project-name",
    "description": "项目描述",
    "registeredAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 删除项目

**请求**

```
DELETE /api/v1/projects/:path
```

**响应**

```json
{
  "success": true,
  "message": "项目已删除"
}
```

---

## CodeMaps API

### 获取项目的所有 CodeMap

**请求**

```
GET /api/v1/codemaps?projectId=:projectId
```

**响应**

```json
{
  "success": true,
  "data": [
    {
      "id": "codemap-id",
      "projectId": "project-path",
      "name": "CodeMap 名称",
      "description": "CodeMap 描述",
      "mermaidDiagram": "graph TD\n  A --> B\n  B --> C",
      "infographicSteps": [
        {
          "title": "步骤 1",
          "description": "步骤描述"
        }
      ],
      "traces": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 创建 CodeMap

**请求**

```
POST /api/v1/codemaps
```

**请求体**

```json
{
  "projectId": "/path/to/project",
  "name": "CodeMap 名称",
  "description": "CodeMap 描述",
  "mermaidDiagram": "graph TD\n  A --> B\n  B --> C",
  "infographicSteps": [],
  "traces": []
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "codemap-id",
    "projectId": "/path/to/project",
    "name": "CodeMap 名称",
    "description": "CodeMap 描述",
    "mermaidDiagram": "graph TD\n  A --> B\n  B --> C",
    "infographicSteps": [],
    "traces": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 获取 CodeMap 详情

**请求**

```
GET /api/v1/codemaps/:id
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "codemap-id",
    "projectId": "/path/to/project",
    "name": "CodeMap 名称",
    "description": "CodeMap 描述",
    "mermaidDiagram": "graph TD\n  A --> B\n  B --> C",
    "infographicSteps": [],
    "traces": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 更新 CodeMap

**请求**

```
PUT /api/v1/codemaps/:id
```

**请求体**

```json
{
  "name": "更新后的名称",
  "description": "更新后的描述"
}
```

**响应**

```json
{
  "success": true,
  "data": {
    "id": "codemap-id",
    "projectId": "/path/to/project",
    "name": "更新后的名称",
    "description": "更新后的描述",
    "mermaidDiagram": "graph TD\n  A --> B\n  B --> C",
    "infographicSteps": [],
    "traces": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 删除 CodeMap

**请求**

```
DELETE /api/v1/codemaps/:id
```

**响应**

```json
{
  "success": true,
  "message": "CodeMap 已删除"
}
```

---

## Files API

### 获取文件树

**请求**

```
GET /api/v1/files/tree?path=:path
```

**响应**

```json
{
  "success": true,
  "data": [
    {
      "name": "src",
      "path": "/path/to/project/src",
      "type": "dir",
      "children": [
        {
          "name": "index.ts",
          "path": "/path/to/project/src/index.ts",
          "type": "file"
        }
      ]
    }
  ]
}
```

---

### 获取文件内容

**请求**

```
GET /api/v1/files/content?path=:path
```

**响应**

```json
{
  "success": true,
  "data": {
    "path": "/path/to/project/src/index.ts",
    "content": "export function hello() {\n  return 'Hello World';\n}",
    "language": "typescript"
  }
}
```

---

### 搜索文件

**请求**

```
GET /api/v1/files/search?query=:query&path=:path
```

**响应**

```json
{
  "success": true,
  "data": [
    {
      "path": "/path/to/project/src/index.ts",
      "line": 1,
      "column": 1,
      "text": "export function hello()"
    }
  ]
}
```

---

## 错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

**错误响应示例**

```json
{
  "success": false,
  "error": "项目不存在"
}
```

---

## 速率限制

当前版本没有速率限制。

---

## 版本

当前 API 版本：v1

---

## 更新日志

### v1.0.0 (2026-01-18)

- ✅ 初始版本发布
- ✅ Projects API
- ✅ CodeMaps API
- ✅ Files API

---

## 获取帮助

- 📖 [用户指南](./USER_GUIDE.md)
- 🐛 [问题反馈](https://github.com/your-repo/issues)
- 💬 [讨论](https://github.com/your-repo/discussions)

---

**最后更新**: 2026-01-18