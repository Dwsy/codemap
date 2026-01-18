import { ref, onMounted, onUnmounted } from 'vue'

export interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
}

export interface PerformanceEntry {
  name: string
  value: number
  timestamp: number
}

export function usePerformance() {
  const metrics = ref<PerformanceMetrics>({})
  const entries = ref<PerformanceEntry[]>([])
  const isMonitoring = ref(false)

  function measureLCP() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lcpEntry = entries[entries.length - 1] as any
        metrics.value.lcp = lcpEntry.renderTime || lcpEntry.loadTime
      })

      observer.observe({ type: 'largest-contentful-paint', buffered: true })
      return observer
    } catch (e) {
      console.warn('LCP monitoring not supported', e)
    }
  }

  function measureFID() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[]
        for (const entry of entries) {
          metrics.value.fid = entry.processingStart - entry.startTime
        }
      })

      observer.observe({ type: 'first-input', buffered: true })
      return observer
    } catch (e) {
      console.warn('FID monitoring not supported', e)
    }
  }

  function measureCLS() {
    if (!('PerformanceObserver' in window)) return

    try {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[]
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
          }
        }
        metrics.value.cls = clsValue
      })

      observer.observe({ type: 'layout-shift', buffered: true })
      return observer
    } catch (e) {
      console.warn('CLS monitoring not supported', e)
    }
  }

  function measureFCP() {
    if (!('PerformanceObserver' in window)) return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[]
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            metrics.value.fcp = entry.startTime
          }
        }
      })

      observer.observe({ type: 'paint', buffered: true })
      return observer
    } catch (e) {
      console.warn('FCP monitoring not supported', e)
    }
  }

  function measureTTFB() {
    const navigation = performance.getEntriesByType('navigation')[0] as any
    if (navigation) {
      metrics.value.ttfb = navigation.responseStart
    }
  }

  function startMark(name: string) {
    performance.mark(`${name}-start`)
  }

  function endMark(name: string) {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)

    const measure = performance.getEntriesByName(name)[0]
    entries.value.push({
      name,
      value: measure.duration,
      timestamp: measure.startTime
    })

    return measure.duration
  }

  function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    startMark(name)
    return fn().finally(() => {
      endMark(name)
    })
  }

  function measureSync<T>(name: string, fn: () => T): T {
    startMark(name)
    try {
      return fn()
    } finally {
      endMark(name)
    }
  }

  function getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      }
    }
    return null
  }

  function getNavigationTiming() {
    const navigation = performance.getEntriesByType('navigation')[0] as any
    if (!navigation) return null

    return {
      domContentLoadedEventEnd: navigation.domContentLoadedEventEnd,
      domContentLoadedEventStart: navigation.domContentLoadedEventStart,
      domComplete: navigation.domComplete,
      domInteractive: navigation.domInteractive,
      loadEventEnd: navigation.loadEventEnd,
      loadEventStart: navigation.loadEventStart,
      requestStart: navigation.requestStart,
      responseStart: navigation.responseStart,
      fetchStart: navigation.fetchStart,
      connectStart: navigation.connectStart,
      connectEnd: navigation.connectEnd
    }
  }

  function getEntriesByType(type: string) {
    return performance.getEntriesByType(type)
  }

  function clearMarks() {
    performance.clearMarks()
  }

  function clearMeasures() {
    performance.clearMeasures()
  }

  function clearAll() {
    clearMarks()
    clearMeasures()
    entries.value = []
  }

  function exportMetrics() {
    return {
      webVitals: metrics.value,
      customMetrics: entries.value,
      memory: getMemoryUsage(),
      navigationTiming: getNavigationTiming(),
      timestamp: Date.now()
    }
  }

  function getScore(metric: keyof PerformanceMetrics): 'good' | 'needs-improvement' | 'poor' {
    const value = metrics.value[metric]
    if (!value) return 'needs-improvement'

    switch (metric) {
      case 'lcp':
        if (value <= 2500) return 'good'
        if (value <= 4000) return 'needs-improvement'
        return 'poor'
      case 'fid':
        if (value <= 100) return 'good'
        if (value <= 300) return 'needs-improvement'
        return 'poor'
      case 'cls':
        if (value <= 0.1) return 'good'
        if (value <= 0.25) return 'needs-improvement'
        return 'poor'
      case 'fcp':
        if (value <= 1800) return 'good'
        if (value <= 3000) return 'needs-improvement'
        return 'poor'
      case 'ttfb':
        if (value <= 800) return 'good'
        if (value <= 1800) return 'needs-improvement'
        return 'poor'
      default:
        return 'needs-improvement'
    }
  }

  let observers: any[] = []

  function startMonitoring() {
    if (isMonitoring.value) return

    isMonitoring.value = true

    measureTTFB()
    measureFCP()
    measureLCP()
    measureFID()
    measureCLS()
  }

  function stopMonitoring() {
    isMonitoring.value = false

    observers.forEach(observer => {
      try {
        observer.disconnect()
      } catch (e) {
      }
    })
    observers = []
  }

  onMounted(() => {
    startMonitoring()
  })

  onUnmounted(() => {
    stopMonitoring()
  })

  return {
    metrics,
    entries,
    isMonitoring,
    startMark,
    endMark,
    measureAsync,
    measureSync,
    getMemoryUsage,
    getNavigationTiming,
    getEntriesByType,
    clearMarks,
    clearMeasures,
    clearAll,
    exportMetrics,
    getScore,
    startMonitoring,
    stopMonitoring
  }
}