import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * useChronicleStore
 * Manages predictions, saved Kundalis, and saved Palm scans.
 */
export const useChronicleStore = defineStore('chronicle', () => {
  // ── Mock prediction dataset ─────────────────────────────────────────────
  const predictions = ref([
    {
      id: 1,
      category: 'Career',
      categoryIcon: '💼',
      title: 'A transformative professional door opens',
      description:
        'Jupiter aligns with your natal Midheaven, signalling a pivotal career leap. An unexpected offer or promotion will arrive from an organisation you admire. Trust the timing of the cosmos.',
      timeframe: 'Aug – Sep 2025',
      planet: 'Jupiter',
      status: 'fulfilled',
      fulfilledDate: '12 Aug 2025',
      astrologerName: 'Aria Moonwhisper',
      astrologerRating: 4.9,
    },
    {
      id: 2,
      category: 'Love',
      categoryIcon: '💞',
      title: 'Venus ignites a soul-deep connection',
      description:
        'A chance meeting during a Mercury retrograde shadow period will feel destined. This individual shares your rising sign and will mirror your deepest desires back to you.',
      timeframe: 'Oct 2025',
      planet: 'Venus',
      status: 'fulfilled',
      fulfilledDate: '03 Oct 2025',
      astrologerName: 'Sol Vega',
      astrologerRating: 4.7,
    },
    {
      id: 3,
      category: 'Finance',
      categoryIcon: '💰',
      title: 'Unexpected abundance flows in',
      description:
        'The North Node transiting your second house of wealth activates a dormant income stream. A past investment or creative project begins to yield returns you had almost forgotten.',
      timeframe: 'Nov 2025',
      planet: 'North Node',
      status: 'fulfilled',
      fulfilledDate: '21 Nov 2025',
      astrologerName: 'Celeste Nadir',
      astrologerRating: 5.0,
    },
    {
      id: 4,
      category: 'Health',
      categoryIcon: '🌿',
      title: 'A healing cycle begins at the solstice',
      description:
        'Chiron direct in Aries activates your sixth house. A chronic discomfort loses its grip. You will discover a holistic practice that harmonises body and spirit in a lasting way.',
      timeframe: 'Dec 2025',
      planet: 'Chiron',
      status: 'locked',
      fulfilledDate: null,
      astrologerName: 'Aria Moonwhisper',
      astrologerRating: 4.9,
      timeframeArrived: true,
      daysToFulfill: 45,
    },
    {
      id: 5,
      category: 'Travel',
      categoryIcon: '✈️',
      title: 'A voyage across water changes your lens',
      description:
        'Sagittarius rising activates your ninth house of long journeys. You will cross an ocean — and return a fundamentally different person. A foreign culture holds the mirror you need.',
      timeframe: 'Jan – Feb 2026',
      planet: 'Sagittarius',
      status: 'locked',
      fulfilledDate: null,
      astrologerName: 'Sol Vega',
      astrologerRating: 4.7,
      timeframeArrived: true,
      daysToFulfill: 67,
    },
  ])

  // ── Active filter ───────────────────────────────────────────────────────
  const activeFilter = ref('all')

  const categories = computed(() => {
    const cats = [...new Set(predictions.value.map((p) => p.category))]
    return ['all', ...cats]
  })

  const filteredPredictions = computed(() => {
    if (activeFilter.value === 'all') return predictions.value
    if (activeFilter.value === 'fulfilled')
      return predictions.value.filter((p) => p.status === 'fulfilled')
    if (activeFilter.value === 'locked')
      return predictions.value.filter((p) => p.status === 'locked')
    return predictions.value.filter((p) => p.category === activeFilter.value)
  })

  const manifestationScore = computed(() => {
    const total = predictions.value.length
    if (total === 0) return 0
    const fulfilled = predictions.value.filter((p) => p.status === 'fulfilled').length
    return Math.round((fulfilled / total) * 100)
  })

  const fulfilledCount = computed(
    () => predictions.value.filter((p) => p.status === 'fulfilled').length,
  )

  const lockedCount = computed(
    () => predictions.value.filter((p) => p.status === 'locked').length,
  )

  // ── Saved Kundalis & Palm Scans with localStorage Sync ───────────────────
  const initialKundalis = [
    {
      id: 'k-101',
      name: 'Rahul Singh',
      relation: 'Self (Primary)',
      dob: '1994-06-14',
      tob: '06:32 AM',
      pob: 'Delhi, India',
      gender: 'Male',
      lagna: 'Gemini (Mithuna)',
      sunSign: 'Leo (Simha)',
      moonSign: 'Scorpio (Vrischika)',
      nakshatra: 'Jyeshtha — Pada 2',
      dasha: 'Mercury (2024–2041)',
      generatorType: 'AI Generated',
      createdAt: '18 Aug 2026',
    },
    {
      id: 'k-102',
      name: 'Priya Sharma',
      relation: 'Partner',
      dob: '1996-11-20',
      tob: '08:15 AM',
      pob: 'Mumbai, India',
      gender: 'Female',
      lagna: 'Cancer (Karka)',
      sunSign: 'Scorpio (Vrischika)',
      moonSign: 'Pisces (Revati)',
      nakshatra: 'Revati — Pada 4',
      dasha: 'Venus (2022–2042)',
      generatorType: 'Handcrafted by Pandit Rameshwar',
      createdAt: '10 Aug 2026',
    },
  ]

  const initialPalmScans = [
    {
      id: 'ps-101',
      name: 'Rahul Singh - 5 Angle Palm Scan',
      createdAt: '18 Aug 2026',
      vitality: '94% Vitality Index',
      heartLine: 'High Venusian Empathy',
      headLine: 'Deep Analytical Curve',
    }
  ]

  const savedKundalis = ref(
    JSON.parse(localStorage.getItem('saved_kundalis')) || initialKundalis
  )

  const savedPalmScans = ref(
    JSON.parse(localStorage.getItem('saved_palm_scans')) || initialPalmScans
  )

  function saveKundalisToStorage() {
    localStorage.setItem('saved_kundalis', JSON.stringify(savedKundalis.value))
  }

  function savePalmScansToStorage() {
    localStorage.setItem('saved_palm_scans', JSON.stringify(savedPalmScans.value))
  }

  function addKundali(kundali) {
    savedKundalis.value.unshift({
      ...kundali,
      id: 'k-' + Date.now(),
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    })
    saveKundalisToStorage()
  }

  function deleteKundali(id) {
    savedKundalis.value = savedKundalis.value.filter((k) => k.id !== id)
    saveKundalisToStorage()
  }

  function addPalmScan(scan) {
    savedPalmScans.value.unshift({
      ...scan,
      id: 'ps-' + Date.now(),
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    })
    savePalmScansToStorage()
  }

  function deletePalmScan(id) {
    savedPalmScans.value = savedPalmScans.value.filter((s) => s.id !== id)
    savePalmScansToStorage()
  }

  function setFilter(filter) {
    activeFilter.value = filter
  }

  function fulfillPrediction(id) {
    const pred = predictions.value.find((p) => p.id === id)
    if (pred && pred.status === 'locked') {
      pred.status = 'fulfilled'
      const now = new Date()
      pred.fulfilledDate = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    }
  }

  function addImportedPredictions(newPredictions) {
    const base = Date.now()
    newPredictions.forEach((pred, i) => {
      predictions.value.push({
        ...pred,
        id: base + i,
        status: 'locked',
        fulfilledDate: null,
        timeframeArrived: false,
        daysToFulfill: null,
      })
    })
  }

  return {
    predictions,
    activeFilter,
    categories,
    filteredPredictions,
    manifestationScore,
    fulfilledCount,
    lockedCount,
    savedKundalis,
    savedPalmScans,
    addKundali,
    deleteKundali,
    addPalmScan,
    deletePalmScan,
    setFilter,
    fulfillPrediction,
    addImportedPredictions,
  }
})
