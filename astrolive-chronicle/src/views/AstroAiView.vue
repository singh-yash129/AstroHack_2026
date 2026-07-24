<template>
  <section class="view-page astro-ai-view">

    <!-- ── Header Banner ─────────────────────────────────────────────── -->
    <header class="ai-header">
      <div class="ai-avatar-ring">
        <div class="ai-avatar">✨</div>
        <span class="ai-pulse-dot" />
      </div>

      <div class="ai-title-box">
        <div class="ai-badge">
          <span class="sparkle">✦</span> ASTRO AI 2.0
        </div>
        <h1 class="ai-title">Cosmic Intelligence</h1>
        <p class="ai-subtitle">Ask anything about horoscopes, transits, Kundli &amp; remedies</p>
      </div>
    </header>

    <!-- ── Topic Suggestions Grid ───────────────────────────────────── -->
    <div v-if="messages.length === 0" class="suggestions-section">
      <p class="section-label">⚡ QUICK ASTROLOGICAL QUERIES</p>
      <div class="suggestions-grid">
        <button
          v-for="s in SUGGESTIONS"
          :key="s.title"
          class="suggestion-card"
          @click="askQuestion(s.query)"
        >
          <span class="sug-icon">{{ s.icon }}</span>
          <div class="sug-info">
            <span class="sug-title">{{ s.title }}</span>
            <span class="sug-desc">{{ s.desc }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- ── Chat Messages Stream ──────────────────────────────────────── -->
    <div class="chat-messages" ref="messagesContainer">
      <TransitionGroup name="bubble">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="msg-row"
          :class="msg.sender === 'user' ? 'msg-row--user' : 'msg-row--ai'"
        >
          <!-- Avatar -->
          <div v-if="msg.sender === 'ai'" class="msg-avatar">
            ✨
          </div>

          <!-- Bubble -->
          <div class="msg-bubble" :class="msg.sender === 'user' ? 'bubble--user' : 'bubble--ai'">
            <div class="msg-content" v-html="formatMarkdown(msg.text)" />

            <!-- Planetary breakdown pill if present -->
            <div v-if="msg.planetaryInsight" class="planetary-card">
              <div class="planet-row">
                <span class="planet-badge">🪐 {{ msg.planetaryInsight.planet }}</span>
                <span class="house-badge">House {{ msg.planetaryInsight.house }}</span>
              </div>
              <p class="planet-detail">{{ msg.planetaryInsight.detail }}</p>
            </div>

            <!-- Lock to Chronicle Button for AI Predictions -->
            <button
              v-if="msg.sender === 'ai' &amp;&amp; msg.prediction"
              class="pin-chronicle-btn"
              :class="{ 'pinned': msg.isPinned }"
              @click="pinToChronicle(msg)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>{{ msg.isPinned ? 'Saved to Chronicle! ✨' : 'Save Prediction to Chronicle' }}</span>
            </button>

            <span class="msg-time">{{ msg.time }}</span>
          </div>
        </div>

        <!-- Typing indicator -->
        <div v-if="isTyping" key="typing" class="msg-row msg-row--ai">
          <div class="msg-avatar">✨</div>
          <div class="msg-bubble bubble--ai bubble--typing">
            <span class="typing-dot" /><span class="typing-dot" /><span class="typing-dot" />
            <span class="typing-text">Synthesizing planetary transits…</span>
          </div>
        </div>
      </TransitionGroup>
      <div ref="scrollAnchor" style="height: 1px;" />
    </div>

    <!-- ── Chat & Voice Input Bar ───────────────────────────────────── -->
    <div class="input-container">

      <!-- Quick prompts horizontal scroll -->
      <div class="quick-prompts-bar">
        <button
          v-for="chip in PROMPT_CHIPS"
          :key="chip"
          class="prompt-chip"
          @click="askQuestion(chip)"
        >
          {{ chip }}
        </button>
      </div>

      <!-- Main Input Controls -->
      <form class="input-form" @submit.prevent="handleSend">
        <input
          ref="inputField"
          v-model="inputQuery"
          type="text"
          class="chat-input"
          placeholder="Ask Astro AI about love, career, remedies, horoscopes..."
          :disabled="isTyping"
          autocomplete="off"
        />

        <!-- Voice typing button -->
        <button
          type="button"
          class="icon-btn voice-btn"
          :class="{ 'listening': isListening }"
          @click="toggleVoiceInput"
          :title="isListening ? 'Listening... Speak now' : 'Voice Input'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>

        <!-- Send button -->
        <button
          type="submit"
          class="icon-btn send-btn"
          :disabled="!inputQuery.trim() || isTyping"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>

      <!-- Voice Listening status toast -->
      <div v-if="isListening" class="listening-status">
        <span class="mic-wave" />
        Listening… Speak your astrological question
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useChronicleStore } from '../stores/chronicle.js'

