<template>
  <section class="view-page importer-view">

    <!-- ══════════════════════════════════════════════════════════════════
         IDLE STATE — tap-to-upload card
    ═══════════════════════════════════════════════════════════════════ -->
    <template v-if="phase === 'idle'">

      <!-- Page header -->
      <div class="page-header">
        <div class="header-icon">⬆️</div>
        <div>
          <h1 class="page-title">AI Importer</h1>
          <p class="page-subtitle">Scan your Kundli · AI extracts your destiny</p>
        </div>
      </div>

      <!-- ── Main tap card ────────────────────────────────────────────── -->
      <button
        id="btn-upload-kundli"
        class="upload-card"
        @click="openFilePicker"
        aria-label="Tap to upload your Kundli document"
      >
        <!-- Animated nebula background -->
        <div class="upload-card-bg" aria-hidden="true" />

        <!-- Floating icon cluster -->
        <div class="upload-icon-cluster" aria-hidden="true">
          <div class="upload-icon-ring">
            <span class="upload-icon-inner">📄</span>
          </div>
          <span class="upload-icon-badge">🤖</span>
        </div>

        <!-- Text content -->
        <h2 class="upload-title">Tap to Upload Kundli</h2>
        <p class="upload-subtitle">(PDF or Image)</p>

        <!-- Format chips -->
        <div class="format-chips" aria-hidden="true">
          <span class="format-chip">PDF</span>
          <span class="format-chip">JPG</span>
          <span class="format-chip">PNG</span>
          <span class="format-chip">HEIC</span>
        </div>

        <!-- Tap hint -->
        <p class="tap-hint">
          <svg class="tap-hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
            <path d="M6 14v0a6 6 0 0 0 6 6h2a8 8 0 0 0 8-8 1 1 0 0 0-1-1h-.5A1.5 1.5 0 0 1 19 9.5v0A1.5 1.5 0 0 0 17.5 8H17"/>
          </svg>
          Tap anywhere to browse files
        </p>
      </button>

      <!-- ── AI Feature list ───────────────────────────────────────────── -->
      <ul class="feature-list" aria-label="AI Importer capabilities">
        <li v-for="feat in features" :key="feat.icon" class="feature-item">
          <span class="feature-icon" aria-hidden="true">{{ feat.icon }}</span>
          <div>
            <p class="feature-title">{{ feat.title }}</p>
            <p class="feature-desc">{{ feat.desc }}</p>
          </div>
        </li>
      </ul>

      <!-- ── Privacy note ─────────────────────────────────────────────── -->
      <p class="privacy-note">
        🔒 Your document is processed locally and never stored on our servers.
      </p>

    </template>

    <!-- ══════════════════════════════════════════════════════════════════
         PROCESSING STATE — AI extraction animation
    ═══════════════════════════════════════════════════════════════════ -->
    <template v-else-if="phase === 'processing'">

      <!-- File name pill -->
      <div class="file-pill">
        <span class="file-pill-icon">📄</span>
        <span class="file-pill-name">{{ fileName }}</span>
        <span class="file-pill-badge">Analysing</span>
      </div>

      <!-- ── Central cosmic processing orb ──────────────────────────── -->
      <div class="orb-wrap" aria-hidden="true">
        <!-- Outer rings -->
        <div class="orb-ring orb-ring--outer" />
        <div class="orb-ring orb-ring--mid"   />
        <!-- Orbiting planet dots -->
        <div class="orb-planet orb-planet--1">🪐</div>
        <div class="orb-planet orb-planet--2">⭐</div>
        <div class="orb-planet orb-planet--3">🌙</div>
        <!-- Core orb -->
        <div class="orb-core">
          <span class="orb-core-icon">🤖</span>
        </div>
      </div>

      <!-- ── Processing headline ─────────────────────────────────────── -->
      <div class="processing-headline">
        <h2 class="processing-title">AI Extracting</h2>
        <p class="processing-subtitle">{{ currentStepText }}</p>
      </div>

      <!-- ── Step checklist ─────────────────────────────────────────── -->
      <ul class="step-list" aria-label="AI processing steps" aria-live="polite">
        <li
          v-for="(step, i) in steps"
          :key="i"
          class="step-item"
          :class="{
            'step--done':    step.done,
            'step--active':  !step.done && i === activeStepIndex,
            'step--pending': !step.done && i > activeStepIndex,
          }"
        >
          <!-- State icon -->
          <div class="step-icon-wrap" aria-hidden="true">
            <span v-if="step.done" class="step-check">✓</span>
            <svg v-else-if="i === activeStepIndex" class="step-spinner" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="40 20" />
            </svg>
            <span v-else class="step-dot" aria-hidden="true" />
          </div>
          <!-- Step text -->
          <span class="step-text" :aria-label="`${step.done ? 'Complete' : i === activeStepIndex ? 'In progress' : 'Pending'}: ${step.text}`">
            {{ step.text }}
          </span>
          <!-- Done timestamp -->
          <span v-if="step.done" class="step-ts">{{ step.ts }}</span>
        </li>
      </ul>

      <!-- ── Progress bar ───────────────────────────────────────────── -->
      <div class="progress-wrap" aria-label="Overall progress" role="progressbar" :aria-valuenow="progressPct" aria-valuemin="0" aria-valuemax="100">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPct + '%' }" />
          <div class="progress-glow" :style="{ left: progressPct + '%' }" />
        </div>
        <span class="progress-label">{{ Math.round(progressPct) }}%</span>
      </div>

      <!-- Flavour note -->
      <p class="processing-note">
        Decoding your cosmic blueprint — please hold ✨
      </p>

    </template>

    <!-- Hidden native file input — triggers device file picker/camera -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".pdf,image/*"
      class="sr-only"
      aria-hidden="true"
      tabindex="-1"
      @change="onFileSelected"
    />

  </section>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChronicleStore } from '../stores/chronicle.js'

