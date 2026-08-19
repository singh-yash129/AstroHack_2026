<template>
  <section class="view-page astrologers-view">

    <!-- ── Page header ──────────────────────────────────────────────────── -->
    <div class="page-header">
      <div class="header-icon">🔮</div>
      <div>
        <h1 class="page-title">Astrologers</h1>
        <p class="page-subtitle">Ranked by Manifestation Accuracy</p>
      </div>
    </div>

    <!-- ── Leaderboard banner ───────────────────────────────────────────── -->
    <div class="leader-banner" aria-label="Leaderboard info">
      <div class="leader-banner-icon" aria-hidden="true">🏆</div>
      <div class="leader-banner-copy">
        <p class="leader-title">Accuracy Leaderboard</p>
        <p class="leader-sub">Sorted by verified prediction fulfilment rate — not paid reviews</p>
      </div>
      <div class="leader-live-dot" aria-label="Live data">
        <span class="live-pulse" aria-hidden="true" />
        <span class="live-label">Live</span>
      </div>
    </div>

    <!-- ── Astrologer cards ─────────────────────────────────────────────── -->
    <ul class="ast-list" aria-label="Astrologer marketplace, sorted by accuracy">
      <li
        v-for="(ast, index) in astrologers"
        :key="ast.id"
        class="ast-card"
        :class="{
          'ast-card--surge': ast.isSurge,
          'ast-card--top3': index < 3,
        }"
      >

        <!-- ── Surge ribbon (top-rated only) ───────────────────────── -->
        <div v-if="ast.isSurge" class="surge-ribbon" aria-label="Surge pricing active">
          <span class="surge-fire" aria-hidden="true">🔥</span>
          High Demand · Surge Pricing
        </div>

        <!-- ── Card body ───────────────────────────────────────────── -->
        <div class="ast-card-body">

          <!-- Left: avatar + online dot -->
          <div class="ast-avatar-wrap">
            <div class="ast-avatar-ring" :class="ast.isSurge ? 'ring--surge' : ''">
              <div class="ast-avatar" :style="{ background: ast.avatarGradient }">
                {{ ast.name.charAt(0) }}
              </div>
            </div>
            <span
              class="ast-online"
              :class="ast.online ? 'online--active' : 'online--away'"
              :aria-label="ast.online ? 'Online now' : 'Away'"
            />
          </div>

          <!-- Right: info column -->
          <div class="ast-info">

            <!-- Name row -->
            <div class="ast-name-row">
              <span class="rank-medal" :aria-label="`Rank ${index + 1}`">
                <span v-if="index === 0">👑</span>
                <span v-else-if="index === 1">🥈</span>
                <span v-else-if="index === 2">🥉</span>
                <span v-else class="rank-num-inline">#{{ index + 1 }}</span>
              </span>
              <h2 class="ast-name">{{ ast.name }}</h2>
              <span v-if="ast.verified" class="ast-verified" aria-label="Verified astrologer">
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" fill="#4f46e5"/>
                  <polyline points="4.5 8.5 7 11 11.5 5.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </div>

            <!-- Specialty -->
            <p class="ast-specialty">{{ ast.specialty }}</p>

            <!-- ── Accuracy score — PROMINENT ───────────────────── -->
            <div class="accuracy-badge" :class="accuracyClass(ast.accuracyScore)">
              <div class="accuracy-badge-score">
                <span class="accuracy-pct">{{ ast.accuracyScore }}%</span>
                <svg class="accuracy-trend" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                  <polyline points="2 12 6 6 10 9 14 3"/>
                </svg>
              </div>
              <p class="accuracy-badge-label">Predictions Fulfilled</p>
            </div>

            <!-- Stats row -->
            <div class="ast-stats">
              <div class="stat">
                <span class="stat-val">{{ ast.totalPredictions.toLocaleString() }}</span>
                <span class="stat-key">Predictions</span>
              </div>
              <div class="stat-divider" aria-hidden="true" />
              <div class="stat">
                <span class="stat-val">{{ ast.yearsActive }}yr</span>
                <span class="stat-key">Experience</span>
              </div>
              <div class="stat-divider" aria-hidden="true" />
              <div class="stat">
                <span class="stat-val">{{ ast.responseTime }}</span>
                <span class="stat-key">Avg Reply</span>
              </div>
            </div>

            <!-- Tags -->
            <div class="ast-tags" aria-label="Speciality tags">
              <span
                v-for="tag in ast.tags"
                :key="tag"
                class="ast-tag"
              >{{ tag }}</span>
            </div>

            <!-- Surge demand meter (top-rated only) -->
            <div v-if="ast.isSurge" class="surge-demand">
              <div class="surge-demand-bar">
                <div class="surge-demand-fill" :style="{ width: ast.demandPct + '%' }" />
              </div>
              <span class="surge-demand-text">
                {{ ast.consultationsToday }}+ consultations today · {{ 100 - ast.demandPct }}% capacity left
              </span>
            </div>

            <!-- Price + Book button -->
            <div class="ast-footer">
              <!-- Left: price -->
              <div class="ast-price">
                <span class="price-from">from</span>
                <span class="price-val">${{ ast.price }}</span>
                <span class="price-unit">/ 10 min</span>
              </div>

              <!-- Right: surge label stacked above book button -->
              <div class="ast-footer-right">
                <span v-if="ast.isSurge" class="price-surge-badge">
                  🔥 Surge Pricing
                </span>
                <button
                  class="book-btn"
                  :class="{ 'book-btn--surge': ast.isSurge }"
                  @click="openSheet(ast)"
                  :aria-label="`Book consultation with ${ast.name}`"
                >
                  <svg class="book-btn-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="14" height="14" rx="2"/>
                    <path d="M7 2v4M13 2v4M3 9h14"/>
                    <path d="M7 13h.01M10 13h.01M13 13h.01"/>
                  </svg>
                  Book Consultation
                </button>
              </div>
            </div>

          </div>
        </div>

      </li>
    </ul>

    <!-- ── Bottom spacer ──────────────────────────────────────────────── -->
    <div style="height: 1rem" aria-hidden="true" />

    <!-- ── Bottom Sheet ───────────────────────────────────────────────── -->
    <ConsultationBottomSheet
      :show="sheetOpen"
      :astrologer="selectedAstrologer || astrologers[0]"
      @close="sheetOpen = false"
      @booked="handleBooked"
    />

    <!-- ── Success Toast ──────────────────────────────────────────────── -->
    <ToastNotification
      :show="showToast"
      :title="toastTitle"
      :subtitle="toastSubtitle"
      icon="📅"
      :duration="5000"
      @dismissed="showToast = false"
    />

  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ConsultationBottomSheet from '../components/ConsultationBottomSheet.vue'
