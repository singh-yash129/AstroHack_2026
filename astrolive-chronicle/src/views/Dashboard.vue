<template>
  <section class="dash-view">

    <!-- ══════════════════════════════════════════════════════════════════
         HEADER — matches other page headers
    ═══════════════════════════════════════════════════════════════════ -->
    <!-- Page header — same as ChronicleView -->
    <div class="page-header">
      <div class="header-icon">🌌</div>
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Your cosmic command centre</p>
      </div>
    </div>
    <!-- ══════════════════════════════════════════════════════════════════
         COSMIC STREAK TRACKER
    ═══════════════════════════════════════════════════════════════════ -->
    <div class="section-label-row">
      <span class="section-chip">🔥 COSMIC STREAK</span>
      <span class="section-pill">4 of 7 days</span>
    </div>

    <div class="streak-card">
      <!-- Ambient glow -->
      <div class="streak-glow" aria-hidden="true" />

      <div class="streak-top-row">
        <div class="streak-fire-block">
          <span class="streak-fire-emoji">🔥</span>
          <div>
            <p class="streak-main-text">4-Day Streak!</p>
            <p class="streak-sub-text">3 days left to unlock a free prediction</p>
          </div>
        </div>
        <div class="streak-reward-badge">
          <span>🎁</span>
          <span>Free<br/>Prediction</span>
        </div>
      </div>

      <!-- 7 nodes -->
      <div class="streak-track-wrap">
        <!-- grey connector line -->
        <div class="streak-connector" />
        <!-- gold progress line, 4 of 7 nodes filled -->
        <!-- width = (4-1)/(7-1) * 100% = 50%, centered on first 4 nodes -->
        <div class="streak-connector streak-connector--progress" />

        <!-- Node row -->
        <div class="streak-nodes">
          <div v-for="day in 7" :key="day" class="streak-node-col">
            <div
              class="streak-node"
              :class="day <= 4 ? 'streak-node--lit' : 'streak-node--dim'"
            >
              <span v-if="day <= 4" class="streak-check">✓</span>
              <span v-else class="streak-day-num">{{ day }}</span>
            </div>
            <span class="streak-day-label" :class="day <= 4 ? 'streak-day-label--lit' : ''">
              {{ ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][day - 1] }}
            </span>
          </div>
        </div>
      </div>
    </div>
 <!-- ══════════════════════════════════════════════════════════════════
         INTERACTIVE VISUAL KUNDALI
    ═══════════════════════════════════════════════════════════════════ -->
    <div class="section-label-row">
      <span class="section-chip">🪐 VISUAL KUNDALI</span>
    </div>

    <div class="kundali-wrapper">
      <VisualKundali />
    </div>
    <!-- ══════════════════════════════════════════════════════════════════
         QUICK ACTION SHORTCUTS
    ═══════════════════════════════════════════════════════════════════ -->
    <div class="section-label-row">
      <span class="section-chip">⚡ QUICK ACTIONS</span>
    </div>

    <div class="quick-actions-grid">
      <RouterLink to="/astro-ai" class="qa-card qa-card--ai">
        <div class="qa-icon-wrap">✨</div>
        <span class="qa-name">Astro AI</span>
        <span class="qa-desc">Ask anything</span>
      </RouterLink>

      <RouterLink to="/astrologers" class="qa-card qa-card--astro">
        <div class="qa-icon-wrap">🔮</div>
        <span class="qa-name">Book Session</span>
        <span class="qa-desc">Live consult</span>
      </RouterLink>

      <RouterLink to="/chronicle" class="qa-card qa-card--chron">
        <div class="qa-icon-wrap">📜</div>
        <span class="qa-name">Chronicle</span>
        <span class="qa-desc">My timeline</span>
      </RouterLink>

      <RouterLink to="/importer" class="qa-card qa-card--import">
        <div class="qa-icon-wrap">📥</div>
        <span class="qa-name">Import</span>
        <span class="qa-desc">Add prediction</span>
      </RouterLink>
    </div>


    <!-- ══════════════════════════════════════════════════════════════════
         TODAY'S COSMIC SUGGESTIONS
    ═══════════════════════════════════════════════════════════════════ -->
    <div class="section-label-row">
      <span class="section-chip">💡 COSMIC SUGGESTIONS</span>
    </div>

    <div class="suggestions-list">
      <div
        v-for="s in SUGGESTIONS"
        :key="s.id"
        class="sug-card"
        @click="s.action"
      >
        <div class="sug-icon-circle" :class="s.colorClass">{{ s.icon }}</div>
        <div class="sug-body">
          <p class="sug-title">{{ s.title }}</p>
          <p class="sug-desc">{{ s.desc }}</p>
        </div>
        <div class="sug-arrow">›</div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════════
         MY ACTIVITY
    ═══════════════════════════════════════════════════════════════════ -->
    <div class="section-label-row">
      <span class="section-chip">📊 MY ACTIVITY</span>
    </div>

    <div class="activity-grid">
      <div class="activity-stat-card">
        <span class="activity-stat-num">12</span>
        <span class="activity-stat-label">Predictions Logged</span>
        <span class="activity-stat-icon">🔮</span>
      </div>
      <div class="activity-stat-card">
        <span class="activity-stat-num">8</span>
        <span class="activity-stat-label">Consultations Done</span>
        <span class="activity-stat-icon">🎙️</span>
      </div>
      <div class="activity-stat-card activity-stat-card--wide">
        <span class="activity-stat-num activity-stat-num--gold">87%</span>
        <span class="activity-stat-label">Your Accuracy Score</span>
        <div class="activity-accuracy-bar-wrap">
          <div class="activity-accuracy-bar" style="width: 87%" />
        </div>
      </div>
    </div>

    <!-- Recent Activity List -->
    <div class="recent-list">
      <div
        v-for="act in RECENT_ACTIVITY"
        :key="act.id"
        class="recent-item"
      >
        <div class="recent-dot" :class="act.dotClass" />
        <div class="recent-content">
          <p class="recent-title">{{ act.title }}</p>
          <p class="recent-time">{{ act.time }}</p>
        </div>
        <span class="recent-badge" :class="act.badgeClass">{{ act.badge }}</span>
      </div>
    </div>

   

    <!-- bottom breathing room -->
    <div style="height: 2rem" />
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import VisualKundali from '../components/VisualKundali.vue'

