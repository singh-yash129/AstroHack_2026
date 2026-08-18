import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { label: 'Dashboard' },
  },
  {
    path: '/chronicle',
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
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { label: 'Profile' },
  },
  {
    path: '/palm-scanner',
    name: 'palm-scanner',
    component: () => import('../views/PalmScannerView.vue'),
    meta: { label: 'AI Palm Scanner', hideNav: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
