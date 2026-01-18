import { Hono } from 'hono'
import { storage } from '../../storage.js'
import { scanDirectory, scanDocsCodeMap } from '../../lib/utils.js'
import { successResponse, errorResponse } from '../../middleware/apiResponse.js'
import type { ApiResponse, Project, CodeMap as CodeMapType } from '../../../shared/types/index.js'
import { readFileSync } from 'fs'

const app = new Hono()

// 获取所有项目
app.get('/', (c) => {
  try {
    const projects = storage.getAllProjects()
    const result: Project[] = projects.map(p => ({
      path: p.path,
      name: p.path.split('/').pop() || p.path,
      description: '',
      registeredAt: p.registeredAt,
      updatedAt: p.registeredAt
    }))
    return c.json(successResponse(result))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 获取单个项目
app.get('/:path', (c) => {
  try {
    const path = decodeURIComponent(c.req.param('path'))
    const projects = storage.getAllProjects()
    const project = projects.find(p => p.path === path)

    if (!project) {
      return c.json(errorResponse('Project not found'), 404)
    }

    const result: Project = {
      path: project.path,
      name: project.path.split('/').pop() || project.path,
      description: '',
      registeredAt: project.registeredAt,
      updatedAt: project.registeredAt
    }

    return c.json(successResponse(result))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 注册项目
app.post('/', async (c) => {
  try {
    const { path } = await c.req.json<{ path: string }>()

    if (!path) {
      return c.json(errorResponse('Path is required'), 400)
    }

    const project = storage.addProject(path)
    const result: Project = {
      path: project.path,
      name: project.path.split('/').pop() || project.path,
      description: '',
      registeredAt: project.registeredAt,
      updatedAt: project.registeredAt
    }

    return c.json(successResponse(result, 'Project registered successfully'), 201)
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 删除项目
app.delete('/:path', (c) => {
  try {
    const path = decodeURIComponent(c.req.param('path'))
    storage.deleteProject(path)
    return c.json(successResponse(null, 'Project deleted successfully'))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 获取项目的 CodeMaps
app.get('/:path/codemaps', (c) => {
  try {
    const path = decodeURIComponent(c.req.param('path'))

    // 获取已保存的 CodeMaps
    const savedCodemaps = storage.getCodeMaps(path)

    // 扫描 docs/codemap 目录中的文件
    const scannedCodemaps = scanDocsCodeMap(path)

    // 合并结果：优先使用已保存的，补充扫描到的
    const codemapsMap = new Map()

    // 先添加已保存的
    for (const cm of savedCodemaps) {
      codemapsMap.set(cm.id, cm)
    }

    // 再添加扫描到的（如果不存在）
    for (const scanned of scannedCodemaps) {
      const exists = Array.from(codemapsMap.values()).find(
        cm => cm.title === scanned.title && cm.description === scanned.description
      )

      if (!exists) {
        // 尝试加载并保存这个 CodeMap
        try {
          const content = JSON.parse(readFileSync(scanned.path, 'utf-8'))
          const saved = storage.saveCodeMap(path, content)
          codemapsMap.set(saved.id, saved)
        } catch {
          // 忽略加载失败的文件
        }
      }
    }

    const result: CodeMapType[] = Array.from(codemapsMap.values()).map(cm => {
      // 从 traces 中提取 infographicSteps
      const infographicSteps = cm.traces?.map(trace => trace.traceGuide).filter(Boolean) ?? []

      return {
        id: cm.id,
        projectPath: cm.projectPath,
        name: cm.title,
        description: cm.description,
        mermaidDiagram: cm.mermaidDiagram,
        infographicSteps: infographicSteps.length > 0 ? infographicSteps : undefined,
        traces: cm.traces,
        createdAt: cm.createdAt,
        updatedAt: cm.createdAt
      }
    }).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return c.json(successResponse(result))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 扫描项目文件
app.get('/:path/files', (c) => {
  try {
    const path = decodeURIComponent(c.req.param('path'))
    const files = scanDirectory(path)
    return c.json(successResponse(files))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 扫描 docs/codemap 文件
app.get('/:path/docs-codemaps', (c) => {
  try {
    const path = decodeURIComponent(c.req.param('path'))
    const docsCodemaps = scanDocsCodeMap(path)
    return c.json(successResponse(docsCodemaps))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

export default app