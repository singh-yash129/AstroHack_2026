<template>
  <div class="app-shell">

    <!-- Scrollable content -->
    <main ref="contentRef" class="app-content" :class="{ 'app-content--no-nav': !showNav }">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.name" />
        </Transition>
      </RouterView>
    </main>

    <!-- Bottom nav - flex sibling, always at bottom of shell -->
    <nav v-if="showNav" class="bottom-nav" role="navigation" aria-label="Main navigation">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ 'nav-item--active': currentRoute === item.to }"
        :aria-label="item.label"
      >
        <span class="nav-pill" aria-hidden="true" />
        <span class="nav-icon-wrap">
          <component :is="item.icon" class="nav-icon" />
        </span>
        <span class="nav-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

  </div>
</template>

<script setup>
import { computed, h, ref, watch, nextTick } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route        = useRoute()
const currentRoute = computed(() => route.path)
const showNav      = computed(() => !route.meta.hideNav)
const contentRef   = ref(null)

// Reset scroll position on route change
watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      if (contentRef.value) {
        contentRef.value.scrollTop = 0
      }
      window.scrollTo(0, 0)
    })
  }
)

// ── SVG icon components ─────────────────────────────────────────────

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

const IconProfile = {
  name: 'IconProfile',
  render: () =>
    h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('circle', { cx: '12', cy: '8', r: '4' }),
      h('path',   { d: 'M4 20c0-4 3.6-7 8-7s8 3 8 7' }),
    ]),
}

const IconStars = {
  name: 'IconStars',
  render: () =>
    h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('polygon', { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' }),
      h('circle',  { cx: '12', cy: '12', r: '3', fill: 'currentColor', opacity: '0.15' }),
    ]),
}

const IconDashboard = {
  name: 'IconDashboard',
  render: () =>
    h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path',     { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
      h('polyline', { points: '9 22 9 12 15 12 15 22' }),
    ]),
}

const navItems = [
  { to: '/',            label: 'Dashboard',    icon: IconDashboard },
  { to: '/chronicle',   label: 'My Chronicle', icon: IconTimeline  },
  { to: '/astrologers', label: 'Astrologers',  icon: IconStars     },
  { to: '/profile',     label: 'Profile',      icon: IconProfile   },
]
</script>

<style scoped>
/* ── App shell fills the #app div (which fills .screen-app in index.html) ── */
.app-shell {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: transparent;
}

/* ── Scrollable main area ── */
.app-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;        /* important for flex children to scroll */
  scrollbar-width: none;
}
.app-content::-webkit-scrollbar { display: none; }

.app-content--no-nav {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Bottom nav - flex item at bottom, no fixed/absolute needed ── */
.bottom-nav {
  flex-shrink: 0;
  width: 100%;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(
    135deg,
    rgba(13, 6, 24, 0.92) 0%,
    rgba(6, 13, 31, 0.96) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(251, 191, 36, 0.15);
  box-shadow: 0 -8px 32px rgba(0,0,0,0.5), 0 -1px 0 rgba(109,40,217,0.2);
  padding: 0 0.5rem;
}

/* ── Nav items ── */
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
  color: rgba(232, 234, 246, 0.42);
  transition: color 0.25s ease;
  cursor: pointer;
  border: none;
  background: transparent;
  -webkit-tap-highlight-color: transparent;
}
.nav-item:hover   { color: rgba(232, 234, 246, 0.75); }
.nav-item--active { color: #fbbf24; }

.nav-pill {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -60%);
  width: 46px; height: 26px;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.12);
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.2);
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
}
.nav-item--active .nav-pill { opacity: 1; }

.nav-icon-wrap {
  position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-item--active .nav-icon-wrap { transform: translateY(-2px) scale(1.15); }

.nav-icon { width: 22px; height: 22px; }

.nav-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px; font-weight: 500;
  letter-spacing: 0.02em;
  white-space: nowrap;
  opacity: 0.7; position: relative; z-index: 1;
  transition: opacity 0.25s ease;
}
.nav-item--active .nav-label { opacity: 1; font-weight: 600; }

/* ── Page transition ── */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.fade-enter-from   { opacity: 0; transform: translateY(5px); }
.fade-leave-to     { opacity: 0; transform: translateY(-5px); }
</style>