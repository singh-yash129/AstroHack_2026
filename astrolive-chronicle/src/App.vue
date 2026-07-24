<template>
  <div class="app-shell">

    <!-- ── Router View with fade transition ───────────────────────────── -->
    <main class="app-content" :class="{ 'app-content--no-nav': !showNav }">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.name" />
        </Transition>
      </RouterView>
    </main>

    <!-- ── Fixed Bottom Navigation ────────────────────────────────────── -->
    <nav v-if="showNav" class="bottom-nav" role="navigation" aria-label="Main navigation">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ 'nav-item--active': currentRoute === item.to }"
        :aria-label="item.label"
      >
        <!-- Active pill background -->
        <span class="nav-pill" aria-hidden="true" />

        <!-- Icon wrapper -->
        <span class="nav-icon-wrap">
          <component :is="item.icon" class="nav-icon" />
        </span>

        <!-- Label -->
        <span class="nav-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const currentRoute = computed(() => route.path)
const showNav = computed(() => !route.meta.hideNav)

// ── SVG icon components (inline, no external deps) ──────────────────────

/** Timeline / scroll icon → "My Chronicle" */
const IconTimeline = {
  name: 'IconTimeline',
  render: () =>
    h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('line',   { x1: '3',  y1: '6',  x2: '21', y2: '6'  }),
      h('circle', { cx: '3',  cy: '6',  r: '1.5' }),
      h('line',   { x1: '3',  y1: '12', x2: '21', y2: '12' }),
      h('circle', { cx: '3',  cy: '12', r: '1.5' }),
      h('line',   { x1: '3',  y1: '18', x2: '21', y2: '18' }),
      h('circle', { cx: '3',  cy: '18', r: '1.5' }),
    ]),
}

/** Upload / sparkle icon → "AI Importer" */
const IconUpload = {
  name: 'IconUpload',
  render: () =>
    h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
      h('polyline', { points: '17 8 12 3 7 8' }),
      h('line', { x1: '12', y1: '3', x2: '12', y2: '15' }),
      h('path', { d: 'M9.5 19.5l1-1a2 2 0 0 1 3 0l1 1', 'stroke-dasharray': '2 2', opacity: '0.5' }),
    ]),
}

/** Stars / marketplace icon → "Astrologers" */
const IconStars = {
  name: 'IconStars',
  render: () =>
    h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' }),
      h('circle',  { cx: '12', cy: '12', r: '3', fill: 'currentColor', opacity: '0.15' }),
    ]),
}

/** Sparkle / AI icon → "Astro AI" */
const IconSparkle = {
  name: 'IconSparkle',
  render: () =>
    h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z' }),
      h('path', { d: 'M19 2l1 2.5L22.5 5.5 20 6.5 19 9l-1-2.5-2.5-1L18 4.5z', opacity: '0.7' }),
    ]),
}

const navItems = [
  { to: '/',            label: 'Chronicle',   icon: IconTimeline },
  { to: '/astro-ai',    label: 'Astro AI',    icon: IconSparkle  },
  { to: '/importer',    label: 'AI Importer', icon: IconUpload   },
  { to: '/astrologers', label: 'Astrologers', icon: IconStars    },
]
</script>

<style scoped>
/* ── Shell ────────────────────────────────────────────────────────────── */
.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: 480px;        /* mobile-first, centred on desktop */
  margin: 0 auto;
  position: relative;
}

/* ── Scrollable content area above the nav bar ─────────────────────── */
.app-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 5rem;   /* clear of the 80px bottom nav */
}

.app-content--no-nav {
  padding-bottom: 0 !important;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  height: 100dvh;
}

/* ── Bottom Navigation Bar ─────────────────────────────────────────── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  /* glass morphism */
  background: linear-gradient(
    135deg,
    rgba(13, 6, 24, 0.85) 0%,
    rgba(6, 13, 31, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(251, 191, 36, 0.15);
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.5), 0 -1px 0 rgba(109, 40, 217, 0.2);
  z-index: 100;
  padding: 0 0.5rem;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* ── Nav Item (each tab button) ───────────────────────────────────── */
.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex: 1;
  height: 100%;
  text-decoration: none;
  color: rgba(232, 234, 246, 0.45);
  transition: color 0.25s ease;
  cursor: pointer;
  border: none;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
}

.nav-item:hover {
  color: rgba(232, 234, 246, 0.75);
}

/* Active state */
.nav-item--active {
  color: #fbbf24;
}

/* ── Animated pill behind the active icon ─────────────────────────── */
.nav-pill {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%);
  width: 48px;
  height: 28px;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.12);
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.2);
  opacity: 0;
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
}

.nav-item--active .nav-pill {
  opacity: 1;
  transform: translate(-50%, -60%) scale(1);
}

/* ── Icon ─────────────────────────────────────────────────────────── */
.nav-icon-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-item--active .nav-icon-wrap {
  transform: translateY(-2px) scale(1.15);
}

.nav-icon {
  width: 22px;
  height: 22px;
  transition: stroke 0.25s ease;
}

/* ── Label ─────────────────────────────────────────────────────────── */
.nav-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
  transition: opacity 0.25s ease, transform 0.25s ease;
  opacity: 0.7;
  position: relative;
  z-index: 1;
}

.nav-item--active .nav-label {
  opacity: 1;
  font-weight: 600;
}

/* ── Page fade transition ─────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
