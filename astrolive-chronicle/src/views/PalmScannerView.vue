<template>
  <div class="palm-scanner-view">

    <!-- ── Header Bar ─────────────────────────────────────────────────── -->
    <header class="ps-header">
      <button class="ps-back-btn" @click="goBack" aria-label="Back to Dashboard">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      <div class="ps-header-title">
        <h1>AI Palm Scanner</h1>
        <p v-if="phase === 'capture'">Photo {{ currentStep }} of 5 &bull; {{ stepGuides[currentStep - 1].title }}</p>
        <p v-else-if="phase === 'scanning'">Neural Cyan Vector Scan…</p>
        <p v-else>Scan Complete</p>
      </div>

      <div class="ps-step-badge">
        <span v-if="phase === 'capture'">{{ currentStep }}/5</span>
        <span v-else-if="phase === 'scanning'">⚡ SCANNING</span>
        <span v-else>✓ DONE</span>
      </div>
    </header>

    <!-- ── Progress Step Bar (5 Steps) ────────────────────────────────── -->
    <div class="ps-progress-bar">
      <div
        v-for="i in 5"
        :key="i"
        class="ps-progress-step"
        :class="{
          'active': i === currentStep && phase === 'capture',
          'completed': capturedPhotos[i - 1] || phase !== 'capture'
        }"
      />
    </div>

    <!-- ═════════════════════════════════════════════════════════════════
         PHASE 1: MULTI-ANGLE REAL HUMAN PALM PHOTO CAPTURE (5 ANGLES)
    ═══════════════════════════════════════════════════════════════════ -->
    <div v-if="phase === 'capture'" class="capture-container">

      <!-- Viewfinder / Camera Screen -->
      <div class="camera-viewport">
        <!-- Flash overlay simulation -->
        <div v-if="flashActive" class="camera-flash" />

        <!-- Camera overlay guide SVG -->
        <div class="camera-guide-overlay">
          <svg viewBox="0 0 280 340" fill="none" class="palm-guide-svg">
            <path
              d="M140,290 C90,290 60,240 50,180 C40,120 45,90 45,90 C45,90 60,85 70,110 C80,135 85,160 85,160 C85,160 95,50 110,40 C125,30 135,45 130,80 C125,115 125,150 125,150 C125,150 145,40 160,35 C175,30 180,50 175,90 C170,130 165,155 165,155 C165,155 185,55 198,55 C210,55 210,75 200,115 C190,155 185,175 185,175 C185,175 210,120 225,125 C240,130 235,160 215,200 C195,240 180,290 140,290 Z"
              stroke="rgba(6, 182, 212, 0.5)"
              stroke-width="2"
              stroke-dasharray="6 4"
            />
            <path d="M75,200 C110,180 160,195 200,225" stroke="rgba(34, 211, 238, 0.7)" stroke-width="1.8" stroke-dasharray="3 3" />
            <path d="M70,220 C110,215 150,230 185,260" stroke="rgba(6, 182, 212, 0.7)" stroke-width="1.8" stroke-dasharray="3 3" />
            <path d="M120,290 C100,240 105,190 145,170" stroke="rgba(0, 242, 254, 0.7)" stroke-width="1.8" stroke-dasharray="3 3" />
          </svg>
        </div>

        <!-- Real Human Palm Photo Preview -->
        <img
          v-if="capturedPhotos[currentStep - 1]"
          :src="capturedPhotos[currentStep - 1]"
          alt="Real Human Palm Angle"
          class="captured-preview-img"
        />

        <!-- Instructional Overlay inside Viewfinder -->
        <div class="viewfinder-instruction">
          <span class="guide-icon">{{ stepGuides[currentStep - 1].icon }}</span>
          <div>
            <p class="guide-title">{{ stepGuides[currentStep - 1].title }}</p>
            <p class="guide-desc">{{ stepGuides[currentStep - 1].instruction }}</p>
          </div>
        </div>
      </div>

      <!-- Shutter Controls Bar -->
      <div class="shutter-controls-bar">
        <button
          class="ctrl-btn retake"
          :disabled="!capturedPhotos[currentStep - 1]"
          @click="retakeCurrentStep"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>Retake</span>
        </button>

        <button class="main-shutter-btn" @click="capturePhoto" aria-label="Take Photo">
          <div class="shutter-inner" />
        </button>

        <button
          class="ctrl-btn next"
          :disabled="!capturedPhotos[currentStep - 1]"
          @click="nextStep"
        >
          <span>{{ currentStep === 5 ? 'Scan Palm' : 'Next' }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <!-- 5 Captured Thumbnails Strip -->
      <div class="thumbnails-strip">
        <div
          v-for="i in 5"
          :key="i"
          class="thumb-box"
          :class="{
            'active': i === currentStep,
            'filled': capturedPhotos[i - 1]
          }"
          @click="selectStep(i)"
        >
          <img v-if="capturedPhotos[i - 1]" :src="capturedPhotos[i - 1]" alt="Human Palm Thumb" class="thumb-img" />
          <span v-else class="thumb-placeholder">{{ i }}</span>
          <span v-if="capturedPhotos[i - 1]" class="thumb-check">✓</span>
        </div>
      </div>

    </div>

    <!-- ═════════════════════════════════════════════════════════════════
         PHASE 2: CYAN NEURAL NETWORK SCANNING ANIMATION (PALM ONLY)
    ═══════════════════════════════════════════════════════════════════ -->
    <div v-else-if="phase === 'scanning'" class="scanning-container">

      <div class="scanner-viewport cyan-theme">
        <!-- Cyan Laser Sweep Beam strictly over palm -->
        <div class="laser-beam cyan-beam" />

        <!-- Real Human Palm Image being scanned -->
        <img :src="capturedPhotos[0]" alt="Scanning Real Palm" class="scan-base-img" />

        <!-- Cyan Neural Network SVG overlay -->
        <svg class="neural-network-svg" viewBox="0 0 300 400" fill="none">
          <!-- Neural connecting lines -->
          <line x1="80" y1="120" x2="150" y2="90" stroke="rgba(6,182,212,0.5)" stroke-width="1.5" stroke-dasharray="4 2" />
          <line x1="150" y1="90" x2="220" y2="130" stroke="rgba(6,182,212,0.5)" stroke-width="1.5" stroke-dasharray="4 2" />
          <line x1="80" y1="120" x2="100" y2="200" stroke="rgba(6,182,212,0.6)" stroke-width="1.5" />
          <line x1="100" y1="200" x2="180" y2="190" stroke="rgba(34,211,238,0.7)" stroke-width="1.5" />
          <line x1="180" y1="190" x2="220" y2="130" stroke="rgba(6,182,212,0.5)" stroke-width="1.5" />
          <line x1="100" y1="200" x2="120" y2="280" stroke="rgba(6,182,212,0.6)" stroke-width="1.5" />
          <line x1="180" y1="190" x2="170" y2="290" stroke="rgba(34,211,238,0.7)" stroke-width="1.5" />
          <line x1="120" y1="280" x2="170" y2="290" stroke="rgba(0,242,254,0.8)" stroke-width="1.5" />

          <!-- Cyan Neural Nodes -->
          <circle cx="80" cy="120" r="5" fill="#00f2fe" class="neural-node pulse-node" />
          <circle cx="150" cy="90" r="6" fill="#06b6d4" class="neural-node pulse-node" />
          <circle cx="220" cy="130" r="5" fill="#22d3ee" class="neural-node pulse-node" />
          <circle cx="100" cy="200" r="6" fill="#00f2fe" class="neural-node pulse-node" />
          <circle cx="180" cy="190" r="7" fill="#06b6d4" class="neural-node pulse-node" />
          <circle cx="120" cy="280" r="6" fill="#22d3ee" class="neural-node pulse-node" />
          <circle cx="170" cy="290" r="6" fill="#00f2fe" class="neural-node pulse-node" />
        </svg>

        <!-- Neural Vector Points Overlay -->
        <div class="scan-overlay-grid">
          <div class="vector-node cyan-node node-heart" :class="{ 'detected': scanProgress > 25 }">
            <span class="node-pulse cyan-pulse" />
            <span class="node-label cyan-label">Heart Vector &bull; High Empathy</span>
          </div>

          <div class="vector-node cyan-node node-head" :class="{ 'detected': scanProgress > 50 }">
            <span class="node-pulse cyan-pulse" />
            <span class="node-label cyan-label">Head Vector &bull; Deep Logic</span>
          </div>

          <div class="vector-node cyan-node node-life" :class="{ 'detected': scanProgress > 75 }">
            <span class="node-pulse cyan-pulse" />
            <span class="node-label cyan-label">Life Vector &bull; 94% Vitality</span>
          </div>

          <div class="vector-node cyan-node node-fate" :class="{ 'detected': scanProgress > 90 }">
            <span class="node-pulse cyan-pulse" />
            <span class="node-label cyan-label">Fate Vector &bull; 2026 Shift</span>
          </div>
        </div>
      </div>

      <!-- Telemetry Status Box -->
      <div class="telemetry-box cyan-telemetry">
        <div class="telemetry-header">
          <span class="pulse-dot cyan-dot" />
          <span>CYAN NEURAL PALM DECODER</span>
          <span class="percent cyan-percent">{{ Math.floor(scanProgress) }}%</span>
        </div>

        <p class="telemetry-log">{{ telemetryStatus }}</p>

        <div class="telemetry-progress-track">
          <div class="telemetry-progress-fill cyan-fill" :style="{ width: scanProgress + '%' }" />
        </div>
      </div>

    </div>

    <!-- ═════════════════════════════════════════════════════════════════
         PHASE 3: BOTTOM-TO-TOP POP-UP SHEET (SLIDES UP FROM BOTTOM)
    ═══════════════════════════════════════════════════════════════════ -->
    <Teleport to="#phone-screen">
      <Transition name="sheet-slide">
        <div v-if="phase === 'complete'" class="palm-sheet-backdrop" @click.self="phase = 'complete'">
          <div class="palm-sheet-card">

            <!-- Drag Handle Bar -->
            <div class="palm-sheet-handle" />

            <!-- Header Badge -->
            <div class="modal-badge-row">
              <span class="modal-badge">✨ PALM SCAN COMPLETE</span>
            </div>

            <h2 class="modal-title">Select Analysis Path</h2>
            <p class="modal-subtitle">5 palm photo vector angles successfully decoded. How would you like to proceed?</p>

            <!-- Option A: Astro AI (Redirect to AI Chat) -->
            <div class="choice-card choice-card--ai" @click="connectToAstroAi">
              <div class="choice-icon-wrap">🤖</div>
              <div class="choice-info">
                <h3>Consult Astro AI (AI Palmist)</h3>
                <p>Instant response, 12 palm line vector breakdowns &amp; AI chat analysis.</p>
                <span class="choice-tag tag-ai">⚡ Instant &bull; AI Powered</span>
              </div>
              <button class="choice-action-btn btn-ai">
                <span>Start AI Chat</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>

            <!-- Option B: Human Palmist (Connects to Palmist Booking) -->
            <div class="choice-card choice-card--human" @click="connectToHumanPalmist">
              <div class="choice-icon-wrap">🔮</div>
              <div class="choice-info">
                <h3>Book Expert Human Palmist</h3>
                <p>1-on-1 live call with verified Palmist to confirm major life event timing.</p>
                <span class="choice-tag tag-human">⭐ 4.95 Rating &bull; Certified Palmist</span>
              </div>
              <button class="choice-action-btn btn-human">
                <span>Book Palmist</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>

            <button class="retake-scan-link" @click="resetScan">
              🔄 Retake 5 Palm Photos
            </button>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Consultation Bottom Sheet for Human Palmist Booking -->
    <ConsultationBottomSheet
      v-if="showConsultationSheet && selectedPalmist"
      :astrologer="selectedPalmist"
      @close="showConsultationSheet = false"
      @confirmed="onConsultationConfirmed"
    />

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ConsultationBottomSheet from '../components/ConsultationBottomSheet.vue'

