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
        <h1>Futuristic AI Palm Scanner</h1>
        <p v-if="phase === 'capture'">Photo {{ currentStep }} of 5 &bull; {{ stepGuides[currentStep - 1].title }}</p>
        <p v-else-if="phase === 'scanning'">Cyan Neural HUD Scanning…</p>
        <p v-else>Scan Complete</p>
      </div>

      <div class="ps-step-badge">
        <span v-if="phase === 'capture'">{{ currentStep }}/5</span>
        <span v-else-if="phase === 'scanning'">⚡ CYAN HUD</span>
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
         PHASE 1: MULTI-ANGLE REAL HUMAN PALM CAPTURE (5 ANGLES)
    ═══════════════════════════════════════════════════════════════════ -->
    <div v-if="phase === 'capture'" class="capture-container">

      <!-- Viewfinder / Camera Screen with Futuristic HUD Frame -->
      <div class="camera-viewport cyan-hud">

        <!-- Sci-Fi HUD Corner Brackets -->
        <span class="hud-corner hud-tl" />
        <span class="hud-corner hud-tr" />
        <span class="hud-corner hud-bl" />
        <span class="hud-corner hud-br" />

        <!-- Camera Flash Effect -->
        <div v-if="flashActive" class="camera-flash" />

        <!-- Real Human Palm Image Preview when captured -->
        <img
          v-if="capturedPhotos[currentStep - 1]"
          :src="capturedPhotos[currentStep - 1]"
          alt="Real Human Open Palm"
          class="captured-preview-img"
        />

        <!-- Camera Overlay Contour Guide SVG -->
        <div class="camera-guide-overlay">
          <svg viewBox="0 0 280 340" fill="none" class="palm-guide-svg">
            <path
              d="M140,290 C90,290 60,240 50,180 C40,120 45,90 45,90 C45,90 60,85 70,110 C80,135 85,160 85,160 C85,160 95,50 110,40 C125,30 135,45 130,80 C125,115 125,150 125,150 C125,150 145,40 160,35 C175,30 180,50 175,90 C170,130 165,155 165,155 C165,155 185,55 198,55 C210,55 210,75 200,115 C190,155 185,175 185,175 C185,175 210,120 225,125 C240,130 235,160 215,200 C195,240 180,290 140,290 Z"
              stroke="#00f2fe"
              stroke-width="2"
              stroke-dasharray="6 4"
              class="hud-path-pulse"
            />
            <path d="M75,200 C110,180 160,195 200,225" stroke="#22d3ee" stroke-width="1.8" stroke-dasharray="3 3" />
            <path d="M70,220 C110,215 150,230 185,260" stroke="#06b6d4" stroke-width="1.8" stroke-dasharray="3 3" />
            <path d="M120,290 C100,240 105,190 145,170" stroke="#00f2fe" stroke-width="1.8" stroke-dasharray="3 3" />
          </svg>
        </div>

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

      <!-- 5 Captured Human Palm Thumbnails Strip -->
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
         PHASE 2: FUTURISTIC CYAN NEURAL NETWORK PALM SCANNER
    ═══════════════════════════════════════════════════════════════════ -->
    <div v-else-if="phase === 'scanning'" class="scanning-container">

      <div class="scanner-viewport cyan-hud">
        <!-- Sci-Fi HUD Brackets -->
        <span class="hud-corner hud-tl" />
        <span class="hud-corner hud-tr" />
        <span class="hud-corner hud-bl" />
        <span class="hud-corner hud-br" />

        <!-- Futuristic Rotating Holographic Ring -->
        <div class="holo-ring" />

        <!-- Cyan Laser Sweep Beam strictly over palm -->
        <div class="laser-beam cyan-beam" />

        <!-- Real Human Palm Image being scanned -->
        <img :src="capturedPhotos[0]" alt="Scanning Real Palm" class="scan-base-img" />

        <!-- Cyan Neural Network Interconnected SVG Lines -->
        <svg class="neural-network-svg" viewBox="0 0 300 400" fill="none">
          <line x1="80" y1="120" x2="150" y2="90" stroke="rgba(6,182,212,0.6)" stroke-width="1.8" stroke-dasharray="4 2" />
          <line x1="150" y1="90" x2="220" y2="130" stroke="rgba(6,182,212,0.6)" stroke-width="1.8" stroke-dasharray="4 2" />
          <line x1="80" y1="120" x2="100" y2="200" stroke="rgba(0,242,254,0.7)" stroke-width="1.8" />
          <line x1="100" y1="200" x2="180" y2="190" stroke="rgba(34,211,238,0.8)" stroke-width="1.8" />
          <line x1="180" y1="190" x2="220" y2="130" stroke="rgba(6,182,212,0.6)" stroke-width="1.8" />
          <line x1="100" y1="200" x2="120" y2="280" stroke="rgba(6,182,212,0.7)" stroke-width="1.8" />
          <line x1="180" y1="190" x2="170" y2="290" stroke="rgba(0,242,254,0.8)" stroke-width="1.8" />
          <line x1="120" y1="280" x2="170" y2="290" stroke="rgba(0,242,254,0.9)" stroke-width="1.8" />

          <!-- Cyan Glowing Neural Nodes -->
          <circle cx="80" cy="120" r="5" fill="#00f2fe" class="neural-node pulse-node" />
          <circle cx="150" cy="90" r="6" fill="#06b6d4" class="neural-node pulse-node" />
          <circle cx="220" cy="130" r="5" fill="#22d3ee" class="neural-node pulse-node" />
          <circle cx="100" cy="200" r="6" fill="#00f2fe" class="neural-node pulse-node" />
          <circle cx="180" cy="190" r="7" fill="#06b6d4" class="neural-node pulse-node" />
          <circle cx="120" cy="280" r="6" fill="#22d3ee" class="neural-node pulse-node" />
          <circle cx="170" cy="290" r="6" fill="#00f2fe" class="neural-node pulse-node" />
        </svg>

        <!-- Futuristic Telemetry Vector Callouts -->
        <div class="scan-overlay-grid">
          <div class="vector-node cyan-node node-heart" :class="{ 'detected': scanProgress > 25 }">
            <span class="node-pulse cyan-pulse" />
            <span class="node-label cyan-label">Heart Line &bull; Empathy Vector</span>
          </div>

          <div class="vector-node cyan-node node-head" :class="{ 'detected': scanProgress > 50 }">
            <span class="node-pulse cyan-pulse" />
            <span class="node-label cyan-label">Head Line &bull; Analytical Vector</span>
          </div>

          <div class="vector-node cyan-node node-life" :class="{ 'detected': scanProgress > 75 }">
            <span class="node-pulse cyan-pulse" />
            <span class="node-label cyan-label">Life Line &bull; 94% Vitality Index</span>
          </div>

          <div class="vector-node cyan-node node-fate" :class="{ 'detected': scanProgress > 90 }">
            <span class="node-pulse cyan-pulse" />
            <span class="node-label cyan-label">Fate Line &bull; 2026 Shift</span>
          </div>
        </div>
      </div>

      <!-- Telemetry Diagnostics Console -->
      <div class="telemetry-box cyan-telemetry">
        <div class="telemetry-header">
          <span class="pulse-dot cyan-dot" />
          <span>CYAN NEURAL BIOMETRIC SCANNER</span>
          <span class="percent cyan-percent">{{ Math.floor(scanProgress) }}%</span>
        </div>

        <p class="telemetry-log">{{ telemetryStatus }}</p>

        <div class="telemetry-progress-track">
          <div class="telemetry-progress-fill cyan-fill" :style="{ width: scanProgress + '%' }" />
        </div>
      </div>

    </div>

    <!-- ═════════════════════════════════════════════════════════════════
         PHASE 3: BOTTOM-TO-TOP POP-UP SHEET WITH CLOSE BUTTON
    ═══════════════════════════════════════════════════════════════════ -->
    <Teleport to="#phone-screen">
      <Transition name="sheet-slide">
        <div v-if="phase === 'complete'" class="palm-sheet-backdrop" @click.self="dismissModal">
          <div class="palm-sheet-card">

            <!-- Close Button (✕) -->
            <button class="sheet-close-btn" @click="dismissModal" aria-label="Close modal">✕</button>

            <!-- Drag Handle Bar -->
            <div class="palm-sheet-handle" />

            <!-- Header Badge -->
            <div class="modal-badge-row">
              <span class="modal-badge">✨ PALM SCAN COMPLETE</span>
            </div>

            <h2 class="modal-title">Select Analysis Path</h2>
            <p class="modal-subtitle">5 palm photo vector angles successfully decoded. How would you like to proceed?</p>

            <!-- Option A: Astro AI -->
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

            <!-- Option B: Human Palmist -->
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
const telemetryStatus = ref('Initializing cyan neural network optical biometric scanner…')

