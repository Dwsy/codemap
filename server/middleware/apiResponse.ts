import type { Context, Next } from 'hono'
import type { ApiResponse } from '../../shared/types/index.js'

export async function apiResponseMiddleware(c: Context, next: Next) {
  await next()

  // 如果响应已经是 JSON，不做处理
  const contentType = c.res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return
  }

  // 如果是 HTML 响应，不做处理
  if (contentType?.includes('text/html')) {
    return
  }
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  }
}

export function errorResponse(error: string, code?: number): { success: false; error: string; code?: number } {
  return {
    success: false,
    error,
    code
  }
}