const router = useRouter()

// ── State ──────────────────────────────────────────────────────────────────
const phase = ref('capture') // 'capture' | 'scanning' | 'complete'
const currentStep = ref(1)
const flashActive = ref(false)
const scanProgress = ref(0)
const telemetryStatus = ref('Initializing cyan optical neural network recognition…')

// 5 REAL Human Palm Photos (Unsplash High Quality Human Hand Photography)
const REAL_HUMAN_PALM_IMGS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
]

const capturedPhotos = ref([null, null, null, null, null])

const stepGuides = [
  {
    icon: '✋',
    title: '1. Primary Palm View',
    instruction: 'Align center of dominant palm. Ensure Heart, Head & Life lines are clearly illuminated.',
  },
  {
    icon: '🤚',
    title: '2. Side Palm Edge',
    instruction: 'Tilt hand sideways to capture Marriage & Relationship lines under Pinky finger.',
  },
  {
    icon: '👍',
    title: '3. Mount of Venus & Thumb',
    instruction: 'Focus on base of thumb & Mount of Venus for Willpower & Vitality reserves.',
  },
  {
    icon: '✨',
    title: '4. Mount of Sun & Saturn',
    instruction: 'Angle top of palm to scan Mount of Sun & Saturn for Career, Fame & Destiny traces.',
  },
  {
    icon: '🖐️',
    title: '5. Non-Dominant Hand',
    instruction: 'Scan your non-dominant hand for latent karma potential comparison.',
  },
]

