import { ref, onUnmounted } from 'vue'

declare global {
  interface Window {
    Infographic?: any
  }
}

export function useInfographic() {
  const isLoading = ref(false)
  const isReady = ref(false)
  const error = ref<string | null>(null)

  let infographicInstance: any = null

  async function loadInfographic() {
    if (typeof window !== 'undefined' && !window.Infographic) {
      isLoading.value = true
      error.value = null

      try {
        const script = document.createElement('script')
        script.src = '/assets/infographic.min.js'
        script.async = true

        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })

        infographicInstance = window.Infographic
        isReady.value = true
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to load Infographic'
        throw e
      } finally {
        isLoading.value = false
      }
    } else if (window.Infographic) {
      infographicInstance = window.Infographic
      isReady.value = true
    }
  }

  async function render(containerId: string, steps: string[]) {
    if (!isReady.value) {
      await loadInfographic()
    }

    if (!infographicInstance) {
      throw new Error('Infographic not initialized')
    }

    const container = document.getElementById(containerId)
    if (!container) {
      throw new Error(`Container with id "${containerId}" not found`)
    }

    try {
      container.innerHTML = ''

      const infographic = new infographicInstance.Infographic({
        container,
        steps: steps.map((step, index) => ({
          id: `step-${index}`,
          content: step
        })),
        width: '100%',
        height: 'auto',
        theme: 'light'
      })

      infographic.render()
      return infographic
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to render infographic'
      throw e
    }
  }

  async function renderFromMarkdown(markdown: string, containerId: string) {
    const steps = parseInfographicSteps(markdown)
    return render(containerId, steps)
  }

  function parseInfographicSteps(markdown: string): string[] {
    const lines = markdown.split('\n')
    const steps: string[] = []
    let currentStep: string[] = []

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (trimmedLine.startsWith('## ')) {
        if (currentStep.length > 0) {
          steps.push(currentStep.join('\n'))
          currentStep = []
        }
      } else if (trimmedLine.startsWith('### ')) {
        if (currentStep.length > 0) {
          steps.push(currentStep.join('\n'))
          currentStep = []
        }
      }

      currentStep.push(line)
    }

    if (currentStep.length > 0) {
      steps.push(currentStep.join('\n'))
    }

    return steps.length > 0 ? steps : [markdown]
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
    loadInfographic,
    render,
    renderFromMarkdown,
    parseInfographicSteps,
    exportAsSVG,
    exportAsPNG
  }
}