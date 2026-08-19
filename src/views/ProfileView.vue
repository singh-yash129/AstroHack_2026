<template>
  <section class="view-page profile-view">

    <!-- ── Page Header ─────────────────────────────────────────────── -->
    <div class="page-header">
      <div class="header-icon">👤</div>
      <div>
        <h1 class="page-title">My Profile</h1>
        <p class="page-subtitle">Your cosmic identity &amp; saved charts</p>
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
        <p class="identity-sign">♊ Gemini Rising &bull; ☉ Leo Sun &bull; ☽ Scorpio Moon</p>
        <div class="identity-badges">
          <span class="id-badge id-badge--gold">⭐ Premium Member</span>
          <span class="id-badge id-badge--purple">🔥 4-Day Streak</span>
        </div>
      </div>
    </div>

    <!-- ── Primary Birth Chart Details ──────────────────────────────── -->
    <div class="section-label-row">
      <span class="section-chip">🌌 PRIMARY BIRTH DETAILS</span>
    </div>

    <div class="chart-card">
      <div class="chart-row" v-for="row in birthData" :key="row.label">
        <span class="chart-label">{{ row.label }}</span>
        <span class="chart-val">{{ row.value }}</span>
      </div>
    </div>

    <!-- ── Saved Kundalis ───────────────────────────────────────────── -->
    <div class="section-label-row">
      <span class="section-chip">📊 SAVED KUNDALIS ({{ store.savedKundalis.length }})</span>
      <button class="section-action-btn" @click="showKundaliModal = true">+ Create Kundali</button>
    </div>

    <div v-if="store.savedKundalis.length === 0" class="empty-saved">
      <p>No saved Kundalis yet. Click "+ Create Kundali" to generate your first chart.</p>
    </div>

    <div v-else class="saved-charts">
      <div
        v-for="chart in store.savedKundalis"
        :key="chart.id"
        class="saved-chart-chip"
      >
        <span class="saved-chart-icon">🪐</span>
        <div class="saved-chart-main">
          <div class="saved-chart-top">
            <p class="saved-chart-name">{{ chart.name }}</p>
            <span class="saved-relation-pill">{{ chart.relation }}</span>
          </div>
          <p class="saved-chart-sub">{{ chart.lagna }} &bull; {{ chart.moonSign }}</p>
          <span class="saved-gen-type">{{ chart.generatorType }} &bull; {{ chart.createdAt }}</span>
        </div>
        <!-- Delete Button -->
        <button
          class="delete-chart-btn"
          @click="deleteKundali(chart.id, chart.name)"
          title="Delete Saved Kundali"
          aria-label="Delete Chart"
        >
          🗑️
        </button>
      </div>
    </div>

    <!-- ── Saved AI Palm Scans ─────────────────────────────────────── -->
    <div class="section-label-row">
      <span class="section-chip">🤚 SAVED PALM SCANS ({{ store.savedPalmScans.length }})</span>
      <button class="section-action-btn" @click="router.push('/palm-scanner')">+ New Scan</button>
    </div>

    <div v-if="store.savedPalmScans.length === 0" class="empty-saved">
      <p>No saved palm scans. Use AI Palm Scanner to scan your 5 palm angles.</p>
    </div>

    <div v-else class="saved-charts">
      <div
        v-for="scan in store.savedPalmScans"
        :key="scan.id"
        class="saved-chart-chip"
      >
        <span class="saved-chart-icon">✋</span>
        <div class="saved-chart-main">
          <p class="saved-chart-name">{{ scan.name }}</p>
          <p class="saved-chart-sub">{{ scan.vitality }} &bull; {{ scan.heartLine }}</p>
          <span class="saved-gen-type">5 Photo Angle Scan &bull; {{ scan.createdAt }}</span>
        </div>
        <!-- Delete Button -->
        <button
          class="delete-chart-btn"
          @click="deletePalmScan(scan.id, scan.name)"
          title="Delete Saved Palm Scan"
          aria-label="Delete Scan"
        >
          🗑️
        </button>
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

    <!-- Kundali Creator Modal -->
    <KundaliCreatorModal
      :is-open="showKundaliModal"
      @close="showKundaliModal = false"
    />

  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChronicleStore } from '../stores/chronicle.js'
import KundaliCreatorModal from '../components/KundaliCreatorModal.vue'

const router = useRouter()
const store = useChronicleStore()

const showKundaliModal = ref(false)

function deleteKundali(id, name) {
  if (confirm(`Are you sure you want to delete Kundali for ${name}?`)) {
    store.deleteKundali(id)
  }
}

