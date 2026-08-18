<template>
  <Teleport to="#phone-screen">
    <div
      class="tip-overlay"
      @click.self="emit('close')"
      role="dialog"
      aria-modal="true"
      aria-label="Send a gratitude tip"
    >
      <!-- ── Close ──────────────────────────────────────────────────────── -->
      <button class="tip-close" @click="emit('close')" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>

      <!-- ── Panel ──────────────────────────────────────────────────────── -->
      <div class="tip-panel">

        <!-- ── Decorative nebula orbs ────────────────────────────────── -->
        <div class="tip-orb tip-orb--top"    aria-hidden="true" />
        <div class="tip-orb tip-orb--bottom" aria-hidden="true" />

        <!-- ── Eyebrow ───────────────────────────────────────────────── -->
        <p class="tip-eyebrow">✨ Your prediction manifested!</p>

        <!-- ── Astrologer profile ────────────────────────────────────── -->
        <div class="ast-profile">
          <!-- Avatar ring -->
          <div class="ast-ring">
            <div class="ast-avatar-wrap">
              <div class="ast-avatar">{{ prediction.astrologerName.charAt(0) }}</div>
            </div>
          </div>
          <!-- Name & title -->
          <div class="ast-info">
            <h2 class="ast-name">{{ prediction.astrologerName }}</h2>
            <p class="ast-title">Cosmic Astrologer · {{ prediction.planet }} Specialist</p>
            <!-- Star rating -->
            <div class="ast-stars">
              <span v-for="i in 5" :key="i" class="ast-star" :class="i <= Math.floor(prediction.astrologerRating) ? 'ast-star--lit' : ''">★</span>
              <span class="ast-rating">{{ prediction.astrologerRating }}/5</span>
            </div>
          </div>
        </div>

        <!-- ── Accuracy score ─────────────────────────────────────────── -->
        <div class="accuracy-block">
          <div class="accuracy-header">
            <span class="accuracy-label">Prediction Accuracy Score</span>
            <span class="accuracy-value">{{ ACCURACY }}%</span>
          </div>
          <div class="accuracy-track" role="progressbar" :aria-valuenow="ACCURACY" aria-valuemin="0" aria-valuemax="100">
            <div class="accuracy-fill" :style="{ width: barWidth }" />
            <div class="accuracy-shine" />
          </div>
          <p class="accuracy-note">
            Top <strong>2%</strong> of all astrologers on AstroLive Chronicle
          </p>
        </div>

        <!-- ── Divider ───────────────────────────────────────────────── -->
        <div class="tip-divider" aria-hidden="true">
          <span class="tip-divider-text">Show your cosmic gratitude</span>
        </div>

        <!-- ── Quick-tip chips ────────────────────────────────────────── -->
        <div class="tip-chips" role="group" aria-label="Select tip amount">
          <button
            v-for="opt in tipOptions"
            :key="opt.amount"
            class="tip-chip"
            :class="{ 'tip-chip--active': selectedAmount === opt.amount }"
            @click="selectAmount(opt.amount)"
            :aria-pressed="selectedAmount === opt.amount"
          >
            <span class="chip-amount">${{ opt.amount }}</span>
            <span class="chip-label">{{ opt.label }}</span>
          </button>
        </div>

        <!-- ── Custom amount ──────────────────────────────────────────── -->
        <div class="custom-input-wrap">
          <span class="custom-prefix">$</span>
          <input
            id="custom-tip-amount"
            v-model.number="customAmount"
            type="number"
            min="1"
            max="500"
            placeholder="Custom amount"
            class="custom-input"
            @focus="selectedAmount = null"
            aria-label="Enter a custom tip amount in dollars"
          />
        </div>

        <!-- ── Total line ─────────────────────────────────────────────── -->
        <div class="tip-total">
          <span class="total-label">Your tip</span>
          <span class="total-amount">${{ effectiveAmount || '—' }}</span>
        </div>

        <!-- ── CTA ───────────────────────────────────────────────────── -->
        <button
          id="btn-send-tip"
          class="send-btn"
          :class="{ 'send-btn--disabled': !effectiveAmount }"
          :disabled="!effectiveAmount"
          @click="sendTip"
          aria-label="Send tip and boost karma"
        >
          <span class="send-btn-icon" aria-hidden="true">🚀</span>
          <span>Send Tip &amp; Boost Karma</span>
          <svg class="send-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- ── Karma micro-copy ───────────────────────────────────────── -->
        <p class="karma-note">
          💫 Tips are simulated — no real charges. 100% of cosmic energy goes to your astrologer.
        </p>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  prediction: { type: Object, required: true },
})

const emit = defineEmits(['close', 'tip-sent'])

// Static accuracy metric for this prototype
const ACCURACY = 98

