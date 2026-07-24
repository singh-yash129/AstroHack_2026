<template>
  <section class="view-page chronicle-view">

    <!-- ── Page header ──────────────────────────────────────────────────── -->
    <div class="page-header">
      <div class="header-icon">📜</div>
      <div>
        <h1 class="page-title">My Chronicle</h1>
        <p class="page-subtitle">Your personal cosmic prediction timeline</p>
      </div>
    </div>

    <!-- ── Manifestation Score card ─────────────────────────────────────── -->
    <ManifestationScore
      :score="store.manifestationScore"
      :fulfilled-count="store.fulfilledCount"
      :locked-count="store.lockedCount"
    />

    <!-- ── Filter tabs ───────────────────────────────────────────────────── -->
    <div class="filter-scroll" role="tablist" aria-label="Filter predictions">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        class="filter-tab"
        :class="{ 'filter-tab--active': store.activeFilter === tab.value }"
        role="tab"
        :aria-selected="store.activeFilter === tab.value"
        @click="store.setFilter(tab.value)"
      >
        {{ tab.icon }} {{ tab.label }}
      </button>
    </div>

    <!-- ── Vertical Timeline ─────────────────────────────────────────────── -->
    <div class="timeline" role="list">
      <TransitionGroup name="card-list" tag="div" class="timeline-inner">
        <div
          v-for="(prediction, index) in store.filteredPredictions"
          :key="prediction.id"
          class="timeline-item"
          role="listitem"
        >
          <!-- Connector line (hidden on last item) -->
          <div
            class="timeline-connector"
            :class="index === store.filteredPredictions.length - 1 ? 'connector--hidden' : ''"
          >
            <!-- Node dot -->
            <div
              class="timeline-dot"
              :class="prediction.status === 'fulfilled' ? 'dot--fulfilled' : 'dot--locked'"
              aria-hidden="true"
            >
              <div class="dot-inner" />
            </div>
            <!-- Vertical line -->
            <div
              class="timeline-line"
              :class="prediction.status === 'fulfilled' ? 'line--fulfilled' : 'line--locked'"
            />
          </div>

          <!-- Prediction card -->
          <PredictionCard
            :prediction="prediction"
            class="timeline-card"
            @unlock-verify="handleUnlockVerify"
          />
        </div>
      </TransitionGroup>

      <!-- Empty filtered state -->
      <div v-if="store.filteredPredictions.length === 0" class="filter-empty">
        <span class="filter-empty-icon">🌌</span>
        <p>No predictions match this filter.</p>
      </div>
    </div>

    <!-- ── Bottom spacer for safe area ─────────────────────────────────── -->
    <div style="height: 1rem" aria-hidden="true" />

    <!-- ── Confetti canvas ─────────────────────────────────────────────── -->
    <Teleport to="body">
      <ConfettiCanvas v-if="showConfetti" @done="showConfetti = false" />
    </Teleport>

    <!-- ── Manifestation Card Modal (internally Teleports to body) ──────── -->
    <ManifestationCardModal
      v-if="showModal && verifiedPrediction"
      :prediction="verifiedPrediction"
      @close="handleModalClose"
      @show-tip="handleShowTip"
    />

    <!-- ── Gratitude Tip Modal (internally Teleports to body) ────────────── -->
    <GratitudeTipModal
      v-if="showTipModal && verifiedPrediction"
      :prediction="verifiedPrediction"
      @close="showTipModal = false"
      @tip-sent="handleTipSent"
    />

    <!-- ── Success Toast (internally Teleports to body) ──────────────────── -->
    <ToastNotification
      :show="showToast"
      :title="toastTitle"
      :subtitle="toastSubtitle"
      icon="💫"
      :duration="4500"
      @dismissed="showToast = false"
    />

  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useChronicleStore } from '../stores/chronicle.js'
import ManifestationScore from '../components/ManifestationScore.vue'
import PredictionCard from '../components/PredictionCard.vue'
import ConfettiCanvas from '../components/ConfettiCanvas.vue'
import ManifestationCardModal from '../components/ManifestationCardModal.vue'
import GratitudeTipModal from '../components/GratitudeTipModal.vue'
import ToastNotification from '../components/ToastNotification.vue'

const store = useChronicleStore()

const filterTabs = [
  { value: 'all',       label: 'All',      icon: '🌐' },
  { value: 'fulfilled', label: 'Fulfilled', icon: '✓'  },
  { value: 'locked',    label: 'Locked',    icon: '🔒' },
]