const router = useRouter()
const store  = useChronicleStore()

// ── Phase state machine: idle → processing ────────────────────────────────
const phase    = ref('idle')
const fileName = ref('')

// ── File input ref ────────────────────────────────────────────────────────
const fileInputRef = ref(null)

function openFilePicker() {
  fileInputRef.value?.click()
}

function onFileSelected(evt) {
  const file = evt.target.files?.[0]
  if (!file) return
  fileName.value = file.name
  startProcessing()
  // Reset so the same file can be re-selected if needed
  evt.target.value = ''
}

// ── Feature list ─────────────────────────────────────────────────────────
const features = [
  {
    icon: '🔮',
    title: 'Reads Kundli Charts & Horoscopes',
    desc: 'Supports Vedic & Western birth chart formats',
  },
  {
    icon: '🪐',
    title: 'Extracts 12-House Planetary Data',
    desc: 'Maps all planetary positions & transits automatically',
  },
  {
    icon: '✨',
    title: 'Generates Personalised Predictions',
    desc: 'AI creates locked predictions unique to your chart',
  },
]

// ── Processing steps ──────────────────────────────────────────────────────
const steps = ref([
  { text: 'Kundli document loaded',          done: false, ts: '' },
  { text: 'Mapping planetary positions',     done: false, ts: '' },
  { text: 'Extracting karmic transits',      done: false, ts: '' },
  { text: 'Generating locked predictions',   done: false, ts: '' },
])

const activeStepIndex = computed(() => {
  const idx = steps.value.findIndex((s) => !s.done)
  return idx === -1 ? steps.value.length : idx
})

const currentStepText = computed(() => {
  const s = steps.value.find((s) => !s.done)
  return s ? s.text + '...' : 'Finalising your chronicle...'
})

// Progress (0-100) driven by which step is active
const progressPct = computed(() => {
  const done = steps.value.filter((s) => s.done).length
  return (done / steps.value.length) * 100
})

// ── Timers ────────────────────────────────────────────────────────────────
const timers = []

function nowTs() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function markStep(index) {
  steps.value[index].done = true
  steps.value[index].ts   = nowTs()
}

