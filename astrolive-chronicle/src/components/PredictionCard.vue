<template>
  <article
    class="prediction-card"
    :class="[
      prediction.status === 'fulfilled' ? 'card--fulfilled' : 'card--locked',
      isExpanded && 'card--expanded',
    ]"
    @click="toggle"
    role="button"
    :aria-expanded="isExpanded"
    :aria-label="`${prediction.category} prediction — ${prediction.status}`"
  >
    <!-- ── Status badge ─────────────────────────────────────────────────── -->
    <div class="card-badge" :class="prediction.status === 'fulfilled' ? 'badge--fulfilled' : 'badge--locked'">
      <span v-if="prediction.status === 'fulfilled'" class="badge-icon">✓</span>
      <svg v-else class="badge-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    </div>

    <!-- ── Card body ───────────────────────────────────────────────────── -->
    <div class="card-body">
      <!-- Top row: category pill + timeframe + planet -->
      <div class="card-meta">
        <span class="category-pill">
          {{ prediction.categoryIcon }} {{ prediction.category }}
        </span>
        <span class="meta-divider">·</span>
        <span class="planet-tag">⟁ {{ prediction.planet }}</span>
        <span class="timeframe-tag">{{ prediction.timeframe }}</span>
      </div>

      <!-- Title -->
      <h3 class="card-title">{{ prediction.title }}</h3>

      <!-- Description — blurred for locked, clear for fulfilled -->
      <p
        class="card-description"
        :class="prediction.status === 'locked' && !isExpanded ? 'description--blurred' : ''"
      >
        {{ prediction.description }}
      </p>

      <!-- Fulfilled date ribbon -->
      <div v-if="prediction.status === 'fulfilled'" class="fulfilled-ribbon">
        <span class="ribbon-dot" />
        Fulfilled on {{ prediction.fulfilledDate }}
      </div>

      <!-- Locked hint (collapses if expanded) -->
      <div v-if="prediction.status === 'locked' && !isExpanded" class="locked-hint">
        <svg class="lock-mini" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        Tap to reveal
      </div>

      <!-- Unlock & Verify CTA — only when timeframe has arrived -->
      <button
        v-if="prediction.status === 'locked' && prediction.timeframeArrived"
        class="unlock-btn"
        @click.stop="emit('unlock-verify', prediction)"
        :aria-label="`Unlock and verify ${prediction.category} prediction`"
      >
        <svg class="unlock-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        Unlock &amp; Verify
        <span class="unlock-badge">Timeframe Arrived</span>
      </button>

      <!-- Astrologer byline -->
      <div class="astrologer-row">
        <div class="astrologer-avatar">{{ prediction.astrologerName.charAt(0) }}</div>
        <span class="astrologer-name">{{ prediction.astrologerName }}</span>
        <span class="astrologer-rating">★ {{ prediction.astrologerRating }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  prediction: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['unlock-verify'])

// Expand locked cards on click to reveal description
const isExpanded = ref(false)
function toggle() {
  if (props.prediction.status === 'locked') {
    isExpanded.value = !isExpanded.value
  }
}
</script>

<style scoped>
/* ── Card shell ─────────────────────────────────────────────────────── */
.prediction-card {
  position: relative;
  display: flex;
  gap: 0.875rem;
  padding: 1rem 1rem 0.875rem;
  border-radius: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  will-change: transform;
}

.prediction-card:active {
  transform: scale(0.985);
}

/* Fulfilled — gold border glow */
.card--fulfilled {
  background: linear-gradient(135deg, rgba(251,191,36,0.07) 0%, rgba(217,119,6,0.04) 100%);
  border: 1px solid rgba(251,191,36,0.25);
  box-shadow: 0 4px 24px rgba(0,0,0,0.4), 0 0 0 0 rgba(251,191,36,0.1);
}
.card--fulfilled:hover {
  box-shadow: 0 6px 28px rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.15);
  transform: translateY(-1px);
}