// Palmist for live booking
const showConsultationSheet = ref(false)
const selectedPalmist = ref({
  id: 101,
  name: 'Pandit Rameshwar Shastri',
  title: 'Master Palmist & Samudrik Shastra Specialist',
  badge: 'Top Palmist',
  rating: 4.95,
  reviewsCount: 342,
  experience: '22 yrs exp',
  languages: 'Hindi, English',
  rate: 49,
  originalRate: 75,
  avatar: '✋',
  skills: ['Palmistry', 'Samudrik Shastra', 'Vedic Astrology', 'Gemology'],
})

// ── Capture Logic ──────────────────────────────────────────────────────────
function capturePhoto() {
  flashActive.value = true
  setTimeout(() => { flashActive.value = false }, 180)

  // Assign real human palm photo for current step
  capturedPhotos.value[currentStep.value - 1] = REAL_HUMAN_PALM_IMGS[currentStep.value - 1]

  if (currentStep.value < 5) {
    setTimeout(() => {
      currentStep.value++
    }, 300)
  }
}

function retakeCurrentStep() {
  capturedPhotos.value[currentStep.value - 1] = null
}

function selectStep(stepNum) {
  currentStep.value = stepNum
}

function nextStep() {
  if (currentStep.value < 5) {
    currentStep.value++
  } else {
    startScanning()
  }
}

