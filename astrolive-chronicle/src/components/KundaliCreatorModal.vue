<template>
  <Teleport to="#phone-screen">
    <Transition name="sheet-slide">
      <div v-if="isOpen" class="kc-backdrop" @click.self="emit('close')">
        <div class="kc-card">

          <!-- Drag Handle -->
          <div class="kc-handle" />

          <!-- Close Button -->
          <button class="kc-close-btn" @click="emit('close')" aria-label="Close Modal">✕</button>

          <!-- ═══════════════════════════════════════════════════════════
               SMART STEP 0: SAVED KUNDALIS LIST (WHEN PREVIOUS CHARTS EXIST)
          ════════════════════════════════════════════════════════════ -->
          <div v-if="step === 'list'" class="kc-step-list">

            <div class="kc-header">
              <span class="kc-chip">🪐 SAVED KUNDALIS ({{ store.savedKundalis.length }})</span>
              <h2 class="kc-title">Your Generated Charts</h2>
              <p class="kc-subtitle">View, download PDF, or delete previous birth charts.</p>
            </div>

            <!-- List of Saved Kundalis -->
            <div class="saved-kundalis-scroll">
              <div
                v-for="chart in store.savedKundalis"
                :key="chart.id"
                class="kundali-list-card"
              >
                <div class="kl-icon">🪐</div>
                <div class="kl-main">
                  <div class="kl-top-row">
                    <h4 class="kl-name">{{ chart.name }}</h4>
                    <span class="kl-relation">{{ chart.relation }}</span>
                  </div>
                  <p class="kl-sub">{{ chart.lagna }} &bull; {{ chart.moonSign }}</p>
                  <span class="kl-gen">{{ chart.generatorType }} &bull; {{ chart.createdAt }}</span>
                </div>

                <div class="kl-actions">
                  <!-- View & PDF button -->
                  <button class="kl-btn btn-view" @click="viewKundali(chart)" title="View Chart & PDF">
                    <span>View &bull; PDF</span>
                  </button>
                  <!-- Delete button -->
                  <button class="kl-btn btn-delete" @click="deleteSavedKundali(chart.id, chart.name)" title="Delete Chart">
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            <!-- Big + Generate New Kundali Button -->
            <button class="submit-kc-btn" @click="openForm">
              <span>+ Generate New Kundali</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

          </div>

          <!-- ═══════════════════════════════════════════════════════════
               STEP 1 & 2: FORM & GENERATOR SELECTION
          ════════════════════════════════════════════════════════════ -->
          <div v-else-if="step === 'form'" class="kc-step-form">

            <div class="kc-header">
              <div class="header-top-nav" v-if="store.savedKundalis.length > 0">
                <button class="back-to-list-btn" @click="step = 'list'">
                  &larr; Back to Saved Charts ({{ store.savedKundalis.length }})
                </button>
              </div>
              <span class="kc-chip">🪐 VEDIC KUNDALI CREATOR</span>
              <h2 class="kc-title">Generate Birth Chart</h2>
              <p class="kc-subtitle">Enter exact birth details to calculate Sidereal Lagna &amp; D9 Navamsha chart.</p>
            </div>

            <form class="kc-form" @submit.prevent="proceedToGeneration">

              <!-- Name & Relation -->
              <div class="form-row">
                <div class="form-group flex-2">
                  <label class="form-label">Full Name *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-input"
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Relation</label>
                  <select v-model="form.relation" class="form-input form-select">
                    <option>Self</option>
                    <option>Spouse</option>
                    <option>Child</option>
                    <option>Friend</option>
                    <option>Parent</option>
                  </select>
                </div>
              </div>

              <!-- DOB & TOB -->
              <div class="form-row">
                <div class="form-group flex-1">
                  <label class="form-label">Date of Birth *</label>
                  <input
                    v-model="form.dob"
                    type="date"
                    class="form-input"
                    required
                  />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Time of Birth *</label>
                  <input
                    v-model="form.tob"
                    type="time"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <!-- POB & Gender -->
              <div class="form-row">
                <div class="form-group flex-2">
                  <label class="form-label">Place of Birth (City/Country) *</label>
                  <input
                    v-model="form.pob"
                    type="text"
                    class="form-input"
                    placeholder="e.g. New Delhi, India"
                    required
                  />
                </div>
                <div class="form-group flex-1">
                  <label class="form-label">Gender</label>
                  <select v-model="form.gender" class="form-input form-select">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <!-- Generator Mode Selection -->
              <div class="generator-select-label">
                <span>SELECT KUNDALI GENERATOR</span>
              </div>

              <div class="generator-options">
                <!-- Option A: AI Generator -->
                <div
                  class="gen-option"
                  :class="{ 'selected': generatorType === 'ai' }"
                  @click="generatorType = 'ai'"
                >
                  <div class="gen-icon">🤖</div>
                  <div class="gen-info">
                    <h4>Instant AI Kundali</h4>
                    <p>Free sidereal chart, D1/D9 charts &amp; PDF download.</p>
                    <span class="gen-badge badge-free">⚡ FREE &bull; Instant</span>
                  </div>
                </div>

                <!-- Option B: Expert Astrologer Handcrafted -->
                <div
                  class="gen-option"
                  :class="{ 'selected': generatorType === 'astrologer' }"
                  @click="generatorType = 'astrologer'"
                >
                  <div class="gen-icon">🔮</div>
                  <div class="gen-info">
                    <h4>Certified Astrologer Kundali</h4>
                    <p>Hand-verified by Pandit Rameshwar. In-depth Dasha advice.</p>
                    <span class="gen-badge badge-paid">⭐ ₹199 / 199 Coins</span>
                  </div>
                </div>
              </div>

              <button type="submit" class="submit-kc-btn">
                <span>Generate Kundali &amp; PDF</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

            </form>

          </div>

          <!-- ═══════════════════════════════════════════════════════════
               STEP 3: CALCULATION & PLANETARY MATRIX ANIMATION
          ════════════════════════════════════════════════════════════ -->
          <div v-else-if="step === 'generating'" class="kc-step-generating">

            <div class="gen-animation-container">
              <div class="gen-orb" />
              <div class="gen-spin-ring" />
              <span class="gen-symbol">🪐</span>
            </div>

            <h3 class="gen-status-title">Synthesizing Sidereal Chart</h3>
            <p class="gen-status-log">{{ telemetryLog }}</p>

            <div class="gen-progress-track">
              <div class="gen-progress-fill" :style="{ width: progress + '%' }" />
            </div>

          </div>

          <!-- ═══════════════════════════════════════════════════════════
               STEP 4: GENERATED KUNDALI CHART VIEW & DOWNLOAD PDF
          ════════════════════════════════════════════════════════════ -->
          <div v-else-if="step === 'result'" class="kc-step-result">

            <div class="result-nav-bar" v-if="store.savedKundalis.length > 0">
              <button class="back-to-list-btn" @click="step = 'list'">
                &larr; Back to Saved Kundalis
              </button>
            </div>

            <div class="result-top-bar">
              <span class="result-badge">✓ KUNDALI CREATED &amp; SAVED</span>
              <span class="result-gen-tag">{{ generatedKundali.generatorType }}</span>
            </div>

            <h2 class="result-person-name">{{ generatedKundali.name }}</h2>
            <p class="result-person-meta">
              {{ generatedKundali.dob }} &bull; {{ generatedKundali.tob }} &bull; {{ generatedKundali.pob }}
            </p>

            <!-- Diamond Kundali SVG Graphic -->
            <div class="kundali-chart-card">
              <svg viewBox="0 0 300 300" class="diamond-chart-svg">
                <rect x="15" y="15" width="270" height="270" fill="none" stroke="#fbbf24" stroke-width="2.5" />
                <line x1="15" y1="15" x2="285" y2="285" stroke="rgba(251,191,36,0.6)" stroke-width="1.5" />
                <line x1="285" y1="15" x2="15" y2="285" stroke="rgba(251,191,36,0.6)" stroke-width="1.5" />
                <polygon points="150,15 285,150 150,285 15,150" fill="none" stroke="#fbbf24" stroke-width="2" />

                <!-- House Numbers & Planetary Placements -->
                <text x="150" y="80" text-anchor="middle" fill="#fbbf24" font-size="12" font-weight="bold">1 (Asc)</text>
                <text x="150" y="100" text-anchor="middle" fill="#f1f5f9" font-size="11">Su, Me</text>

                <text x="80" y="50" text-anchor="middle" fill="#fbbf24" font-size="11">2</text>
                <text x="80" y="65" text-anchor="middle" fill="#94a3b8" font-size="10">Ve</text>

                <text x="50" y="80" text-anchor="middle" fill="#fbbf24" font-size="11">3</text>
                <text x="50" y="95" text-anchor="middle" fill="#94a3b8" font-size="10">Ma</text>

                <text x="80" y="150" text-anchor="middle" fill="#fbbf24" font-size="11">4</text>
                <text x="80" y="165" text-anchor="middle" fill="#94a3b8" font-size="10">Ju</text>

                <text x="50" y="210" text-anchor="middle" fill="#fbbf24" font-size="11">5</text>
                <text x="80" y="240" text-anchor="middle" fill="#fbbf24" font-size="11">6</text>

                <text x="150" y="220" text-anchor="middle" fill="#fbbf24" font-size="11">7</text>
                <text x="150" y="240" text-anchor="middle" fill="#f1f5f9" font-size="11">Mo (Scorpio)</text>

                <text x="220" y="240" text-anchor="middle" fill="#fbbf24" font-size="11">8</text>
                <text x="250" y="210" text-anchor="middle" fill="#fbbf24" font-size="11">9</text>
                <text x="220" y="150" text-anchor="middle" fill="#fbbf24" font-size="11">10</text>
                <text x="220" y="165" text-anchor="middle" fill="#94a3b8" font-size="10">Sa (Saturn)</text>
                <text x="250" y="80" text-anchor="middle" fill="#fbbf24" font-size="11">11</text>
                <text x="220" y="50" text-anchor="middle" fill="#fbbf24" font-size="11">12</text>
              </svg>
            </div>

            <!-- Key Sign Breakdown Grid -->
            <div class="sign-grid">
              <div class="sign-box">
                <span class="sign-lbl">Ascendant (Lagna)</span>
                <span class="sign-val">{{ generatedKundali.lagna }}</span>
              </div>
              <div class="sign-box">
                <span class="sign-lbl">Moon Sign (Rashi)</span>
                <span class="sign-val">{{ generatedKundali.moonSign }}</span>
              </div>
              <div class="sign-box">
                <span class="sign-lbl">Sun Sign</span>
                <span class="sign-val">{{ generatedKundali.sunSign }}</span>
              </div>
              <div class="sign-box">
                <span class="sign-lbl">Mahadasha</span>
                <span class="sign-val">{{ generatedKundali.dasha }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="result-actions-row">
              <button class="result-btn btn-download" @click="downloadPdf">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Download PDF Report</span>
              </button>

              <button class="result-btn btn-ai" @click="askAstroAi">
                <span>Ask AI About Chart</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            <button class="generate-another-btn" @click="openForm">
              + Generate Another Kundali
            </button>

          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useChronicleStore } from '../stores/chronicle.js'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
