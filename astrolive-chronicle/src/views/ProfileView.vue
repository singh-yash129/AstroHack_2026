<template>
  <section class="view-page profile-view">

    <!-- ── Page Header ─────────────────────────────────────────────── -->
    <div class="page-header">
      <div class="header-icon">👤</div>
      <div>
        <h1 class="page-title">My Profile</h1>
        <p class="page-subtitle">Your cosmic identity & settings</p>
      </div>
    </div>

    <!-- ── User Identity Card ──────────────────────────────────────── -->
    <div class="identity-card">
      <div class="identity-glow" />
      <div class="avatar-ring">
        <div class="avatar-inner">R</div>
      </div>
      <div class="identity-info">
        <h2 class="identity-name">Rahul Singh</h2>
        <p class="identity-sign">♊ Gemini Rising · ☉ Leo Sun · ☽ Scorpio Moon</p>
        <div class="identity-badges">
          <span class="id-badge id-badge--gold">⭐ Premium</span>
          <span class="id-badge id-badge--purple">🔥 4-Day Streak</span>
        </div>
      </div>
    </div>

    <!-- ── Birth Chart Details ─────────────────────────────────────── -->
    <div class="section-label-row">
      <span class="section-chip">🌌 BIRTH CHART</span>
    </div>

    <div class="chart-card">
      <div class="chart-row" v-for="row in birthData" :key="row.label">
        <span class="chart-label">{{ row.label }}</span>
        <span class="chart-val">{{ row.value }}</span>
      </div>
    </div>

    <!-- ── Saved Charts ────────────────────────────────────────────── -->
    <div class="section-label-row">
      <span class="section-chip">📊 SAVED CHARTS</span>
      <button class="section-action-btn">+ Add</button>
    </div>

    <div class="saved-charts">
      <div class="saved-chart-chip" v-for="chart in savedCharts" :key="chart.name">
        <span class="saved-chart-icon">{{ chart.icon }}</span>
        <div>
          <p class="saved-chart-name">{{ chart.name }}</p>
          <p class="saved-chart-sub">{{ chart.relation }}</p>
        </div>
      </div>
    </div>

    <!-- ── Settings List ───────────────────────────────────────────── -->
    <div class="section-label-row">
      <span class="section-chip">⚙️ SETTINGS</span>
    </div>

    <div class="settings-list">
      <button class="settings-row" v-for="s in settings" :key="s.label">
        <div class="settings-left">
          <span class="settings-icon-wrap" :class="s.colorClass">{{ s.icon }}</span>
          <div>
            <p class="settings-label">{{ s.label }}</p>
            <p class="settings-sub">{{ s.sub }}</p>
          </div>
        </div>
        <span class="settings-arrow">›</span>
      </button>
    </div>

    <!-- ── Sign Out ────────────────────────────────────────────────── -->
    <button class="signout-btn">Sign Out</button>

    <div style="height: 1rem" />
  </section>
</template>

<script setup>
const birthData = [
  { label: 'Date of Birth',  value: 'June 14, 1994'        },
  { label: 'Time of Birth',  value: '06:32 AM'             },
  { label: 'Place of Birth', value: 'Delhi, India'         },
  { label: 'Ascendant',      value: 'Gemini (Mithuna)'     },
  { label: 'Sun Sign',       value: 'Leo (Simha)'          },
  { label: 'Moon Sign',      value: 'Scorpio (Vrischika)'  },
  { label: 'Nakshatra',      value: 'Jyeshtha — Pada 2'   },
  { label: 'Dasha Period',   value: 'Mercury · 2024–2041'  },
]

const savedCharts = [
  { icon: '👤', name: 'Rahul Singh',  relation: 'Self (Primary)' },
  { icon: '💑', name: 'Priya Sharma', relation: 'Partner'        },
  { icon: '👨', name: 'Rajesh Singh', relation: 'Father'         },
]

const settings = [
  { icon: '🔔', label: 'Notifications',       sub: 'Cosmic alerts & daily nudges',   colorClass: 'si--purple' },
  { icon: '🌐', label: 'Language & Region',   sub: 'English · IST (UTC +5:30)',      colorClass: 'si--blue'   },
  { icon: '🔒', label: 'Privacy & Security',  sub: 'Manage data & account access',   colorClass: 'si--teal'   },
  { icon: '💎', label: 'Subscription',        sub: 'Premium Plan · Renews Aug 2025', colorClass: 'si--gold'   },
  { icon: '🤝', label: 'Refer a Friend',      sub: 'Earn free predictions',          colorClass: 'si--green'  },
  { icon: '❓', label: 'Help & Support',      sub: 'FAQs, chat with us',             colorClass: 'si--slate'  },
]
</script>

<style scoped>
.profile-view { gap: 1rem; }

