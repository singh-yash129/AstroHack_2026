<template>
  <Teleport to="body">
    <!-- ── Backdrop ──────────────────────────────────────────────────────── -->
    <Transition name="backdrop-fade">
      <div
        v-if="show"
        class="bs-backdrop"
        @click="emit('close')"
        aria-hidden="true"
      />
    </Transition>

    <!-- ── Bottom sheet ──────────────────────────────────────────────────── -->
    <Transition name="sheet-slide">
      <div
        v-if="show"
        class="bs-sheet"
        role="dialog"
        aria-modal="true"
        :aria-label="`Book consultation with ${astrologer.name}`"
      >
        <!-- Drag handle -->
        <div class="bs-handle" aria-hidden="true" />

        <!-- ── Astrologer identity strip ──────────────────────────────── -->
        <div class="bs-header">
          <!-- Avatar with ring -->
          <div class="bs-avatar-ring">
            <div class="bs-avatar">{{ astrologer.name.charAt(0) }}</div>
          </div>

          <!-- Name + specialty -->
          <div class="bs-ast-info">
            <div class="bs-ast-top">
              <h2 class="bs-ast-name">{{ astrologer.name }}</h2>
              <span v-if="astrologer.isSurge" class="bs-surge-mini">🔥 Surge</span>
            </div>
            <p class="bs-ast-spec">{{ astrologer.specialty }}</p>
            <!-- Accuracy pill -->
            <div class="bs-accuracy-pill">
              <span class="bs-accuracy-val">{{ astrologer.accuracyScore }}%</span>
              <span class="bs-accuracy-lbl">Manifestation Accuracy</span>
            </div>
          </div>
        </div>

        <!-- ── Value proposition ────────────────────────────────────────── -->
        <div class="bs-pitch">
          <div class="bs-pitch-icon" aria-hidden="true">🔮</div>
          <p class="bs-pitch-text">
            Consult with <strong>{{ astrologer.name }}</strong> to unlock your next
            verified prediction on your timeline — personalised to your birth chart.
          </p>
        </div>

        <!-- ── Session options ──────────────────────────────────────────── -->
        <div class="bs-sessions" role="group" aria-label="Choose session length">
          <button
            v-for="sess in sessions"
            :key="sess.mins"
            class="bs-sess-chip"
            :class="{ 'bs-sess-chip--active': selectedSession === sess.mins }"
            @click="selectedSession = sess.mins"
            :aria-pressed="selectedSession === sess.mins"
          >
            <span class="sess-mins">{{ sess.mins }} min</span>
            <span class="sess-price">${{ sess.price }}</span>
          </button>
        </div>

        <!-- ── What's included ──────────────────────────────────────────── -->
        <ul class="bs-includes" aria-label="What's included in the consultation">
          <li v-for="item in includes" :key="item" class="bs-include-item">
            <svg class="bs-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="2 8 6 12 14 4"/>
            </svg>
            {{ item }}
          </li>
        </ul>

        <!-- ── CTA button ─────────────────────────────────────────────── -->
        <button
          id="btn-book-consultation"
          class="bs-cta"
          :class="{ 'bs-cta--processing': processing }"
          @click="handleBook"
          :disabled="processing"
          :aria-label="`Book ${selectedSession} minute consultation with ${astrologer.name} for $${activePrice}`"
        >
          <template v-if="!processing">
            <span class="bs-cta-label">Book Now</span>
            <span class="bs-cta-price">${{ activePrice }} · {{ selectedSession }} mins</span>
            <svg class="bs-cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </template>
          <template v-else>
            <svg class="bs-cta-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke-dasharray="40 20"/>
            </svg>
            <span>Confirming your slot...</span>
          </template>
        </button>

        <!-- ── Surge note ─────────────────────────────────────────────── -->
        <p v-if="astrologer.isSurge" class="bs-surge-note">
          🔥 High demand — {{ astrologer.consultationsToday }}+ consultations today. Prices may increase.
        </p>

        <!-- ── Trust strip ────────────────────────────────────────────── -->
        <div class="bs-trust">
          <span>🔒 Secure payment</span>
          <span>✦</span>
          <span>💫 Money-back guarantee</span>
          <span>✦</span>
          <span>🌐 Encrypted session</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  astrologer: { type: Object, required: true },
})