const router = useRouter()
const store = useChronicleStore()

// ── State ──────────────────────────────────────────────────────────────────
const step = ref('list') // 'list' | 'form' | 'generating' | 'result'
const generatorType = ref('ai') // 'ai' | 'astrologer'
const progress = ref(0)
const telemetryLog = ref('Calculating Sidereal planetary longitudes…')

const form = reactive({
  name: '',
  relation: 'Self',
  dob: '',
  tob: '',
  pob: '',
  gender: 'Male',
})

const generatedKundali = ref(null)

// Smart watch: when modal opens, default to list if charts exist, else form
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      if (store.savedKundalis.length > 0) {
        step.value = 'list'
      } else {
        step.value = 'form'
      }
    }
  },
  { immediate: true }
)

function openForm() {
  step.value = 'form'
}

function viewKundali(kundali) {
  generatedKundali.value = kundali
  step.value = 'result'
}

function deleteSavedKundali(id, name) {
  if (confirm(`Are you sure you want to delete Kundali for ${name}?`)) {
    store.deleteKundali(id)
    if (store.savedKundalis.length === 0) {
      step.value = 'form'
    }
  }
}

// ── Form Actions ───────────────────────────────────────────────────────────
function proceedToGeneration() {
  step.value = 'generating'
  progress.value = 0

  const logs = [
    'Calculating Sidereal Ascendant (Lagna) degrees…',
    'Extracting Moon Nakshatra & Dasha timeline…',
    'Constructing D-1 Birth & D-9 Navamsha charts…',
    'Cross-referencing 2026 planetary transits…',
    'Synthesizing Kundali PDF Document…',
    'Kundali Generation Complete!',
  ]

  let idx = 0
  const interval = setInterval(() => {
    progress.value += 6
    if (progress.value % 20 === 0 && idx < logs.length) {
      telemetryLog.value = logs[idx]
      idx++
    }

    if (progress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        finishGeneration()
      }, 400)
    }
  }, 80)
}

