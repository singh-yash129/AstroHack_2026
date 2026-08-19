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

      <!-- AI Palm Scanner Animated Card -->
      <div class="scanner-card">

        <!-- background circuit lines + nodes -->
        <svg class="circuit-bg" viewBox="0 0 480 380" aria-hidden="true">
          <g stroke="#2e5f7a" stroke-width="1.3" fill="none" opacity="0.5">
            <path d="M0 40 L50 40 L78 66 L130 66"/>
            <path d="M0 130 L35 130 L58 108 L100 108"/>
            <path d="M0 230 L48 230 L72 252 L125 252"/>
            <path d="M0 320 L40 320 L62 298 L110 298"/>
            <path d="M480 40 L430 40 L402 66 L350 66"/>
            <path d="M480 130 L445 130 L422 108 L380 108"/>
            <path d="M480 230 L432 230 L408 252 L355 252"/>
            <path d="M480 320 L440 320 L418 298 L370 298"/>
            <path d="M150 0 L150 30 L178 50"/>
            <path d="M240 0 L240 20"/>
            <path d="M330 0 L330 30 L302 50"/>
            <path d="M160 380 L160 350 L188 330"/>
            <path d="M320 380 L320 350 L292 330"/>
          </g>
          <g fill="#4fd8ff" opacity="0.85">
            <circle cx="130" cy="66" r="3.2"/><circle cx="100" cy="108" r="3.2"/>
            <circle cx="125" cy="252" r="3.2"/><circle cx="110" cy="298" r="3.2"/>
            <circle cx="350" cy="66" r="3.2"/><circle cx="380" cy="108" r="3.2"/>
            <circle cx="355" cy="252" r="3.2"/><circle cx="370" cy="298" r="3.2"/>
            <circle cx="178" cy="50" r="3.2"/><circle cx="240" cy="20" r="3.2"/><circle cx="302" cy="50" r="3.2"/>
            <circle cx="188" cy="330" r="3.2"/><circle cx="292" cy="330" r="3.2"/>
          </g>
        </svg>

        <!-- radial glow pulse -->
        <div class="glow-div"></div>

        <!-- Real captured palm image underlay if available -->
        <img v-if="capturedPhotos[0]" :src="capturedPhotos[0]" alt="Captured Palm Underlay" class="palm-underlay-img" />

        <!-- hand: outline + mesh fill + scanning line, all built from the same icon glyph -->
        <div class="hand-wrap">
          <i class="ti ti-hand-stop hand-outline" aria-hidden="true"></i>
          <i class="ti ti-hand-stop hand-mesh" aria-hidden="true"></i>
          <i class="ti ti-hand-stop hand-scanline" aria-hidden="true"></i>

          <!-- Fallback SVG hand glyph if icon font is loading -->
          <svg class="hand-fallback-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M8 13v-7.5a1.5 1.5 0 0 1 3 0v6.5 M11 11.5v-2a1.5 1.5 0 0 1 3 0v2 M14 10.5v-1.5a1.5 1.5 0 0 1 3 0v1.5 M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-3.7 -5.7a1 1 0 0 1 .15 -1.25a1 1 0 0 1 1.252 -.15l2.3 1.6v-8.5a1.5 1.5 0 0 1 3 0v7.5" stroke="#8fe8ff" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

          <!-- Neural Network Callout Overlay Nodes -->
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
              <span class="node-label cyan-label">Fate Line &bull; Destiny Shift</span>
            </div>
          </div>
        </div>

        <div class="status-block scanner-font">
          <span class="status-title">scanning palm</span>
          <span class="status-sub">neural mesh — active</span>
        </div>

        <!-- Telemetry Diagnostics Bar -->
        <div class="telemetry-box cyan-telemetry">
          <div class="telemetry-header scanner-font">
            <span class="pulse-dot cyan-dot" />
            <span class="telemetry-log-text">{{ telemetryStatus }}</span>
            <span class="percent cyan-percent">{{ Math.floor(scanProgress) }}%</span>
          </div>

          <div class="telemetry-progress-track">
            <div class="telemetry-progress-fill cyan-fill" :style="{ width: scanProgress + '%' }" />
          </div>
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

/* ── Phase 2: AI Palm Scanner (Neural Mesh Animation) ─────────────── */
.scanner-font {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
}

@keyframes scanmove {
  0%   { background-position-y: -120%; }
  100% { background-position-y: 220%; }
}

@keyframes pulseglow {
  0%, 100% { opacity: 0.55; transform: scale(1); }
  50%      { opacity: 0.85; transform: scale(1.06); }
}

