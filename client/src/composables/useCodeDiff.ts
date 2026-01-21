import { ref, computed } from 'vue'
import * as monaco from 'monaco-editor'

export interface DiffOptions {
  renderSideBySide: boolean
  ignoreTrimWhitespace: boolean
  renderLineHighlight: 'all' | 'none' | 'gutter' | 'line'
  enableSplitViewResizing: boolean
  renderOverviewRuler: boolean
}

const defaultOptions: DiffOptions = {
  renderSideBySide: true,
  ignoreTrimWhitespace: true,
  renderLineHighlight: 'all',
  enableSplitViewResizing: true,
  renderOverviewRuler: true
}

export function useCodeDiff() {
  const original = ref('')
  const modified = ref('')
  const options = ref<DiffOptions>({ ...defaultOptions })
  const diffEditorRef = ref<monaco.editor.IStandaloneDiffEditor | null>(null)

  const diffCount = computed(() => {
    if (!diffEditorRef.value) return { added: 0, removed: 0, changed: 0 }

    const lineChanges = diffEditorRef.value.getLineChanges() || []
    let added = 0
    let removed = 0
    let changed = 0

    lineChanges.forEach((change: any) => {
      if (change.originalEndLineNumber === 0) {
        added += (change.modifiedEndLineNumber - change.modifiedStartLineNumber + 1)
      } else if (change.modifiedEndLineNumber === 0) {
        removed += (change.originalEndLineNumber - change.originalStartLineNumber + 1)
      } else {
        changed += Math.max(
          change.originalEndLineNumber - change.originalStartLineNumber + 1,
          change.modifiedEndLineNumber - change.modifiedStartLineNumber + 1
        )
      }
    })

    return { added, removed, changed }
  })

  function createDiffEditor(
    container: HTMLElement,
    theme: string
  ): monaco.editor.IStandaloneDiffEditor {
    const editor = monaco.editor.createDiffEditor(container, {
      theme,
      enableSplitViewResizing: options.value.enableSplitViewResizing,
      renderSideBySide: options.value.renderSideBySide,
      ignoreTrimWhitespace: options.value.ignoreTrimWhitespace,
      renderLineHighlight: options.value.renderLineHighlight,
      renderOverviewRuler: options.value.renderOverviewRuler,
      readOnly: true,
      automaticLayout: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      diffWordWrap: 'on'
    })

    diffEditorRef.value = editor
    return editor
  }

  function updateDiff() {
    if (!diffEditorRef.value) return

    const originalModel = monaco.editor.createModel(original.value, 'plaintext')
    const modifiedModel = monaco.editor.createModel(modified.value, 'plaintext')

    diffEditorRef.value.setModel({
      original: originalModel,
      modified: modifiedModel
    })
  }

  function setDiff(originalText: string, modifiedText: string) {
    original.value = originalText
    modified.value = modifiedText
    updateDiff()
  }

  function toggleSideBySide() {
    options.value.renderSideBySide = !options.value.renderSideBySide
    if (diffEditorRef.value) {
      diffEditorRef.value.updateOptions({
        renderSideBySide: options.value.renderSideBySide
      })
    }
  }

  function updateOptions(newOptions: Partial<DiffOptions>) {
    options.value = { ...options.value, ...newOptions }
    if (diffEditorRef.value) {
      diffEditorRef.value.updateOptions(options.value)
    }
  }

  function resetOptions() {
    options.value = { ...defaultOptions }
    if (diffEditorRef.value) {
      diffEditorRef.value.updateOptions(options.value)
    }
  }

  function closeDiff() {
    if (diffEditorRef.value) {
      const model = diffEditorRef.value.getModel()
      if (model) {
        model.original?.dispose()
        model.modified?.dispose()
      }
      diffEditorRef.value.dispose()
      diffEditorRef.value = null
    }
    original.value = ''
    modified.value = ''
  }

  function copyOriginal() {
    navigator.clipboard.writeText(original.value)
  }

  function copyModified() {
    navigator.clipboard.writeText(modified.value)
  }

  function copyDiff() {
    return diffEditorRef.value?.getLineChanges() || []
  }

  return {
    original,
    modified,
    options,
    diffEditorRef,
    diffCount,
    createDiffEditor,
    setDiff,
    updateDiff,
    toggleSideBySide,
    updateOptions,
    resetOptions,
    closeDiff,
    copyOriginal,
    copyModified,
    copyDiff
  }
}