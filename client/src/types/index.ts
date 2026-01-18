export interface Project {
  path: string
  name: string
  description?: string
  registeredAt: string
  updatedAt: string
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
  title: string
  description?: string
  traceTextDiagram?: string
  traceGuide?: string
  locations?: CodeNodeLocation[]
}

export interface CodeNode {
  file: string
  line: number
  column?: number
  snippet?: string
}

export interface CodeNodeLocation {
  id: string
  path: string
  lineNumber: number
  lineContent: string
  title: string
  description: string
}

export interface FileContent {
  path: string
  content: string
  language?: string
}

export interface UIState {
  sidebarOpen: boolean
  codePanelOpen: boolean
  selectedView: 'mermaid' | 'infographic' | 'traces'
}