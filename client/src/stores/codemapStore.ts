import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { CodeMap, CodeMapMeta, ViewMode, SuggestedTopic, PanelLayout } from 'codemap'

/**
 * CodeMap Store
 * 使用 Zustand + Immer 管理应用状态
 */
interface CodeMapStore {
  // 当前 CodeMap
  currentCodeMap: CodeMap | null
  selectedNodeId: string | null
  viewMode: ViewMode
  panelLayout: PanelLayout
  
  // 历史记录
  history: CodeMapMeta[]
  
  // UI 状态
  isLoading: boolean
  error: string | null
  showCreateDialog: boolean
  initialPrompt: string
  
  // 建议主题
  suggestedTopics: SuggestedTopic[]
  
  // 搜索
  searchQuery: string
  
  // Actions
  setCurrentCodeMap: (codemap: CodeMap | null) => void
  setSelectedNodeId: (nodeId: string | null) => void
  setViewMode: (mode: ViewMode) => void
  setPanelLayout: (layout: Partial<PanelLayout>) => void
  setHistory: (history: CodeMapMeta[]) => void
  addToHistory: (meta: CodeMapMeta) => void
  removeFromHistory: (id: string) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setShowCreateDialog: (show: boolean) => void
  setInitialPrompt: (prompt: string) => void
  setSuggestedTopics: (topics: SuggestedTopic[]) => void
  setSearchQuery: (query: string) => void
  
  // Async Actions
  createCodeMap: (prompt: string, files: string[], projectRoot: string, modelTier: ModelTier) => Promise<void>
  loadCodeMapById: (id: string) => Promise<void>
  loadHistory: () => Promise<void>
  loadSuggestedTopics: () => Promise<void>
  
  // Getters (computed)
  getSelectedNode: () => any
  getRootNodes: () => any[]
  getChildren: (nodeId: string) => any[]
  searchNodes: (query: string) => any[]
}

