<template>
  <!-- ── Full-screen overlay ──────────────────────────────────────────────── -->
  <Teleport to="#phone-screen">
    <div class="modal-overlay" @click.self="emit('close')" role="dialog" aria-modal="true" :aria-label="`${prediction.category} prediction verified`">

      <!-- ── Close button ──────────────────────────────────────────────────── -->
      <button class="modal-close" @click="emit('close')" aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <path d="M18 6 6 18M6 6l12 12"/>
        </svg>
      </button>

      <!-- ── The Manifestation Card ────────────────────────────────────────── -->
      <div class="mcard-wrap">
        <article class="mcard" ref="cardRef">

          <!-- Decorative star field on the card -->
          <div class="mcard-stars" aria-hidden="true">
            <span v-for="s in stars" :key="s.id" class="mcard-star" :style="s.style">✦</span>
          </div>

          <!-- Nebula orb glow -->
          <div class="mcard-orb mcard-orb--left"  aria-hidden="true" />
          <div class="mcard-orb mcard-orb--right" aria-hidden="true" />

          <!-- ── Header brand strip ─────────────────────────────────────────── -->
          <div class="mcard-brand">
            <span class="brand-logo">🌌</span>
            <span class="brand-name">AstroLive Chronicle</span>
            <span class="brand-badge">
              <svg class="brand-badge-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z"/>
              </svg>
              Verified
            </span>
          </div>

          <!-- ── Giant checkmark ───────────────────────────────────────────── -->
          <div class="mcard-check-ring" aria-hidden="true">
            <div class="check-outer-ring">
              <div class="check-inner-ring">
                <svg class="check-svg" viewBox="0 0 48 48" fill="none">
                  <polyline points="10,26 20,36 38,16" stroke="#030712" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- ── Headline ──────────────────────────────────────────────────── -->
          <div class="mcard-headline-block">
            <p class="mcard-eyebrow">AstroLive Verified</p>
            <h2 class="mcard-headline">
              {{ prediction.category }} Prediction<br/>
              <span class="headline-fulfilled">Fulfilled</span>
            </h2>
          </div>

          <!-- ── Days badge ────────────────────────────────────────────────── -->
          <div class="mcard-days-badge">
            <div class="days-number">{{ prediction.daysToFulfill }}</div>
            <div class="days-label">Days<br/>to Manifest</div>
          </div>

          <!-- ── Prediction title ──────────────────────────────────────────── -->
          <div class="mcard-prediction-box">
            <span class="prediction-cat-icon">{{ prediction.categoryIcon }}</span>
            <p class="mcard-prediction-title">"{{ prediction.title }}"</p>
          </div>

          <!-- ── Astrologer credit ─────────────────────────────────────────── -->
          <div class="mcard-astrologer">
            <div class="ast-avatar">{{ prediction.astrologerName.charAt(0) }}</div>
            <div class="ast-info">
              <span class="ast-by">Predicted by</span>
              <span class="ast-name">{{ prediction.astrologerName }}</span>
            </div>
            <div class="ast-stars">
              <span v-for="i in 5" :key="i" class="ast-star" :class="i <= Math.floor(prediction.astrologerRating) ? 'ast-star--lit' : ''">★</span>
              <span class="ast-rating-num">{{ prediction.astrologerRating }}</span>
            </div>
          </div>

          <!-- ── Planet & timeframe tags ───────────────────────────────────── -->
          <div class="mcard-tags">
            <span class="mcard-tag mcard-tag--planet">⟁ {{ prediction.planet }}</span>
            <span class="mcard-tag mcard-tag--time">{{ prediction.timeframe }}</span>
            <span class="mcard-tag mcard-tag--date">📅 {{ fulfillDate }}</span>
          </div>

          <!-- ── Watermark ─────────────────────────────────────────────────── -->
          <div class="mcard-watermark">astrolive.app · #ManifestWithStars</div>

        </article>

        <!-- ── Share button (outside the card so it doesn't appear in "screenshot") -->
        <button class="share-btn" @click="handleShare" id="btn-share-instagram">
          <span class="share-btn-icon" aria-hidden="true">
            <!-- Instagram gradient icon (SVG) -->
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="white" stroke-width="1.8"/>
              <circle cx="12" cy="12" r="4.5" stroke="white" stroke-width="1.8"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
            </svg>
          </span>
          <span class="share-btn-text">
            Share to Instagram Story
          </span>
          <span class="share-btn-arrow" aria-hidden="true">↗</span>
        </button>

        <p class="share-subtext">Tap to simulate viral cosmic sharing ✨</p>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  prediction: { type: Object, required: true },
})