import ToastNotification from '../components/ToastNotification.vue'

const router = useRouter()

// ── Astrologer dataset — sorted descending by accuracyScore ───────────────
const astrologers = [
  {
    id: 1,
    name: 'Celeste Nadir',
    specialty: 'Karmic Saturn & Past-Life Readings',
    avatarGradient: 'linear-gradient(135deg, #4c1d95 0%, #1e3a8a 100%)',
    accuracyScore: 98,
    totalPredictions: 1240,
    yearsActive: 12,
    responseTime: '< 2 hr',
    verified: true,
    online: true,
    isSurge: true,
    consultationsToday: 47,
    demandPct: 87,
    price: 15,
    tags: ['Saturn Return', 'Karma', 'Life Path', 'Past Lives'],
  },
  {
    id: 2,
    name: 'Aria Moonwhisper',
    specialty: 'Lunar Cycles & Relationship Compatibility',
    avatarGradient: 'linear-gradient(135deg, #701a75 0%, #1e1b4b 100%)',
    accuracyScore: 94,
    totalPredictions: 978,
    yearsActive: 8,
    responseTime: '< 4 hr',
    verified: true,
    online: true,
    isSurge: false,
    consultationsToday: 31,
    demandPct: 0,
    price: 12,
    tags: ['Relationships', 'Moon Signs', 'Compatibility', 'Synastry'],
  },
  {
    id: 3,
    name: 'Sol Vega',
    specialty: 'Vedic Astrology & Financial Transits',
    avatarGradient: 'linear-gradient(135deg, #78350f 0%, #1e3a8a 100%)',
    accuracyScore: 91,
    totalPredictions: 856,
    yearsActive: 10,
    responseTime: '< 3 hr',
    verified: true,
    online: false,
    isSurge: false,
    consultationsToday: 22,
    demandPct: 0,
    price: 10,
    tags: ['Vedic', 'Finance', 'Career', 'Jupiter Transits'],
  },
  {
    id: 4,
    name: 'Orion Dusk',
    specialty: 'Rising Signs & Ascendant Mastery',
    avatarGradient: 'linear-gradient(135deg, #164e63 0%, #312e81 100%)',
    accuracyScore: 88,
    totalPredictions: 643,
    yearsActive: 6,
    responseTime: '< 6 hr',
    verified: true,
    online: true,
    isSurge: false,
    consultationsToday: 18,
    demandPct: 0,
    price: 9,
    tags: ['Rising Sign', 'Identity', 'Self-Discovery'],
  },
  {
    id: 5,
    name: 'Nova Starfield',
    specialty: 'Predictive Astrology & Eclipse Charts',
    avatarGradient: 'linear-gradient(135deg, #1f2937 0%, #4c1d95 100%)',
    accuracyScore: 85,
    totalPredictions: 512,
    yearsActive: 5,
    responseTime: '< 8 hr',
    verified: false,
    online: false,
    isSurge: false,
    consultationsToday: 9,
    demandPct: 0,
    price: 8,
    tags: ['Eclipses', 'Predictions', 'Solar Returns'],
  },
]