// ── Unlock & Verify flow ──────────────────────────────────────────────────
const showConfetti       = ref(false)
const showModal          = ref(false)
const verifiedPrediction = ref(null)

function handleUnlockVerify(prediction) {
  verifiedPrediction.value = prediction

  // 1. Fire confetti immediately
  showConfetti.value = true

  // 2. Mark the prediction fulfilled in the store (timeline card turns gold)
  store.fulfillPrediction(prediction.id)

  // 3. Show the Manifestation Card after a short confetti head-start
  setTimeout(() => {
    showModal.value = true
  }, 800)
}

function handleModalClose() {
  showModal.value = false
  verifiedPrediction.value = null
}

// ── Tip flow ──────────────────────────────────────────────────────────────
const showTipModal = ref(false)

// ManifestationCardModal emits show-tip after the Instagram share alert
function handleShowTip(prediction) {
  verifiedPrediction.value = prediction
  showModal.value    = false  // close manifestation card
  showTipModal.value = true   // open tip modal
}

// ── Toast flow ────────────────────────────────────────────────────────────
const showToast     = ref(false)
const toastTitle    = ref('')
const toastSubtitle = ref('')

// GratitudeTipModal emits tip-sent with { amount, astrologerName, category }
function handleTipSent({ amount, astrologerName, category }) {
  showTipModal.value  = false
  toastTitle.value    = `💫 $${amount} Tip Sent! Karma Boosted`
  toastSubtitle.value = `${astrologerName} · ${category} Prediction · Thank you ✨`
  showToast.value     = true
  verifiedPrediction.value = null
}
</script>

<style scoped>
.chronicle-view {
  gap: 1.25rem;
}

/* ── Filter scroll strip ─────────────────────────────────────────────── */
.filter-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  scrollbar-width: none;
}
.filter-scroll::-webkit-scrollbar { display: none; }

.filter-tab {
  flex-shrink: 0;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04);
  color: rgba(232,234,246,0.55);
  -webkit-tap-highlight-color: transparent;
}

.filter-tab:hover {
  background: rgba(255,255,255,0.08);
  color: rgba(232,234,246,0.85);
}

.filter-tab--active {
  background: linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(217,119,6,0.15) 100%);
  border-color: rgba(251,191,36,0.4);
  color: #fbbf24;
  box-shadow: 0 0 12px rgba(251,191,36,0.15);
}

/* ── Timeline container ──────────────────────────────────────────────── */
.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-inner {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ── Single timeline row ─────────────────────────────────────────────── */
.timeline-item {
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;
}

/* ── Connector (dot + vertical line) ────────────────────────────────── */
.timeline-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 24px;
  padding-top: 1.15rem;
}

.connector--hidden .timeline-line {
  visibility: hidden;
}

/* Node dot */
.timeline-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}

.dot--fulfilled {
  background: linear-gradient(135deg, #d97706, #fbbf24);
  box-shadow: 0 0 10px rgba(251,191,36,0.6), 0 0 20px rgba(251,191,36,0.2);
}

.dot--locked {
  background: linear-gradient(135deg, rgba(109,40,217,0.5), rgba(55,25,94,0.8));
  border: 1.5px solid rgba(139,92,246,0.4);
}

.dot-inner {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
}

.dot--locked .dot-inner {
  background: rgba(167,139,250,0.7);
}

/* Vertical connecting line */
.timeline-line {
  width: 2px;
  flex: 1;
  min-height: 1.5rem;
  border-radius: 1px;
  margin-top: 3px;
}

.line--fulfilled {
  background: linear-gradient(to bottom, rgba(251,191,36,0.5), rgba(251,191,36,0.1));
}

.line--locked {
  background: linear-gradient(to bottom, rgba(109,40,217,0.4), rgba(109,40,217,0.05));
}

/* ── Card within timeline ─────────────────────────────────────────────── */
.timeline-card {
  flex: 1;
  margin-bottom: 0.875rem;
  min-width: 0;
}

/* ── Empty state ─────────────────────────────────────────────────────── */
.filter-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: rgba(232,234,246,0.35);
  font-size: 0.85rem;
  text-align: center;
}

.filter-empty-icon {
  font-size: 2rem;
  display: block;
}

/* ── TransitionGroup animations ─────────────────────────────────────── */
.card-list-enter-active {
  transition: all 0.3s ease;
}
.card-list-leave-active {
  transition: all 0.25s ease;
  position: absolute;
  width: 100%;
}
.card-list-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}
.card-list-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
.card-list-move {
  transition: transform 0.3s ease;
}
</style>
