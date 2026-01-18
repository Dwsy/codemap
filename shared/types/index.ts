export interface Project {
  path: string
  name: string
  description?: string
  registeredAt: string
  updatedAt?: string
}

export interface CodeMap {
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

export interface Trace {
  id: string
  name: string
  type: 'function' | 'class' | 'module' | 'file'
  description?: string
  traceTextDiagram?: string
  traceGuide?: string
  children?: Trace[]
  codeNode?: CodeNode
}

export interface CodeNode {
  file: string
  line: number
  column?: number
  snippet?: string
}

export interface FileTreeNode {
  name: string
  path: string
  type: 'dir' | 'file'
  children?: FileTreeNode[]
}

export interface FileContent {
  path: string
  content: string
  language?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}