// ── Accuracy badge colour tier ────────────────────────────────────────────
function accuracyClass(score) {
  if (score >= 95) return 'accuracy--elite'
  if (score >= 90) return 'accuracy--high'
  if (score >= 80) return 'accuracy--good'
  return 'accuracy--standard'
}

// ── Bottom sheet state ────────────────────────────────────────────────────
const sheetOpen         = ref(false)
const selectedAstrologer = ref(null)

function openSheet(ast) {
  selectedAstrologer.value = ast
  sheetOpen.value          = true
}

// ── Toast state ───────────────────────────────────────────────────────────
const showToast     = ref(false)
const toastTitle    = ref('')
const toastSubtitle = ref('')

function handleBooked({ astrologer }) {
  sheetOpen.value = false
  // Brief pause, then launch the live chat session
  setTimeout(() => {
    router.push({ name: 'live-chat', query: { astrologer: astrologer.name } })
  }, 300)
}
</script>

<style scoped>
.astrologers-view {
  gap: 1.25rem;
}

/* ── Leaderboard banner ──────────────────────────────────────────────── */
.leader-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
  border-radius: 0.875rem;
  background: linear-gradient(135deg, rgba(79,70,229,0.12) 0%, rgba(109,40,217,0.08) 100%);
  border: 1px solid rgba(109,40,217,0.2);
}

.leader-banner-icon { font-size: 1.25rem; flex-shrink: 0; }

.leader-banner-copy { flex: 1; }

.leader-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: #e8eaf6;
  line-height: 1.2;
}

.leader-sub {
  font-size: 0.65rem;
  color: rgba(232,234,246,0.4);
  margin-top: 0.15rem;
  line-height: 1.4;
}

/* Live dot */
.leader-live-dot {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-shrink: 0;
}

.live-pulse {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 6px rgba(74,222,128,0.8);
  animation: live-blink 1.5s ease-in-out infinite;
}

@keyframes live-blink {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.75); }
}