const router = useRouter()

// ── Cosmic Suggestions ──────────────────────────────────────────────────
const SUGGESTIONS = [
  {
    id: 1,
    icon: '✨',
    title: 'Ask Astro AI about today\'s transit',
    desc: 'Jupiter conjunct your Moon — major expansion energy today!',
    colorClass: 'sug-icon--purple',
    action: () => router.push('/astro-ai'),
  },
  {
    id: 2,
    icon: '📅',
    title: 'Book your monthly Kundali review',
    desc: 'Your next Dasha period starts in 14 days — plan ahead',
    colorClass: 'sug-icon--gold',
    action: () => router.push('/astrologers'),
  },
  {
    id: 3,
    icon: '📜',
    title: 'Log yesterday\'s synchronicity',
    desc: 'You had 2 unlogged prediction hits. Chronicle them now!',
    colorClass: 'sug-icon--teal',
    action: () => router.push('/importer'),
  },
  {
    id: 4,
    icon: '💰',
    title: 'Profit window: Sept 8 – Oct 2',
    desc: 'Venus trine Jupiter — high-value negotiations favoured',
    colorClass: 'sug-icon--green',
    action: () => router.push('/astro-ai'),
  },
]

// ── Recent Activity ─────────────────────────────────────────────────────
const RECENT_ACTIVITY = [
  {
    id: 1,
    title: 'Prediction locked — Career Growth 2026',
    time: '2 hours ago',
    badge: 'Logged',
    dotClass: 'dot--amber',
    badgeClass: 'badge--amber',
  },
  {
    id: 2,
    title: 'Live Session with Pandit Ramesh',
    time: 'Yesterday · 45 min',
    badge: 'Done',
    dotClass: 'dot--green',
    badgeClass: 'badge--green',
  },
  {
    id: 3,
    title: 'Prediction HIT — Job Interview (Jul 22)',
    time: '3 days ago',
    badge: '✓ Hit',
    dotClass: 'dot--purple',
    badgeClass: 'badge--purple',
  },
  {
    id: 4,
    title: 'Astro AI Horoscope for Leo',
    time: '4 days ago',
    badge: 'AI Chat',
    dotClass: 'dot--sky',
    badgeClass: 'badge--sky',
  },
]
</script>