// ── Tip options ─────────────────────────────────────────────────────────
const tipOptions = [
  { amount: 2,  label: 'Starter Spark'  },
  { amount: 5,  label: 'Star Boost'     },
  { amount: 10, label: 'Cosmic Love'    },
]

const selectedAmount = ref(5)   // default to $5
const customAmount   = ref(null)

function selectAmount(amount) {
  selectedAmount.value = amount
  customAmount.value   = null
}

const effectiveAmount = computed(() => {
  if (customAmount.value && customAmount.value > 0) return customAmount.value
  return selectedAmount.value
})

// ── Accuracy bar animates in on mount ───────────────────────────────────
const barWidth = ref('0%')
onMounted(() => {
  requestAnimationFrame(() => {
    setTimeout(() => {
      barWidth.value = `${ACCURACY}%`
    }, 120)
  })
})

// ── Send tip ─────────────────────────────────────────────────────────────
function sendTip() {
  if (!effectiveAmount.value) return
  emit('tip-sent', {
    amount: effectiveAmount.value,
    astrologerName: props.prediction.astrologerName,
    category: props.prediction.category,
  })
}
</script>

<style scoped>
/* ── Overlay ──────────────────────────────────────────────────────────── */
.tip-overlay {
  position: fixed;
  inset: 0;
  z-index: 8500;
  background: rgba(3, 7, 18, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  animation: overlayIn 0.28s ease;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Close ────────────────────────────────────────────────────────────── */
.tip-close {
  position: fixed;
  top: 1rem; right: 1rem;
  width: 2.25rem; height: 2.25rem;
  border-radius: 50%;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(232,234,246,0.65);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  z-index: 8600;
  transition: background 0.2s, color 0.2s;
}
.tip-close svg { width: 1rem; height: 1rem; }
.tip-close:hover { background: rgba(255,255,255,0.14); color: #fff; }

/* ── Panel ────────────────────────────────────────────────────────────── */
.tip-panel {
  position: relative;
  width: 100%;
  max-width: 380px;
  background: linear-gradient(160deg, #0d0618 0%, #180b2e 35%, #060d1f 70%, #0a1631 100%);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 1.5rem;
  padding: 1.75rem 1.5rem 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow:
    0 0 60px rgba(109,40,217,0.2),
    0 24px 60px rgba(0,0,0,0.7),
    inset 0 1px 0 rgba(255,255,255,0.04);
  animation: panelIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes panelIn {
  from { opacity: 0; transform: scale(0.88) translateY(20px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
}

/* Nebula orbs */
.tip-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(50px);
  pointer-events: none;
}
.tip-orb--top {
  width: 200px; height: 200px;
  top: -60px; right: -60px;
  background: radial-gradient(circle, rgba(109,40,217,0.3) 0%, transparent 70%);
}
.tip-orb--bottom {
  width: 180px; height: 180px;
  bottom: -50px; left: -50px;
  background: radial-gradient(circle, rgba(30,58,138,0.35) 0%, transparent 70%);
}

/* ── Eyebrow ─────────────────────────────────────────────────────────── */
.tip-eyebrow {
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(232,234,246,0.45);
  position: relative;
  z-index: 1;
}

/* ── Astrologer profile ──────────────────────────────────────────────── */
.ast-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

/* Spinning conic ring */
.ast-ring {
  flex-shrink: 0;
  width: 58px; height: 58px;
  border-radius: 50%;
  background: conic-gradient(#8b5cf6, #a78bfa, #c4b5fd, #8b5cf6);
  padding: 2.5px;
  box-shadow: 0 0 20px rgba(139,92,246,0.45);
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.ast-avatar-wrap {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: #0d0618;
  display: flex; align-items: center; justify-content: center;
}

.ast-avatar {
  width: 54px; height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #37195e 0%, #162a5c 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem; font-weight: 800;
  color: #c4b5fd;
}

.ast-info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }

.ast-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.1rem; font-weight: 700;
  color: #e8eaf6; line-height: 1.2;
}

.ast-title {
  font-size: 0.68rem;
  color: rgba(232,234,246,0.4);
}

.ast-stars { display: flex; align-items: center; gap: 2px; margin-top: 0.2rem; }
.ast-star { font-size: 0.7rem; color: rgba(232,234,246,0.18); }
.ast-star--lit { color: #fbbf24; }
.ast-rating { font-size: 0.65rem; font-weight: 700; color: #fbbf24; margin-left: 0.25rem; }

/* ── Accuracy block ──────────────────────────────────────────────────── */
.accuracy-block {
  position: relative;
  z-index: 1;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(139,92,246,0.18);
  border-radius: 0.875rem;
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.accuracy-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.accuracy-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(232,234,246,0.55);
  letter-spacing: 0.02em;
}

.accuracy-value {
  font-family: 'Outfit', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  background: linear-gradient(90deg, #a78bfa, #c4b5fd);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Progress track */
.accuracy-track {
  position: relative;
  height: 7px;
  background: rgba(255,255,255,0.06);
  border-radius: 999px;
  overflow: hidden;
}

.accuracy-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #6d28d9, #8b5cf6, #a78bfa);
  box-shadow: 0 0 10px rgba(139,92,246,0.6);
  transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Shimmer sweep on the fill bar */
.accuracy-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shine-sweep 2.5s linear infinite;
}

@keyframes shine-sweep {
  from { background-position: -200% center; }
  to   { background-position: 200% center; }
}

.accuracy-note {
  font-size: 0.65rem;
  color: rgba(232,234,246,0.35);
}

.accuracy-note strong { color: #a78bfa; }

/* ── Divider ──────────────────────────────────────────────────────────── */
.tip-divider {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tip-divider::before,
.tip-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(139,92,246,0.25), transparent);
}

.tip-divider::after {
  background: linear-gradient(to left, transparent, rgba(139,92,246,0.25), transparent);
}

.tip-divider-text {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(232,234,246,0.35);
  white-space: nowrap;
  letter-spacing: 0.04em;
}

/* ── Tip chips ────────────────────────────────────────────────────────── */
.tip-chips {
  display: flex;
  gap: 0.6rem;
  position: relative;
  z-index: 1;
}

.tip-chip {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.7rem 0.5rem;
  border-radius: 0.875rem;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: rgba(232,234,246,0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.tip-chip:hover {
  border-color: rgba(139,92,246,0.4);
  background: rgba(139,92,246,0.08);
  color: #c4b5fd;
}

.tip-chip--active {
  border-color: rgba(251,191,36,0.55) !important;
  background: linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(217,119,6,0.1) 100%) !important;
  color: #fbbf24 !important;
  box-shadow: 0 0 16px rgba(251,191,36,0.2);
}

.tip-chip--active .chip-amount { color: #fbbf24; }
.tip-chip--active .chip-label  { color: rgba(251,191,36,0.7); }

.chip-amount {
  font-family: 'Outfit', sans-serif;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1;
  transition: color 0.2s;
}

.chip-label {
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: rgba(232,234,246,0.35);
  white-space: nowrap;
  transition: color 0.2s;
}

/* ── Custom input ─────────────────────────────────────────────────────── */
.custom-input-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.75rem;
  background: rgba(255,255,255,0.03);
  overflow: hidden;
  transition: border-color 0.2s;
}

.custom-input-wrap:focus-within {
  border-color: rgba(139,92,246,0.5);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
}

.custom-prefix {
  padding: 0 0.75rem;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: rgba(232,234,246,0.4);
  border-right: 1px solid rgba(255,255,255,0.07);
}

.custom-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 0.65rem 0.75rem;
  color: #e8eaf6;
  font-family: 'Inter', sans-serif;
  font-size: 0.88rem;
  font-weight: 500;
}

.custom-input::placeholder { color: rgba(232,234,246,0.25); }

/* Hide number spinners */
.custom-input::-webkit-inner-spin-button,
.custom-input::-webkit-outer-spin-button { -webkit-appearance: none; }
.custom-input[type=number] { -moz-appearance: textfield; }

/* ── Total line ───────────────────────────────────────────────────────── */
.tip-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.25rem;
  position: relative;
  z-index: 1;
}

.total-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(232,234,246,0.4);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.total-amount {
  font-family: 'Outfit', sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, #d97706, #fbbf24);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ── CTA Button ───────────────────────────────────────────────────────── */
.send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.95rem 1.5rem;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: #030712;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%);
  background-size: 200% 200%;
  box-shadow:
    0 0 30px rgba(251,191,36,0.4),
    0 8px 24px rgba(0,0,0,0.4);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  z-index: 1;
  animation: btn-pulse 3s ease-in-out infinite;
}

@keyframes btn-pulse {
  0%, 100% { box-shadow: 0 0 30px rgba(251,191,36,0.4), 0 8px 24px rgba(0,0,0,0.4); }
  50%       { box-shadow: 0 0 45px rgba(251,191,36,0.65), 0 8px 32px rgba(0,0,0,0.5); }
}

.send-btn:not(.send-btn--disabled):hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 0 50px rgba(251,191,36,0.55), 0 12px 32px rgba(0,0,0,0.5);
  animation: none;
}

.send-btn:not(.send-btn--disabled):active { transform: scale(0.97); }

.send-btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
  animation: none;
}

.send-btn-icon { font-size: 1.1rem; }

.send-btn-arrow {
  width: 1rem; height: 1rem;
  flex-shrink: 0;
}

/* ── Karma note ───────────────────────────────────────────────────────── */
.karma-note {
  font-size: 0.62rem;
  color: rgba(232,234,246,0.22);
  text-align: center;
  line-height: 1.55;
  position: relative;
  z-index: 1;
}
</style>
