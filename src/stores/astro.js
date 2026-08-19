import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Main application store for AstroLive Chronicle.
 * Tracks cosmic events, active filters, and UI state.
 */
export const useAstroStore = defineStore('astro', () => {
  // ── State ────────────────────────────────────────────────────────────────
  const events = ref([])
  const activeFilter = ref('all')
  const isLoading = ref(false)
  const darkMode = ref(true)

  // ── Getters ──────────────────────────────────────────────────────────────
  const filteredEvents = computed(() => {
    if (activeFilter.value === 'all') return events.value
    return events.value.filter((e) => e.type === activeFilter.value)
  })

  const eventCount = computed(() => events.value.length)

  // ── Actions ──────────────────────────────────────────────────────────────
  function addEvent(event) {
    events.value.push({ id: Date.now(), ...event })
  }

  function removeEvent(id) {
    events.value = events.value.filter((e) => e.id !== id)
  }

  function setFilter(filter) {
    activeFilter.value = filter
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  // Initialise dark mode on store creation
  document.documentElement.classList.add('dark')

  return {
    // State
    events,
    activeFilter,
    isLoading,
    darkMode,
    // Getters
    filteredEvents,
    eventCount,
    // Actions
    addEvent,
    removeEvent,
    setFilter,
    toggleDarkMode,
  }
})
