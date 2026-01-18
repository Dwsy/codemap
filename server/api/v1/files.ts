import { Hono } from 'hono'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { successResponse, errorResponse } from '../../middleware/apiResponse.js'
import { detectLanguage, escapeHtml } from '../../lib/utils.js'
import type { ApiResponse, FileContent, FileTreeNode } from '../../../shared/types/index.js'

const app = new Hono()

// 读取文件内容
app.get('/', (c) => {
  try {
    const path = c.req.query('path')

    if (!path) {
      return c.json(errorResponse('path parameter is required'), 400)
    }

    if (!existsSync(path)) {
      return c.json(errorResponse('File not found'), 404)
    }

    const content = readFileSync(path, 'utf-8')
    const language = detectLanguage(path)

    const result: FileContent = {
      path,
      content,
      language
    }

    return c.json(successResponse(result))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 获取文件树（从指定目录）
app.get('/tree', (c) => {
  try {
    const path = c.req.query('path')

    if (!path) {
      return c.json(errorResponse('path parameter is required'), 400)
    }

    const tree = scanDirectory(path)
    return c.json(successResponse(tree))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 获取文件的指定行（用于代码高亮跳转）
app.get('/lines', (c) => {
  try {
    const path = c.req.query('path')
    const line = c.req.query('line')

    if (!path || !line) {
      return c.json(errorResponse('path and line parameters are required'), 400)
    }

    if (!existsSync(path)) {
      return c.json(errorResponse('File not found'), 404)
    }

    const content = readFileSync(path, 'utf-8')
    const lines = content.split('\n')
    const lineNum = parseInt(line, 10) - 1 // 转换为 0-based

    if (lineNum < 0 || lineNum >= lines.length) {
      return c.json(errorResponse('Line number out of range'), 400)
    }

    // 返回目标行及其上下文（前后各 5 行）
    const start = Math.max(0, lineNum - 5)
    const end = Math.min(lines.length, lineNum + 6)
    const contextLines = lines.slice(start, end).map((l, i) => ({
      line: start + i + 1,
      content: l,
      isTarget: start + i === lineNum
    }))

    return c.json(successResponse({
      path,
      targetLine: lineNum + 1,
      contextLines
    }))
  } catch (e: any) {
    return c.json(errorResponse(e.message), 500)
  }
})

// 辅助函数：扫描目录
function scanDirectory(dirPath: string): FileTreeNode[] {
  const { existsSync, readdirSync, statSync } = require('fs')
  const { join } = require('path')

  if (!existsSync(dirPath)) {
    return []
  }

  const IGNORE_DIRS = ['.git', 'node_modules', '.DS_Store', 'dist', 'build', 'coverage', '.idea', '.vscode']

  let files
  try {
    files = readdirSync(dirPath)
  } catch (e: any) {
    return []
  }

  const tree: FileTreeNode[] = []

  for (const file of files) {
    if (IGNORE_DIRS.includes(file)) continue

    const fullPath = join(dirPath, file)
    const stats = statSync(fullPath)
    const isDirectory = stats.isDirectory()

    const node: FileTreeNode = {
      name: file,
      path: fullPath,
      type: isDirectory ? 'dir' : 'file'
    }

    if (isDirectory) {
      node.children = scanDirectory(fullPath)
    }

    tree.push(node)
  }

  return tree.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name)
    return a.type === 'dir' ? -1 : 1
  })
}

export default app