const chronicleStore = useChronicleStore()

// ── Data & Templates ───────────────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: '🪐', title: 'Daily Transit Forecast', desc: 'How do today’s moon & planetary aspects affect me?', query: 'What are the dominant planetary transits today and their spiritual guidance?' },
  { icon: '💖', title: 'Love & Relationship Astrology', desc: 'Zodiac synastry, soulmates & venus cycles', query: 'What does my Venus and 7th House alignment say about my current relationship cycle?' },
  { icon: '💎', title: 'Gemstone & Remedial Advice', desc: 'Mantra, gemstones & cosmic balancing', query: 'Which gemstone and Vedic remedies strengthen my career & financial growth?' },
  { icon: '💼', title: 'Career & Wealth Timing', desc: 'Dasha periods & Saturn 10th House transits', query: 'When is my next major career promotion or financial breakthrough window?' },
]

const PROMPT_CHIPS = [
  '✨ Today\'s Horoscope',
  '🌙 Moon Phase impact',
  '🔮 Kundli Dasha check',
  '💎 Lucky Gemstone',
  '💼 Career Transit 2026',
]

// ── State ──────────────────────────────────────────────────────────────────
const messages = ref([])
const inputQuery = ref('')
const isTyping = ref(false)
const isListening = ref(false)
const messagesContainer = ref(null)
const scrollAnchor = ref(null)

let recognition = null

// ── Speech Recognition setup ──────────────────────────────────────────────
function toggleVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    alert('Voice typing is not supported in this browser. Please use Chrome, Safari or Edge.')
    return
  }

  if (isListening.value) {
    recognition?.stop()
    isListening.value = false
    return
  }

  recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.interimResults = true

  recognition.onstart = () => {
    isListening.value = true
  }

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join('')
    inputQuery.value = transcript
  }

  recognition.onerror = () => {
    isListening.value = false
  }

  recognition.onend = () => {
    isListening.value = false
  }

  recognition.start()
}

// ── Message Handlers ───────────────────────────────────────────────────────
function askQuestion(queryText) {
  inputQuery.value = queryText
  handleSend()
}

async function handleSend() {
  const text = inputQuery.value.trim()
  if (!text || isTyping.value) return

  // Add User Message
  messages.value.push({
    id: Date.now(),
    sender: 'user',
    text,
    time: getCurrentTime(),
  })

  inputQuery.value = ''
  scrollToBottom()

  // AI Response processing
  isTyping.value = true

  setTimeout(() => {
    const responseData = generateAstroAiResponse(text)
    isTyping.value = false

    messages.value.push({
      id: Date.now() + 1,
      sender: 'ai',
      text: responseData.text,
      planetaryInsight: responseData.planetaryInsight,
      prediction: responseData.prediction,
      isPinned: false,
      time: getCurrentTime(),
    })

    scrollToBottom()
  }, 1800)
}

function pinToChronicle(msg) {
  if (msg.isPinned) return
  msg.isPinned = true

  if (msg.prediction) {
    chronicleStore.addImportedPredictions([{
      category: msg.prediction.category || 'AI Insight',
      categoryIcon: msg.prediction.icon || '✨',
      title: msg.prediction.title,
      description: msg.prediction.description,
      timeframe: msg.prediction.timeframe || 'Immediate',
      planet: msg.prediction.planet || 'Cosmic AI',
      astrologerName: 'Astro AI 2.0',
      astrologerRating: 4.9,
    }])
  }
}