function goBack() {
  router.push('/')
}

// ── Cyan Neural Scanning Logic ─────────────────────────────────────────────
function startScanning() {
  phase.value = 'scanning'
  scanProgress.value = 0

  const logs = [
    'Mapping cyan neural network palm nodes…',
    'Analyzing Heart Line depth & emotional frequency…',
    'Calculating Head Line vector & analytical density…',
    'Detecting Life Line circumference & vitality index…',
    'Synthesizing 5-angle palm geometry vectors…',
    'Cyan Neural Scan Complete!',
  ]

  let stepIdx = 0
  const interval = setInterval(() => {
    scanProgress.value += 5
    if (scanProgress.value % 20 === 0 && stepIdx < logs.length) {
      telemetryStatus.value = logs[stepIdx]
      stepIdx++
    }

    if (scanProgress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        phase.value = 'complete'
      }, 400)
    }
  }, 90)
}

// ── Result Choice Actions ──────────────────────────────────────────────────
function connectToAstroAi() {
  router.push('/astro-ai?mode=palm&scanned=true')
}

function connectToHumanPalmist() {
  showConsultationSheet.value = true
}

function onConsultationConfirmed() {
  showConsultationSheet.value = false
  router.push('/live-chat')
}

function resetScan() {
  capturedPhotos.value = [null, null, null, null, null]
  currentStep.value = 1
  phase.value = 'capture'
}
</script>