.scanning-container {
  display: flex; flex-direction: column; gap: 1rem; flex: 1; align-items: center; justify-content: center;
}

.scanner-card {
  background: #12151c;
  border-radius: 16px;
  padding: 1.75rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(143, 232, 255, 0.25);
  box-shadow: 0 20px 45px rgba(0,0,0,0.65), 0 0 35px rgba(79, 216, 255, 0.18);
  box-sizing: border-box;
}

.circuit-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.glow-div {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 250px;
  height: 250px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(79,216,255,0.85) 0%,
    rgba(31,111,191,0.4) 45%,
    rgba(18,21,28,0) 75%);
  animation: pulseglow 2.6s ease-in-out infinite;
  z-index: 1;
  pointer-events: none;
}

.palm-underlay-img {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 220px; height: 220px;
  object-fit: cover;
  border-radius: 50%;
  opacity: 0.25;
  mix-blend-mode: screen;
  z-index: 1;
  pointer-events: none;
  filter: contrast(1.2) brightness(0.9);
}

.hand-wrap {
  position: relative;
  width: 240px;
  height: 240px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hand-wrap i {
  position: absolute;
  font-size: 210px;
  line-height: 1;
  color: transparent;
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}

.hand-outline {
  -webkit-text-stroke: 2px #8fe8ff;
  text-stroke: 2px #8fe8ff;
}

.hand-mesh {
  background-image:
    repeating-linear-gradient(0deg, rgba(143,232,255,0.55) 0px, rgba(143,232,255,0.55) 1px, transparent 1px, transparent 11px),
    repeating-linear-gradient(90deg, rgba(143,232,255,0.45) 0px, rgba(143,232,255,0.45) 1px, transparent 1px, transparent 11px);
  background-clip: text;
  -webkit-background-clip: text;
}

.hand-scanline {
  background-image: linear-gradient(180deg,
    transparent 0%, transparent 44%,
    rgba(220,250,255,0.95) 50%,
    transparent 56%, transparent 100%);
  background-size: 100% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: scanmove 2.4s linear infinite;
}

.hand-fallback-svg {
  position: absolute;
  width: 170px; height: 170px;
  pointer-events: none;
  opacity: 0.35;
  filter: drop-shadow(0 0 8px rgba(143,232,255,0.6));
}

.status-block {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  text-align: center;
}

.status-title {
  font-size: 14px;
  font-weight: 600;
  color: #DFFBFC;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.status-sub {
  font-size: 11px;
  color: rgba(94,234,240,0.68);
}

.scan-overlay-grid { position: absolute; inset: 0; z-index: 20; pointer-events: none; }
.vector-node.cyan-node {
  position: absolute; display: flex; align-items: center; gap: 0.4rem;
  opacity: 0; transition: opacity 0.4s ease;
}
.vector-node.cyan-node.detected { opacity: 1; }
.node-heart { top: 22%; left: 5%; }
.node-head  { top: 44%; left: 10%; }
.node-life  { top: 66%; left: 24%; }
.node-fate  { top: 52%; right: 5%; }

.node-pulse.cyan-pulse {
  width: 9px; height: 9px; border-radius: 50%;
  background: #00f2fe; box-shadow: 0 0 10px #00f2fe; flex-shrink: 0;
}
.node-label.cyan-label {
  font-size: 0.58rem; font-weight: 700; color: #f1f5f9;
  background: rgba(9, 14, 26, 0.92); padding: 2px 6px; border-radius: 4px;
  border: 1px solid rgba(6, 182, 212, 0.4); white-space: nowrap;
}

.telemetry-box.cyan-telemetry {
  position: relative; z-index: 2; width: 100%;
  background: rgba(9, 14, 26, 0.9); border: 1px solid rgba(6, 182, 212, 0.35);
  border-radius: 0.85rem; padding: 0.75rem 0.85rem; box-sizing: border-box;
}
.telemetry-header {
  display: flex; align-items: center; gap: 0.5rem; font-size: 0.65rem; font-weight: 700; color: #22d3ee;
  margin-bottom: 0.5rem;
}
.telemetry-log-text {
  flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.64rem;
}
.pulse-dot.cyan-dot { width: 6px; height: 6px; border-radius: 50%; background: #00f2fe; box-shadow: 0 0 8px #00f2fe; flex-shrink: 0; }
.percent.cyan-percent { color: #00f2fe; font-weight: 800; font-size: 0.72rem; }

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
