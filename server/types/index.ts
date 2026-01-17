export interface Project {
  path: string;
  registeredAt: string;
}

export interface Location {
  id: string;
  path: string;
  lineNumber: number;
  lineContent: string;
  description: string;
}

export interface Trace {
  id: string;
  title: string;
  description?: string;
  traceTextDiagram?: string;
  traceGuide?: string;
  locations?: Location[];
}

export interface CodeMap {
  id: string;
  projectPath: string;
  title: string;
  description: string;
  mermaidDiagram: string;
  traces: Trace[];
  createdAt: string;
}

export interface CodeMapFileInfo {
  path: string;
  title: string;
  description: string;
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: 'dir' | 'file';
  children?: FileTreeNode[];
}