// Helper generator for 5 Real Human Open Palm SVGs (Data URLs)
function createRealPalmDataUrl(angleIndex) {
  const angleDetails = [
    // 1: Primary Open Right Human Palm
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs>
        <linearGradient id="skin1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e8c39e"/>
          <stop offset="50%" stop-color="#d4a373"/>
          <stop offset="100%" stop-color="#b5835a"/>
        </linearGradient>
        <radialGradient id="mountVenus1" cx="30%" cy="70%" r="40%">
          <stop offset="0%" stop-color="#ecc8aa"/>
          <stop offset="100%" stop-color="#c6956d"/>
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill="#090e1a"/>
      <path d="M 200,450 C 130,450 90,390 70,300 C 50,210 60,150 60,150 C 60,150 85,140 100,180 C 115,220 120,250 120,250 C 120,250 135,70 155,55 C 175,40 190,65 180,120 C 170,175 170,230 170,230 C 170,230 200,60 220,50 C 240,40 250,70 240,130 C 230,190 225,235 225,235 C 225,235 255,80 275,80 C 295,80 295,110 280,170 C 265,230 255,260 255,260 C 255,260 290,170 310,180 C 330,190 320,230 290,290 C 260,350 240,450 200,450 Z" fill="url(#skin1)" stroke="#8d5b3a" stroke-width="2.5"/>
      <ellipse cx="140" cy="350" rx="50" ry="60" fill="url(#mountVenus1)" opacity="0.6"/>
      <path d="M 100,240 C 150,210 220,215 280,250" fill="none" stroke="#703f27" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 100,240 C 150,210 220,215 280,250" fill="none" stroke="#e09f7d" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M 90,260 C 150,265 210,290 260,340" fill="none" stroke="#663721" stroke-width="3" stroke-linecap="round"/>
      <path d="M 95,255 C 140,300 135,390 190,430" fill="none" stroke="#6b3a24" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 195,420 C 190,340 195,270 200,210" fill="none" stroke="#7a462d" stroke-width="2.5" stroke-dasharray="8 3" stroke-linecap="round"/>
      <path d="M 160,440 C 180,435 210,440 230,445" fill="none" stroke="#855235" stroke-width="2"/>
    </svg>`,

    // 2: Side Palm Edge (Marriage Lines)
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs>
        <linearGradient id="skin2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#dfb792"/>
          <stop offset="100%" stop-color="#aa774e"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="#090e1a"/>
      <path d="M 120,440 C 100,360 90,280 90,220 C 90,160 110,120 130,100 C 150,80 170,100 165,160 C 160,220 180,280 200,340 C 220,400 200,440 120,440 Z" fill="url(#skin2)" stroke="#7a472a" stroke-width="2"/>
      <path d="M 105,210 L 145,215" fill="none" stroke="#5c2e17" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 108,230 L 155,235" fill="none" stroke="#5c2e17" stroke-width="4" stroke-linecap="round"/>
      <path d="M 112,250 L 148,253" fill="none" stroke="#6d3920" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 98,280 C 130,285 160,300 185,320" fill="none" stroke="#68341a" stroke-width="3"/>
    </svg>`,

    // 3: Mount of Venus & Thumb Base
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs>
        <radialGradient id="venusGlow" cx="45%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#f0caa9"/>
          <stop offset="100%" stop-color="#b07d54"/>
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill="#090e1a"/>
      <path d="M 100,450 C 90,360 80,260 110,180 C 135,115 170,120 185,170 C 195,210 200,270 250,340 C 290,400 270,450 100,450 Z" fill="url(#venusGlow)" stroke="#7d4c2b" stroke-width="2"/>
      <path d="M 120,210 C 145,215 170,210 180,205" fill="none" stroke="#5e3118" stroke-width="3"/>
      <path d="M 190,260 C 150,300 145,390 195,440" fill="none" stroke="#592b13" stroke-width="4" stroke-linecap="round"/>
      <path d="M 165,310 C 145,340 148,390 160,420" fill="none" stroke="#7a4427" stroke-width="2" stroke-dasharray="5 3"/>
    </svg>`,

    // 4: Mount of Sun & Saturn
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs>
        <linearGradient id="topMounts" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#edd0b4"/>
          <stop offset="100%" stop-color="#ad7b53"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="#090e1a"/>
      <path d="M 60,400 C 60,300 70,220 80,170 M 80,170 C 80,170 95,70 115,60 C 135,50 145,75 140,160 M 140,160 C 140,160 160,45 180,40 C 200,35 210,65 200,165 M 200,165 C 200,165 225,60 245,60 C 265,60 265,90 250,175 M 250,175 C 250,175 285,100 305,110 C 320,120 310,170 280,240 C 260,300 250,400 60,400 Z" fill="url(#topMounts)" stroke="#78482a" stroke-width="2"/>
      <path d="M 230,290 L 232,185" fill="none" stroke="#4a220c" stroke-width="3" stroke-linecap="round"/>
      <path d="M 175,320 L 178,180" fill="none" stroke="#4a220c" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,

    // 5: Left Non-Dominant Human Palm
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs>
        <linearGradient id="leftSkin" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#e6c19c"/>
          <stop offset="100%" stop-color="#a8744b"/>
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="#090e1a"/>
      <path d="M 200,450 C 270,450 310,390 330,300 C 350,210 340,150 340,150 C 340,150 315,140 300,180 C 285,220 280,250 280,250 C 280,250 265,70 245,55 C 225,40 210,65 220,120 C 230,175 230,230 230,230 C 230,230 200,60 180,50 C 160,40 150,70 160,130 C 170,190 175,235 175,235 C 175,235 145,80 125,80 C 105,80 105,110 120,170 C 135,230 145,260 145,260 C 145,260 110,170 90,180 C 70,190 80,230 110,290 C 140,350 160,450 200,450 Z" fill="url(#leftSkin)" stroke="#7c4a29" stroke-width="2"/>
      <path d="M 300,240 C 250,210 180,215 120,250" fill="none" stroke="#5e2e16" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 310,260 C 250,265 190,290 140,340" fill="none" stroke="#5e2e16" stroke-width="3" stroke-linecap="round"/>
      <path d="M 305,255 C 260,300 265,390 210,430" fill="none" stroke="#5e2e16" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`
  ]

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(angleDetails[angleIndex])
}

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

  // Assign real human open palm SVG data URL for current step
  capturedPhotos.value[currentStep.value - 1] = createRealPalmDataUrl(currentStep.value - 1)

  if (currentStep.value < 5) {
    setTimeout(() => {
      currentStep.value++
    }, 300)
  } else {
    // 5th photo captured -> Auto-trigger Futuristic Cyan Scan!
    setTimeout(() => {
      startScanning()
    }, 450)
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

function dismissModal() {
  phase.value = 'capture'
  router.push('/')
}

// ── Cyan Futuristic Neural Scanning Logic ──────────────────────────────────
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
  background: #00f2fe;
}