const emit = defineEmits(['close', 'show-tip'])

// Generate today's date string for the fulfillment date
const fulfillDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
})

// Random decorative stars scattered across the card
const stars = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  style: {
    top:      `${5 + Math.random() * 88}%`,
    left:     `${3 + Math.random() * 94}%`,
    fontSize: `${6 + Math.random() * 7}px`,
    opacity:  `${0.15 + Math.random() * 0.5}`,
    animationDelay: `${Math.random() * 3}s`,
  },
}))

// Share simulation — then immediately transition to Gratitude Tip modal
function handleShare() {
  alert(
    `🚀 Sharing to Instagram Story...\n\n` +
    `✨ "${props.prediction.category} Prediction Fulfilled in ${props.prediction.daysToFulfill} Days by ${props.prediction.astrologerName}"\n\n` +
    `Your manifestation is going viral across the cosmos! 🌌\n` +
    `#AstroLiveVerified #ManifestWithStars #CosmicChronicle`,
  )
  // Transition to Gratitude Tip modal immediately after alert is dismissed
  emit('show-tip', props.prediction)
}
</script>

<style scoped>
/* ── Overlay ────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 8000;
  background: rgba(3, 7, 18, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  animation: overlayIn 0.3s ease;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Close button ───────────────────────────────────────────────────── */
.modal-close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(232,234,246,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 8100;
  transition: background 0.2s, color 0.2s;
}
.modal-close svg { width: 1rem; height: 1rem; }
.modal-close:hover { background: rgba(255,255,255,0.15); color: #fff; }

/* ── Card wrapper ───────────────────────────────────────────────────── */
.mcard-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 360px;
  animation: cardIn 0.45s cubic-bezier(0.34,1.56,0.64,1);
}

@keyframes cardIn {
  from { opacity: 0; transform: scale(0.8) translateY(24px); }
  to   { opacity: 1; transform: scale(1)   translateY(0); }
}

/* ── The Manifestation Card ─────────────────────────────────────────── */
.mcard {
  position: relative;
  width: 100%;
  background: linear-gradient(
    160deg,
    #0d0618 0%,
    #180b2e 30%,
    #060d1f 60%,
    #0a1631 100%
  );
  border: 1px solid rgba(251,191,36,0.35);
  border-radius: 1.5rem;
  padding: 1.5rem 1.25rem 1.25rem;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgba(251,191,36,0.1),
    0 0 40px rgba(251,191,36,0.12),
    0 0 80px rgba(109,40,217,0.15),
    0 24px 60px rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

/* Decorative stars */
.mcard-stars { position: absolute; inset: 0; pointer-events: none; }
.mcard-star {
  position: absolute;
  color: #fbbf24;
  animation: twinkle 3s ease-in-out infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: inherit; }
  50% { opacity: 0.05; }
}

/* Nebula orbs */
.mcard-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  pointer-events: none;
}
.mcard-orb--left {
  width: 160px; height: 160px;
  top: -40px; left: -40px;
  background: radial-gradient(circle, rgba(109,40,217,0.35) 0%, transparent 70%);
}
.mcard-orb--right {
  width: 140px; height: 140px;
  bottom: -30px; right: -30px;
  background: radial-gradient(circle, rgba(30,58,138,0.4) 0%, transparent 70%);
}

