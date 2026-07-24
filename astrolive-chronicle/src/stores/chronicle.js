import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * useChronicleStore
 * Manages the user's personal astrological prediction timeline.
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
      // Timeframe Dec 2025 has passed — user can now verify
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
      // Timeframe Jan-Feb 2026 has passed — user can now verify
      timeframeArrived: true,
      daysToFulfill: 67,
    },
    {
      id: 6,
      category: 'Creativity',
      categoryIcon: '🎨',
      title: 'Your magnum opus demands to be born',
      description:
        'Neptune sextile your natal Sun dissolves creative blocks built over years. A project you abandoned resurfaces with new clarity. The world is ready for what only you can create.',
      timeframe: 'Mar 2026',
      planet: 'Neptune',
      status: 'locked',
      fulfilledDate: null,
      astrologerName: 'Celeste Nadir',
      astrologerRating: 5.0,
    },
    {
      id: 7,
      category: 'Spirituality',
      categoryIcon: '🔮',
      title: 'A lunar eclipse catalyses your awakening',
      description:
        'The full moon lunar eclipse in Scorpio falls exactly on your natal Pluto. What you release in this moment liberates you from a karmic pattern spanning multiple lifetimes.',
      timeframe: 'Apr 2026',
      planet: 'Pluto',
      status: 'locked',
      fulfilledDate: null,
      astrologerName: 'Aria Moonwhisper',
      astrologerRating: 4.9,
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

  // ── Manifestation Score ─────────────────────────────────────────────────
  /**
   * Score = (fulfilled predictions / total) × 100, rounded.
   * Weighted so each fulfilled prediction contributes equally.
   */
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

  // ── Actions ─────────────────────────────────────────────────────────────
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

  /**
   * Bulk-insert predictions generated by the AI Importer.
   * Each entry receives a unique numeric id based on current timestamp.
   */
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
    setFilter,
    fulfillPrediction,
    addImportedPredictions,
  }
})