/* ── Phase 1: Camera Viewport with Futuristic HUD ───────────────────── */
.capture-container {
  display: flex; flex-direction: column; gap: 0.85rem; flex: 1;
}

.camera-viewport.cyan-hud {
  position: relative;
  width: 100%; height: 360px;
  border-radius: 1.25rem;
  background: #090e1a;
  border: 1.5px solid rgba(6, 182, 212, 0.4);
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 12px 32px rgba(0,0,0,0.5), inset 0 0 25px rgba(6, 182, 212, 0.15);
}

/* Sci-Fi HUD Corner Brackets */
.hud-corner {
  position: absolute; width: 14px; height: 14px;
  border: 2px solid #00f2fe; z-index: 25; pointer-events: none;
}
.hud-tl { top: 10px; left: 10px; border-right: none; border-bottom: none; }
.hud-tr { top: 10px; right: 10px; border-left: none; border-bottom: none; }
.hud-bl { bottom: 10px; left: 10px; border-right: none; border-top: none; }
.hud-br { bottom: 10px; right: 10px; border-left: none; border-top: none; }

.camera-flash {
  position: absolute; inset: 0; background: #fff; z-index: 100; opacity: 0.9;
}

.camera-guide-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none; z-index: 10;
}
.palm-guide-svg { width: 85%; height: 85%; }
.hud-path-pulse { animation: hudPulse 2s ease-in-out infinite alternate; }
@keyframes hudPulse {
  0% { stroke: rgba(0,242,254,0.4); }
  100% { stroke: rgba(0,242,254,0.9); }
}