// ── Mock AI Response Engine ────────────────────────────────────────────────
function generateAstroAiResponse(query) {
  const q = query.toLowerCase()

  if (q.includes('love') || q.includes('relationship') || q.includes('venus') || q.includes('soulmate')) {
    return {
      text: "Based on natal synastry principles, **Venus is in strong aspect with Jupiter**! 💖 Your emotional receptivity is heightened. This is an ideal cycle for deepening romantic trust and releasing past karmic attachments.",
      planetaryInsight: {
        planet: 'Venus in 7th House',
        house: 7,
        detail: 'Conjunction with Natal Moon indicates emotional harmony and magnetic attraction until late Q3.',
      },
      prediction: {
        category: 'Relationships',
        icon: '💖',
        title: 'Venus Transits 7th House: Harmonious Love Alignment',
        description: 'Venus-Jupiter alignment opens a major 45-day window for soulmate connection and resolving relationship blockages.',
        timeframe: 'Next 45 Days',
        planet: 'Venus / Jupiter',
      }
    }
  }

  if (q.includes('career') || q.includes('job') || q.includes('promot') || q.includes('money') || q.includes('business')) {
    return {
      text: "The stars reveal a high-energy **Saturn Trine** impacting your 10th House of vocation! 💼 Strategic discipline applied over the next month will yield massive financial alignment. Avoid impulsive contracts during retrograde shifts.",
      planetaryInsight: {
        planet: 'Saturn in 10th House',
        house: 10,
        detail: 'Disciplined effort creates unshakeable career foundations. Recognition window opens near full moon.',
      },
      prediction: {
        category: 'Career',
        icon: '🚀',
        title: 'Saturn 10th House: Major Career Elevation',
        description: 'Strategic leadership demonstrated between now and the next quarter guarantees promotion and financial expansion.',
        timeframe: 'Sep – Nov 2026',
        planet: 'Saturn / Sun',
      }
    }
  }

  if (q.includes('gemstone') || q.includes('remedy') || q.includes('mantra')) {
    return {
      text: "To balance your ruling planet's aura, **Yellow Sapphire (Pukhraj)** or **Blue Sapphire** (depending on Saturn placement) strengthens focus! 💎 Complement this by chanting the *Om Namah Shivaya* mantra 108 times at sunrise.",
      planetaryInsight: {
        planet: 'Jupiter & Mercury Balance',
        house: 5,
        detail: 'Chants at dawn align the solar plexus chakra with planetary frequencies.',
      },
      prediction: null,
    }
  }

  // General fallback response
  return {
    text: `Analyzing your cosmic query: *"${query}"*… ✨ The current celestial alignment indicates that your **Sun sign and Ascendant lord** are in strong harmony! Trust your inner intuition as transiting planets align in your house of transformation.`,
    planetaryInsight: {
      planet: 'Solar & Lunar Resonance',
      house: 1,
      detail: 'Favorable planetary aspects boost clarity, spiritual aura, and decision-making precision.',
    },
    prediction: {
      category: 'General',
      icon: '🔮',
      title: 'Cosmic Convergence & Intuitive Peak',
      description: 'Solar transits bring unprecedented clarity for personal growth and vital decision-making.',
      timeframe: 'Next 30 Days',
      planet: 'Sun / Moon',
    }
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────
function formatMarkdown(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

function getCurrentTime() {
  const d = new Date()
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

async function scrollToBottom() {
  await nextTick()
  scrollAnchor.value?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  scrollToBottom()
})

onUnmounted(() => {
  if (recognition) recognition.abort()
})
</script>

<style scoped>
.astro-ai-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: calc(100vh - 80px);
  padding: 1rem 0.85rem 6.5rem 0.85rem;
  box-sizing: border-box;
}

/* ── Header Banner ───────────────────────────────────────────────── */
.ai-header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(30, 15, 60, 0.8) 0%, rgba(10, 20, 45, 0.9) 100%);
  border: 1px solid rgba(147, 51, 234, 0.3);
  border-radius: 1.25rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 15px rgba(168, 85, 247, 0.15);
  margin-bottom: 1rem;
}

.ai-avatar-ring {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: conic-gradient(#c084fc, #818cf8, #38bdf8, #c084fc);
  padding: 2px;
  animation: rotateGlow 10s linear infinite;
  flex-shrink: 0;
}

@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.ai-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.ai-pulse-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4ade80;
  border: 2px solid #0f172a;
  box-shadow: 0 0 8px #4ade80;
}

.ai-title-box {
  display: flex;
  flex-direction: column;
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.12);
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  width: fit-content;
  margin-bottom: 0.2rem;
}

.sparkle {
  color: #fbbf24;
  animation: pulse 1.5s ease-in-out infinite;
}

.ai-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  color: #f3f4f6;
  line-height: 1.1;
}

.ai-subtitle {
  font-size: 0.7rem;
  color: rgba(226, 232, 240, 0.6);
  margin-top: 0.15rem;
}

/* ── Suggestions Section ─────────────────────────────────────────── */
.suggestions-section {
  margin-top: 0.5rem;
}