<style scoped>
/* ── Page shell ─────────────────────────────────────────────────────── */
.dash-view {
  padding: 1.5rem 0 1rem 0;
}



/* ── Section Label Row ──────────────────────────────────────────────── */
.section-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0.5rem 1rem;
}
.section-chip {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgba(251, 191, 36, 0.9);
  font-family: 'Outfit', sans-serif;
}
.section-pill {
  font-size: 0.6rem;
  font-weight: 700;
  color: rgba(203, 213, 225, 0.5);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 2px 8px;
  border-radius: 99px;
}

/* ── Quick Actions Grid ─────────────────────────────────────────────── */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
  padding: 0 1rem;
}
.qa-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0.7rem 0.4rem;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(15, 23, 42, 0.7);
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}
.qa-card:active { transform: scale(0.95); }

.qa-card--ai     { border-color: rgba(168,85,247,0.3);  box-shadow: 0 0 14px rgba(168,85,247,0.08); }
.qa-card--astro  { border-color: rgba(251,191,36,0.3);  box-shadow: 0 0 14px rgba(251,191,36,0.08); }
.qa-card--chron  { border-color: rgba(99,102,241,0.3);  box-shadow: 0 0 14px rgba(99,102,241,0.08); }
.qa-card--import { border-color: rgba(20,184,166,0.3);  box-shadow: 0 0 14px rgba(20,184,166,0.08); }

.qa-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.qa-name {
  font-size: 0.62rem;
  font-weight: 800;
  color: #e2e8f0;
  text-align: center;
  font-family: 'Outfit', sans-serif;
  line-height: 1.1;
}
.qa-desc {
  font-size: 0.56rem;
  color: rgba(148,163,184,0.65);
  text-align: center;
  line-height: 1.1;
}

/* ── Streak Card ────────────────────────────────────────────────────── */
.streak-card {
  margin: 0 1rem;
  border-radius: 18px;
  background: rgba(10, 10, 30, 0.8);
  border: 1px solid rgba(251, 191, 36, 0.25);
  padding: 1rem 1rem 1.2rem 1rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(251,191,36,0.08);
}
.streak-glow {
  position: absolute;
  right: -30px;
  top: -30px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%);
  pointer-events: none;
}
.streak-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.streak-fire-block {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.streak-fire-emoji {
  font-size: 1.6rem;
  animation: fireWiggle 1.5s ease-in-out infinite alternate;
}
@keyframes fireWiggle {
  from { transform: rotate(-5deg) scale(1); }
  to   { transform: rotate(5deg) scale(1.08); }
}
.streak-main-text {
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 800;
  color: #fbbf24;
  margin: 0;
}
.streak-sub-text {
  font-size: 0.62rem;
  color: rgba(203, 213, 225, 0.55);
  margin: 0;
}
.streak-reward-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 0.55rem;
  font-weight: 700;
  color: rgba(251,191,36,0.8);
  text-align: center;
  line-height: 1.2;
}
.streak-reward-badge span:first-child { font-size: 1rem; }

/* Track + nodes — two-row layout: nodes on top, labels below */
.streak-track-wrap {
  position: relative;
  padding-top: 8px; /* room for node glow overflow */
}