<style scoped>
.palm-scanner-view {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #060311;
  color: #e8eaf6;
  padding: 1rem 0.85rem;
  box-sizing: border-box;
}

/* ── Header Bar ─────────────────────────────────────────────────────── */
.ps-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.ps-back-btn {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: #f1f5f9;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.ps-back-btn svg { width: 18px; height: 18px; }

.ps-header-title { flex: 1; }
.ps-header-title h1 {
  font-family: 'Outfit', sans-serif;
  font-size: 1.15rem; font-weight: 800; color: #f1f5f9; line-height: 1.1;
}
.ps-header-title p {
  font-size: 0.68rem; color: rgba(226,232,240,0.6); margin-top: 0.15rem;
}

.ps-step-badge {
  font-size: 0.65rem; font-weight: 800;
  color: #06b6d4;
  background: rgba(6, 182, 212, 0.12);
  border: 1px solid rgba(6, 182, 212, 0.35);
  padding: 0.2rem 0.6rem; border-radius: 999px;
}

/* ── Progress Step Bar ──────────────────────────────────────────────── */
.ps-progress-bar {
  display: flex; gap: 0.4rem; margin-bottom: 1rem;
}
.ps-progress-step {
  flex: 1; height: 4px; border-radius: 999px;
  background: rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}
.ps-progress-step.active {
  background: #06b6d4;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.6);
}
.ps-progress-step.completed {
  background: #22d3ee;
}

/* ── Phase 1: Camera Viewport ───────────────────────────────────────── */
.capture-container {
  display: flex; flex-direction: column; gap: 0.85rem; flex: 1;
}

.camera-viewport {
  position: relative;
  width: 100%; height: 360px;
  border-radius: 1.25rem;
  background: #090e1a;
  border: 1.5px solid rgba(6, 182, 212, 0.35);
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 12px 32px rgba(0,0,0,0.5), inset 0 0 20px rgba(6, 182, 212, 0.12);
}

.camera-flash {
  position: absolute; inset: 0; background: #fff; z-index: 100; opacity: 0.9;
}

.camera-guide-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none; z-index: 10;
}
.palm-guide-svg { width: 85%; height: 85%; }

.captured-preview-img {
  width: 100%; height: 100%; object-fit: cover;
  position: absolute; inset: 0; z-index: 5;
}

.viewfinder-instruction {
  position: absolute; bottom: 12px; left: 12px; right: 12px;
  background: rgba(9, 14, 26, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 0.85rem;
  padding: 0.6rem 0.75rem;
  display: flex; align-items: center; gap: 0.6rem;
  z-index: 20;
}
.guide-icon { font-size: 1.3rem; flex-shrink: 0; }
.guide-title { font-size: 0.75rem; font-weight: 800; color: #22d3ee; }
.guide-desc { font-size: 0.63rem; color: rgba(226,232,240,0.85); line-height: 1.25; margin-top: 0.1rem; }

/* Shutter Controls */
.shutter-controls-bar {
  display: flex; align-items: center; justify-content: space-around;
  padding: 0.5rem 0;
}
.ctrl-btn {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  background: transparent; border: none; color: #cbd5e1; font-size: 0.65rem;
  cursor: pointer; opacity: 0.8; transition: opacity 0.2s;
}
.ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.ctrl-btn svg { width: 22px; height: 22px; }

.main-shutter-btn {
  width: 68px; height: 68px; border-radius: 50%;
  border: 3px solid #06b6d4;
  background: transparent;
  padding: 4px; cursor: pointer;
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
  transition: transform 0.15s ease;
}
.main-shutter-btn:active { transform: scale(0.92); }
.shutter-inner {
  width: 100%; height: 100%; border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4, #00f2fe);
}

/* 5 Thumbnails Strip */
.thumbnails-strip {
  display: flex; gap: 0.5rem; justify-content: space-between;
}
.thumb-box {
  flex: 1; height: 56px; border-radius: 0.65rem;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.03);
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s ease;
}
.thumb-box.active {
  border-color: #06b6d4; box-shadow: 0 0 10px rgba(6,182,212,0.4);
}
.thumb-box.filled { border-color: rgba(34,211,238,0.5); }

.thumb-img { width: 100%; height: 100%; object-fit: cover; }
.thumb-placeholder { font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.3); }
.thumb-check {
  position: absolute; top: 2px; right: 2px;
  font-size: 0.65rem; font-weight: 900; color: #4ade80;
  background: rgba(0,0,0,0.75); width: 14px; height: 14px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
}

