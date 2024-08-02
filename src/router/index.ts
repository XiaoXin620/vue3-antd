import { createRouter, createWebHistory } from 'vue-router'
import { createRouterGuards } from './router-guards'
import { rootRoute } from './routes'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    rootRoute,
    {
      path: '/login',
      name: 'Login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/login/index.vue')
    },
  ]
})

createRouterGuards(router)

export default router