/* ── Brand strip ────────────────────────────────────────────────────── */
.mcard-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
}
.brand-logo { font-size: 1.1rem; }
.brand-name {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(232,234,246,0.6);
  flex: 1;
  letter-spacing: 0.03em;
}
.brand-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(251,191,36,0.25), rgba(217,119,6,0.2));
  border: 1px solid rgba(251,191,36,0.4);
  font-size: 0.65rem;
  font-weight: 700;
  color: #fbbf24;
  letter-spacing: 0.04em;
}
.brand-badge-icon { width: 0.7rem; height: 0.7rem; color: #fbbf24; }

/* ── Check ring ─────────────────────────────────────────────────────── */
.mcard-check-ring {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 1;
}
.check-outer-ring {
  width: 82px; height: 82px;
  border-radius: 50%;
  background: conic-gradient(#fbbf24, #f59e0b, #d97706, #fbbf24);
  padding: 3px;
  box-shadow: 0 0 30px rgba(251,191,36,0.5), 0 0 60px rgba(251,191,36,0.2);
}
.check-inner-ring {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  display: flex;
  align-items: center;
  justify-content: center;
}
.check-svg { width: 44px; height: 44px; }
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ── Headline block ─────────────────────────────────────────────────── */
.mcard-headline-block {
  text-align: center;
  position: relative;
  z-index: 1;
}
.mcard-eyebrow {
  font-size: 0.65rem;
  color: rgba(232,234,246,0.45);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 600;
  margin-bottom: 0.4rem;
}
.mcard-headline {
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: #e8eaf6;
  line-height: 1.2;
}
.headline-fulfilled {
  background: linear-gradient(90deg, #d97706, #fbbf24, #f59e0b, #fbbf24, #d97706);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 2.5s linear infinite;
}
@keyframes shimmer {
  from { background-position: 0% center; }
  to   { background-position: 200% center; }
}

/* ── Days badge ─────────────────────────────────────────────────────── */
.mcard-days-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, rgba(251,191,36,0.12), rgba(109,40,217,0.1));
  border: 1px solid rgba(251,191,36,0.2);
  border-radius: 1rem;
  padding: 0.75rem 1.25rem;
  position: relative;
  z-index: 1;
}
.days-number {
  font-family: 'Outfit', sans-serif;
  font-size: 2.8rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(180deg, #fbbf24, #d97706);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
}
.days-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(232,234,246,0.55);
  line-height: 1.3;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ── Prediction title box ───────────────────────────────────────────── */
.mcard-prediction-box {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  position: relative;
  z-index: 1;
  padding: 0.75rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 0.875rem;
}
.prediction-cat-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 0.1rem; }
.mcard-prediction-title {
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #e8eaf6;
  line-height: 1.45;
  font-style: italic;
}

/* ── Astrologer ─────────────────────────────────────────────────────── */
.mcard-astrologer {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  position: relative;
  z-index: 1;
  padding: 0 0.25rem;
}
.ast-avatar {
  width: 2.25rem; height: 2.25rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a2278, #162a5c);
  border: 2px solid rgba(251,191,36,0.3);
  box-shadow: 0 0 12px rgba(251,191,36,0.2);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem; font-weight: 700; color: #fbbf24;
  flex-shrink: 0;
}
.ast-info { flex: 1; display: flex; flex-direction: column; gap: 0.05rem; }
.ast-by { font-size: 0.6rem; color: rgba(232,234,246,0.35); text-transform: uppercase; letter-spacing: 0.06em; }
.ast-name { font-size: 0.82rem; font-weight: 700; color: #e8eaf6; }
.ast-stars { display: flex; align-items: center; gap: 1px; }
.ast-star { font-size: 0.65rem; color: rgba(232,234,246,0.2); }
.ast-star--lit { color: #fbbf24; }
.ast-rating-num { font-size: 0.65rem; font-weight: 700; color: #fbbf24; margin-left: 0.2rem; }

/* ── Tags ───────────────────────────────────────────────────────────── */
.mcard-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  position: relative;
  z-index: 1;
}
.mcard-tag {
  font-size: 0.62rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  border: 1px solid;
}
.mcard-tag--planet { background: rgba(139,92,246,0.15); border-color: rgba(139,92,246,0.3); color: #a78bfa; }
.mcard-tag--time   { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: rgba(232,234,246,0.5); }
.mcard-tag--date   { background: rgba(251,191,36,0.1); border-color: rgba(251,191,36,0.25); color: #fbbf24; }

/* ── Watermark ──────────────────────────────────────────────────────── */
.mcard-watermark {
  font-size: 0.58rem;
  color: rgba(232,234,246,0.2);
  text-align: center;
  letter-spacing: 0.06em;
  position: relative;
  z-index: 1;
}

/* ── Share button ───────────────────────────────────────────────────── */
.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #ffffff;
  background: linear-gradient(
    135deg,
    #833ab4 0%,
    #fd1d1d 40%,
    #fcb045 100%
  );
  box-shadow:
    0 0 30px rgba(253,29,29,0.35),
    0 0 60px rgba(131,58,180,0.2),
    0 8px 24px rgba(0,0,0,0.5);
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  overflow: hidden;
}

.share-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 100%);
  pointer-events: none;
}

.share-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow:
    0 0 40px rgba(253,29,29,0.45),
    0 0 80px rgba(131,58,180,0.3),
    0 12px 32px rgba(0,0,0,0.6);
}
.share-btn:active { transform: scale(0.97); }

.share-btn-icon { width: 1.4rem; height: 1.4rem; flex-shrink: 0; }
.share-btn-text { font-size: 1rem; }
.share-btn-arrow { font-size: 1.2rem; opacity: 0.8; }

/* ── Share subtext ──────────────────────────────────────────────────── */
.share-subtext {
  font-size: 0.7rem;
  color: rgba(232,234,246,0.3);
  text-align: center;
}
</style>
