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

    <!-- Planet Placement Details Modal / Bottom Sheet -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="selectedPlanet" class="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm" @click.self="closePlanetDetails">
          <div class="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-purple-950/90 border border-purple-500/30 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl relative animate-slide-up">
            
            <!-- Close Button -->
            <button class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold hover:bg-slate-700" @click="closePlanetDetails">
              ✕
            </button>

            <!-- Planet Header -->
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-amber-400/30" :class="selectedPlanet.bgGradient">
                {{ selectedPlanet.symbol }}
              </div>
              <div>
                <span class="text-[10px] font-extrabold tracking-widest text-amber-400 uppercase bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  {{ selectedPlanet.category }}
                </span>
                <h3 class="text-lg font-extrabold text-slate-100 font-['Outfit'] mt-1">
                  {{ selectedPlanet.name }} in {{ selectedPlanet.houseName }}
                </h3>
              </div>
            </div>

            <!-- Energy & Manifestation Impact Box -->
            <div class="bg-slate-950/60 border border-purple-500/20 rounded-xl p-3.5 mb-4">
              <p class="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span>⚡</span> Manifestation Energy
              </p>
              <p class="text-xs text-slate-200 leading-relaxed font-normal">
                {{ selectedPlanet.manifestationEffect }}
              </p>
            </div>

            <!-- Detailed Explanation -->
            <div class="space-y-2 mb-5">
              <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-800">
                <span class="text-slate-400">Zodiac Sign Alignment</span>
                <span class="font-bold text-slate-200">{{ selectedPlanet.zodiacSign }}</span>
              </div>
              <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-800">
                <span class="text-slate-400">Power Level</span>
                <span class="font-bold text-amber-400">{{ selectedPlanet.powerRating }} / 100</span>
              </div>
              <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-800">
                <span class="text-slate-400">Cosmic Element</span>
                <span class="font-bold text-indigo-300">{{ selectedPlanet.element }}</span>
              </div>
            </div>

            <!-- Actionable Remedy / Advice -->
            <div class="bg-amber-400/10 border border-amber-400/30 rounded-xl p-3 flex items-start gap-2.5">
              <span class="text-base">💡</span>
              <p class="text-xs text-amber-200/90 leading-snug">
                <strong class="text-amber-300">Cosmic Key:</strong> {{ selectedPlanet.keyRemedy }}
              </p>
            </div>

            <!-- Got it button -->
            <button class="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-purple-600 text-slate-950 font-bold text-xs uppercase tracking-wider font-['Outfit'] shadow-lg shadow-amber-500/20 hover:opacity-95 active:scale-[0.98] transition-all" @click="closePlanetDetails">
              Close Placement Details
            </button>
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

/* ── Modal animations ─────────────────────────────────────────────── */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes slideUp {
  from { transform: translateY(24px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.animate-slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