/* Locked — cosmic purple border */
.card--locked {
  background: linear-gradient(135deg, rgba(109,40,217,0.08) 0%, rgba(6,13,31,0.6) 100%);
  border: 1px solid rgba(109,40,217,0.2);
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
}
.card--locked:hover {
  border-color: rgba(139,92,246,0.35);
  box-shadow: 0 6px 28px rgba(0,0,0,0.5), 0 0 16px rgba(109,40,217,0.15);
  transform: translateY(-1px);
}

/* ── Status badge circle ────────────────────────────────────────────── */
.card-badge {
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.1rem;
}

.badge--fulfilled {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  box-shadow: 0 0 12px rgba(251,191,36,0.5), 0 0 24px rgba(251,191,36,0.2);
}

.badge--locked {
  background: linear-gradient(135deg, rgba(109,40,217,0.4) 0%, rgba(55,25,94,0.6) 100%);
  border: 1px solid rgba(139,92,246,0.35);
}

.badge-icon {
  color: #030712;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1;
}

.badge-icon-svg {
  width: 1rem;
  height: 1rem;
  color: #a78bfa;
}

/* ── Card body ──────────────────────────────────────────────────────── */
.card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

/* Meta row */
.card-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  font-size: 0.7rem;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(232,234,246,0.8);
  font-weight: 500;
  font-size: 0.68rem;
}

.meta-divider {
  color: rgba(232,234,246,0.25);
}

.planet-tag {
  color: #a78bfa;
  font-weight: 500;
  font-size: 0.68rem;
}

.timeframe-tag {
  color: rgba(232,234,246,0.4);
  margin-left: auto;
  font-size: 0.65rem;
  white-space: nowrap;
}

/* Title */
.card-title {
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #e8eaf6;
  line-height: 1.35;
}

/* Description */
.card-description {
  font-size: 0.8rem;
  color: rgba(232,234,246,0.55);
  line-height: 1.6;
  transition: filter 0.3s ease;
}

.description--blurred {
  filter: blur(5px);
  user-select: none;
  pointer-events: none;
}

/* Fulfilled ribbon */
.fulfilled-ribbon {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.68rem;
  color: #fbbf24;
  font-weight: 500;
  margin-top: 0.1rem;
}

.ribbon-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 6px #fbbf24;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Locked hint */
.locked-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.68rem;
  color: #8b5cf6;
  font-weight: 500;
  margin-top: 0.1rem;
}

.lock-mini {
  width: 0.75rem;
  height: 0.75rem;
}

/* Astrologer row */
.astrologer-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.35rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.astrologer-avatar {
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a2278, #162a5c);
  border: 1px solid rgba(139,92,246,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
  color: #c4b5fd;
  flex-shrink: 0;
}

.astrologer-name {
  font-size: 0.7rem;
  color: rgba(232,234,246,0.5);
  flex: 1;
}

.astrologer-rating {
  font-size: 0.68rem;
  color: #fbbf24;
  font-weight: 600;
}

/* ── Unlock & Verify button ─────────────────────────────────────────── */
.unlock-btn {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
  padding: 0.6rem 0.9rem;
  margin-top: 0.25rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(251,191,36,0.4);
  background: linear-gradient(
    135deg,
    rgba(251,191,36,0.15) 0%,
    rgba(217,119,6,0.1) 100%
  );
  color: #fbbf24;
  font-family: 'Inter', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  overflow: hidden;
}

.unlock-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.08) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}
.unlock-btn:hover::after { transform: translateX(100%); }

.unlock-btn:hover {
  background: linear-gradient(
    135deg,
    rgba(251,191,36,0.25) 0%,
    rgba(217,119,6,0.18) 100%
  );
  border-color: rgba(251,191,36,0.65);
  box-shadow: 0 0 16px rgba(251,191,36,0.25);
  transform: translateY(-1px);
}
.unlock-btn:active { transform: scale(0.97); }

.unlock-btn-icon {
  width: 0.95rem;
  height: 0.95rem;
  flex-shrink: 0;
}

.unlock-badge {
  margin-left: auto;
  font-size: 0.58rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(251,191,36,0.2);
  border: 1px solid rgba(251,191,36,0.35);
  color: #fbbf24;
  white-space: nowrap;
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0.3); }
  50%       { box-shadow: 0 0 0 4px rgba(251,191,36,0); }
}
</style>
