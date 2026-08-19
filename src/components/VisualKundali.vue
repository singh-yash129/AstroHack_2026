<template>
  <div class="kundali-outer-card">
    <p class="kundali-hint">🪐 Tap any planet badge to reveal its manifestation energy</p>

    <!-- North Indian Style Kundali SVG Chart -->
    <div class="kundali-chart-wrapper">
      <svg class="w-full h-full drop-shadow-[0_0_15px_rgba(168,85,247,0.15)]" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- outer border -->
        <rect x="10" y="10" width="380" height="380" stroke="url(#kundali-stroke)" stroke-width="2.5" fill="rgba(15, 23, 42, 0.6)" rx="4" />
        
        <!-- Diagonals -->
        <line x1="10" y1="10" x2="390" y2="390" stroke="url(#kundali-stroke)" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.6" />
        <line x1="390" y1="10" x2="10" y2="390" stroke="url(#kundali-stroke)" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.6" />
        
        <!-- Inner Diamond (connecting midpoints of outer square) -->
        <polygon points="200,10 390,200 200,390 10,200" stroke="url(#kundali-stroke-bright)" stroke-width="2" fill="rgba(30, 27, 75, 0.4)" />
        
        <!-- Center house cross accents -->
        <circle cx="200" cy="200" r="3" fill="#fbbf24" opacity="0.8" />

        <!-- House Numbers (1 to 12 in traditional North Indian order) -->
        <!-- House 1 (Top Center Diamond) -->
        <text x="200" y="115" class="house-number">1</text>
        <!-- House 2 (Top Left Triangle) -->
        <text x="110" y="65" class="house-number">2</text>
        <!-- House 3 (Left Top Triangle) -->
        <text x="65" y="110" class="house-number">3</text>
        <!-- House 4 (Left Center Diamond) -->
        <text x="115" y="205" class="house-number">4</text>
        <!-- House 5 (Left Bottom Triangle) -->
        <text x="65" y="300" class="house-number">5</text>
        <!-- House 6 (Bottom Left Triangle) -->
        <text x="110" y="345" class="house-number">6</text>
        <!-- House 7 (Bottom Center Diamond) -->
        <text x="200" y="295" class="house-number">7</text>
        <!-- House 8 (Bottom Right Triangle) -->
        <text x="290" y="345" class="house-number">8</text>
        <!-- House 9 (Right Bottom Triangle) -->
        <text x="335" y="300" class="house-number">9</text>
        <!-- House 10 (Right Center Diamond) -->
        <text x="285" y="205" class="house-number">10</text>
        <!-- House 11 (Right Top Triangle) -->
        <text x="335" y="110" class="house-number">11</text>
        <!-- House 12 (Top Right Triangle) -->
        <text x="290" y="65" class="house-number">12</text>

        <!-- Gradients -->
        <defs>
          <linearGradient id="kundali-stroke" x1="0" y1="0" x2="400" y2="400" gradientUnits="userSpaceOnUse">
            <stop stop-color="#a855f7" />
            <stop offset="0.5" stop-color="#fbbf24" />
            <stop offset="1" stop-color="#6366f1" />
          </linearGradient>
          <linearGradient id="kundali-stroke-bright" x1="0" y1="400" x2="400" y2="0" gradientUnits="userSpaceOnUse">
            <stop stop-color="#fbbf24" />
            <stop offset="1" stop-color="#c084fc" />
          </linearGradient>
        </defs>
      </svg>

      <!-- Interactive Planet Badges Overlay -->
      <button
        v-for="p in PLANETS"
        :key="p.id"
        class="planet-chip"
        :class="p.badgeClass"
        :style="{ left: p.x + '%', top: p.y + '%' }"
        @click="openPlanetDetails(p)"
      >
        <span class="chip-sym">{{ p.symbol }}</span>
        <span class="chip-name">{{ p.shortName }}</span>
      </button>
    </div>

    <!-- Planet Placement Bottom Sheet -->
    <Teleport to="#phone-screen">
      <!-- Backdrop -->
      <Transition name="bs-backdrop-fade">
        <div
          v-if="selectedPlanet"
          class="pk-backdrop"
          @click="closePlanetDetails"
        />
      </Transition>

      <!-- Sheet -->
      <Transition name="pk-sheet-slide">
        <div
          v-if="selectedPlanet"
          class="pk-sheet"
          role="dialog"
          aria-modal="true"
        >
          <!-- Drag handle -->
          <div class="pk-handle" />

          <!-- Planet header identity -->
          <div class="pk-header">
            <div class="pk-planet-ring">
              <div class="pk-planet-avatar">{{ selectedPlanet.symbol }}</div>
            </div>
            <div class="pk-info">
              <div class="pk-name-row">
                <h2 class="pk-name">{{ selectedPlanet.name }}</h2>
                <span class="pk-category-chip">{{ selectedPlanet.category }}</span>
              </div>
              <p class="pk-house">{{ selectedPlanet.houseName }}</p>
              <div class="pk-power-pill">
                <span class="pk-power-val">{{ selectedPlanet.powerRating }}</span>
                <span class="pk-power-lbl">Power Rating / 100</span>
              </div>
            </div>
          </div>

          <!-- Manifestation energy pitch -->
          <div class="pk-pitch">
            <div class="pk-pitch-icon">⚡</div>
            <p class="pk-pitch-text">{{ selectedPlanet.manifestationEffect }}</p>
          </div>

          <!-- Stat rows -->
          <div class="pk-stats">
            <div class="pk-stat-row">
              <span class="pk-stat-label">Zodiac Sign</span>
              <span class="pk-stat-val">{{ selectedPlanet.zodiacSign }}</span>
            </div>
            <div class="pk-stat-row">
              <span class="pk-stat-label">Cosmic Element</span>
              <span class="pk-stat-val">{{ selectedPlanet.element }}</span>
            </div>
          </div>

          <!-- Cosmic Key remedy -->
          <div class="pk-remedy">
            <span class="pk-remedy-icon">💡</span>
            <p class="pk-remedy-text">
              <strong class="pk-remedy-strong">Cosmic Key:</strong>
              {{ selectedPlanet.keyRemedy }}
            </p>
          </div>

          <!-- Gold CTA -->
          <button class="pk-cta" @click="closePlanetDetails">
            <span class="pk-cta-label">Got it — Close</span>
            <span class="pk-cta-sub">{{ selectedPlanet.houseName }}</span>
          </button>

          <!-- Trust strip -->
          <div class="pk-trust">
            <span>🌌 Vedic Astrology</span>
            <span>✦</span>
            <span>🔮 Lagna Chart</span>
            <span>✦</span>
            <span>✨ Manifestation AI</span>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// ── Planets Data Positioned on North Indian Diamond Chart ──────────────────