.captured-preview-img {
  width: 100%; height: 100%; object-fit: cover;
  position: absolute; inset: 0; z-index: 5;
}

.viewfinder-instruction {
  position: absolute; bottom: 12px; left: 12px; right: 12px;
  background: rgba(9, 14, 26, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(6, 182, 212, 0.35);
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

/* ── Phase 2: Cyan Neural HUD Scanner (Palm Only) ────────────────────── */
.scanning-container {
  display: flex; flex-direction: column; gap: 1rem; flex: 1;
}
.scanner-viewport.cyan-hud {
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

.holo-ring {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 220px; height: 220px; border-radius: 50%;
  border: 1.5px stroke-dasharray="10 5" rgba(0,242,254,0.4);
  border: 1.5px dashed rgba(6,182,212,0.4);
  pointer-events: none; z-index: 15;
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
  background: rgba(4, 2, 14, 0.75);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  display: flex; flex-direction: column; justify-content: flex-end;
}

.palm-sheet-card {
  position: relative;
  width: 100%;
  background: linear-gradient(160deg, #0d1222 0%, #060914 100%);
  border-top: 1px solid rgba(6, 182, 212, 0.35);
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1rem 1.15rem 1.75rem;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.8), 0 -1px 0 rgba(0, 242, 254, 0.3);
  display: flex; flex-direction: column; gap: 0.8rem;
  box-sizing: border-box;
}

/* Sheet Close Button (✕) */
.sheet-close-btn {
  position: absolute; top: 12px; right: 14px;
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  color: #f1f5f9; font-size: 0.85rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.2s; z-index: 30;
}
.sheet-close-btn:hover { background: rgba(255,255,255,0.2); }

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