/* Full grey connector sits at vertical center of nodes (15px = half of 30px node) */
.streak-connector {
  position: absolute;
  top: 23px; /* 8px padding + 15px (half node height) */
  left: 15px;  /* half first node width */
  right: 15px; /* half last node width */
  height: 3px;
  background: rgba(255,255,255,0.08);
  border-radius: 99px;
}
.streak-connector--progress {
  /* 4 of 7: progress to center of 4th node = (3/6)*100% from center of node 1 */
  right: auto;
  width: calc((3 / 6) * (100% - 30px)); /* 3 gaps of 6 total gaps */
  background: linear-gradient(90deg, #f59e0b, #fbbf24, #fde68a);
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.8);
}
.streak-nodes {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 1;
}
.streak-node-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.streak-node {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 800;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}
.streak-node--lit {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: #0f0a02;
  border: 2px solid #fde68a;
  box-shadow: 0 0 14px rgba(251, 191, 36, 0.7), 0 0 4px rgba(251, 191, 36, 0.4);
}
.streak-node--dim {
  background: rgba(15, 23, 42, 0.9);
  color: rgba(148, 163, 184, 0.5);
  border: 2px solid rgba(148, 163, 184, 0.15);
}
.streak-check { color: #0f0a02; font-size: 0.75rem; font-weight: 900; }
.streak-day-num { color: rgba(148,163,184,0.45); font-size: 0.65rem; }
.streak-day-label {
  font-size: 0.57rem;
  font-weight: 600;
  color: rgba(148, 163, 184, 0.4);
  text-align: center;
}
.streak-day-label--lit { color: rgba(251, 191, 36, 0.75); }

/* ── Suggestions ────────────────────────────────────────────────────── */
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 1rem;
}
.sug-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 0.75rem 0.85rem;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}
.sug-card:active { transform: scale(0.98); background: rgba(15,23,42,0.9); }
.sug-icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}
.sug-icon--purple { background: rgba(168,85,247,0.18); border: 1px solid rgba(168,85,247,0.3); }
.sug-icon--gold   { background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.3); }
.sug-icon--teal   { background: rgba(20,184,166,0.15); border: 1px solid rgba(20,184,166,0.3); }
.sug-icon--green  { background: rgba(34,197,94,0.15);  border: 1px solid rgba(34,197,94,0.3); }
.sug-body { flex: 1; min-width: 0; }
.sug-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 2px 0;
  line-height: 1.3;
  font-family: 'Outfit', sans-serif;
}
.sug-desc {
  font-size: 0.62rem;
  color: rgba(148, 163, 184, 0.65);
  margin: 0;
  line-height: 1.3;
}
.sug-arrow {
  font-size: 1.2rem;
  color: rgba(148,163,184,0.3);
  flex-shrink: 0;
}

/* ── Activity Stats Grid ────────────────────────────────────────────── */
.activity-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  padding: 0 1rem;
  margin-bottom: 0.6rem;
}
.activity-stat-card {
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 0.85rem 0.85rem 0.75rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
  position: relative;
  overflow: hidden;
}
.activity-stat-card--wide {
  grid-column: 1 / -1;
}
.activity-stat-num {
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  font-weight: 900;
  color: #f1f5f9;
  line-height: 1;
}
.activity-stat-num--gold { color: #fbbf24; }
.activity-stat-label {
  font-size: 0.62rem;
  color: rgba(148, 163, 184, 0.6);
  font-weight: 500;
}
.activity-stat-icon {
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  font-size: 1.3rem;
  opacity: 0.25;
}
.activity-accuracy-bar-wrap {
  margin-top: 6px;
  height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 99px;
  overflow: hidden;
}
.activity-accuracy-bar {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  border-radius: 99px;
  box-shadow: 0 0 8px rgba(251,191,36,0.6);
}

/* ── Recent Activity List ───────────────────────────────────────────── */
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 1rem;
  margin-bottom: 0.25rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  overflow: hidden;
  margin-left: 1rem;
  margin-right: 1rem;
}
.recent-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.recent-item:last-child { border-bottom: none; }
.recent-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dot--amber  { background: #fbbf24; box-shadow: 0 0 6px rgba(251,191,36,0.6); }
.dot--green  { background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.6); }
.dot--purple { background: #a855f7; box-shadow: 0 0 6px rgba(168,85,247,0.6); }
.dot--sky    { background: #38bdf8; box-shadow: 0 0 6px rgba(56,189,248,0.6); }
.recent-content { flex: 1; min-width: 0; }
.recent-title {
  font-size: 0.68rem;
  font-weight: 600;
  color: #cbd5e1;
  margin: 0 0 2px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recent-time {
  font-size: 0.58rem;
  color: rgba(148,163,184,0.5);
  margin: 0;
}
.recent-badge {
  font-size: 0.55rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 99px;
  flex-shrink: 0;
  white-space: nowrap;
}
.badge--amber  { background: rgba(251,191,36,0.12); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
.badge--green  { background: rgba(34,197,94,0.1);   color: #22c55e; border: 1px solid rgba(34,197,94,0.3); }
.badge--purple { background: rgba(168,85,247,0.12); color: #c084fc; border: 1px solid rgba(168,85,247,0.3); }
.badge--sky    { background: rgba(56,189,248,0.1);  color: #38bdf8; border: 1px solid rgba(56,189,248,0.3); }

/* ── Kundali wrapper ─────────────────────────────────────────────────── */
.kundali-wrapper {
  padding: 0 1rem;
}
</style>
