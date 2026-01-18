interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class APIClient {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private pendingRequests: Map<string, Promise<any>> = new Map()

  async get<T>(url: string, options: RequestInit = {}, cacheOptions?: { ttl?: number }): Promise<T> {
    const cacheKey = url

    if (cacheOptions?.ttl) {
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data as T
      }
    }

    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey) as Promise<T>
    }

    const promise = this.fetchWithRetry<T>(url, options)
      .then(data => {
        console.log('API Client - Received data:', url, data)
        if (cacheOptions?.ttl) {
          this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
            ttl: cacheOptions.ttl
          })
        }
        return data
      })
      .catch(error => {
        console.error('API Client - Error:', url, error)
        throw error
      })
      .finally(() => {
        this.pendingRequests.delete(cacheKey)
      })

    this.pendingRequests.set(cacheKey, promise)
    return promise
  }

  private async fetchWithRetry<T>(url: string, options: RequestInit = {}, maxRetries = 3): Promise<T> {
    let lastError: Error | null = null

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const json = await response.json()
        console.log('API Response:', url, json)
        return json.data || json
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')

        if (i < maxRetries - 1) {
          await this.delay(Math.pow(2, i) * 1000)
        }
      }
    }

    throw lastError
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      }
    } else {
      this.cache.clear()
    }
  }

  invalidateCache(url: string) {
    this.cache.delete(url)
  }
}

export const apiClient = new APIClient()