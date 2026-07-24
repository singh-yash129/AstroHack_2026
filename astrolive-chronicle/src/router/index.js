import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'chronicle',
    component: () => import('../views/ChronicleView.vue'),
    meta: { label: 'My Chronicle' },
  },
  {
    path: '/importer',
    name: 'importer',
    component: () => import('../views/ImporterView.vue'),
    meta: { label: 'AI Importer' },
  },
  {
    path: '/astrologers',
    name: 'astrologers',
    component: () => import('../views/AstrologersView.vue'),
    meta: { label: 'Astrologers' },
  },
  {
    path: '/astro-ai',
    name: 'astro-ai',
    component: () => import('../views/AstroAiView.vue'),
    meta: { label: 'Astro AI' },
  },
  {
    path: '/live-chat',
    name: 'live-chat',
    component: () => import('../views/LiveConsultation.vue'),
    meta: { label: 'Live Chat', hideNav: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
