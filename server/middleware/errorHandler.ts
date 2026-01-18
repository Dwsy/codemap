import type { Context } from 'hono'

export function errorHandler(err: Error, c: Context) {
  console.error('API Error:', err)

  // 处理特定错误类型
  if (err.message.includes('ENOENT')) {
    return c.json({
      success: false,
      error: 'File or directory not found'
    }, 404)
  }

  if (err.message.includes('EACCES')) {
    return c.json({
      success: false,
      error: 'Permission denied'
    }, 403)
  }

  if (err.message.includes('SyntaxError')) {
    return c.json({
      success: false,
      error: 'Invalid data format'
    }, 400)
  }

  // 默认错误响应
  return c.json({
    success: false,
    error: err.message || 'Internal server error'
  }, 500)
}