import { Hono } from 'hono'
import { storage } from '../../storage.js'
import { successResponse, errorResponse } from '../../middleware/apiResponse.js'
import type { ApiResponse, CodeMap as CodeMapType } from '../../../shared/types/index.js'

const app = new Hono()

// 获取所有 CodeMaps
app.get('/', (c) => {
  try {
    const projects = storage.getAllProjects()
    const allCodemaps: CodeMapType[] = []

    for (const project of projects) {
      const codemaps = storage.getCodeMaps(project.path)
      for (const cm of codemaps) {
        // 从 traces 中提取 infographicSteps
        const infographicSteps = cm.traces?.map(trace => trace.traceGuide).filter(Boolean) ?? []

        allCodemaps.push({
          id: cm.id,
          projectPath: cm.projectPath,
          name: cm.title,
          description: cm.description,
          mermaidDiagram: cm.mermaidDiagram,
          infographicSteps: infographicSteps.length > 0 ? infographicSteps : undefined,
          traces: cm.traces,
          createdAt: cm.createdAt,
          updatedAt: cm.createdAt
        })
      }
    }

    // 按创建时间倒序排序
    allCodemaps.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return c.json(successResponse(allCodemaps))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 从文件加载 CodeMap (必须在 /:id 之前)
app.get('/from-file', async (c) => {
  try {
    const filePath = c.req.query('path')

    if (!filePath) {
      return c.json(errorResponse('path parameter is required'), 400)
    }

    const fileContent = await Bun.file(filePath).text()
    const codemapData = JSON.parse(fileContent)

    if (!codemapData.title || !codemapData.mermaidDiagram) {
      return c.json(errorResponse('Invalid CodeMap format'), 400)
    }

    const projectPath = filePath.substring(0, filePath.lastIndexOf('/docs/codemap'))
    const existingCodemaps = storage.getCodeMaps(projectPath)
    const existing = existingCodemaps.find(
      cm => cm.title === codemapData.title && cm.description === codemapData.description
    )

    if (existing) {
      const infographicSteps = existing.traces?.map(trace => trace.traceGuide).filter(Boolean) ?? []
      const result: CodeMapType = {
        id: existing.id,
        projectPath: existing.projectPath,
        name: existing.title,
        description: existing.description,
        mermaidDiagram: existing.mermaidDiagram,
        infographicSteps: infographicSteps.length > 0 ? infographicSteps : undefined,
        traces: existing.traces,
        createdAt: existing.createdAt,
        updatedAt: existing.createdAt
      }
      return c.json(successResponse(result))
    }

    // 保存新的 CodeMap
    const saved = storage.saveCodeMap(projectPath, codemapData)
    const infographicSteps = saved.traces?.map(trace => trace.traceGuide).filter(Boolean) ?? []
    const result: CodeMapType = {
      id: saved.id,
      projectPath: saved.projectPath,
      name: saved.title,
      description: saved.description,
      mermaidDiagram: saved.mermaidDiagram,
      infographicSteps: infographicSteps.length > 0 ? infographicSteps : undefined,
      traces: saved.traces,
      createdAt: saved.createdAt,
      updatedAt: saved.createdAt
    }

    return c.json(successResponse(result, 'CodeMap loaded successfully'), 201)
  } catch (e: any) {
    console.error('from-file error:', e)
    return c.json(errorResponse(e.message), 500)
  }
})

// 创建 CodeMap
app.post('/', async (c) => {
  try {
    const { projectPath, codemap } = await c.req.json<{
      projectPath: string
      codemap: any
    }>()

    if (!projectPath || !codemap) {
      return c.json(errorResponse('projectPath and codemap are required'), 400)
    }

    const saved = storage.saveCodeMap(projectPath, codemap)
    const infographicSteps = saved.traces?.map(trace => trace.traceGuide).filter(Boolean) ?? []
    const result: CodeMapType = {
      id: saved.id,
      projectPath: saved.projectPath,
      name: saved.title,
      description: saved.description,
      mermaidDiagram: saved.mermaidDiagram,
      infographicSteps: infographicSteps.length > 0 ? infographicSteps : undefined,
      traces: saved.traces,
      createdAt: saved.createdAt,
      updatedAt: saved.createdAt
    }

    return c.json(successResponse(result, 'CodeMap created successfully'), 201)
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 获取单个 CodeMap
app.get('/:id', (c) => {
  try {
    const id = c.req.param('id')
    const codemap = storage.getCodeMap(id)

    if (!codemap) {
      return c.json(errorResponse('CodeMap not found'), 404)
    }

    const infographicSteps = codemap.traces?.map(trace => trace.traceGuide).filter(Boolean) ?? []
    const result: CodeMapType = {
      id: codemap.id,
      projectPath: codemap.projectPath,
      name: codemap.title,
      description: codemap.description,
      mermaidDiagram: codemap.mermaidDiagram,
      infographicSteps: infographicSteps.length > 0 ? infographicSteps : undefined,
      traces: codemap.traces,
      createdAt: codemap.createdAt,
      updatedAt: codemap.createdAt
    }

    return c.json(successResponse(result))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 删除 CodeMap
app.delete('/:id', (c) => {
  try {
    const id = c.req.param('id')
    storage.deleteCodeMap(id)
    return c.json(successResponse(null, 'CodeMap deleted successfully'))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

export default app