const PLANETS = [
  {
    id: 'sun',
    name: 'Sun (Surya)',
    shortName: 'Sun',
    symbol: '☉',
    houseNum: 1,
    houseName: '1st House (Lagna / Self)',
    x: 50,
    y: 35,
    badgeClass: 'border-amber-400/50 text-amber-300 shadow-amber-500/20',
    bgGradient: 'bg-gradient-to-br from-amber-500/30 to-orange-600/30',
    category: 'Leadership & Soul',
    zodiacSign: 'Aries (Exalted)',
    powerRating: 96,
    element: 'Fire 🔥',
    manifestationEffect: 'Sun in the 1st House radiates intense vitality, magnetic aura, and high willpower. Your manifestation clarity is at peak capacity.',
    keyRemedy: 'Offer water to the rising Sun at dawn and maintain visible leadership in projects.',
  },
  {
    id: 'mercury',
    name: 'Mercury (Budh)',
    shortName: 'Merc',
    symbol: '☿',
    houseNum: 2,
    houseName: '2nd House (Wealth & Speech)',
    x: 28,
    y: 22,
    badgeClass: 'border-emerald-400/50 text-emerald-300 shadow-emerald-500/20',
    bgGradient: 'bg-gradient-to-br from-emerald-500/30 to-teal-600/30',
    category: 'Finance & Intellect',
    zodiacSign: 'Taurus',
    powerRating: 88,
    element: 'Earth 🌍',
    manifestationEffect: 'Mercury in 2nd House bestows sharp financial intellect, persuasive speech, and rapid wealth generation opportunities.',
    keyRemedy: 'Use clear written agreements and express financial goals out loud daily.',
  },
  {
    id: 'rahu',
    name: 'Rahu (North Node)',
    shortName: 'Rahu',
    symbol: '☊',
    houseNum: 3,
    houseName: '3rd House (Courage & Media)',
    x: 22,
    y: 34,
    badgeClass: 'border-purple-400/50 text-purple-300 shadow-purple-500/20',
    bgGradient: 'bg-gradient-to-br from-purple-500/30 to-indigo-600/30',
    category: 'Innovation & Drive',
    zodiacSign: 'Gemini',
    powerRating: 92,
    element: 'Air 💨',
    manifestationEffect: 'Rahu in 3rd House sparks unconventional courage, digital influence, and breakthroughs through bold self-expression.',
    keyRemedy: 'Embrace new media technologies and take calculated risks.',
  },
  {
    id: 'moon',
    name: 'Moon (Chandra)',
    shortName: 'Moon',
    symbol: '☽',
    houseNum: 4,
    houseName: '4th House (Emotion & Home)',
    x: 32,
    y: 50,
    badgeClass: 'border-sky-300/50 text-sky-200 shadow-sky-500/20',
    bgGradient: 'bg-gradient-to-br from-sky-500/30 to-blue-600/30',
    category: 'Intuition & Peace',
    zodiacSign: 'Cancer (Own Sign)',
    powerRating: 94,
    element: 'Water 💧',
    manifestationEffect: 'Moon in 4th House brings deep intuitive peace, emotional sanctuary, and subconscious alignment with your true desires.',
    keyRemedy: 'Meditate near water or practice evening moonlit breathwork.',
  },
  {
    id: 'mars',
    name: 'Mars (Mangal)',
    shortName: 'Mars',
    symbol: '♂',
    houseNum: 10,
    houseName: '10th House (Career & Zenith)',
    x: 68,
    y: 50,
    badgeClass: 'border-rose-500/50 text-rose-300 shadow-rose-500/20',
    bgGradient: 'bg-gradient-to-br from-rose-500/30 to-red-600/30',
    category: 'Ambition & Action',
    zodiacSign: 'Capricorn (Exalted)',
    powerRating: 98,
    element: 'Fire 🔥',
    manifestationEffect: 'Mars in 10th House (Dig Bala / Directional Strength) grants unshakeable career momentum, executive authority, and decisive execution.',
    keyRemedy: 'Channel physical energy into high-priority professional goals immediately.',
  },
  {
    id: 'jupiter',
    name: 'Jupiter (Guru)',
    shortName: 'Jup',
    symbol: '♃',
    houseNum: 9,
    houseName: '9th House (Luck & Dharma)',
    x: 78,
    y: 65,
    badgeClass: 'border-yellow-400/50 text-yellow-300 shadow-yellow-500/20',
    bgGradient: 'bg-gradient-to-br from-yellow-500/30 to-amber-600/30',
    category: 'Wisdom & Expansion',
    zodiacSign: 'Sagittarius',
    powerRating: 95,
    element: 'Fire 🔥',
    manifestationEffect: 'Jupiter in 9th House activates cosmic luck, higher wisdom, and effortless alignment with divine timing.',
    keyRemedy: 'Seek mentorship, study sacred wisdom, and practice generous gratitude.',
  },
  {
    id: 'venus',
    name: 'Venus (Shukra)',
    shortName: 'Ven',
    symbol: '♀',
    houseNum: 7,
    houseName: '7th House (Love & Partner)',
    x: 50,
    y: 66,
    badgeClass: 'border-pink-400/50 text-pink-300 shadow-pink-500/20',
    bgGradient: 'bg-gradient-to-br from-pink-500/30 to-rose-600/30',
    category: 'Love & Harmony',
    zodiacSign: 'Libra',
    powerRating: 91,
    element: 'Air 💨',
    manifestationEffect: 'Venus in 7th House fosters magnetic attraction, soulmate connection, and harmonious business partnerships.',
    keyRemedy: 'Surround your workspace with aesthetic beauty and cultivate genuine partnerships.',
  },
  {
    id: 'saturn',
    name: 'Saturn (Shani)',
    shortName: 'Sat',
    symbol: '♄',
    houseNum: 11,
    houseName: '11th House (Gains & Network)',
    x: 78,
    y: 35,
    badgeClass: 'border-indigo-400/50 text-indigo-300 shadow-indigo-500/20',
    bgGradient: 'bg-gradient-to-br from-indigo-500/30 to-purple-600/30',
    category: 'Wealth & Stability',
    zodiacSign: 'Aquarius',
    powerRating: 90,
    element: 'Air 💨',
    manifestationEffect: 'Saturn in 11th House ensures enduring financial rewards, compound gains, and influential long-term network alliances.',
    keyRemedy: 'Maintain long-term discipline and support community causes.',
  },
]