export const useCodeMapStore = create<CodeMapStore>()(
  immer((set, get) => ({
    // Initial state
    currentCodeMap: null,
    selectedNodeId: null,
    viewMode: ViewMode.Tree,
    panelLayout: {
      treeWidth: 350,
      detailsWidth: 400,
      showDetails: true,
    },
    history: [],
    isLoading: false,
    error: null,
    showCreateDialog: false,
    initialPrompt: '',
    suggestedTopics: [],
    searchQuery: '',
    
    // Actions
    setCurrentCodeMap: (codemap) => {
      set((state) => {
        state.currentCodeMap = codemap
        state.selectedNodeId = null
      })
    },
    
    setSelectedNodeId: (nodeId) => {
      set((state) => {
        state.selectedNodeId = nodeId
        if (nodeId) {
          state.panelLayout.showDetails = true
        }
      })
    },
    
    setViewMode: (mode) => {
      set((state) => {
        state.viewMode = mode
      })
    },
    
    setPanelLayout: (layout) => {
      set((state) => {
        Object.assign(state.panelLayout, layout)
      })
    },
    
    setHistory: (history) => {
      set((state) => {
        state.history = history
      })
    },
    
    addToHistory: (meta) => {
      set((state) => {
        const existingIndex = state.history.findIndex(h => h.id === meta.id)
        if (existingIndex >= 0) {
          state.history[existingIndex] = meta
        } else {
          state.history.unshift(meta)
        }
      })
    },
    
    removeFromHistory: async (id) => {
      try {
        // 获取当前工作目录作为项目根目录
        const projectRoot = await window.__TAURI__.core.invoke('get_project_root')
        
        // 调用 Rust 后端删除
        await window.__TAURI__.core.invoke('delete_codemap', {
          id,
          projectRoot: projectRoot,
        })
        
        // 从本地状态中移除
        set((state) => {
          state.history = state.history.filter(h => h.id !== id)
        })
        
      } catch (error) {
        console.error('Failed to delete codemap:', error)
      }
    },
    
    setIsLoading: (loading) => {
      set((state) => {
        state.isLoading = loading
      })
    },
    
    setError: (error) => {
      set((state) => {
        state.error = error
      })
    },
    
    setShowCreateDialog: (show) => {
      set((state) => {
        state.showCreateDialog = show
        // 关闭对话框时清除 initialPrompt
        if (!show) {
          state.initialPrompt = ''
        }
      })
    },
    
    setInitialPrompt: (prompt) => {
      set((state) => {
        state.initialPrompt = prompt
      })
    },
    
    setSuggestedTopics: (topics) => {
      set((state) => {
        state.suggestedTopics = topics
      })
    },
    
    setSearchQuery: (query) => {
      set((state) => {
        state.searchQuery = query
      })
    },
    
    // Async Actions
    createCodeMap: async (prompt, files, projectRoot, modelTier) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })
      
      try {
        // Demo mode: 如果没有提供文件，使用当前项目的示例文件
        let actualFiles = files
        if (actualFiles.length === 0) {
          actualFiles = [
            `${projectRoot}/client/src/App.tsx`,
            `${projectRoot}/client/src/stores/codemapStore.ts`,
            `${projectRoot}/client/src/components/Header.tsx`,
            `${projectRoot}/client/src/components/Sidebar.tsx`,
            `${projectRoot}/client/src/components/MainPanel.tsx`,
          ]
        }
        
        console.log('🚀 Creating CodeMap with files:', actualFiles)
        
        // 调用 Tauri 命令生成 CodeMap
        const codemapJson = await window.__TAURI__.core.invoke('generate_codemap_with_pi', {
          query: prompt,
          files: actualFiles,
          projectRoot: projectRoot,
        })
        
        console.log('📦 Received raw JSON from generator:', codemapJson)
        
        const codemap: CodeMap = JSON.parse(codemapJson)
        
        console.log('✅ Parsed CodeMap:', {
          codemapId: codemap.codemap_id,
          title: codemap.title,
          nodesCount: codemap.nodes.length,
          edgesCount: codemap.edges.length,
          nodes: codemap.nodes.map(n => ({
            id: n.node_id,
            title: n.title,
            hasChildren: n.children?.length > 0,
            codeRefsCount: n.code_refs?.length ?? 0
          }))
        })
        
        set((state) => {
          state.currentCodeMap = codemap
          state.isLoading = false
        })
        
        // 保存到历史
        const meta: CodeMapMeta = {
          id: codemap.codemap_id,
          filename: `${codemap.codemap_id}.json`,
          title: codemap.title,
          prompt: codemap.prompt,
          created_at: codemap.created_at,
          updated_at: new Date().toISOString(),
          tags: [modelTier],
          note: undefined,
        }
        
        set((state) => {
          state.history.unshift(meta)
        })
        
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : String(error)
          state.isLoading = false
        })
      }
    },
    
    loadCodeMapById: async (id: string) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })
      
      try {
        // 获取当前工作目录作为项目根目录
        const projectRoot = await window.__TAURI__.core.invoke('get_project_root')
        
        const codemapJson = await window.__TAURI__.core.invoke('load_codemap', {
          id,
          projectRoot: projectRoot,
        })
        
        const codemap: CodeMap = JSON.parse(codemapJson)
        
        set((state) => {
          state.currentCodeMap = codemap
          state.isLoading = false
        })
        
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : String(error)
          state.isLoading = false
        })
      }
    },
    
    loadHistory: async () => {
      try {
        // 获取当前工作目录作为项目根目录
        const projectRoot = await window.__TAURI__.core.invoke('get_project_root')
        
        const historyJson = await window.__TAURI__.core.invoke('list_codemaps', {
          projectRoot: projectRoot,
        })
        
        // 检查返回的 JSON 是否有效
        if (!historyJson || historyJson.trim() === '') {
          set((state) => {
            state.history = []
          })
          return
        }
        
        const history: CodeMapMeta[] = JSON.parse(historyJson)
        
        set((state) => {
          state.history = history
        })
        
      } catch (error) {
        // 如果加载失败，使用空历史
        set((state) => {
          state.history = []
        })
      }
    },
    
    loadSuggestedTopics: async () => {
      // 生成模拟建议主题
      const topics: SuggestedTopic[] = [
        {
          id: 's1',
          title: '用户认证流程',
          description: '追踪从用户登录到 token 生成的完整流程',
          icon: '🔐',
        },
        {
          id: 's2',
          title: '订单处理链路',
          description: '分析订单创建、支付、发货的完整业务流程',
          icon: '📦',
        },
        {
          id: 's3',
          title: '数据同步机制',
          description: '理解系统间数据同步的实现方式',
          icon: '🔄',
        },
      ]
      
      set((state) => {
        state.suggestedTopics = topics
      })
    },
    
    // Getters
    getSelectedNode: () => {
      const { currentCodeMap, selectedNodeId } = get()
      if (!currentCodeMap || !selectedNodeId) return null
      return currentCodeMap.nodes.find(n => n.node_id === selectedNodeId) || null
    },
    
    getRootNodes: () => {
      const { currentCodeMap } = get()
      if (!currentCodeMap) return []
      
      const allChildren = new Set<string>()
      currentCodeMap.nodes.forEach(node => {
        node.children.forEach(childId => allChildren.add(childId))
      })
      
      return currentCodeMap.nodes.filter(node => !allChildren.has(node.node_id))
    },
    
    getChildren: (nodeId: string) => {
      const { currentCodeMap } = get()
      if (!currentCodeMap) return []
      
      const node = currentCodeMap.nodes.find(n => n.node_id === nodeId)
      if (!node) return []
      
      return node.children
        .map(childId => currentCodeMap.nodes.find(n => n.node_id === childId))
        .filter((n): n is any => n !== undefined)
    },
    
    searchNodes: (query: string) => {
      const { currentCodeMap } = get()
      if (!currentCodeMap || !query.trim()) return []
      
      const lowerQuery = query.toLowerCase()
      return currentCodeMap.nodes.filter(node =>
        node.title.toLowerCase().includes(lowerQuery) ||
        node.summary.toLowerCase().includes(lowerQuery)
      )
    },
  }))
)

// Selectors
export const selectCurrentCodeMap = (state: CodeMapStore) => state.currentCodeMap
export const selectSelectedNode = (state: CodeMapStore) => state.getSelectedNode()
export const selectRootNodes = (state: CodeMapStore) => state.getRootNodes()
export const selectIsLoading = (state: CodeMapStore) => state.isLoading
export const selectError = (state: CodeMapStore) => state.error
export const selectSuggestedTopics = (state: CodeMapStore) => state.suggestedTopics