function deletePalmScan(id, name) {
  if (confirm(`Are you sure you want to delete ${name}?`)) {
    store.deletePalmScan(id)
  }
}

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
.profile-view {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Identity Card */
.identity-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.15rem;
  background: linear-gradient(135deg, rgba(30, 15, 60, 0.85) 0%, rgba(10, 20, 45, 0.9) 100%);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 1.25rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  overflow: hidden;
}
.identity-glow {
  position: absolute;
  top: -20px; right: -20px;
  width: 100px; height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%);
  pointer-events: none;
}
.avatar-ring {
  flex-shrink: 0;
  width: 58px; height: 58px;
  border-radius: 50%;
  background: conic-gradient(#8b5cf6, #fbbf24, #c4b5fd, #f59e0b, #8b5cf6);
  padding: 2.5px;
  box-shadow: 0 0 20px rgba(251,191,36,0.3);
}
.avatar-inner {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #200a4e 0%, #0f1e3d 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem; font-weight: 800; color: #fbbf24;
}
.identity-info { flex: 1; min-width: 0; }
.identity-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.15rem; font-weight: 800; color: #f1f5f9;
  line-height: 1.1; margin: 0 0 0.2rem 0;
}
.identity-sign {
  font-size: 0.65rem; color: rgba(226,232,240,0.65);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  margin-bottom: 0.4rem;
}
.identity-badges { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.id-badge {
  font-size: 0.58rem; font-weight: 700;
  padding: 0.15rem 0.5rem; border-radius: 999px;
}
.id-badge--gold   { color: #fbbf24; background: rgba(251,191,36,0.12); border: 1px solid rgba(251,191,36,0.3); }
.id-badge--purple { color: #c084fc; background: rgba(168,85,247,0.12); border: 1px solid rgba(168,85,247,0.3); }

/* Section Label Row */
.section-label-row {
  display: flex; align-items: center; justify-content: space-between;
}
.section-chip {
  font-size: 0.65rem; font-weight: 800;
  letter-spacing: 0.07em; text-transform: uppercase;
  color: rgba(251,191,36,0.85); font-family: 'Outfit', sans-serif;
}
.section-action-btn {
  font-size: 0.65rem; font-weight: 700;
  color: rgba(168,85,247,0.9); background: rgba(168,85,247,0.1);
  border: 1px solid rgba(168,85,247,0.3); border-radius: 99px;
  padding: 0.2rem 0.7rem; cursor: pointer; transition: all 0.2s;
}
.section-action-btn:hover { background: rgba(168,85,247,0.2); }

/* Birth Chart Card */
.chart-card {
  background: rgba(10,8,28,0.75);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; overflow: hidden;
}
.chart-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.65rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.04);
}
.chart-row:last-child { border-bottom: none; }
.chart-label { font-size: 0.72rem; color: rgba(232,234,246,0.42); }
.chart-val   { font-size: 0.72rem; font-weight: 700; color: #e8eaf6; }

/* Saved Charts */
.empty-saved {
  font-size: 0.68rem; color: rgba(226,232,240,0.5); text-align: center;
  padding: 0.85rem; background: rgba(255,255,255,0.02);
  border: 1px dashed rgba(255,255,255,0.1); border-radius: 0.85rem;
}
.saved-charts { display: flex; flex-direction: column; gap: 0.45rem; }
.saved-chart-chip {
  display: flex; align-items: center; gap: 0.75rem;
  background: rgba(15,23,42,0.7); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 13px; padding: 0.65rem 0.9rem; transition: all 0.2s;
}
.saved-chart-icon { font-size: 1.2rem; flex-shrink: 0; }
.saved-chart-main { flex: 1; min-width: 0; }

.saved-chart-top { display: flex; align-items: center; gap: 0.4rem; }
.saved-chart-name {
  font-size: 0.75rem; font-weight: 800; color: #e2e8f0; margin: 0;
}
.saved-relation-pill {
  font-size: 0.55rem; font-weight: 700; color: #fbbf24;
  background: rgba(251,191,36,0.12); padding: 1px 5px; border-radius: 4px;
}

.saved-chart-sub { font-size: 0.62rem; color: rgba(148,163,184,0.75); margin: 0.15rem 0 0.1rem 0; }
.saved-gen-type  { font-size: 0.58rem; color: rgba(168,85,247,0.8); display: block; }

/* Delete Button */
.delete-chart-btn {
  background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 8px; width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
}
.delete-chart-btn:hover { background: rgba(239, 68, 68, 0.25); transform: scale(1.05); }

/* Settings */
.settings-list {
  display: flex; flex-direction: column;
  background: rgba(10,8,28,0.75); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px; overflow: hidden;
}
.settings-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.8rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.04);
  background: transparent; border-left: none; border-right: none; border-top: none;
  cursor: pointer; text-align: left; transition: background 0.2s ease;
}
.settings-row:last-child { border-bottom: none; }
.settings-row:hover { background: rgba(255,255,255,0.03); }

.settings-left { display: flex; align-items: center; gap: 0.75rem; }
.settings-icon-wrap {
  width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; flex-shrink: 0;
}
.si--purple { background: rgba(109,40,217,0.2); }
.si--blue   { background: rgba(30,58,138,0.25); }
.si--teal   { background: rgba(13,148,136,0.2); }
.si--gold   { background: rgba(217,119,6,0.2);  }
.si--green  { background: rgba(22,101,52,0.25);  }
.si--slate  { background: rgba(51,65,85,0.4);    }

.settings-label { font-size: 0.78rem; font-weight: 600; color: #e8eaf6; margin: 0 0 0.1rem 0; }
.settings-sub   { font-size: 0.62rem; color: rgba(232,234,246,0.42); margin: 0; }
.settings-arrow { font-size: 1rem; color: rgba(232,234,246,0.3); font-weight: 300; }

.signout-btn {
  width: 100%; padding: 0.85rem; border-radius: 14px;
  background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25);
  color: #f87171; font-size: 0.82rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s ease; margin-top: 0.5rem;
}
.signout-btn:hover { background: rgba(239,68,68,0.18); }
</style>