const emit = defineEmits(['close', 'booked'])

// Session length options derived from astrologer pricing
const sessions = computed(() => [
  { mins: 10, price: props.astrologer.price },
  { mins: 20, price: props.astrologer.price * 1.8 },
  { mins: 30, price: props.astrologer.price * 2.5 },
])

const selectedSession = ref(10)

const activePrice = computed(() => {
  const s = sessions.value.find((s) => s.mins === selectedSession.value)
  return s ? s.price : props.astrologer.price
})

const includes = [
  'Live 1-on-1 video/audio consultation',
  'Personalised birth chart analysis',
  'AI-generated locked prediction added to your timeline',
  'Session recording for future reference',
]

// ── Book flow ──────────────────────────────────────────────────────────────
const processing = ref(false)

function handleBook() {
  processing.value = true
  // Simulate payment + slot confirmation
  setTimeout(() => {
    processing.value = false
    emit('booked', {
      astrologer: props.astrologer,
      mins: selectedSession.value,
      price: activePrice.value,
    })
    emit('close')
  }, 1800)
}
</script>

<style scoped>
/* ── Backdrop ─────────────────────────────────────────────────────────── */
.bs-backdrop {
  position: fixed;
  inset: 0;
  z-index: 7000;
  background: rgba(3, 7, 18, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.backdrop-fade-enter-active,
.backdrop-fade-leave-active { transition: opacity 0.28s ease; }
.backdrop-fade-enter-from,
.backdrop-fade-leave-to     { opacity: 0; }

/* ── Sheet ────────────────────────────────────────────────────────────── */
.bs-sheet {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 7100;
  width: 100%;
  max-width: 480px;
  background: linear-gradient(170deg, #120723 0%, #0b1226 50%, #060d1f 100%);
  border: 1px solid rgba(139,92,246,0.25);
  border-bottom: none;
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 0 1.25rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  box-shadow:
    0 -8px 40px rgba(109,40,217,0.2),
    0 -2px 0 rgba(139,92,246,0.15),
    inset 0 1px 0 rgba(255,255,255,0.04);
  max-height: 92dvh;
  overflow-y: auto;
  scrollbar-width: none;
}
.bs-sheet::-webkit-scrollbar { display: none; }

.sheet-slide-enter-active {
  transition: transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.28s ease;
}
.sheet-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.sheet-slide-enter-from,
.sheet-slide-leave-to {
  transform: translateX(-50%) translateY(100%);
  opacity: 0;
}

/* ── Drag handle ─────────────────────────────────────────────────────── */
.bs-handle {
  width: 40px; height: 4px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  margin: 0.85rem auto 0;
  flex-shrink: 0;
}

/* ── Header strip ────────────────────────────────────────────────────── */
.bs-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

/* Avatar ring */
.bs-avatar-ring {
  flex-shrink: 0;
  width: 56px; height: 56px;
  border-radius: 50%;
  background: conic-gradient(#8b5cf6, #a78bfa, #c4b5fd, #8b5cf6);
  padding: 2px;
  animation: spin-slow 12s linear infinite;
  box-shadow: 0 0 16px rgba(139,92,246,0.4);
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.bs-avatar {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #37195e 0%, #162a5c 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 1.3rem; font-weight: 800;
  color: #c4b5fd;
}

.bs-ast-info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }

.bs-ast-top { display: flex; align-items: center; gap: 0.5rem; }

.bs-ast-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.05rem; font-weight: 700;
  color: #e8eaf6;
}

.bs-surge-mini {
  font-size: 0.62rem; font-weight: 700;
  padding: 0.12rem 0.4rem;
  border-radius: 999px;
  background: rgba(251,100,36,0.18);
  border: 1px solid rgba(251,100,36,0.4);
  color: #fb923c;
}

.bs-ast-spec {
  font-size: 0.68rem;
  color: rgba(232,234,246,0.4);
}

.bs-accuracy-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  background: rgba(251,191,36,0.12);
  border: 1px solid rgba(251,191,36,0.3);
  margin-top: 0.15rem;
}

.bs-accuracy-val {
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem; font-weight: 800;
  color: #fbbf24;
}

.bs-accuracy-lbl {
  font-size: 0.58rem; font-weight: 600;
  color: rgba(251,191,36,0.65);
}

/* ── Pitch block ─────────────────────────────────────────────────────── */
.bs-pitch {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.85rem 1rem;
  border-radius: 0.875rem;
  background: rgba(109,40,217,0.1);
  border: 1px solid rgba(109,40,217,0.2);
}

.bs-pitch-icon { font-size: 1.3rem; flex-shrink: 0; margin-top: 0.05rem; }

.bs-pitch-text {
  font-size: 0.82rem;
  color: rgba(232,234,246,0.7);
  line-height: 1.55;
}

.bs-pitch-text strong { color: #c4b5fd; font-weight: 700; }

/* ── Session chips ───────────────────────────────────────────────────── */
.bs-sessions {
  display: flex;
  gap: 0.55rem;
}

.bs-sess-chip {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.65rem 0.5rem;
  border-radius: 0.875rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.bs-sess-chip:hover {
  border-color: rgba(139,92,246,0.4);
  background: rgba(109,40,217,0.08);
}

.bs-sess-chip--active {
  border-color: rgba(251,191,36,0.5) !important;
  background: linear-gradient(135deg, rgba(251,191,36,0.14), rgba(217,119,6,0.08)) !important;
  box-shadow: 0 0 12px rgba(251,191,36,0.15);
}

.sess-mins {
  font-size: 0.75rem; font-weight: 700;
  color: rgba(232,234,246,0.75);
}

.sess-price {
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem; font-weight: 800;
  color: #e8eaf6;
}

.bs-sess-chip--active .sess-mins,
.bs-sess-chip--active .sess-price { color: #fbbf24; }

/* ── Includes list ───────────────────────────────────────────────────── */
.bs-includes {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bs-include-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.75rem;
  color: rgba(232,234,246,0.6);
}

.bs-check {
  width: 1rem; height: 1rem;
  color: #4ade80;
  flex-shrink: 0;
}

/* ── CTA Button ──────────────────────────────────────────────────────── */
.bs-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem; font-weight: 700;
  color: #030712;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%);
  box-shadow: 0 0 28px rgba(251,191,36,0.35), 0 6px 20px rgba(0,0,0,0.4);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
  -webkit-tap-highlight-color: transparent;
  animation: cta-pulse 3s ease-in-out infinite;
}

@keyframes cta-pulse {
  0%, 100% { box-shadow: 0 0 28px rgba(251,191,36,0.35), 0 6px 20px rgba(0,0,0,0.4); }
  50%       { box-shadow: 0 0 44px rgba(251,191,36,0.55), 0 6px 24px rgba(0,0,0,0.5); }
}

.bs-cta:not(.bs-cta--processing):hover {
  transform: translateY(-2px) scale(1.02);
  animation: none;
  box-shadow: 0 0 44px rgba(251,191,36,0.5), 0 10px 28px rgba(0,0,0,0.5);
}

.bs-cta:not(.bs-cta--processing):active { transform: scale(0.97); }

.bs-cta--processing {
  opacity: 0.8;
  cursor: not-allowed;
  animation: none;
  color: rgba(3,7,18,0.6);
}

.bs-cta-label { font-size: 1rem; font-weight: 700; }
.bs-cta-price {
  font-size: 0.82rem; font-weight: 600;
  opacity: 0.75;
  padding: 0.1rem 0.5rem;
  background: rgba(3,7,18,0.12);
  border-radius: 999px;
}

.bs-cta-arrow { width: 1rem; height: 1rem; }

.bs-cta-spinner {
  width: 1.2rem; height: 1.2rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ── Surge note ──────────────────────────────────────────────────────── */
.bs-surge-note {
  font-size: 0.68rem;
  color: #fb923c;
  text-align: center;
  font-weight: 500;
}

/* ── Trust strip ─────────────────────────────────────────────────────── */
.bs-trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.62rem;
  color: rgba(232,234,246,0.25);
  flex-wrap: wrap;
}
</style>
