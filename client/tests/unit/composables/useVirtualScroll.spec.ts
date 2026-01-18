import { describe, it, expect, beforeEach } from 'vitest'
import { useVirtualScroll } from '@/composables/useVirtualScroll'

describe('useVirtualScroll', () => {
  const items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }))

  it('should initialize correctly', () => {
    const { visibleItems, totalHeight } = useVirtualScroll(items, {
      itemHeight: 50
    })

    expect(visibleItems.value).toBeDefined()
    expect(totalHeight.value).toBe(100 * 50)
  })

  it('should calculate visible items correctly', () => {
    const { visibleItems, containerRef } = useVirtualScroll(items, {
      itemHeight: 50,
      overscan: 2
    })

    const mockContainer = {
      clientHeight: 500,
      scrollTop: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }

    containerRef.value = mockContainer as any

    expect(visibleItems.value.length).toBeGreaterThan(0)
  })

  it('should handle dynamic item height', () => {
    const { visibleItems, totalHeight } = useVirtualScroll(items, {
      itemHeight: (index) => 50 + (index % 5) * 10
    })

    expect(totalHeight.value).toBeGreaterThan(0)
    expect(visibleItems.value).toBeDefined()
  })

  it('should scroll to index correctly', () => {
    const { scrollToIndex, containerRef } = useVirtualScroll(items, {
      itemHeight: 50
    })

    const mockContainer = {
      clientHeight: 500,
      scrollTop: 0,
      scrollTo: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }

    containerRef.value = mockContainer as any
    scrollToIndex(10)

    expect(mockContainer.scrollTo).toHaveBeenCalled()
  })

  it('should scroll to top correctly', () => {
    const { scrollToTop, containerRef } = useVirtualScroll(items, {
      itemHeight: 50
    })

    const mockContainer = {
      clientHeight: 500,
      scrollTop: 100,
      scrollTo: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }

    containerRef.value = mockContainer as any
    scrollToTop()

    expect(mockContainer.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
  })

  it('should scroll to bottom correctly', () => {
    const { scrollToBottom, containerRef, totalHeight } = useVirtualScroll(items, {
      itemHeight: 50
    })

    const mockContainer = {
      clientHeight: 500,
      scrollTop: 0,
      scrollTo: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }

    containerRef.value = mockContainer as any
    scrollToBottom()

    expect(mockContainer.scrollTo).toHaveBeenCalledWith({
      top: totalHeight.value - 500,
      behavior: 'smooth'
    })
  })
})