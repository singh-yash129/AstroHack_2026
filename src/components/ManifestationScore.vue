<template>
  <div class="score-card" role="region" aria-label="Manifestation Score">
    <!-- Left: circular ring chart -->
    <div class="ring-wrap" aria-hidden="true">
      <svg class="ring-svg" viewBox="0 0 80 80">
        <!-- Track -->
        <circle
          class="ring-track"
          cx="40" cy="40" r="34"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          stroke-width="6"
        />
        <!-- Progress arc -->
        <circle
          class="ring-progress"
          cx="40" cy="40" r="34"
          fill="none"
          stroke="url(#goldGrad)"
          stroke-width="6"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 40 40)"
        />
        <!-- Gradient definition -->
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stop-color="#d97706"/>
            <stop offset="100%" stop-color="#fbbf24"/>
          </linearGradient>
        </defs>
        <!-- Centre score text -->
        <text x="40" y="44" text-anchor="middle" class="ring-text">
          {{ animatedScore }}
        </text>
      </svg>
    </div>

    <!-- Right: copy -->
    <div class="score-copy">
      <p class="score-label">Manifestation Score</p>
      <h2 class="score-headline">
        <span class="text-gold-shimmer">{{ animatedScore }}</span>
        <span class="score-max">/ 100</span>
      </h2>
      <p class="score-sub">{{ scoreComment }}</p>

      <!-- Stat pills row -->
      <div class="stat-row">
        <div class="stat-pill stat-fulfilled">
          <span class="stat-dot stat-dot--gold" />
          {{ fulfilledCount }} Fulfilled
        </div>
        <div class="stat-pill stat-locked">
          <span class="stat-dot stat-dot--purple" />
          {{ lockedCount }} Locked
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'

const props = defineProps({
  score: { type: Number, required: true },
  fulfilledCount: { type: Number, default: 0 },
  lockedCount:    { type: Number, default: 0 },
})

// Ring geometry
const RADIUS = 34
const circumference = 2 * Math.PI * RADIUS  // ≈ 213.6

const dashOffset = computed(() =>
  circumference - (props.score / 100) * circumference
)

// Animated counter (counts up from 0 on mount)
const animatedScore = ref(0)

function animateTo(target) {
  const duration = 1200
  const start = performance.now()
  const from = animatedScore.value

  function step(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    animatedScore.value = Math.round(from + (target - from) * eased)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

onMounted(() => animateTo(props.score))
watch(() => props.score, (val) => animateTo(val))

// Flavour text
const scoreComment = computed(() => {
  const s = props.score
  if (s >= 80) return 'The cosmos flows with you ✨'
  if (s >= 50) return 'Your stars are aligning 🌙'
  if (s >= 25) return 'Destiny is unfolding 🔮'
  return 'Your journey begins 🌱'
})
</script>

<style scoped>
.score-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.1rem 1.25rem;
  border-radius: 1.25rem;
  background: linear-gradient(
    135deg,
    rgba(251,191,36,0.08) 0%,
    rgba(109,40,217,0.1) 50%,
    rgba(6,13,31,0.6) 100%
  );
  border: 1px solid rgba(251,191,36,0.2);
  box-shadow:
    0 0 40px rgba(251,191,36,0.08),
    0 4px 32px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.05);
  position: relative;
  overflow: hidden;
}

/* Subtle sparkle top-right */
.score-card::after {
  content: '✦';
  position: absolute;
  top: 0.6rem;
  right: 0.9rem;
  font-size: 0.6rem;
  color: rgba(251,191,36,0.4);
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* ── Ring ───────────────────────────────────────────────────────────── */
.ring-wrap {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
}

.ring-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.ring-progress {
  transition: stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 0 6px rgba(251,191,36,0.6));
}

.ring-text {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 700;
  fill: #fbbf24;
}

/* ── Copy ───────────────────────────────────────────────────────────── */
.score-copy {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.score-label {
  font-size: 0.68rem;
  color: rgba(232,234,246,0.45);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.score-headline {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  font-family: 'Outfit', sans-serif;
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1;
}

.score-max {
  font-size: 0.85rem;
  font-weight: 400;
  color: rgba(232,234,246,0.3);
}

.score-sub {
  font-size: 0.73rem;
  color: rgba(232,234,246,0.5);
  margin-top: 0.1rem;
}

/* Stat pills */
.stat-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 600;
}

.stat-fulfilled {
  background: rgba(251,191,36,0.12);
  border: 1px solid rgba(251,191,36,0.25);
  color: #fbbf24;
}

.stat-locked {
  background: rgba(109,40,217,0.15);
  border: 1px solid rgba(139,92,246,0.25);
  color: #a78bfa;
}

.stat-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: inline-block;
}

.stat-dot--gold   { background: #fbbf24; box-shadow: 0 0 4px #fbbf24; }
.stat-dot--purple { background: #8b5cf6; box-shadow: 0 0 4px #8b5cf6; }
</style>