.live-label { font-size: 0.62rem; font-weight: 700; color: #4ade80; }

/* ── Astrologer list ─────────────────────────────────────────────────── */
.ast-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ── Astrologer card ─────────────────────────────────────────────────── */
.ast-card {
  position: relative;
  border-radius: 1.25rem;
  background: linear-gradient(160deg, rgba(18,7,35,0.95) 0%, rgba(11,18,38,0.95) 100%);
  border: 1px solid rgba(139,92,246,0.2);
  overflow: hidden;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.ast-card:hover {
  border-color: rgba(139,92,246,0.4);
  box-shadow: 0 6px 30px rgba(109,40,217,0.2), 0 4px 20px rgba(0,0,0,0.5);
  transform: translateY(-1px);
}

/* Surge card */
.ast-card--surge {
  border-color: rgba(251,115,0,0.35) !important;
  box-shadow:
    0 0 0 1px rgba(251,115,0,0.12),
    0 0 30px rgba(251,115,0,0.12),
    0 4px 20px rgba(0,0,0,0.5) !important;
}

.ast-card--surge:hover {
  border-color: rgba(251,115,0,0.6) !important;
  box-shadow:
    0 0 0 1px rgba(251,115,0,0.2),
    0 0 45px rgba(251,115,0,0.2),
    0 6px 30px rgba(0,0,0,0.5) !important;
}

/* ── Surge ribbon ─────────────────────────────────────────────── */
.surge-ribbon {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.85rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #fb923c;
  background: linear-gradient(90deg, rgba(251,115,0,0.15) 0%, rgba(251,115,0,0.06) 100%);
  border-bottom: 1px solid rgba(251,115,0,0.2);
  animation: surge-glow 2.5s ease-in-out infinite;
  /* Prevent overflow on narrow screens */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@keyframes surge-glow {
  0%, 100% { background: linear-gradient(90deg, rgba(251,115,0,0.15) 0%, rgba(251,115,0,0.06) 100%); }
  50%       { background: linear-gradient(90deg, rgba(251,115,0,0.22) 0%, rgba(251,115,0,0.1) 100%); }
}

.surge-fire { font-size: 0.8rem; }

/* ── Card body ───────────────────────────────────────────────────────── */
.ast-card-body {
  display: flex;
  gap: 0.875rem;
  padding: 1rem;
}

/* ── Avatar ──────────────────────────────────────────────────────────── */
.ast-avatar-wrap {
  position: relative;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 0.25rem;
}

.ast-avatar-ring {
  width: 60px; height: 60px;
  border-radius: 50%;
  background: conic-gradient(#8b5cf6, #a78bfa, #c4b5fd, #8b5cf6);
  padding: 2px;
  box-shadow: 0 0 14px rgba(139,92,246,0.3);
}

.ring--surge {
  background: conic-gradient(#f97316, #fb923c, #fbbf24, #f97316) !important;
  box-shadow: 0 0 14px rgba(249,115,22,0.4) !important;
}

@keyframes spin-ring {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.ast-avatar {
  width: 100%; height: 100%;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem; font-weight: 800;
  color: #e8eaf6;
}

/* Online dot */
.ast-online {
  position: absolute;
  bottom: 2px; right: 2px;
  width: 12px; height: 12px;
  border-radius: 50%;
  border: 2px solid #0b1226;
}

.online--active {
  background: #4ade80;
  box-shadow: 0 0 6px rgba(74,222,128,0.8);
}

.online--away { background: rgba(255,255,255,0.25); }

/* ── Info column ─────────────────────────────────────────────────────── */
.ast-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Name row */
.ast-name-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: nowrap;
  overflow: hidden;
}

/* Inline rank medal — sits before the name */
.rank-medal {
  font-size: 0.95rem;
  line-height: 1;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.rank-num-inline {
  font-size: 0.62rem;
  font-weight: 800;
  color: rgba(232,234,246,0.4);
  font-family: 'Outfit', sans-serif;
  letter-spacing: 0.02em;
}

.ast-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem; font-weight: 700;
  color: #e8eaf6;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.ast-verified {
  flex-shrink: 0;
  width: 1.1rem; height: 1.1rem;
}

.ast-specialty {
  font-size: 0.7rem;
  color: rgba(232,234,246,0.4);
  line-height: 1.35;
}

/* ── Accuracy badge ──────────────────────────────────────────────────── */
.accuracy-badge {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid;
}

.accuracy--elite {
  background: linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(217,119,6,0.08) 100%);
  border-color: rgba(251,191,36,0.35);
}

.accuracy--high {
  background: linear-gradient(135deg, rgba(74,222,128,0.12) 0%, rgba(16,185,129,0.06) 100%);
  border-color: rgba(74,222,128,0.25);
}

.accuracy--good {
  background: linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 100%);
  border-color: rgba(99,102,241,0.25);
}

.accuracy--standard {
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.1);
}

.accuracy-badge-score {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.accuracy-pct {
  font-family: 'Outfit', sans-serif;
  font-size: 1.25rem; font-weight: 900;
  line-height: 1;
}

.accuracy--elite .accuracy-pct { color: #fbbf24; }
.accuracy--high  .accuracy-pct { color: #4ade80; }
.accuracy--good  .accuracy-pct { color: #818cf8; }
.accuracy--standard .accuracy-pct { color: #e8eaf6; }

.accuracy-trend {
  width: 0.9rem; height: 0.9rem;
  opacity: 0.7;
}

.accuracy--elite .accuracy-trend { color: #fbbf24; }
.accuracy--high  .accuracy-trend { color: #4ade80; }
.accuracy--good  .accuracy-trend { color: #818cf8; }

.accuracy-badge-label {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(232,234,246,0.45);
}

/* ── Stats row ───────────────────────────────────────────────────────── */
.ast-stats {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.05rem;
}

.stat-val {
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem; font-weight: 700;
  color: #e8eaf6;
}

.stat-key {
  font-size: 0.58rem;
  color: rgba(232,234,246,0.35);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.stat-divider {
  width: 1px; height: 1.5rem;
  background: rgba(255,255,255,0.1);
}

/* ── Tags ────────────────────────────────────────────────────────────── */
.ast-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.ast-tag {
  font-size: 0.58rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  background: rgba(109,40,217,0.12);
  border: 1px solid rgba(139,92,246,0.2);
  color: #a78bfa;
  white-space: nowrap;
}

/* ── Surge demand meter ──────────────────────────────────────────────── */
.surge-demand {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.surge-demand-bar {
  height: 5px;
  background: rgba(255,255,255,0.07);
  border-radius: 999px;
  overflow: hidden;
}

.surge-demand-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #f97316, #fbbf24);
  box-shadow: 0 0 6px rgba(251,115,0,0.6);
  animation: demand-pulse 2s ease-in-out infinite;
}

@keyframes demand-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.75; }
}

.surge-demand-text {
  font-size: 0.62rem;
  color: #fb923c;
  font-weight: 500;
}

/* ── Card footer ───────────────────────────────────────────── */
.ast-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.1rem;
}

/* Right column: surge pill stacked above book button */
.ast-footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  flex-shrink: 0;
}

/* Price */
.ast-price {
  display: flex;
  align-items: baseline;
  gap: 0.2rem;
}

.price-from {
  font-size: 0.62rem;
  color: rgba(232,234,246,0.35);
}

.price-val {
  font-family: 'Outfit', sans-serif;
  font-size: 1.1rem; font-weight: 800;
  color: #e8eaf6;
}

.price-unit {
  font-size: 0.65rem;
  color: rgba(232,234,246,0.4);
}

.price-surge-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6rem; font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(251,115,0,0.18);
  border: 1px solid rgba(251,115,0,0.4);
  color: #fb923c;
  white-space: nowrap;
  animation: surge-badge-pulse 2.5s ease-in-out infinite;
}

@keyframes surge-badge-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.65; }
}

/* Book button */
.book-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(139,92,246,0.4);
  background: linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(79,70,229,0.12) 100%);
  color: #c4b5fd;
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem; font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
}

.book-btn-icon { width: 0.85rem; height: 0.85rem; flex-shrink: 0; }

.book-btn:hover {
  background: linear-gradient(135deg, rgba(109,40,217,0.35) 0%, rgba(79,70,229,0.2) 100%);
  border-color: rgba(139,92,246,0.7);
  color: #e8eaf6;
  box-shadow: 0 0 14px rgba(109,40,217,0.25);
}

.book-btn:active { transform: scale(0.96); }

/* Surge variant — gold book button */
.book-btn--surge {
  border-color: rgba(251,191,36,0.45) !important;
  background: linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(217,119,6,0.1) 100%) !important;
  color: #fbbf24 !important;
  animation: book-btn-pulse 3s ease-in-out infinite;
}

@keyframes book-btn-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(251,191,36,0); }
  50%       { box-shadow: 0 0 12px rgba(251,191,36,0.3); }
}

.book-btn--surge:hover {
  background: linear-gradient(135deg, rgba(251,191,36,0.28) 0%, rgba(217,119,6,0.18) 100%) !important;
  border-color: rgba(251,191,36,0.7) !important;
  box-shadow: 0 0 18px rgba(251,191,36,0.35) !important;
}
</style>