/* ── Phase 2: Cyan Neural Scanning (Palm Only) ───────────────────────── */
.scanning-container {
  display: flex; flex-direction: column; gap: 1rem; flex: 1;
}
.scanner-viewport.cyan-theme {
  position: relative; width: 100%; height: 380px;
  border-radius: 1.25rem; overflow: hidden;
  border: 1.5px solid rgba(6, 182, 212, 0.5);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.25);
}
.scan-base-img { width: 100%; height: 100%; object-fit: cover; filter: contrast(1.15) brightness(0.85); }

.laser-beam.cyan-beam {
  position: absolute; left: 0; right: 0; height: 3px;
  background: #00f2fe;
  box-shadow: 0 0 15px #06b6d4, 0 0 30px #00f2fe;
  z-index: 25;
  animation: laserScan 2.2s ease-in-out infinite alternate;
}
@keyframes laserScan {
  0% { top: 8%; }
  100% { top: 90%; }
}

.neural-network-svg {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 18;
}
.neural-node.pulse-node {
  animation: pulseNode 1.5s ease-in-out infinite alternate;
}
@keyframes pulseNode {
  0% { transform: scale(1); filter: drop-shadow(0 0 4px #00f2fe); }
  100% { transform: scale(1.4); filter: drop-shadow(0 0 10px #00f2fe); }
}

.scan-overlay-grid { position: absolute; inset: 0; z-index: 20; }
.vector-node.cyan-node {
  position: absolute; display: flex; align-items: center; gap: 0.4rem;
  opacity: 0; transition: opacity 0.4s ease;
}
.vector-node.cyan-node.detected { opacity: 1; }
.node-heart { top: 30%; left: 12%; }
.node-head  { top: 48%; left: 18%; }
.node-life  { top: 68%; left: 32%; }
.node-fate  { top: 55%; left: 52%; }

.node-pulse.cyan-pulse {
  width: 10px; height: 10px; border-radius: 50%;
  background: #00f2fe; box-shadow: 0 0 12px #00f2fe;
}
.node-label.cyan-label {
  font-size: 0.6rem; font-weight: 700; color: #f1f5f9;
  background: rgba(9, 14, 26, 0.88); padding: 2px 7px; border-radius: 4px;
  border: 1px solid rgba(6, 182, 212, 0.4);
}

.telemetry-box.cyan-telemetry {
  background: rgba(9, 14, 26, 0.88); border: 1px solid rgba(6, 182, 212, 0.35);
  border-radius: 1rem; padding: 0.85rem;
}
.telemetry-header {
  display: flex; align-items: center; gap: 0.5rem; font-size: 0.65rem; font-weight: 800; color: #22d3ee;
}
.pulse-dot.cyan-dot { width: 6px; height: 6px; border-radius: 50%; background: #00f2fe; box-shadow: 0 0 8px #00f2fe; }
.percent.cyan-percent { margin-left: auto; color: #00f2fe; }

.telemetry-log {
  font-family: monospace; font-size: 0.68rem; color: #e2e8f0; margin: 0.4rem 0; min-height: 1.2rem;
}
.telemetry-progress-track {
  width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden;
}
.telemetry-progress-fill.cyan-fill {
  height: 100%; background: linear-gradient(90deg, #06b6d4, #00f2fe); transition: width 0.1s linear;
}

/* ── Phase 3: Bottom-to-Top Pop-up Sheet ────────────────────────────── */
.palm-sheet-backdrop {
  position: absolute; inset: 0; z-index: 9999;
  background: rgba(4, 2, 14, 0.7);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  display: flex; flex-direction: column; justify-content: flex-end;
}

.palm-sheet-card {
  width: 100%;
  background: linear-gradient(160deg, #0d1222 0%, #060914 100%);
  border-top: 1px solid rgba(6, 182, 212, 0.35);
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1rem 1.15rem 1.75rem;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.8), 0 -1px 0 rgba(0, 242, 254, 0.3);
  display: flex; flex-direction: column; gap: 0.8rem;
  box-sizing: border-box;
}

/* Drag Handle Bar */
.palm-sheet-handle {
  width: 42px; height: 4px; border-radius: 99px;
  background: rgba(255,255,255,0.25); margin: 0 auto 0.2rem;
}

.modal-badge-row { text-align: center; }
.modal-badge {
  font-size: 0.62rem; font-weight: 800; color: #06b6d4;
  background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.3);
  padding: 0.2rem 0.65rem; border-radius: 999px;
}

.modal-title {
  font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 800;
  color: #f1f5f9; text-align: center; line-height: 1.1; margin-top: 0.1rem;
}
.modal-subtitle {
  font-size: 0.7rem; color: rgba(226,232,240,0.7); text-align: center; line-height: 1.3;
}

/* Choice Cards */
.choice-card {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 0.85rem; border-radius: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer; transition: all 0.25s ease;
}
.choice-card:hover { transform: translateY(-2px); }

.choice-card--ai {
  border-color: rgba(6, 182, 212, 0.4); background: linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(9,14,26,0.4) 100%);
}
.choice-card--human {
  border-color: rgba(251, 191, 36, 0.4); background: linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(45,26,10,0.3) 100%);
}

.choice-icon-wrap { font-size: 1.6rem; flex-shrink: 0; }
.choice-info { flex: 1; }
.choice-info h3 { font-size: 0.8rem; font-weight: 800; color: #f1f5f9; }
.choice-info p { font-size: 0.63rem; color: rgba(226,232,240,0.68); margin: 0.15rem 0 0.3rem; line-height: 1.2; }

.choice-tag {
  font-size: 0.58rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; display: inline-block;
}
.tag-ai { color: #00f2fe; background: rgba(6, 182, 212, 0.15); }
.tag-human { color: #fbbf24; background: rgba(251, 191, 36, 0.15); }

.choice-action-btn {
  background: transparent; border: none; color: #f1f5f9;
  display: flex; align-items: center; gap: 2px; font-size: 0.7rem; font-weight: 800;
  cursor: pointer; flex-shrink: 0;
}
.choice-action-btn svg { width: 14px; height: 14px; }
.btn-ai { color: #00f2fe; }
.btn-human { color: #fbbf24; }

.retake-scan-link {
  background: transparent; border: none; color: rgba(226,232,240,0.5);
  font-size: 0.68rem; font-weight: 600; cursor: pointer; text-align: center; margin-top: 0.2rem;
}
.retake-scan-link:hover { color: #f1f5f9; }

/* ── Smooth Bottom-to-Top Pop Sheet Transition ─────────────────────── */
.sheet-slide-enter-active,
.sheet-slide-leave-active {
  transition: opacity 0.35s ease;
}
.sheet-slide-enter-active .palm-sheet-card,
.sheet-slide-leave-active .palm-sheet-card {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.sheet-slide-enter-from {
  opacity: 0;
}
.sheet-slide-enter-from .palm-sheet-card {
  transform: translateY(100%);
}

.sheet-slide-leave-to {
  opacity: 0;
}
.sheet-slide-leave-to .palm-sheet-card {
  transform: translateY(100%);
}
</style>