// ── Three AI-generated locked predictions ─────────────────────────────────
const AI_PREDICTIONS = [
  {
    category:      'Saturn Return',
    categoryIcon:  '🪐',
    title:         'Saturn demands karmic accountability',
    description:   'Your natal Saturn return in Aquarius begins a 2.5-year restructuring of your foundations. Relationships, career structures, and limiting beliefs will be tested and ultimately strengthened. What no longer serves your highest self will dissolve — and something far more authentic will replace it.',
    timeframe:     'Aug – Dec 2026',
    planet:        'Saturn',
    astrologerName: 'Celeste Nadir',
    astrologerRating: 5.0,
  },
  {
    category:      'Relationships',
    categoryIcon:  '💫',
    title:         'Rahu & Ketu axis ignites destined meetings',
    description:   'The nodal axis activating your seventh house of partnerships over the coming six months signals fated encounters. One relationship — romantic or professional — will feel unmistakably destined. Pay close attention to who appears in your life during eclipses.',
    timeframe:     'Sep – Nov 2026',
    planet:        'Rahu / Ketu',
    astrologerName: 'Aria Moonwhisper',
    astrologerRating: 4.9,
  },
  {
    category:      'Abundance',
    categoryIcon:  '🌠',
    title:         'Venus–Jupiter conjunction supercharges prosperity',
    description:   'A rare Venus–Jupiter conjunction in your second house of material wealth activates one of the most auspicious financial windows of the decade. A bold investment, creative project, or partnership will yield outsized returns. Act before Mercury stations retrograde.',
    timeframe:     'Oct 2026',
    planet:        'Venus / Jupiter',
    astrologerName: 'Sol Vega',
    astrologerRating: 4.7,
  },
]

// ── Start the processing sequence ─────────────────────────────────────────
function startProcessing() {
  phase.value = 'processing'

  // Step 0 — immediate (doc loaded)
  timers.push(setTimeout(() => markStep(0), 150))

  // Step 1 — 900ms
  timers.push(setTimeout(() => markStep(1), 900))

  // Step 2 — 1800ms
  timers.push(setTimeout(() => markStep(2), 1800))

  // Step 3 — 2600ms
  timers.push(setTimeout(() => markStep(3), 2600))

  // Finalise at 3200ms — push predictions & redirect
  timers.push(setTimeout(() => {
    store.addImportedPredictions(AI_PREDICTIONS)
    // Reset filter so all predictions show on arrival
    store.setFilter('all')
    router.push('/')
  }, 3200))
}

// Cleanup on unmount (if user navigates away mid-import)
onUnmounted(() => timers.forEach(clearTimeout))
</script>

<style scoped>
/* ── View layout ─────────────────────────────────────────────────────── */
.importer-view {
  gap: 1.5rem;
  align-items: center;
}

/* Header must be full-width and left-aligned despite align-items:center parent */
.importer-view :deep(.page-header),
.page-header {
  align-self: stretch;
  width: 100%;
}

/* ══════════════════════════════════════════════════════════════════════
   IDLE STATE STYLES
══════════════════════════════════════════════════════════════════════ */

/* ── Upload card ─────────────────────────────────────────────────────── */
.upload-card {
  position: relative;
  width: 90%;
  max-width: 380px;
  min-height: 280px;
  border-radius: 1.5rem;
  border: 2px solid rgba(139,92,246,0.3);
  background: linear-gradient(
    160deg,
    rgba(109,40,217,0.1) 0%,
    rgba(6,13,31,0.7)    40%,
    rgba(30,58,138,0.08) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 2rem 1.5rem;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  box-shadow:
    0 0 40px rgba(109,40,217,0.12),
    0 8px 32px rgba(0,0,0,0.45),
    inset 0 1px 0 rgba(255,255,255,0.04);
}

/* Breathing pulse on the border */
.upload-card {
  animation: card-pulse 3.5s ease-in-out infinite;
}

@keyframes card-pulse {
  0%, 100% { border-color: rgba(139,92,246,0.3); box-shadow: 0 0 40px rgba(109,40,217,0.12), 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04); }
  50%       { border-color: rgba(139,92,246,0.6); box-shadow: 0 0 60px rgba(109,40,217,0.25), 0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04); }
}

.upload-card:hover,
.upload-card:focus-visible {
  border-color: rgba(251,191,36,0.5);
  box-shadow: 0 0 50px rgba(251,191,36,0.15), 0 12px 40px rgba(0,0,0,0.5);
  transform: translateY(-2px);
  animation: none;
}

.upload-card:active { transform: scale(0.97); }

