import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface VirtualScrollOptions {
  itemHeight: number | ((index: number) => number)
  overscan?: number
  estimatedItemHeight?: number
}

export function useVirtualScroll<T>(
  items: T[],
  options: VirtualScrollOptions
) {
  const {
    itemHeight,
    overscan = 5,
    estimatedItemHeight = 50
  } = options

  const containerRef = ref<HTMLElement>()
  const scrollTop = ref(0)
  const containerHeight = ref(0)

  const getItemHeight = (index: number): number => {
    return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight
  }

  const totalHeight = computed(() => {
    return items.reduce((sum, _, index) => sum + getItemHeight(index), 0)
  })

  const getOffset = (index: number): number => {
    let offset = 0
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i)
    }
    return offset
  }

  const getVisibleRange = () => {
    if (!containerHeight.value) return { start: 0, end: 0 }

    let start = 0
    let end = 0
    let currentOffset = 0

    for (let i = 0; i < items.length; i++) {
      const height = getItemHeight(i)
      if (currentOffset + height < scrollTop.value - overscan * estimatedItemHeight) {
        currentOffset += height
        start = i + 1
      } else if (currentOffset < scrollTop.value + containerHeight.value + overscan * estimatedItemHeight) {
        end = i + 1
      }
      currentOffset += height
    }

    return { start: Math.max(0, start), end: Math.min(items.length, end) }
  }

  const visibleRange = computed(() => getVisibleRange())

  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value
    return items.slice(start, end).map((item, i) => ({
      item,
      index: start + i,
      offset: getOffset(start + i)
    }))
  })

  const handleScroll = () => {
    if (containerRef.value) {
      scrollTop.value = containerRef.value.scrollTop
    }
  }

  const scrollToIndex = (index: number, align: 'start' | 'center' | 'end' = 'start') => {
    if (!containerRef.value) return

    const offset = getOffset(index)
    const height = getItemHeight(index)

    let targetScroll = offset
    if (align === 'center') {
      targetScroll = offset - containerHeight.value / 2 + height / 2
    } else if (align === 'end') {
      targetScroll = offset - containerHeight.value + height
    }

    containerRef.value.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'smooth'
    })
  }

  const scrollToTop = () => {
    if (containerRef.value) {
      containerRef.value.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollToBottom = () => {
    if (containerRef.value) {
      containerRef.value.scrollTo({
        top: totalHeight.value - containerHeight.value,
        behavior: 'smooth'
      })
    }
  }

  onMounted(() => {
    if (containerRef.value) {
      containerHeight.value = containerRef.value.clientHeight
      containerRef.value.addEventListener('scroll', handleScroll)
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          containerHeight.value = entry.contentRect.height
        }
      })
      resizeObserver.observe(containerRef.value)
      onUnmounted(() => {
        resizeObserver.disconnect()
      })
    }
  })

  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    containerRef,
    visibleItems,
    visibleRange,
    totalHeight,
    scrollToIndex,
    scrollToTop,
    scrollToBottom
  }
}