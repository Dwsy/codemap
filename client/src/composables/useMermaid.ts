import { ref, onUnmounted } from 'vue'
import mermaid from 'mermaid'

interface MermaidConfig {
  startOnLoad?: boolean
  theme?: 'default' | 'forest' | 'dark' | 'neutral'
  securityLevel?: 'strict' | 'loose'
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
}

export function useMermaid(config: MermaidConfig = {}) {
  const isLoading = ref(false)
  const isReady = ref(false)
  const error = ref<string | null>(null)
  const scale = ref(1)
  const translateX = ref(0)
  const translateY = ref(0)

  const defaultConfig: MermaidConfig = {
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    logLevel: 'error',
    ...config
  }

  async function loadMermaid() {
    if (!isReady.value) {
      isLoading.value = true
      error.value = null

      try {
        mermaid.initialize(defaultConfig)
        isReady.value = true
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load Mermaid'
        throw e
      } finally {
        isLoading.value = false
      }
    }
  }

  async function render(elementId: string, definition: string) {
    if (!isReady.value) {
      await loadMermaid()
    }

    try {
      const uniqueId = `mermaid-${elementId}-${Date.now()}`
      const { svg } = await mermaid.render(uniqueId, definition)
      return svg
    } catch (e) {
      console.error('Mermaid render error:', e)
      error.value = e instanceof Error ? e.message : 'Failed to render diagram'
      throw e
    }
  }

  function resetTransform() {
    scale.value = 1
    translateX.value = 0
    translateY.value = 0
  }

  function zoomIn() {
    scale.value = Math.min(scale.value * 1.2, 5)
  }

  function zoomOut() {
    scale.value = Math.max(scale.value / 1.2, 0.1)
  }

  function pan(dx: number, dy: number) {
    translateX.value += dx
    translateY.value += dy
  }

  function getTransformStyle() {
    return {
      transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
      transformOrigin: 'center center',
      transition: 'transform 0.2s ease-out'
    }
  }

  async function exportAsSVG(containerId: string): Promise<string> {
    const svgElement = document.querySelector(`#${containerId} svg`)
    if (!svgElement) {
      throw new Error('SVG element not found')
    }
    return svgElement.outerHTML
  }

  async function exportAsPNG(containerId: string): Promise<Blob> {
    const svgElement = document.querySelector(`#${containerId} svg`)
    if (!svgElement) {
      throw new Error('SVG element not found')
    }

    const svgData = new XMLSerializer().serializeToString(svgElement)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    const image = new Image()
    image.src = url

    await new Promise((resolve) => {
      image.onload = resolve
    })

    const canvas = document.createElement('canvas')
    canvas.width = image.width * 2
    canvas.height = image.height * 2
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(2, 2)
      ctx.drawImage(image, 0, 0)
    }

    URL.revokeObjectURL(url)
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob)
      }, 'image/png')
    })
  }

  onUnmounted(() => {
    error.value = null
  })

  return {
    isLoading,
    isReady,
    error,
    scale,
    translateX,
    translateY,
    loadMermaid,
    render,
    resetTransform,
    zoomIn,
    zoomOut,
    pan,
    getTransformStyle,
    exportAsSVG,
    exportAsPNG
  }
}