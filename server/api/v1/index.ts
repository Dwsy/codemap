import { Hono } from 'hono'
import projectsRouter from './projects.js'
import codemapsRouter from './codemaps.js'
import filesRouter from './files.js'

const v1Router = new Hono()

// 挂载子路由
v1Router.route('/projects', projectsRouter)
v1Router.route('/codemaps', codemapsRouter)
v1Router.route('/files', filesRouter)

// 健康检查
v1Router.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'CodeMap API v1 is running',
    timestamp: new Date().toISOString()
  })
})

export default v1Router