/* Animated nebula bg inside card */
.upload-card-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 30%, rgba(109,40,217,0.15) 0%, transparent 55%),
    radial-gradient(ellipse at 70% 70%, rgba(30,58,138,0.12) 0%, transparent 55%);
  pointer-events: none;
}

/* ── Icon cluster ──────────────────────────────────────────────────── */
.upload-icon-cluster {
  position: relative;
  margin-bottom: 0.35rem;
}

.upload-icon-ring {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(109,40,217,0.3) 0%, rgba(30,58,138,0.2) 100%);
  border: 1.5px solid rgba(139,92,246,0.4);
  box-shadow: 0 0 24px rgba(109,40,217,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

.upload-icon-inner { font-size: 2rem; }

/* Small AI bot badge floating top-right */
.upload-icon-badge {
  position: absolute;
  top: -4px;
  right: -10px;
  font-size: 1.1rem;
  background: rgba(6,13,31,0.9);
  border: 1px solid rgba(251,191,36,0.35);
  border-radius: 50%;
  width: 1.8rem;
  height: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(251,191,36,0.2);
  animation: badge-bob 3.5s ease-in-out infinite 0.5s;
}

@keyframes badge-bob {
  0%, 100% { transform: translateY(0) scale(1); }
  50%       { transform: translateY(-4px) scale(1.06); }
}

/* ── Card text ─────────────────────────────────────────────────────── */
.upload-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  color: #e8eaf6;
  text-align: center;
  line-height: 1.25;
  position: relative;
  z-index: 1;
}

.upload-subtitle {
  font-size: 0.78rem;
  color: rgba(232,234,246,0.4);
  position: relative;
  z-index: 1;
}

/* Format chips */
.format-chips {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.2rem;
  position: relative;
  z-index: 1;
}

.format-chip {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(139,92,246,0.3);
  background: rgba(109,40,217,0.12);
  color: #a78bfa;
}

/* Tap hint */
.tap-hint {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  color: rgba(232,234,246,0.35);
  font-weight: 500;
  margin-top: 0.5rem;
  position: relative;
  z-index: 1;
}

.tap-hint-icon {
  width: 0.9rem;
  height: 0.9rem;
  opacity: 0.6;
}

/* ── Feature list ──────────────────────────────────────────────────── */
.feature-list {
  list-style: none;
  width: 90%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.875rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}

.feature-icon {
  font-size: 1.15rem;
  flex-shrink: 0;
  margin-top: 0.05rem;
}

.feature-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e8eaf6;
  line-height: 1.3;
}

.feature-desc {
  font-size: 0.68rem;
  color: rgba(232,234,246,0.4);
  margin-top: 0.15rem;
  line-height: 1.4;
}

/* ── Privacy note ──────────────────────────────────────────────────── */
.privacy-note {
  font-size: 0.65rem;
  color: rgba(232,234,246,0.25);
  text-align: center;
  padding: 0 1rem;
  line-height: 1.5;
}

/* ── Hidden file input ─────────────────────────────────────────────── */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}

/* ══════════════════════════════════════════════════════════════════════
   PROCESSING STATE STYLES
══════════════════════════════════════════════════════════════════════ */

/* ── File pill at top ──────────────────────────────────────────────── */
.file-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 0.72rem;
  color: rgba(232,234,246,0.7);
  max-width: 90%;
  animation: fadeIn 0.3s ease;
}

.file-pill-icon { font-size: 0.9rem; }