.section-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: rgba(168, 85, 247, 0.8);
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.suggestion-card {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(30, 27, 75, 0.4);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 0.85rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
}

.suggestion-card:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(168, 85, 247, 0.5);
  transform: translateY(-2px);
}

.sug-icon {
  font-size: 1.25rem;
}

.sug-info {
  display: flex;
  flex-direction: column;
}

.sug-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #f1f5f9;
}

.sug-desc {
  font-size: 0.62rem;
  color: rgba(203, 213, 225, 0.6);
  margin-top: 0.15rem;
  line-height: 1.25;
}

/* ── Chat Messages ───────────────────────────────────────────────── */
.chat-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 0.75rem;
  overflow-y: auto;
}

.msg-row {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.msg-row--user {
  justify-content: flex-end;
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(147, 51, 234, 0.3);
  border: 1px solid rgba(168, 85, 247, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.msg-bubble {
  max-width: 82%;
  padding: 0.75rem 0.95rem;
  border-radius: 1rem;
  font-size: 0.82rem;
  line-height: 1.5;
}

.bubble--user {
  background: linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%);
  color: #ffffff;
  border-bottom-right-radius: 0.2rem;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
}

.bubble--ai {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(139, 92, 246, 0.25);
  color: #e2e8f0;
  border-bottom-left-radius: 0.2rem;
  backdrop-filter: blur(10px);
}

.msg-content :deep(strong) {
  color: #fbbf24;
}

.msg-time {
  display: block;
  font-size: 0.58rem;
  color: rgba(226, 232, 240, 0.4);
  margin-top: 0.35rem;
  text-align: right;
}

/* Planetary Card inside AI Bubble */
.planetary-card {
  margin-top: 0.65rem;
  padding: 0.6rem 0.75rem;
  background: rgba(30, 27, 75, 0.6);
  border: 1px dashed rgba(251, 191, 36, 0.4);
  border-radius: 0.6rem;
}

.planet-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.planet-badge, .house-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 0.3rem;
}

.planet-badge {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.house-badge {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
}

.planet-detail {
  font-size: 0.7rem;
  color: rgba(226, 232, 240, 0.8);
}

/* Pin to Chronicle Button */
.pin-chronicle-btn {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  width: 100%;
  padding: 0.45rem 0.75rem;
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.15) 0%, rgba(217, 119, 6, 0.2) 100%);
  border: 1px solid rgba(251, 191, 36, 0.4);
  border-radius: 0.5rem;
  color: #fbbf24;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pin-chronicle-btn svg {
  width: 14px;
  height: 14px;
}

.pin-chronicle-btn.pinned {
  background: rgba(74, 222, 128, 0.15);
  border-color: rgba(74, 222, 128, 0.4);
  color: #4ade80;
}

/* Typing Indicator */
.bubble--typing {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c084fc;
  animation: typingBounce 1.2s infinite ease-in-out;
}

.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typingBounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}

.typing-text {
  font-size: 0.7rem;
  color: rgba(226, 232, 240, 0.5);
  margin-left: 0.2rem;
}

/* ── Input Bar Container ─────────────────────────────────────────── */
.input-container {
  position: fixed;
  bottom: 72px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(15px);
  border-top: 1px solid rgba(139, 92, 246, 0.2);
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  z-index: 90;
}

.quick-prompts-bar {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.4rem;
  margin-bottom: 0.4rem;
  scrollbar-width: none;
}

.quick-prompts-bar::-webkit-scrollbar {
  display: none;
}

.prompt-chip {
  white-space: nowrap;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  background: rgba(30, 27, 75, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 999px;
  color: #c084fc;
  cursor: pointer;
}

.input-form {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.chat-input {
  flex: 1;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  font-size: 0.78rem;
  color: #f8fafc;
  outline: none;
}

.chat-input:focus {
  border-color: #a855f7;
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.voice-btn {
  background: rgba(139, 92, 246, 0.15);
  color: #c084fc;
  border: 1px solid rgba(168, 85, 247, 0.3);
}

.voice-btn.listening {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border-color: #ef4444;
  animation: pulseMic 1s infinite;
}

@keyframes pulseMic {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.send-btn {
  background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%);
  color: #ffffff;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.listening-status {
  font-size: 0.68rem;
  color: #ef4444;
  text-align: center;
  margin-top: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}

.mic-wave {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  animation: pulse 1s infinite;
}

/* Animations */
.bubble-enter-active {
  transition: all 0.3s ease-out;
}
.bubble-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