function finishGeneration() {
  const newChart = {
    id: 'k-' + Date.now(),
    name: form.name || 'Personal Chart',
    relation: form.relation,
    dob: form.dob || '1996-08-15',
    tob: form.tob || '10:30 AM',
    pob: form.pob || 'Delhi, India',
    gender: form.gender,
    lagna: 'Scorpio (Vrischika)',
    sunSign: 'Leo (Simha)',
    moonSign: 'Taurus (Rohini)',
    nakshatra: 'Rohini — Pada 3',
    dasha: 'Jupiter (2024–2040)',
    generatorType: generatorType.value === 'ai' ? 'AI Generated' : 'Handcrafted by Pandit Rameshwar',
  }

  generatedKundali.value = newChart
  store.addKundali(newChart)
  step.value = 'result'
}

function downloadPdf() {
  const pdfContent = `
=====================================================
          ASTROLIVE VEDIC KUNDALI REPORT
=====================================================
Name: ${generatedKundali.value.name}
Relation: ${generatedKundali.value.relation}
Date of Birth: ${generatedKundali.value.dob}
Time of Birth: ${generatedKundali.value.tob}
Place of Birth: ${generatedKundali.value.pob}
Gender: ${generatedKundali.value.gender}

-- SIDEREAL PLANETARY POSITIONS --
Ascendant (Lagna): ${generatedKundali.value.lagna}
Sun Sign: ${generatedKundali.value.sunSign}
Moon Sign: ${generatedKundali.value.moonSign}
Nakshatra: ${generatedKundali.value.nakshatra}
Current Mahadasha: ${generatedKundali.value.dasha}
Generator: ${generatedKundali.value.generatorType}

Generated on AstroLive Platform.
=====================================================
  `

  const blob = new Blob([pdfContent], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Kundali_${generatedKundali.value.name.replace(/\s+/g, '_')}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function askAstroAi() {
  emit('close')
  router.push('/astro-ai')
}
</script>

<style scoped>
.kc-backdrop {
  position: absolute; inset: 0; z-index: 9999;
  background: rgba(4, 2, 14, 0.78);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  display: flex; flex-direction: column; justify-content: flex-end;
}

.kc-card {
  position: relative; width: 100%;
  background: linear-gradient(160deg, #120926 0%, #060914 100%);
  border-top: 1px solid rgba(251, 191, 36, 0.35);
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1rem 1.15rem 1.75rem;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.8), 0 -1px 0 rgba(251, 191, 36, 0.3);
  display: flex; flex-direction: column; gap: 0.85rem;
  box-sizing: border-box; max-height: 90%; overflow-y: auto;
}

.kc-handle {
  width: 42px; height: 4px; border-radius: 99px;
  background: rgba(255,255,255,0.25); margin: 0 auto 0.2rem;
}

.kc-close-btn {
  position: absolute; top: 12px; right: 14px;
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  color: #f1f5f9; font-size: 0.85rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background 0.2s; z-index: 30;
}
.kc-close-btn:hover { background: rgba(255,255,255,0.2); }

.kc-header { text-align: center; margin-bottom: 0.5rem; }
.header-top-nav { text-align: left; margin-bottom: 0.4rem; }
.back-to-list-btn {
  background: transparent; border: none; color: #a78bfa;
  font-size: 0.68rem; font-weight: 700; cursor: pointer; padding: 0;
}
.back-to-list-btn:hover { color: #c084fc; }

.kc-chip {
  font-size: 0.62rem; font-weight: 800; color: #fbbf24;
  background: rgba(251, 191, 36, 0.12); border: 1px solid rgba(251, 191, 36, 0.3);
  padding: 0.2rem 0.65rem; border-radius: 999px; display: inline-block;
}
.kc-title {
  font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 800;
  color: #f1f5f9; margin-top: 0.2rem; line-height: 1.1;
}
.kc-subtitle {
  font-size: 0.68rem; color: rgba(226,232,240,0.65); line-height: 1.25; margin-top: 0.15rem;
}

/* ── Smart Step List ────────────────────────────────────────────────── */
.saved-kundalis-scroll {
  display: flex; flex-direction: column; gap: 0.55rem;
  max-height: 260px; overflow-y: auto; margin-bottom: 0.3rem;
}

.kundali-list-card {
  display: flex; align-items: center; gap: 0.65rem;
  padding: 0.65rem; border-radius: 0.85rem;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
}
.kl-icon { font-size: 1.3rem; flex-shrink: 0; }
.kl-main { flex: 1; min-width: 0; }

.kl-top-row { display: flex; align-items: center; gap: 0.35rem; }
.kl-name { font-size: 0.75rem; font-weight: 800; color: #f1f5f9; margin: 0; }
.kl-relation {
  font-size: 0.55rem; font-weight: 700; color: #fbbf24;
  background: rgba(251,191,36,0.12); padding: 1px 5px; border-radius: 4px;
}

.kl-sub { font-size: 0.62rem; color: rgba(226,232,240,0.65); margin: 0.1rem 0; }
.kl-gen { font-size: 0.58rem; color: rgba(168,85,247,0.8); display: block; }

.kl-actions { display: flex; align-items: center; gap: 0.35rem; flex-shrink: 0; }
.kl-btn {
  border-radius: 8px; border: none; font-size: 0.62rem; font-weight: 800;
  cursor: pointer; transition: all 0.2s; padding: 0.3rem 0.55rem;
}
.btn-view {
  background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.35); color: #c084fc;
}
.btn-view:hover { background: rgba(168,85,247,0.3); }

.btn-delete {
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171;
  padding: 0.3rem 0.45rem;
}
.btn-delete:hover { background: rgba(239,68,68,0.25); }

/* Form inputs */
.kc-form { display: flex; flex-direction: column; gap: 0.75rem; }
.form-row { display: flex; gap: 0.5rem; }
.flex-1 { flex: 1; }
.flex-2 { flex: 2; }

.form-group { display: flex; flex-direction: column; gap: 0.25rem; }
.form-label { font-size: 0.65rem; font-weight: 700; color: #cbd5e1; }

.form-input {
  width: 100%; height: 38px; border-radius: 0.65rem;
  background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(139, 92, 246, 0.3);
  color: #f1f5f9; padding: 0 0.6rem; font-size: 0.75rem; box-sizing: border-box;
}
.form-select { appearance: auto; }

/* Generator Mode Selector */
.generator-select-label {
  font-size: 0.6rem; font-weight: 800; color: #fbbf24; letter-spacing: 0.05em; margin-top: 0.3rem;
}
.generator-options { display: flex; flex-direction: column; gap: 0.5rem; }

.gen-option {
  display: flex; align-items: center; gap: 0.65rem; padding: 0.65rem;
  border-radius: 0.85rem; background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: all 0.2s ease;
}
.gen-option.selected {
  border-color: #fbbf24; background: rgba(251, 191, 36, 0.1);
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.2);
}

.gen-icon { font-size: 1.4rem; flex-shrink: 0; }
.gen-info h4 { font-size: 0.75rem; font-weight: 800; color: #f1f5f9; }
.gen-info p { font-size: 0.6rem; color: rgba(226,232,240,0.6); margin: 0.1rem 0 0.25rem; line-height: 1.2; }

.gen-badge { font-size: 0.55rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; display: inline-block; }
.badge-free { color: #4ade80; background: rgba(74, 222, 128, 0.15); }
.badge-paid { color: #fbbf24; background: rgba(251, 191, 36, 0.15); }

.submit-kc-btn {
  width: 100%; height: 42px; border-radius: 0.85rem;
  background: linear-gradient(135deg, #d97706, #fbbf24);
  border: none; color: #0f0a02; font-size: 0.8rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center; gap: 0.4rem;
  cursor: pointer; box-shadow: 0 0 16px rgba(251,191,36,0.3); margin-top: 0.4rem;
}
.submit-kc-btn svg { width: 16px; height: 16px; }

.generate-another-btn {
  background: transparent; border: 1px solid rgba(251,191,36,0.3);
  color: #fbbf24; font-size: 0.72rem; font-weight: 800; padding: 0.55rem;
  border-radius: 0.75rem; cursor: pointer; text-align: center; margin-top: 0.2rem;
}

/* ── Step 3: Generating Animation ───────────────────────────────────── */
.kc-step-generating {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 2rem 1rem; gap: 1rem; text-align: center;
}

.gen-animation-container {
  position: relative; width: 80px; height: 80px;
  display: flex; align-items: center; justify-content: center;
}
.gen-orb {
  position: absolute; inset: 0; border-radius: 50%;
  background: radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%);
}
.gen-spin-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 2px dashed #fbbf24; animation: spin 4s linear infinite;
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.gen-symbol { font-size: 2.2rem; position: relative; z-index: 5; }

.gen-status-title { font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 800; color: #f1f5f9; }
.gen-status-log { font-family: monospace; font-size: 0.68rem; color: #fbbf24; min-height: 1.2rem; }

.gen-progress-track {
  width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden;
}
.gen-progress-fill {
  height: 100%; background: linear-gradient(90deg, #f59e0b, #fbbf24); transition: width 0.1s linear;
}

/* ── Step 4: Result View ────────────────────────────────────────────── */
.kc-step-result { display: flex; flex-direction: column; gap: 0.75rem; }
.result-nav-bar { text-align: left; }

.result-top-bar { display: flex; align-items: center; justify-content: space-between; }
.result-badge { font-size: 0.6rem; font-weight: 800; color: #4ade80; background: rgba(74,222,128,0.15); padding: 2px 8px; border-radius: 99px; }
.result-gen-tag { font-size: 0.6rem; font-weight: 700; color: #fbbf24; }

.result-person-name { font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 800; color: #f1f5f9; }
.result-person-meta { font-size: 0.65rem; color: rgba(226,232,240,0.6); }

.kundali-chart-card {
  width: 100%; display: flex; justify-content: center;
  background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(251, 191, 36, 0.25);
  border-radius: 1rem; padding: 0.75rem; box-sizing: border-box;
}
.diamond-chart-svg { width: 220px; height: 220px; }

.sign-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
.sign-box {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 0.65rem; padding: 0.5rem; display: flex; flex-direction: column; gap: 2px;
}
.sign-lbl { font-size: 0.58rem; color: rgba(226,232,240,0.5); }
.sign-val { font-size: 0.7rem; font-weight: 800; color: #fbbf24; }

.result-actions-row { display: flex; gap: 0.5rem; margin-top: 0.3rem; }
.result-btn {
  flex: 1; height: 40px; border-radius: 0.75rem; border: none;
  font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.35rem;
  cursor: pointer; transition: all 0.2s;
}
.btn-download {
  background: linear-gradient(135deg, #10b981, #059669); color: #fff;
}
.btn-download svg { width: 15px; height: 15px; }

.btn-ai {
  background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: #fff;
}
.btn-ai svg { width: 15px; height: 15px; }

/* Transitions */
.sheet-slide-enter-active, .sheet-slide-leave-active { transition: opacity 0.35s ease; }
.sheet-slide-enter-active .kc-card, .sheet-slide-leave-active .kc-card { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.sheet-slide-enter-from { opacity: 0; }
.sheet-slide-enter-from .kc-card { transform: translateY(100%); }
.sheet-slide-leave-to { opacity: 0; }
.sheet-slide-leave-to .kc-card { transform: translateY(100%); }
</style>
