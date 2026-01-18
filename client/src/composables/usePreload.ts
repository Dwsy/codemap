import { ref } from 'vue'

interface PreloadOptions {
  priority?: 'high' | 'low' | 'auto'
  timeout?: number
}

interface PreloadResult {
  loaded: boolean
  error?: Error
  time: number
}

const preloadCache = new Map<string, Promise<PreloadResult>>()

export function usePreload() {
  const preloading = ref<Set<string>>(new Set())
  const preloaded = ref<Set<string>>(new Set())

  function preloadScript(url: string, options: PreloadOptions = {}): Promise<PreloadResult> {
    const { priority = 'auto', timeout = 5000 } = options

    if (preloaded.value.has(url)) {
      return Promise.resolve({ loaded: true, time: 0 })
    }

    if (preloadCache.has(url)) {
      return preloadCache.get(url)!
    }

    const startTime = performance.now()
    preloading.value.add(url)

    const promise = new Promise<PreloadResult>((resolve) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'script'
      link.href = url

      if (priority !== 'auto') {
        link.setAttribute('fetchpriority', priority)
      }

      link.onload = () => {
        const time = performance.now() - startTime
        preloading.value.delete(url)
        preloaded.value.add(url)
        resolve({ loaded: true, time })
      }

      link.onerror = () => {
        const time = performance.now() - startTime
        preloading.value.delete(url)
        resolve({ loaded: false, error: new Error(`Failed to preload ${url}`), time })
      }

      document.head.appendChild(link)

      if (timeout > 0) {
        setTimeout(() => {
          if (preloading.value.has(url)) {
            preloading.value.delete(url)
            resolve({ loaded: false, error: new Error(`Preload timeout for ${url}`), time: timeout })
          }
        }, timeout)
      }
    })

    preloadCache.set(url, promise)
    return promise
  }

  function preloadStyle(url: string, options: PreloadOptions = {}): Promise<PreloadResult> {
    const { priority = 'auto', timeout = 5000 } = options

    if (preloaded.value.has(url)) {
      return Promise.resolve({ loaded: true, time: 0 })
    }

    if (preloadCache.has(url)) {
      return preloadCache.get(url)!
    }

    const startTime = performance.now()
    preloading.value.add(url)

    const promise = new Promise<PreloadResult>((resolve) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = url

      if (priority !== 'auto') {
        link.setAttribute('fetchpriority', priority)
      }

      link.onload = () => {
        const time = performance.now() - startTime
        preloading.value.delete(url)
        preloaded.value.add(url)
        resolve({ loaded: true, time })
      }

      link.onerror = () => {
        const time = performance.now() - startTime
        preloading.value.delete(url)
        resolve({ loaded: false, error: new Error(`Failed to preload ${url}`), time })
      }

      document.head.appendChild(link)

      if (timeout > 0) {
        setTimeout(() => {
          if (preloading.value.has(url)) {
            preloading.value.delete(url)
            resolve({ loaded: false, error: new Error(`Preload timeout for ${url}`), time: timeout })
          }
        }, timeout)
      }
    })

    preloadCache.set(url, promise)
    return promise
  }

  function prefetchUrl(url: string, options: PreloadOptions = {}): Promise<PreloadResult> {
    const { timeout = 10000 } = options

    if (preloaded.value.has(url)) {
      return Promise.resolve({ loaded: true, time: 0 })
    }

    if (preloadCache.has(url)) {
      return preloadCache.get(url)!
    }

    const startTime = performance.now()

    const promise = new Promise<PreloadResult>((resolve) => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url

      link.onload = () => {
        const time = performance.now() - startTime
        preloaded.value.add(url)
        resolve({ loaded: true, time })
      }

      link.onerror = () => {
        const time = performance.now() - startTime
        resolve({ loaded: false, error: new Error(`Failed to prefetch ${url}`), time })
      }

      document.head.appendChild(link)

      if (timeout > 0) {
        setTimeout(() => {
          if (!preloaded.value.has(url)) {
            resolve({ loaded: false, error: new Error(`Prefetch timeout for ${url}`), time: timeout })
          }
        }, timeout)
      }
    })

    preloadCache.set(url, promise)
    return promise
  }

  async function preloadComponent(importFn: () => Promise<any>): Promise<PreloadResult> {
    const startTime = performance.now()

    try {
      await importFn()
      const time = performance.now() - startTime
      return { loaded: true, time }
    } catch (error) {
      const time = performance.now() - startTime
      return { loaded: false, error: error as Error, time }
    }
  }

  function preloadImage(url: string, options: PreloadOptions = {}): Promise<PreloadResult> {
    const { timeout = 5000 } = options

    if (preloaded.value.has(url)) {
      return Promise.resolve({ loaded: true, time: 0 })
    }

    if (preloadCache.has(url)) {
      return preloadCache.get(url)!
    }

    const startTime = performance.now()

    const promise = new Promise<PreloadResult>((resolve) => {
      const img = new Image()

      img.onload = () => {
        const time = performance.now() - startTime
        preloaded.value.add(url)
        resolve({ loaded: true, time })
      }

      img.onerror = () => {
        const time = performance.now() - startTime
        resolve({ loaded: false, error: new Error(`Failed to preload image ${url}`), time })
      }

      img.src = url

      if (timeout > 0) {
        setTimeout(() => {
          if (!preloaded.value.has(url)) {
            resolve({ loaded: false, error: new Error(`Preload timeout for image ${url}`), time: timeout })
          }
        }, timeout)
      }
    })

    preloadCache.set(url, promise)
    return promise
  }

  function clearCache() {
    preloadCache.clear()
  }

  function clearPreloaded() {
    preloaded.value.clear()
  }

  return {
    preloading,
    preloaded,
    preloadScript,
    preloadStyle,
    prefetchUrl,
    preloadComponent,
    preloadImage,
    clearCache,
    clearPreloaded
  }
}