// ── Selected Planet Modal State ────────────────────────────────────────────
const selectedPlanet = ref(null)

function openPlanetDetails(planet) {
  selectedPlanet.value = planet
}

function closePlanetDetails() {
  selectedPlanet.value = null
}
</script>

<style scoped>
/* ── Outer card shell ─────────────────────────────────────────────── */
.kundali-outer-card {
  background: rgba(10, 8, 28, 0.85);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 18px;
  padding: 0.85rem 0.85rem 1rem 0.85rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(168,85,247,0.08);
  overflow: hidden;
}

.kundali-hint {
  font-size: 0.62rem;
  color: rgba(148, 163, 184, 0.55);
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

/* ── SVG wrapper: true square, clips chips at boundary ───────────── */
.kundali-chart-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  user-select: none;
  overflow: visible; /* chips can slightly overflow — clamp via clip-path not needed */
}

.kundali-chart-wrapper svg {
  width: 100%;
  height: 100%;
  display: block;
  filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.15));
}

/* ── Planet chips ─────────────────────────────────────────────────── */
.planet-chip {
  position: absolute;
  transform: translate(-50%, -50%);
  display: inline-flex;
  align-items: center;
  gap: 3px;
  /* compact padding */
  padding: 3px 7px 3px 5px;
  border-radius: 99px;
  border: 1px solid currentColor;
  background: rgba(2, 4, 18, 0.92);
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);
  /* reset button defaults */
  font-family: 'Inter', sans-serif;
  line-height: 1;
  -webkit-tap-highlight-color: transparent;
}
.planet-chip:hover { transform: translate(-50%, -50%) scale(1.12); }
.planet-chip:active { transform: translate(-50%, -50%) scale(0.95); }

