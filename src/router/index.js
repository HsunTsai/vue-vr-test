import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/sample/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/sample/AboutView.vue'),
    },
    {
      path: '/vrobject',
      name: 'vrobject',
      component: () => import('../views/VRObjectView.vue'),
    },
    {
      path: '/vr3Dof',
      name: 'vr3Dof',
      // component: () => import('../views/VRView.vue'),
      component: () => import('../views/TestView2.vue'),
    },
    {
      path: '/light',
      name: 'light',
      component: () => import('../views/lightView/LightView.vue'),
    },
    {
      path: '/snow',
      name: 'snow',
      component: () => import('../views/snowView/SnowView.vue'),
    },
    {
      path: '/vr6Dof',
      name: 'vr6Dof',
      component: () => import('../views/vrView/VRView.vue'),
    },
    {
      path: '/webXR',
      name: 'webXR',
      component: () => import('../views/webXR/WebXRView.vue'),
    },
  ],
})

export default router