/* ── Identity Card ──────────────────────────────────────────────────── */
.identity-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(251,191,36,0.06) 100%);
  border: 1px solid rgba(251,191,36,0.2);
  border-radius: 18px;
  padding: 1.1rem 1rem;
  overflow: hidden;
}
.identity-glow {
  position: absolute;
  top: -40px; right: -40px;
  width: 120px; height: 120px;
  background: radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%);
  pointer-events: none;
}
.avatar-ring {
  flex-shrink: 0;
  width: 60px; height: 60px;
  border-radius: 50%;
  background: conic-gradient(#8b5cf6, #fbbf24, #c4b5fd, #f59e0b, #8b5cf6);
  padding: 2.5px;
  animation: spin-slow 12s linear infinite;
  box-shadow: 0 0 20px rgba(251,191,36,0.3);
}
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.avatar-inner {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #200a4e 0%, #0f1e3d 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem; font-weight: 900;
  color: #fbbf24;
}
.identity-info { flex: 1; min-width: 0; }
.identity-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem; font-weight: 800;
  color: #e8eaf6; margin: 0 0 0.2rem 0;
}
.identity-sign {
  font-size: 0.65rem;
  color: rgba(232,234,246,0.5);
  margin: 0 0 0.5rem 0;
}
.identity-badges { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.id-badge {
  font-size: 0.58rem; font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 99px;
}
.id-badge--gold   { background: rgba(251,191,36,0.14); border: 1px solid rgba(251,191,36,0.35); color: #fbbf24; }
.id-badge--purple { background: rgba(168,85,247,0.14); border: 1px solid rgba(168,85,247,0.35); color: #c084fc; }

/* ── Section labels ─────────────────────────────────────────────────── */
.section-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0 0 0;
}
.section-chip {
  font-size: 0.65rem; font-weight: 800;
  letter-spacing: 0.07em; text-transform: uppercase;
  color: rgba(251,191,36,0.85);
  font-family: 'Outfit', sans-serif;
}
.section-action-btn {
  font-size: 0.65rem; font-weight: 700;
  color: rgba(168,85,247,0.9);
  background: rgba(168,85,247,0.1);
  border: 1px solid rgba(168,85,247,0.3);
  border-radius: 99px;
  padding: 0.2rem 0.7rem;
  cursor: pointer;
}

/* ── Birth Chart Card ────────────────────────────────────────────────── */
.chart-card {
  background: rgba(10,8,28,0.75);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
}
.chart-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.chart-row:last-child { border-bottom: none; }
.chart-label { font-size: 0.72rem; color: rgba(232,234,246,0.42); }
.chart-val   { font-size: 0.72rem; font-weight: 700; color: #e8eaf6; }

/* ── Saved Charts ────────────────────────────────────────────────────── */
.saved-charts {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}
.saved-chart-chip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(15,23,42,0.7);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 13px;
  padding: 0.65rem 0.9rem;
}
.saved-chart-icon { font-size: 1.2rem; }
.saved-chart-name {
  font-size: 0.75rem; font-weight: 700; color: #e2e8f0;
  margin: 0 0 0.1rem 0;
}
.saved-chart-sub  { font-size: 0.62rem; color: rgba(148,163,184,0.55); margin: 0; }

/* ── Settings ────────────────────────────────────────────────────────── */
.settings-list {
  display: flex;
  flex-direction: column;
  background: rgba(10,8,28,0.75);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  overflow: hidden;
}
.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  background: transparent;
  border-left: none; border-right: none;
  cursor: pointer;
  transition: background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}
.settings-row:last-child { border-bottom: none; }
.settings-row:active { background: rgba(255,255,255,0.04); }
.settings-left { display: flex; align-items: center; gap: 0.75rem; }
.settings-icon-wrap {
  width: 34px; height: 34px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.95rem;
  flex-shrink: 0;
}
.si--purple { background: rgba(168,85,247,0.15); }
.si--blue   { background: rgba(99,102,241,0.15); }
.si--teal   { background: rgba(20,184,166,0.15); }
.si--gold   { background: rgba(251,191,36,0.12); }
.si--green  { background: rgba(34,197,94,0.12);  }
.si--slate  { background: rgba(148,163,184,0.1); }

.settings-label {
  font-size: 0.75rem; font-weight: 700; color: #e2e8f0;
  margin: 0 0 0.1rem 0; text-align: left;
}
.settings-sub { font-size: 0.62rem; color: rgba(148,163,184,0.5); margin: 0; text-align: left; }
.settings-arrow { font-size: 1.1rem; color: rgba(148,163,184,0.3); }

/* ── Sign Out ────────────────────────────────────────────────────────── */
.signout-btn {
  width: 100%;
  padding: 0.8rem;
  border-radius: 14px;
  border: 1px solid rgba(239,68,68,0.3);
  background: rgba(239,68,68,0.07);
  color: rgba(252,165,165,0.8);
  font-size: 0.82rem; font-weight: 700;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  transition: background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}
.signout-btn:active { background: rgba(239,68,68,0.14); }
</style>