.chip-sym {
  font-size: 0.7rem;
  line-height: 1;
}
.chip-name {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.01em;
}

/* ── House numbers ────────────────────────────────────────────────── */
.house-number {
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  font-weight: 800;
  fill: rgba(251, 191, 36, 0.35);
  text-anchor: middle;
  dominant-baseline: central;
}

/* ═══════════════════════════════════════════════════════════════════
   PLANET BOTTOM SHEET — matches ConsultationBottomSheet style
═══════════════════════════════════════════════════════════════════ */

/* Backdrop */
.pk-backdrop {
  position: fixed;
  inset: 0;
  z-index: 900;
  background: rgba(3, 7, 18, 0.75);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

/* Sheet */
.pk-sheet {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  z-index: 901;
  background: linear-gradient(
    160deg,
    rgba(15, 10, 40, 0.98) 0%,
    rgba(10, 8, 30, 0.98) 100%
  );
  border-top: 1px solid rgba(139, 92, 246, 0.25);
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 0 1.25rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 -8px 40px rgba(109, 40, 217, 0.25),
              0 -2px 0 rgba(139, 92, 246, 0.1),
              inset 0 1px 0 rgba(255,255,255,0.04);
  max-height: 90dvh;
  overflow-y: auto;
  scrollbar-width: none;
}
.pk-sheet::-webkit-scrollbar { display: none; }

/* Drag handle */
.pk-handle {
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255,255,255,0.12);
  margin: 0.85rem auto 0;
  flex-shrink: 0;
}

