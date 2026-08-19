<template>
  <Teleport to="#phone-screen">
    <Transition name="toast">
      <div
        v-if="visible"
        class="toast-wrap"
        role="status"
        aria-live="polite"
        aria-label="Success notification"
      >
        <!-- Icon -->
        <div class="toast-icon" aria-hidden="true">{{ icon }}</div>

        <!-- Copy -->
        <div class="toast-copy">
          <p class="toast-title">{{ title }}</p>
          <p class="toast-sub">{{ subtitle }}</p>
        </div>

        <!-- Dismiss -->
        <button class="toast-dismiss" @click="dismiss" aria-label="Dismiss notification">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- Auto-progress bar -->
        <div class="toast-progress" aria-hidden="true">
          <div
            class="toast-progress-fill"
            :style="{ animationDuration: `${duration}ms` }"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show:     { type: Boolean, default: false },
  title:    { type: String, default: 'Success!' },
  subtitle: { type: String, default: '' },
  icon:     { type: String, default: '✅' },
  duration: { type: Number, default: 4000 },   // ms before auto-dismiss
})

const emit = defineEmits(['dismissed'])

const visible = ref(false)
let timer = null

function dismiss() {
  visible.value = false
  clearTimeout(timer)
  emit('dismissed')
}

// Watch `show` prop — when it flips true, display and start countdown
watch(
  () => props.show,
  (val) => {
    if (val) {
      visible.value = true
      clearTimeout(timer)
      timer = setTimeout(() => {
        visible.value = false
        emit('dismissed')
      }, props.duration)
    } else {
      visible.value = false
      clearTimeout(timer)
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* ── Toast container ──────────────────────────────────────────────────── */
.toast-wrap {
  position: fixed;
  bottom: calc(72px + 1rem);   /* clear of the bottom nav bar */
  left: 50%;
  transform: translateX(-50%);
  z-index: 9500;
  width: calc(100% - 2rem);
  max-width: 380px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem 0.85rem 1rem;
  border-radius: 1rem;
  background: linear-gradient(
    135deg,
    rgba(13,6,24,0.97) 0%,
    rgba(6,13,31,0.97) 100%
  );
  border: 1px solid rgba(251,191,36,0.35);
  box-shadow:
    0 0 30px rgba(251,191,36,0.2),
    0 8px 32px rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(255,255,255,0.04);
  overflow: hidden;
  backdrop-filter: blur(16px);
}

/* ── Enter/leave transition ───────────────────────────────────────────── */
.toast-enter-active {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}
.toast-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.toast-enter-from {
  transform: translate(-50%, 120%);
  opacity: 0;
}
.toast-leave-to {
  transform: translate(-50%, 120%);
  opacity: 0;
}

/* ── Icon ─────────────────────────────────────────────────────────────── */
.toast-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 8px rgba(251,191,36,0.6));
}

/* ── Copy ─────────────────────────────────────────────────────────────── */
.toast-copy { flex: 1; min-width: 0; }

.toast-title {
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #e8eaf6;
  line-height: 1.3;
}

.toast-sub {
  font-size: 0.7rem;
  color: rgba(232,234,246,0.5);
  margin-top: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Dismiss button ───────────────────────────────────────────────────── */
.toast-dismiss {
  flex-shrink: 0;
  width: 1.75rem; height: 1.75rem;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(232,234,246,0.5);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.toast-dismiss svg { width: 0.75rem; height: 0.75rem; }
.toast-dismiss:hover { background: rgba(255,255,255,0.12); color: #fff; }

/* ── Progress bar (burns down over `duration` ms) ─────────────────────── */
.toast-progress {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: rgba(255,255,255,0.06);
}

.toast-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #6d28d9, #fbbf24);
  border-radius: 0 0 0 1rem;
  animation: burn-down linear forwards;
  transform-origin: left;
}

@keyframes burn-down {
  from { width: 100%; }
  to   { width: 0%; }
}
</style>
