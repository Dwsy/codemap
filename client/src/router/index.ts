import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import(/* webpackPrefetch: true */ '@/views/Dashboard.vue'),
    meta: {
      title: '项目列表',
      requiresAuth: false,
      preload: ['Project', 'View']
    }
  },
  {
    path: '/project/:path',
    name: 'Project',
    component: () => import(/* webpackPrefetch: true */ '@/views/Project.vue'),
    props: true,
    meta: {
      title: '项目详情',
      requiresAuth: false,
      preload: ['View', 'Infographic']
    }
  },
  {
    path: '/view/:id',
    name: 'View',
    component: () => import(/* webpackPrefetch: true */ '@/views/View.vue'),
    props: true,
    meta: {
      title: 'CodeMap 详情',
      requiresAuth: false,
      preload: ['Infographic']
    }
  },
  {
    path: '/infographic/:id',
    name: 'Infographic',
    component: () => import(/* webpackPrefetch: true */ '@/views/Infographic.vue'),
    props: true,
    meta: {
      title: '信息图',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到',
      requiresAuth: false
    }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

const preloadedRoutes = new Set<string>()

function preloadRoute(name: string) {
  if (preloadedRoutes.has(name)) return

  const route = routes.find(r => r.name === name)
  if (route && typeof route.component === 'function') {
    preloadedRoutes.add(name)
    route.component()
  }
}

function preloadRelatedRoutes(to: any) {
  const preloadRoutes = to.meta.preload as string[] || []

  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadRoutes.forEach(name => preloadRoute(name))
    })
  } else {
    setTimeout(() => {
      preloadRoutes.forEach(name => preloadRoute(name))
    }, 1000)
  }
}

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'CodeMap'} - CodeMap`

  if (to.matched.some(record => record.meta.requiresAuth)) {
    next()
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  console.log(`Navigated from ${from.name} to ${to.name}`)
  preloadRelatedRoutes(to)
})

export { preloadRoute }