/* Header strip */
.pk-header {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

/* Planet avatar ring — spinning conic gradient like ConsultationBottomSheet */
.pk-planet-ring {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: conic-gradient(#8b5cf6, #fbbf24, #c4b5fd, #f59e0b, #8b5cf6);
  padding: 2px;
  box-shadow: 0 0 18px rgba(251, 191, 36, 0.35);
}
@keyframes pk-spin-slow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.pk-planet-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e1040 0%, #0f1e3d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.pk-info { flex: 1; display: flex; flex-direction: column; gap: 0.2rem; }

.pk-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pk-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: #e8eaf6;
  margin: 0;
}

.pk-category-chip {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  background: rgba(168, 85, 247, 0.18);
  border: 1px solid rgba(168, 85, 247, 0.35);
  color: #c084fc;
  white-space: nowrap;
}

.pk-house {
  font-size: 0.68rem;
  color: rgba(232, 234, 246, 0.45);
  margin: 0;
}

.pk-power-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  margin-top: 0.1rem;
}
.pk-power-val {
  font-family: 'Outfit', sans-serif;
  font-size: 0.78rem;
  font-weight: 900;
  color: #fbbf24;
}
.pk-power-lbl {
  font-size: 0.57rem;
  font-weight: 600;
  color: rgba(251, 191, 36, 0.6);
}

/* Pitch block */
.pk-pitch {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.85rem 1rem;
  border-radius: 0.875rem;
  background: rgba(109, 40, 217, 0.1);
  border: 1px solid rgba(109, 40, 217, 0.22);
}
.pk-pitch-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 0.05rem; }
.pk-pitch-text {
  font-size: 0.8rem;
  color: rgba(232, 234, 246, 0.72);
  line-height: 1.55;
  margin: 0;
}

/* Stat rows */
.pk-stats {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.pk-stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.pk-stat-row:last-child { border-bottom: none; }
.pk-stat-label {
  font-size: 0.72rem;
  color: rgba(232, 234, 246, 0.45);
}
.pk-stat-val {
  font-size: 0.72rem;
  font-weight: 700;
  color: #e8eaf6;
}

/* Remedy */
.pk-remedy {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  padding: 0.8rem 0.9rem;
  background: rgba(251, 191, 36, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.25);
  border-radius: 0.875rem;
}
.pk-remedy-icon { font-size: 1.1rem; flex-shrink: 0; }
.pk-remedy-text { font-size: 0.78rem; color: rgba(232, 234, 246, 0.65); line-height: 1.5; margin: 0; }
.pk-remedy-strong { color: #fbbf24; font-weight: 700; }

/* Gold CTA button — matches .bs-cta */
.pk-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.2rem;
  width: 100%;
  padding: 0.95rem 1.5rem;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  color: #030712;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%);
  box-shadow: 0 0 28px rgba(251,191,36,0.35), 0 6px 20px rgba(0,0,0,0.4);
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
  -webkit-tap-highlight-color: transparent;
  animation: pk-cta-pulse 3s ease-in-out infinite;
}
@keyframes pk-cta-pulse {
  0%, 100% { box-shadow: 0 0 28px rgba(251,191,36,0.35), 0 6px 20px rgba(0,0,0,0.4); }
  50%       { box-shadow: 0 0 44px rgba(251,191,36,0.55), 0 6px 24px rgba(0,0,0,0.5); }
}
.pk-cta:hover {
  transform: translateY(-2px) scale(1.02);
  animation: none;
  box-shadow: 0 0 44px rgba(251,191,36,0.5), 0 10px 28px rgba(0,0,0,0.5);
}
.pk-cta:active { transform: scale(0.97); }
.pk-cta-label { font-size: 0.95rem; font-weight: 800; }
.pk-cta-sub   { font-size: 0.65rem; font-weight: 500; opacity: 0.65; }

/* Trust strip */
.pk-trust {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-size: 0.6rem;
  color: rgba(232, 234, 246, 0.22);
  flex-wrap: wrap;
}

/* Transitions */
.bs-backdrop-fade-enter-active,
.bs-backdrop-fade-leave-active { transition: opacity 0.28s ease; }
.bs-backdrop-fade-enter-from,
.bs-backdrop-fade-leave-to { opacity: 0; }

.pk-sheet-slide-enter-active {
  transition: transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.28s ease;
}
.pk-sheet-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.pk-sheet-slide-enter-from,
.pk-sheet-slide-leave-to {
  transform: translateX(-50%) translateY(100%);
  opacity: 0;
}
</style>