.file-pill-name {
  font-weight: 500;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-pill-badge {
  font-size: 0.58rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(251,191,36,0.15);
  border: 1px solid rgba(251,191,36,0.3);
  color: #fbbf24;
  animation: pulse-text 1.5s ease-in-out infinite;
}

@keyframes pulse-text {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}

/* ── Cosmic orb ────────────────────────────────────────────────────── */
.orb-wrap {
  position: relative;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Outer + mid rings */
.orb-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid;
}

.orb-ring--outer {
  width: 180px; height: 180px;
  border-color: rgba(109,40,217,0.25);
  animation: orbit-spin 8s linear infinite;
}

.orb-ring--mid {
  width: 130px; height: 130px;
  border-color: rgba(251,191,36,0.2);
  animation: orbit-spin 5s linear infinite reverse;
}

@keyframes orbit-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Orbiting planet emojis */
.orb-planet {
  position: absolute;
  font-size: 1rem;
  line-height: 1;
}

.orb-planet--1 {
  top: 0; left: 50%;
  transform: translateX(-50%);
  animation: revolve 8s linear infinite;
  transform-origin: 0 90px;
}

.orb-planet--2 {
  top: 50%; left: 0;
  transform: translateY(-50%);
  animation: revolve 5s linear infinite reverse;
  transform-origin: 90px 0;
}

.orb-planet--3 {
  animation: revolve 12s linear infinite;
  transform-origin: 90px 0;
  top: 30%; left: 80%;
}

@keyframes revolve {
  from { transform: rotate(0deg)   translateX(90px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
}

/* Core orb */
.orb-core {
  width: 80px; height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, rgba(109,40,217,0.6), rgba(6,13,31,0.9));
  border: 2px solid rgba(139,92,246,0.5);
  box-shadow:
    0 0 20px rgba(109,40,217,0.5),
    0 0 40px rgba(109,40,217,0.2),
    inset 0 0 20px rgba(109,40,217,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  animation: core-pulse 2s ease-in-out infinite;
  z-index: 1;
}

@keyframes core-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(109,40,217,0.5), 0 0 40px rgba(109,40,217,0.2); transform: scale(1); }
  50%       { box-shadow: 0 0 35px rgba(109,40,217,0.7), 0 0 60px rgba(109,40,217,0.3); transform: scale(1.05); }
}

/* ── Processing headline ─────────────────────────────────────────── */
.processing-headline { text-align: center; }

.processing-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.35rem;
  font-weight: 800;
  color: #e8eaf6;
}

.processing-subtitle {
  font-size: 0.75rem;
  color: #a78bfa;
  margin-top: 0.2rem;
  font-weight: 500;
  min-height: 1.2em;
  transition: opacity 0.3s ease;
}

/* ── Step list ──────────────────────────────────────────────────── */
.step-list {
  list-style: none;
  width: 90%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0.85rem;
  border-radius: 0.75rem;
  transition: background 0.3s ease;
}

.step--done   { background: rgba(251,191,36,0.07); }
.step--active { background: rgba(109,40,217,0.1); }
.step--pending{ opacity: 0.35; }

/* Step icon wrapper */
.step-icon-wrap {
  width: 1.5rem; height: 1.5rem;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}

/* Checkmark */
.step-check {
  width: 1.4rem; height: 1.4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #d97706, #fbbf24);
  color: #030712;
  font-size: 0.7rem;
  font-weight: 900;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 10px rgba(251,191,36,0.5);
}

/* Spinner */
.step-spinner {
  width: 1.2rem; height: 1.2rem;
  color: #8b5cf6;
  animation: spin-step 1s linear infinite;
}

@keyframes spin-step {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Pending dot */
.step-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(232,234,246,0.25);
  display: block;
  margin: auto;
}

/* Step label */
.step-text {
  flex: 1;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(232,234,246,0.7);
  line-height: 1.3;
}

.step--done .step-text { color: #fbbf24; }
.step--active .step-text { color: #c4b5fd; }

/* Timestamp */
.step-ts {
  font-size: 0.58rem;
  color: rgba(232,234,246,0.25);
  font-family: 'JetBrains Mono', monospace;
  white-space: nowrap;
}

/* ── Progress bar ────────────────────────────────────────────────── */
.progress-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 90%;
  max-width: 340px;
}

.progress-track {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 999px;
  overflow: visible;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #6d28d9, #8b5cf6, #fbbf24);
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 8px rgba(139,92,246,0.5);
}

/* Glowing dot at the fill tip */
.progress-glow {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 8px rgba(251,191,36,0.9), 0 0 16px rgba(251,191,36,0.4);
  transition: left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.progress-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  color: #fbbf24;
  min-width: 2.5rem;
  text-align: right;
}

/* ── Processing note ─────────────────────────────────────────────── */
.processing-note {
  font-size: 0.68rem;
  color: rgba(232,234,246,0.3);
  text-align: center;
}

/* ── Generic animations ──────────────────────────────────────────── */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
