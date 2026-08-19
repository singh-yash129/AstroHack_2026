<template>
  <div class="psv-root">

    <!-- ── Animated Cosmic Background ─────────────────────────────────── -->
    <div class="psv-bg">
      <div class="psv-bg-grid"></div>
      <div class="psv-bg-orb orb-1"></div>
      <div class="psv-bg-orb orb-2"></div>
      <div class="psv-bg-orb orb-3"></div>
    </div>

    <!-- ── Compact Premium Header ─────────────────────────────────────── -->
    <header class="psv-header">
      <button class="psv-back-btn" @click="goBack" aria-label="Go back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
      </button>

      <div class="psv-header-identity">
        <div class="psv-logo-ring">
          <span class="psv-logo-inner">✌</span>
          <svg class="psv-logo-orbit" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="20" stroke="url(#orbitGrad)" stroke-width="1.5" fill="none" stroke-dasharray="62 10"/>
            <defs>
              <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00f2fe"/>
                <stop offset="100%" stop-color="#4facfe"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="psv-title-stack">
          <h1 class="psv-title">AI Palm Scanner</h1>
          <p class="psv-subtitle">
            <span class="psv-status-dot" :class="phase === 'scanning' ? 'dot-scan' : phase === 'complete' ? 'dot-done' : 'dot-idle'"></span>
            <span v-if="phase === 'capture'">Step {{ currentStep }} of 5 &bull; {{ stepGuides[currentStep - 1].title }}</span>
            <span v-else-if="phase === 'scanning'">Neural Mesh Active</span>
            <span v-else>Scan Complete</span>
          </p>
        </div>
      </div>

      <div class="psv-badge" :class="{ 'badge-glow-scan': phase === 'scanning', 'badge-glow-done': phase === 'complete' }">
        <span v-if="phase === 'capture'">{{ currentStep }}/5</span>
        <span v-else-if="phase === 'scanning'">⚡ AI</span>
        <span v-else>✓ Done</span>
      </div>
    </header>

    <!-- ── Step Progress Pips ─────────────────────────────────────────── -->
    <div class="psv-steps">
      <div
        v-for="i in 5" :key="i"
        class="psv-step-pip"
        :class="{
          'pip-active': i === currentStep && phase === 'capture',
          'pip-done': capturedPhotos[i - 1] || phase !== 'capture'
        }"
        @click="phase === 'capture' && selectStep(i)"
      >
        <span class="pip-num">{{ i }}</span>
      </div>
      <div class="psv-step-line">
        <div class="psv-step-line-fill" :style="{ width: (((phase === 'capture' ? currentStep - 1 : 5) / 5) * 100) + '%' }"></div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!-- PHASE 1: CAPTURE                                                  -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <div v-if="phase === 'capture'" class="psv-capture-phase">

      <!-- Viewfinder Card -->
      <div class="psv-viewfinder" :class="{ 'vf-captured': capturedPhotos[currentStep - 1] }">

        <!-- HUD Corner Brackets -->
        <span class="vf-corner vf-tl"></span>
        <span class="vf-corner vf-tr"></span>
        <span class="vf-corner vf-bl"></span>
        <span class="vf-corner vf-br"></span>

        <!-- Scan Line -->
        <div class="vf-scanline"></div>

        <!-- Flash overlay -->
        <div v-if="flashActive" class="vf-flash"></div>

        <!-- Captured Photo Preview -->
        <img
          v-if="capturedPhotos[currentStep - 1]"
          :src="capturedPhotos[currentStep - 1]"
          alt="Captured palm"
          class="vf-captured-img"
        />

        <!-- Palm Outline Guide SVG -->
        <div class="vf-guide-wrap">
          <svg viewBox="0 0 280 340" fill="none" class="vf-palm-svg">
            <path
              d="M140,290 C90,290 60,240 50,180 C40,120 45,90 45,90 C45,90 60,85 70,110 C80,135 85,160 85,160 C85,160 95,50 110,40 C125,30 135,45 130,80 C125,115 125,150 125,150 C125,150 145,40 160,35 C175,30 180,50 175,90 C170,130 165,155 165,155 C165,155 185,55 198,55 C210,55 210,75 200,115 C190,155 185,175 185,175 C185,175 210,120 225,125 C240,130 235,160 215,200 C195,240 180,290 140,290 Z"
              stroke="#00f2fe"
              stroke-width="1.8"
              stroke-dasharray="6 4"
              class="vf-palm-outline"
            />
            <path d="M75,200 C110,180 160,195 200,225" stroke="#22d3ee" stroke-width="1.4" stroke-dasharray="3 3" opacity="0.8"/>
            <path d="M70,220 C110,215 150,230 185,260" stroke="#06b6d4" stroke-width="1.4" stroke-dasharray="3 3" opacity="0.8"/>
            <path d="M120,290 C100,240 105,190 145,170" stroke="#00f2fe" stroke-width="1.4" stroke-dasharray="3 3" opacity="0.8"/>
          </svg>
        </div>

        <!-- Step Instruction Pill -->
        <div class="vf-instruction">
          <span class="vf-inst-icon">{{ stepGuides[currentStep - 1].icon }}</span>
          <div class="vf-inst-text">
            <p class="vf-inst-title">{{ stepGuides[currentStep - 1].title }}</p>
            <p class="vf-inst-desc">{{ stepGuides[currentStep - 1].instruction }}</p>
          </div>
        </div>

        <!-- Captured badge -->
        <div class="vf-status-badge" v-if="capturedPhotos[currentStep - 1]">
          <span class="vf-check">✓</span> Captured
        </div>
      </div>

      <!-- Controls Row -->
      <div class="psv-controls">
        <button
          class="psv-ctrl-btn retake-btn"
          :disabled="!capturedPhotos[currentStep - 1]"
          @click="retakeCurrentStep"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
          <span>Retake</span>
        </button>

        <button class="psv-shutter" @click="capturePhoto" aria-label="Capture palm">
          <div class="shutter-ring"></div>
          <div class="shutter-core"></div>
        </button>

        <button
          class="psv-ctrl-btn next-btn"
          :disabled="!capturedPhotos[currentStep - 1]"
          @click="nextStep"
        >
          <span>{{ currentStep < 5 ? 'Next' : 'Scan' }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <!-- Thumbnail Strip -->
      <div class="psv-thumb-strip">
        <div
          v-for="i in 5" :key="i"
          class="psv-thumb"
          :class="{ 'thumb-active': i === currentStep, 'thumb-captured': capturedPhotos[i-1] }"
          @click="selectStep(i)"
        >
          <img v-if="capturedPhotos[i-1]" :src="capturedPhotos[i-1]" alt=""/>
          <span v-else class="thumb-num">{{ i }}</span>
          <span class="thumb-check" v-if="capturedPhotos[i-1]">✓</span>
        </div>
      </div>

    </div>

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!-- PHASE 2: SCANNING                                                 -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <div v-if="phase === 'scanning'" class="psv-scanning-phase">
      <div class="scanner-card">

        <!-- Circuit SVG BG -->
        <svg class="scanner-circuit-bg" viewBox="0 0 480 380" fill="none" preserveAspectRatio="xMidYMid slice">
          <g stroke="#06b6d4" stroke-width="0.6" opacity="0.18">
            <path d="M0 40 L50 40 L78 66 L130 66"/>
            <path d="M0 130 L35 130 L58 108 L100 108"/>
            <path d="M0 230 L48 230 L72 252 L125 252"/>
            <path d="M0 320 L40 320 L62 298 L110 298"/>
            <path d="M480 40 L430 40 L402 66 L350 66"/>
            <path d="M480 130 L445 130 L422 108 L380 108"/>
            <path d="M480 230 L432 230 L408 252 L355 252"/>
            <path d="M480 320 L440 320 L418 298 L370 298"/>
          </g>
          <g fill="#00f2fe" opacity="0.6">
            <circle cx="130" cy="66" r="2.5"/>
            <circle cx="100" cy="108" r="2.5"/>
            <circle cx="125" cy="252" r="2.5"/>
            <circle cx="350" cy="66" r="2.5"/>
            <circle cx="380" cy="108" r="2.5"/>
            <circle cx="355" cy="252" r="2.5"/>
          </g>
        </svg>

        <!-- Radial glow behind hand -->
        <div class="scanner-glow-orb"></div>

        <!-- Captured palm underlay -->
        <img v-if="capturedPhotos[0]" :src="capturedPhotos[0]" alt="Palm" class="scanner-palm-underlay"/>

        <!-- ── Scanner Stage: [left-col] [hand] [right-col] ── -->
        <div class="scanner-stage">

          <!-- Left node column -->
          <div class="node-col node-col-left">
            <div class="scan-node" :class="{ 'node-detected': scanProgress > 25 }">
              <span class="node-label">Heart Line</span>
              <span class="node-line"></span>
              <span class="node-dot"></span>
            </div>
            <div class="scan-node" :class="{ 'node-detected': scanProgress > 50 }">
              <span class="node-label">Head Line</span>
              <span class="node-line"></span>
              <span class="node-dot"></span>
            </div>
          </div>

          <!-- Hand with orbit ring + sweep -->
          <div class="scanner-hand-wrap">
            <div class="hand-orbit-ring"></div>
            <svg class="hand-svg" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 72 C18 72 10 58 8 44 C6 30 8 22 8 22 C8 22 14 20 17 28 C20 36 21 42 21 42 C21 42 24 10 28 8 C32 6 34 12 33 22 C32 32 32 38 32 38 C32 38 36 8 40 7 C44 6 45 13 43 24 C41 35 41 40 41 40 C41 40 46 16 50 17 C54 18 53 27 49 38 C45 50 42 72 32 72 Z"
                stroke="#00f2fe" stroke-width="1.2" stroke-linejoin="round" class="hand-path-anim"/>
              <path d="M16 46 C22 42 34 44 42 50" stroke="#38bdf8" stroke-width="0.8" stroke-dasharray="3 2" stroke-linecap="round" opacity="0.9"/>
              <path d="M14 52 C22 51 30 55 40 62" stroke="#06b6d4" stroke-width="0.8" stroke-dasharray="3 2" stroke-linecap="round" opacity="0.8"/>
              <path d="M27 70 C22 58 24 46 33 42" stroke="#00f2fe" stroke-width="0.8" stroke-dasharray="3 2" stroke-linecap="round" opacity="0.8"/>
              <path d="M32 72 C32 50 33 32 32 16" stroke="#4facfe" stroke-width="0.6" stroke-dasharray="2 3" stroke-linecap="round" opacity="0.55"/>
            </svg>
            <div class="scanner-sweep"></div>
          </div>

          <!-- Right node column -->
          <div class="node-col node-col-right">
            <div class="scan-node" :class="{ 'node-detected': scanProgress > 75 }">
              <span class="node-dot"></span>
              <span class="node-line"></span>
              <span class="node-label">Life Line</span>
            </div>
            <div class="scan-node" :class="{ 'node-detected': scanProgress > 90 }">
              <span class="node-dot"></span>
              <span class="node-line"></span>
              <span class="node-label">Fate Line</span>
            </div>
          </div>

        </div>

        <!-- Status labels -->
        <div class="scanner-status-row">
          <span class="status-pip"></span>
          <span class="scanner-label">SCANNING PALM</span>
          <span class="scanner-label-sep">&bull;</span>
          <span class="scanner-label">NEURAL MESH ACTIVE</span>
        </div>

        <!-- Telemetry Bar -->
        <div class="scanner-telemetry">
          <div class="telemetry-top">
            <span class="telemetry-dot"></span>
            <span class="telemetry-text">{{ telemetryStatus }}</span>
            <span class="telemetry-pct">{{ Math.floor(scanProgress) }}%</span>
          </div>
          <div class="telemetry-track">
            <div class="telemetry-fill" :style="{ width: scanProgress + '%' }">
              <div class="telemetry-glow-tip"></div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════════ -->
    <!-- PHASE 3: RESULT SHEET                                             -->
    <!-- ══════════════════════════════════════════════════════════════════ -->
    <Teleport to="#phone-screen">
      <Transition name="sheet-slide">
        <div v-if="phase === 'complete'" class="psv-sheet-backdrop" @click.self="dismissModal">
          <div class="psv-sheet">

            <div class="sheet-handle"></div>
            <button class="sheet-close" @click="dismissModal" aria-label="Close">✕</button>

            <div class="sheet-header">
              <div class="sheet-icon-wrap">
                <span class="sheet-icon-glyph">✌</span>
                <div class="sheet-icon-ring"></div>
              </div>
              <div>
                <div class="sheet-badge">⚡ PALM SCAN COMPLETE</div>
                <h2 class="sheet-title">Select Analysis Path</h2>
                <p class="sheet-desc">5 palm vector angles decoded. Choose your next step.</p>
              </div>
            </div>

            <!-- Choice AI -->
            <div class="choice-card choice-ai" @click="connectToAstroAi">
              <div class="choice-card-bg"></div>
              <div class="choice-left">
                <div class="choice-avatar ai-avatar">🔮</div>
                <div class="choice-info">
                  <h3 class="choice-name">Consult Astro AI</h3>
                  <p class="choice-detail">12 palm line breakdowns &bull; AI chat analysis</p>
                  <span class="choice-tag tag-ai">⚡ Instant &bull; AI Powered</span>
                </div>
              </div>
              <button class="choice-btn btn-ai">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            <!-- Choice Human -->
            <div class="choice-card choice-human" @click="connectToHumanPalmist">
              <div class="choice-card-bg"></div>
              <div class="choice-left">
                <div class="choice-avatar human-avatar">🧙</div>
                <div class="choice-info">
                  <h3 class="choice-name">Book Expert Palmist</h3>
                  <p class="choice-detail">1-on-1 live call &bull; Verified Palmist</p>
                  <span class="choice-tag tag-human">⭐ 4.95 &bull; Certified Palmist</span>
                </div>
              </div>
              <button class="choice-btn btn-human">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            <button class="sheet-retake-btn" @click="resetScan">
              🔄 Retake 5 Palm Photos
            </button>

          </div>
        </div>
      </Transition>
    </Teleport>

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

const phase = ref('capture')
const currentStep = ref(1)
const flashActive = ref(false)
const scanProgress = ref(0)
const telemetryStatus = ref('Initializing cyan neural network optical biometric scanner...')

function createRealPalmDataUrl(angleIndex) {
  const angleDetails = [
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
      <path d="M 100,240 C 150,210 220,215 280,250" fill="none" stroke="#703f27" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 90,260 C 150,265 210,290 260,340" fill="none" stroke="#663721" stroke-width="3" stroke-linecap="round"/>
      <path d="M 95,255 C 140,300 135,390 190,430" fill="none" stroke="#6b3a24" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs><linearGradient id="skin2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e2b98c"/><stop offset="100%" stop-color="#c08050"/></linearGradient></defs>
      <rect width="400" height="500" fill="#090e1a"/>
      <path d="M 200,450 C 260,450 310,380 330,290 C 350,200 340,130 330,100 C 320,70 300,70 290,100 C 280,130 285,200 280,260 C 275,320 270,360 200,420 C 130,360 125,300 120,260 C 115,220 115,140 100,100 C 85,60 65,70 60,110 C 50,160 60,230 80,310 C 100,380 140,450 200,450 Z" fill="url(#skin2)" stroke="#9b6840" stroke-width="2"/>
      <path d="M 170,220 C 180,225 210,220 225,215" fill="none" stroke="#6a3b1f" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs><radialGradient id="venusGlow" cx="35%" cy="65%" r="50%"><stop offset="0%" stop-color="#e8c49c"/><stop offset="100%" stop-color="#b07d54"/></radialGradient></defs>
      <rect width="400" height="500" fill="#090e1a"/>
      <path d="M 100,450 C 90,360 80,260 110,180 C 135,115 170,120 185,170 C 195,210 200,270 250,340 C 290,400 270,450 100,450 Z" fill="url(#venusGlow)" stroke="#7d4c2b" stroke-width="2"/>
      <path d="M 190,260 C 150,300 145,390 195,440" fill="none" stroke="#592b13" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs><linearGradient id="topMounts" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#edd0b4"/><stop offset="100%" stop-color="#ad7b53"/></linearGradient></defs>
      <rect width="400" height="500" fill="#090e1a"/>
      <path d="M 60,400 C 60,300 70,220 80,170 C 80,170 95,70 115,60 C 135,50 145,75 140,160 C 160,45 180,40 200,65 C 200,165 225,60 245,60 C 265,60 265,90 250,175 C 285,100 305,110 310,170 C 280,240 260,300 250,400 Z" fill="url(#topMounts)" stroke="#78482a" stroke-width="2"/>
      <path d="M 230,290 L 232,185" fill="none" stroke="#4a220c" stroke-width="3" stroke-linecap="round"/>
    </svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <defs><linearGradient id="leftSkin" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e6c19c"/><stop offset="100%" stop-color="#a8744b"/></linearGradient></defs>
      <rect width="400" height="500" fill="#090e1a"/>
      <path d="M 200,450 C 270,450 310,390 330,300 C 350,210 340,150 340,150 C 340,150 315,140 300,180 C 285,220 280,250 280,250 C 280,250 265,70 245,55 C 225,40 210,65 220,120 C 230,175 230,230 230,230 C 230,230 200,60 180,50 C 160,40 150,70 160,130 C 170,190 175,235 175,235 C 175,235 145,80 125,80 C 105,80 105,110 120,170 C 135,230 145,260 145,260 C 145,260 110,170 90,180 C 70,190 80,230 110,290 C 140,350 160,450 200,450 Z" fill="url(#leftSkin)" stroke="#7c4a29" stroke-width="2"/>
      <path d="M 300,240 C 250,210 180,215 120,250" fill="none" stroke="#5e2e16" stroke-width="3.5" stroke-linecap="round"/>
    </svg>`
  ]
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(angleDetails[angleIndex])
}

const capturedPhotos = ref([null, null, null, null, null])

const stepGuides = [
  { icon: '✌', title: '1. Primary Palm View', instruction: 'Align center of dominant palm. Ensure Heart, Head & Life lines are clearly illuminated.' },
  { icon: '👊', title: '2. Side Palm Edge', instruction: 'Tilt hand sideways to capture Marriage & Relationship lines under Pinky finger.' },
  { icon: '👍', title: '3. Mount of Venus & Thumb', instruction: 'Focus on base of thumb & Mount of Venus for Willpower & Vitality reserves.' },
  { icon: '☀', title: '4. Mount of Sun & Saturn', instruction: 'Angle top of palm to scan Mount of Sun & Saturn for Career, Fame & Destiny traces.' },
  { icon: '🤲', title: '5. Non-Dominant Hand', instruction: 'Scan your non-dominant hand for latent karma potential comparison.' },
]

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
  avatar: '🧙',
  skills: ['Palmistry', 'Samudrik Shastra', 'Vedic Astrology', 'Gemology'],
})

function capturePhoto() {
  flashActive.value = true
  setTimeout(() => { flashActive.value = false }, 180)
  capturedPhotos.value[currentStep.value - 1] = createRealPalmDataUrl(currentStep.value - 1)
  if (currentStep.value < 5) {
    setTimeout(() => { currentStep.value++ }, 300)
  } else {
    setTimeout(() => { startScanning() }, 450)
  }
}

function retakeCurrentStep() { capturedPhotos.value[currentStep.value - 1] = null }
function selectStep(stepNum) { currentStep.value = stepNum }
function nextStep() {
  if (currentStep.value < 5) { currentStep.value++ }
  else { startScanning() }
}
function goBack() { router.push('/') }
function dismissModal() { phase.value = 'capture'; router.push('/') }

function startScanning() {
  phase.value = 'scanning'
  scanProgress.value = 0
  const logs = [
    'Mapping cyan neural network palm nodes...',
    'Analyzing Heart Line depth & emotional frequency...',
    'Calculating Head Line vector & analytical density...',
    'Detecting Life Line circumference & vitality index...',
    'Synthesizing 5-angle palm geometry vectors...',
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
      setTimeout(() => { phase.value = 'complete' }, 400)
    }
  }, 90)
}

function connectToAstroAi() { router.push('/astro-ai?mode=palm&scanned=true') }
function connectToHumanPalmist() { showConsultationSheet.value = true }
function onConsultationConfirmed() { showConsultationSheet.value = false; router.push('/live-chat') }
function resetScan() { capturedPhotos.value = [null, null, null, null, null]; currentStep.value = 1; phase.value = 'capture' }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap');

/* ── Root ─────────────────────────────────────────────────────────────── */
.psv-root {
  position: relative;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.85rem 0.85rem 1.2rem;
  box-sizing: border-box;
  overflow: hidden;
  color: #e2e8f0;
  font-family: 'Outfit', sans-serif;
}

/* ── Cosmic Background ────────────────────────────────────────────────── */
.psv-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 30% 0%, #060c1e 0%, #020610 60%, #010208 100%);
  z-index: 0;
}
.psv-bg-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(0,242,254,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,242,254,0.04) 1px, transparent 1px);
  background-size: 32px 32px;
}
.psv-bg-orb {
  position: absolute; border-radius: 50%;
  filter: blur(55px);
  animation: orbFloat 8s ease-in-out infinite alternate;
}
.orb-1 { width: 220px; height: 220px; top: -60px; left: -60px; background: radial-gradient(circle, rgba(0,242,254,0.12) 0%, transparent 70%); }
.orb-2 { width: 180px; height: 180px; bottom: 10%; right: -40px; background: radial-gradient(circle, rgba(79,172,254,0.09) 0%, transparent 70%); animation-delay: 2s; }
.orb-3 { width: 140px; height: 140px; top: 40%; left: 20%; background: radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%); animation-delay: 4s; }
@keyframes orbFloat { 0%{transform:translate(0,0) scale(1);} 100%{transform:translate(15px,-20px) scale(1.08);} }

.psv-header, .psv-steps, .psv-capture-phase, .psv-scanning-phase { position: relative; z-index: 1; }

/* ── Header ───────────────────────────────────────────────────────────── */
.psv-header {
  display: flex; align-items: center; gap: 0.55rem;
  padding: 0.45rem 0.65rem;
  background: linear-gradient(135deg, rgba(4,14,36,0.95) 0%, rgba(2,8,24,0.98) 100%);
  border: 1px solid rgba(0,242,254,0.2);
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 16px rgba(0,242,254,0.05);
  backdrop-filter: blur(12px);
  min-height: 48px;
}
.psv-back-btn {
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(0,242,254,0.08); border: 1px solid rgba(0,242,254,0.22);
  color: #00f2fe; display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: all 0.2s ease;
}
.psv-back-btn:hover { background: rgba(0,242,254,0.18); border-color: #00f2fe; }
.psv-back-btn svg { width: 14px; height: 14px; }
.psv-header-identity { display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; }
.psv-logo-ring {
  position: relative; width: 34px; height: 34px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.psv-logo-inner { font-size: 1rem; z-index: 2; position: relative; filter: drop-shadow(0 0 5px rgba(0,242,254,0.7)); }
.psv-logo-orbit { position: absolute; inset: 0; animation: rotateSlow 4s linear infinite; }
@keyframes rotateSlow { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }
.psv-title-stack { min-width: 0; }
.psv-title {
  font-size: 0.88rem; font-weight: 800; margin: 0; line-height: 1.1;
  background: linear-gradient(90deg, #fff 0%, #a5f3fc 60%, #38bdf8 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.psv-subtitle {
  display: flex; align-items: center; gap: 0.28rem;
  font-size: 0.58rem; color: rgba(165,243,252,0.7); margin-top: 0.05rem;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.psv-status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.dot-idle { background: #fbbf24; box-shadow: 0 0 4px #fbbf24; }
.dot-scan { background: #00f2fe; box-shadow: 0 0 5px #00f2fe; animation: dotBlink 1s ease infinite; }
.dot-done { background: #4ade80; box-shadow: 0 0 5px #4ade80; }
@keyframes dotBlink { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
.psv-badge {
  font-size: 0.58rem; font-weight: 800; white-space: nowrap;
  color: #00f2fe; background: rgba(0,242,254,0.1);
  border: 1px solid rgba(0,242,254,0.26); padding: 0.15rem 0.45rem; border-radius: 999px;
  transition: all 0.3s ease;
}
.badge-glow-scan { color: #38bdf8; background: rgba(56,189,248,0.15); border-color: rgba(56,189,248,0.4); box-shadow: 0 0 10px rgba(56,189,248,0.3); }
.badge-glow-done { color: #4ade80; background: rgba(74,222,128,0.12); border-color: rgba(74,222,128,0.35); box-shadow: 0 0 10px rgba(74,222,128,0.25); }

/* ── Step Pips ────────────────────────────────────────────────────────── */
.psv-steps {
  display: flex; align-items: center; gap: 0.4rem; padding: 0 0.1rem;
}
.psv-step-pip {
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(255,255,255,0.04); border: 1.5px solid rgba(0,242,254,0.18);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: all 0.25s ease;
}
.pip-num { font-size: 0.6rem; font-weight: 700; color: rgba(165,243,252,0.45); }
.pip-active { background: rgba(0,242,254,0.15); border-color: #00f2fe; box-shadow: 0 0 10px rgba(0,242,254,0.4); }
.pip-active .pip-num { color: #00f2fe; }
.pip-done { background: linear-gradient(135deg, #06b6d4, #0ea5e9); border-color: #06b6d4; }
.pip-done .pip-num { color: #fff; }
.psv-step-line { flex: 1; height: 3px; border-radius: 999px; background: rgba(0,242,254,0.08); overflow: hidden; }
.psv-step-line-fill {
  height: 100%; background: linear-gradient(90deg, #06b6d4, #00f2fe);
  border-radius: 999px; transition: width 0.4s ease; box-shadow: 0 0 6px rgba(0,242,254,0.5);
}

/* ── Capture Phase ────────────────────────────────────────────────────── */
.psv-capture-phase { display: flex; flex-direction: column; gap: 0.65rem; flex: 1; }

/* Viewfinder */
.psv-viewfinder {
  position: relative; flex: 1; min-height: 240px;
  background: rgba(4,14,36,0.88); border: 1px solid rgba(0,242,254,0.22);
  border-radius: 1.2rem; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  box-shadow: inset 0 0 30px rgba(0,0,0,0.5);
  transition: border-color 0.3s ease;
}
.psv-viewfinder.vf-captured { border-color: rgba(0,242,254,0.5); box-shadow: 0 0 20px rgba(0,242,254,0.08), inset 0 0 30px rgba(0,0,0,0.5); }

.vf-corner { position: absolute; width: 18px; height: 18px; border-color: #00f2fe; border-style: solid; z-index: 4; }
.vf-tl { top: 10px; left: 10px; border-width: 2px 0 0 2px; border-radius: 3px 0 0 0; }
.vf-tr { top: 10px; right: 10px; border-width: 2px 2px 0 0; border-radius: 0 3px 0 0; }
.vf-bl { bottom: 10px; left: 10px; border-width: 0 0 2px 2px; border-radius: 0 0 0 3px; }
.vf-br { bottom: 10px; right: 10px; border-width: 0 2px 2px 0; border-radius: 0 0 3px 0; }

.vf-scanline {
  position: absolute; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, #00f2fe, transparent);
  box-shadow: 0 0 12px rgba(0,242,254,0.6);
  animation: vfScan 2.2s ease-in-out infinite; z-index: 3;
}
@keyframes vfScan { 0%{top:10%;opacity:0;} 10%{opacity:1;} 90%{opacity:1;} 100%{top:90%;opacity:0;} }

.vf-flash { position: absolute; inset: 0; background: rgba(255,255,255,0.85); z-index: 10; animation: flashFade 0.18s ease-out forwards; }
@keyframes flashFade { 0%{opacity:1;} 100%{opacity:0;} }

.vf-captured-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.6; z-index: 1; }

.vf-guide-wrap { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 2; }
.vf-palm-svg { width: 52%; max-width: 200px; }
.vf-palm-outline { animation: outlinePulse 2s ease-in-out infinite; }
@keyframes outlinePulse { 0%,100%{opacity:0.65;filter:drop-shadow(0 0 4px rgba(0,242,254,0.4));} 50%{opacity:1;filter:drop-shadow(0 0 10px rgba(0,242,254,0.85));} }

.vf-instruction {
  position: absolute; bottom: 10px; left: 10px; right: 10px;
  display: flex; align-items: flex-start; gap: 0.45rem;
  background: rgba(4,14,36,0.88); backdrop-filter: blur(8px);
  border: 1px solid rgba(0,242,254,0.18); border-radius: 0.7rem;
  padding: 0.45rem 0.55rem; z-index: 5;
}
.vf-inst-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 0.05rem; }
.vf-inst-title { font-size: 0.66rem; font-weight: 700; color: #00f2fe; margin: 0 0 0.08rem; }
.vf-inst-desc { font-size: 0.57rem; color: rgba(165,243,252,0.65); margin: 0; line-height: 1.3; }

.vf-status-badge {
  position: absolute; top: 10px; right: 10px;
  display: flex; align-items: center; gap: 0.22rem;
  background: rgba(74,222,128,0.18); border: 1px solid rgba(74,222,128,0.38);
  color: #4ade80; font-size: 0.58rem; font-weight: 700;
  padding: 0.13rem 0.4rem; border-radius: 999px; z-index: 5;
}

/* Controls */
.psv-controls { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
.psv-ctrl-btn {
  display: flex; align-items: center; gap: 0.28rem;
  padding: 0.42rem 0.75rem; border-radius: 999px; cursor: pointer;
  font-size: 0.66rem; font-weight: 700; font-family: 'Outfit', sans-serif;
  transition: all 0.2s ease; min-width: 70px; justify-content: center;
}
.psv-ctrl-btn:disabled { opacity: 0.28; cursor: default; pointer-events: none; }
.psv-ctrl-btn svg { width: 13px; height: 13px; }
.retake-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.14); color: rgba(226,232,240,0.7); }
.retake-btn:not(:disabled):hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }
.next-btn { background: rgba(0,242,254,0.12); border: 1px solid rgba(0,242,254,0.32); color: #00f2fe; }
.next-btn:not(:disabled):hover { background: rgba(0,242,254,0.22); border-color: #00f2fe; box-shadow: 0 0 12px rgba(0,242,254,0.22); }

.psv-shutter {
  width: 62px; height: 62px; border-radius: 50%; cursor: pointer;
  position: relative; background: none; border: none; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.shutter-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 2.5px solid rgba(0,242,254,0.55);
  animation: shutterPulse 2s ease-in-out infinite;
}
.shutter-core {
  width: 44px; height: 44px; border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #38bdf8, #0284c7);
  box-shadow: 0 4px 16px rgba(0,242,254,0.5), inset 0 -2px 6px rgba(0,0,0,0.3);
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}
.psv-shutter:active .shutter-core { transform: scale(0.88); box-shadow: 0 2px 8px rgba(0,242,254,0.35); }
@keyframes shutterPulse { 0%,100%{transform:scale(1);opacity:0.65;} 50%{transform:scale(1.09);opacity:1;} }

/* Thumbnails */
.psv-thumb-strip { display: flex; gap: 0.42rem; justify-content: center; }
.psv-thumb {
  width: 44px; height: 44px; border-radius: 0.5rem; overflow: hidden;
  position: relative; cursor: pointer;
  border: 1.5px solid rgba(0,242,254,0.12);
  background: rgba(4,14,36,0.8);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
}
.psv-thumb.thumb-active { border-color: #00f2fe; box-shadow: 0 0 10px rgba(0,242,254,0.4); }
.psv-thumb.thumb-captured { border-color: rgba(74,222,128,0.4); }
.psv-thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb-num { font-size: 0.68rem; font-weight: 700; color: rgba(165,243,252,0.38); }
.thumb-check { position: absolute; bottom: 2px; right: 3px; font-size: 0.52rem; color: #4ade80; font-weight: 800; }

/* ── Scanning Phase ───────────────────────────────────────────────────── */
.psv-scanning-phase { flex: 1; display: flex; flex-direction: column; }

.scanner-card {
  flex: 1; position: relative;
  background: linear-gradient(160deg, rgba(4,14,36,0.96) 0%, rgba(2,8,22,0.99) 100%);
  border: 1px solid rgba(0,242,254,0.22);
  border-radius: 1.2rem;
  overflow: hidden;
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 1rem;
  padding: 1.4rem 1rem 1.1rem;
  box-shadow: 0 0 40px rgba(0,0,0,0.7), 0 0 24px rgba(0,242,254,0.07);
  min-height: 360px;
}

/* Circuit background */
.scanner-circuit-bg {
  position: absolute; inset: 0; width: 100%; height: 100%;
  z-index: 0; pointer-events: none;
}

/* Radial glow orb */
.scanner-glow-orb {
  position: absolute; width: 260px; height: 260px; border-radius: 50%;
  background: radial-gradient(circle, rgba(0,242,254,0.09) 0%, transparent 70%);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  animation: glowPulse 3s ease-in-out infinite; z-index: 0; pointer-events: none;
}
@keyframes glowPulse { 0%,100%{opacity:0.5; transform:translate(-50%,-50%) scale(1);} 50%{opacity:1; transform:translate(-50%,-50%) scale(1.08);} }

/* Palm image underlay */
.scanner-palm-underlay {
  position: absolute; width: 50%; height: 65%; object-fit: contain;
  opacity: 0.08; filter: saturate(0) brightness(3);
  top: 50%; left: 50%; transform: translate(-50%,-52%); z-index: 0;
}

/* ── Scanner Stage: horizontal row of [nodes | hand | nodes] ── */
.scanner-stage {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: center;
  gap: 0.6rem; width: 100%;
}

/* Hand wrap */
.scanner-hand-wrap {
  position: relative;
  width: 110px; height: 140px;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}

/* Rotating orbit ring around the hand */
.hand-orbit-ring {
  position: absolute; inset: -10px; border-radius: 50%;
  border: 1px solid rgba(0,242,254,0.3);
  border-top-color: #00f2fe;
  border-right-color: rgba(0,242,254,0.1);
  animation: orbitSpin 3s linear infinite;
  box-shadow: 0 0 10px rgba(0,242,254,0.2);
}
@keyframes orbitSpin { 0%{transform:rotate(0deg);} 100%{transform:rotate(360deg);} }

/* Hand SVG */
.hand-svg {
  width: 90px; height: 112px; position: relative; z-index: 2;
  filter: drop-shadow(0 0 8px rgba(0,242,254,0.6));
  animation: handBreathe 2.5s ease-in-out infinite alternate;
}
@keyframes handBreathe {
  0% { filter: drop-shadow(0 0 6px rgba(0,242,254,0.5)); transform: scale(1); }
  100% { filter: drop-shadow(0 0 18px rgba(0,242,254,0.95)); transform: scale(1.04); }
}

/* Animated stroke on hand outline */
.hand-path-anim {
  stroke-dasharray: 300;
  stroke-dashoffset: 0;
  animation: traceHand 4s ease-in-out infinite;
}
@keyframes traceHand {
  0% { stroke-dashoffset: 300; opacity: 0.4; }
  40% { stroke-dashoffset: 0; opacity: 1; }
  80% { stroke-dashoffset: 0; opacity: 1; }
  100% { stroke-dashoffset: -300; opacity: 0.4; }
}

/* Sweep scanline inside hand-wrap */
.scanner-sweep {
  position: absolute; left: -6px; right: -6px; height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(0,242,254,0.3) 15%, #00f2fe 50%, rgba(0,242,254,0.3) 85%, transparent 100%);
  box-shadow: 0 0 10px rgba(0,242,254,0.8), 0 0 20px rgba(0,242,254,0.4);
  animation: sweepDown 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  z-index: 3; border-radius: 2px;
}
@keyframes sweepDown {
  0%   { top: 4%;  opacity: 0; }
  8%   { opacity: 1; }
  92%  { opacity: 1; }
  100% { top: 96%; opacity: 0; }
}

/* ── Neural Node Callouts ── */
/* Left nodes (heart, head) */
.scan-node {
  display: flex; align-items: center; gap: 5px;
  opacity: 0; transition: opacity 0.6s ease;
  flex-shrink: 0;
}
.scan-node.node-detected { opacity: 1; }

/* Left side: dot first, then label */
.node-heart { flex-direction: row; align-self: flex-start; margin-top: 20px; }
.node-head  { flex-direction: row; align-self: flex-end;   margin-bottom: 14px; }

/* Right side: label first, then dot */
.node-life.node-right  { flex-direction: row-reverse; align-self: flex-start; margin-top: 20px; }
.node-fate.node-right  { flex-direction: row-reverse; align-self: flex-end;   margin-bottom: 14px; }

/* Column of left nodes */
.scanner-stage > .node-heart,
.scanner-stage > .node-head {
  /* stack them in left column via flex column wrapper (we use a trick below) */
}

/* Left node column */
.scan-node.node-heart,
.scan-node.node-head {
  min-width: 90px; justify-content: flex-end;
}
.scan-node.node-life,
.scan-node.node-fate {
  min-width: 90px; justify-content: flex-start;
}

.node-dot {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  background: #00f2fe;
  box-shadow: 0 0 6px #00f2fe, 0 0 12px rgba(0,242,254,0.5);
  animation: nodePulse 1.4s ease-in-out infinite;
}
@keyframes nodePulse { 0%,100%{transform:scale(1); box-shadow:0 0 6px #00f2fe;} 50%{transform:scale(1.5); box-shadow:0 0 14px #00f2fe, 0 0 28px rgba(0,242,254,0.6);} }

.node-line {
  display: block; height: 1px; width: 18px; flex-shrink: 0;
  background: linear-gradient(90deg, transparent, rgba(0,242,254,0.5));
}
.node-right .node-line {
  background: linear-gradient(270deg, transparent, rgba(0,242,254,0.5));
}

.node-label {
  font-size: 0.5rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  color: #a5f3fc; white-space: nowrap;
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 8px rgba(0,242,254,0.5);
}

/* Left and right column wrappers - we use flex-col on scanner-stage children */
.scanner-stage {
  flex-direction: row;
  align-items: stretch;
}
/* Wrap left nodes in an implicit column via nth-child */
.scanner-stage > .scan-node:nth-child(1),
.scanner-stage > .scan-node:nth-child(2) {
  /* These are positioned by flex row naturally */
}

/* Status row */
.scanner-status-row {
  display: flex; align-items: center; gap: 0.5rem; z-index: 2;
}
.status-pip {
  width: 6px; height: 6px; border-radius: 50%;
  background: #00f2fe; box-shadow: 0 0 6px #00f2fe;
  animation: dotBlink 1s ease infinite;
}
.scanner-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.52rem; font-weight: 600;
  color: rgba(0,242,254,0.6); letter-spacing: 0.08em; text-transform: uppercase;
}
.scanner-label-sep { color: rgba(0,242,254,0.25); font-size: 0.45rem; }

/* Telemetry */
.scanner-telemetry {
  width: 100%; max-width: 280px; z-index: 2;
  background: rgba(4,14,36,0.85);
  border: 1px solid rgba(0,242,254,0.18);
  border-radius: 0.65rem;
  padding: 0.55rem 0.7rem;
  backdrop-filter: blur(4px);
}
.telemetry-top { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.45rem; }
.telemetry-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #00f2fe; box-shadow: 0 0 6px #00f2fe; flex-shrink: 0;
  animation: dotBlink 1s ease infinite;
}
.telemetry-text {
  flex: 1; font-family: 'JetBrains Mono', monospace;
  font-size: 0.52rem; color: rgba(165,243,252,0.85); line-height: 1.3;
}
.telemetry-pct {
  font-size: 0.68rem; font-weight: 800; color: #00f2fe;
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 8px rgba(0,242,254,0.5);
}
.telemetry-track {
  height: 4px; border-radius: 999px;
  background: rgba(0,242,254,0.08); overflow: visible;
}
.telemetry-fill {
  height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, #0284c7, #06b6d4, #00f2fe);
  box-shadow: 0 0 10px rgba(0,242,254,0.7);
  transition: width 0.25s ease; position: relative;
}
.telemetry-glow-tip {
  position: absolute; right: -5px; top: 50%; transform: translateY(-50%);
  width: 10px; height: 10px; border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 2px #00f2fe, 0 0 14px #00f2fe;
}

/* ── Result Sheet ─────────────────────────────────────────────────────── */
.psv-sheet-backdrop {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
  display: flex; align-items: flex-end;
}
.psv-sheet {
  width: 100%; max-height: 88vh; overflow-y: auto;
  background: linear-gradient(160deg, #060c1e 0%, #030812 100%);
  border: 1px solid rgba(0,242,254,0.18); border-bottom: none;
  border-radius: 1.4rem 1.4rem 0 0;
  padding: 0.7rem 0.95rem 2rem;
  display: flex; flex-direction: column; gap: 0.8rem; position: relative;
  box-shadow: 0 -8px 40px rgba(0,0,0,0.6), 0 -4px 20px rgba(0,242,254,0.05);
}
.sheet-handle { width: 36px; height: 4px; border-radius: 999px; background: rgba(255,255,255,0.14); margin: 0 auto 0.25rem; }
.sheet-close {
  position: absolute; top: 0.85rem; right: 0.9rem;
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.14);
  color: rgba(226,232,240,0.65); font-size: 0.68rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;
}
.sheet-close:hover { background: rgba(255,255,255,0.15); color: #fff; }

.sheet-header { display: flex; align-items: center; gap: 0.7rem; }
.sheet-icon-wrap {
  position: relative; width: 44px; height: 44px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.sheet-icon-glyph { font-size: 1.35rem; z-index: 2; position: relative; }
.sheet-icon-ring {
  position: absolute; inset: -2px; border-radius: 50%;
  background: conic-gradient(from 0deg, #00f2fe, #4facfe, #38bdf8, #00f2fe);
  animation: rotateSlow 3s linear infinite; opacity: 0.65;
  -webkit-mask: radial-gradient(circle, transparent 58%, black 59%);
  mask: radial-gradient(circle, transparent 58%, black 59%);
}
.sheet-badge {
  display: inline-flex; font-size: 0.54rem; font-weight: 800; letter-spacing: 0.06em;
  color: #00f2fe; background: rgba(0,242,254,0.1);
  border: 1px solid rgba(0,242,254,0.28); border-radius: 999px;
  padding: 0.1rem 0.42rem; margin-bottom: 0.22rem;
}
.sheet-title {
  font-size: 1rem; font-weight: 800; margin: 0; line-height: 1.2;
  background: linear-gradient(90deg, #fff, #a5f3fc);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
}
.sheet-desc { font-size: 0.6rem; color: rgba(165,243,252,0.62); margin: 0.12rem 0 0; }

.choice-card {
  position: relative; overflow: hidden;
  display: flex; align-items: center; gap: 0.7rem;
  padding: 0.78rem; border-radius: 0.95rem; cursor: pointer;
  transition: all 0.2s ease;
}
.choice-card-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.choice-ai { background: rgba(0,242,254,0.04); border: 1px solid rgba(0,242,254,0.18); }
.choice-ai .choice-card-bg { background: linear-gradient(135deg, rgba(0,242,254,0.04) 0%, transparent 60%); }
.choice-ai:hover { border-color: rgba(0,242,254,0.42); background: rgba(0,242,254,0.08); box-shadow: 0 4px 20px rgba(0,242,254,0.1); transform: translateY(-1px); }
.choice-human { background: rgba(168,85,247,0.04); border: 1px solid rgba(168,85,247,0.18); }
.choice-human .choice-card-bg { background: linear-gradient(135deg, rgba(168,85,247,0.04) 0%, transparent 60%); }
.choice-human:hover { border-color: rgba(168,85,247,0.42); background: rgba(168,85,247,0.08); box-shadow: 0 4px 20px rgba(168,85,247,0.1); transform: translateY(-1px); }

.choice-left { display: flex; align-items: center; gap: 0.62rem; flex: 1; min-width: 0; z-index: 1; }
.choice-avatar { width: 40px; height: 40px; border-radius: 0.6rem; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
.ai-avatar { background: rgba(0,242,254,0.1); border: 1px solid rgba(0,242,254,0.22); }
.human-avatar { background: rgba(168,85,247,0.1); border: 1px solid rgba(168,85,247,0.22); }
.choice-info { min-width: 0; }
.choice-name { font-size: 0.78rem; font-weight: 800; margin: 0 0 0.1rem; color: #f1f5f9; }
.choice-detail { font-size: 0.58rem; color: rgba(226,232,240,0.58); margin: 0 0 0.18rem; }
.choice-tag { display: inline-block; font-size: 0.53rem; font-weight: 700; padding: 0.09rem 0.38rem; border-radius: 999px; }
.tag-ai { background: rgba(0,242,254,0.1); color: #00f2fe; border: 1px solid rgba(0,242,254,0.22); }
.tag-human { background: rgba(168,85,247,0.1); color: #c084fc; border: 1px solid rgba(168,85,247,0.22); }
.choice-btn { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; z-index: 1; }
.choice-btn svg { width: 13px; height: 13px; }
.btn-ai { background: rgba(0,242,254,0.12); border: 1px solid rgba(0,242,254,0.32); color: #00f2fe; }
.btn-human { background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.32); color: #c084fc; }

.sheet-retake-btn {
  text-align: center; background: none; border: none;
  font-size: 0.66rem; font-weight: 600; color: rgba(165,243,252,0.5);
  cursor: pointer; padding: 0.5rem; font-family: 'Outfit', sans-serif;
  transition: color 0.2s ease;
}
.sheet-retake-btn:hover { color: rgba(165,243,252,0.88); }

/* Sheet slide transition */
.sheet-slide-enter-active, .sheet-slide-leave-active { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease; }
.sheet-slide-enter-from, .sheet-slide-leave-to { transform: translateY(100%); opacity: 0; }
</style>
