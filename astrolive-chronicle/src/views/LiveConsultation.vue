<template>
  <div class="chat-shell">

    <!-- ══════════════════════════════════════════
         HEADER
    ══════════════════════════════════════════ -->
    <header class="chat-header">
      <button class="chat-back" @click="router.push('/astrologers')" aria-label="Go back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>

      <div class="chat-ast-ring">
        <div class="chat-ast-avatar">C</div>
        <span class="chat-ast-online" />
      </div>

      <div class="chat-ast-info">
        <div class="name-row">
          <p class="chat-ast-name">Celeste Nadir</p>
          <span class="verified-badge" title="Verified Astrologer">✓</span>
        </div>
        <span class="chat-ast-status">
          <span class="status-dot" />Live Consultation · Online
        </span>
      </div>

      <div class="chat-verified-pill">
        <span>✨ Expert</span>
      </div>
    </header>

    <!-- ══════════════════════════════════════════
         MESSAGES SCROLL AREA
    ══════════════════════════════════════════ -->
    <div class="chat-body" ref="chatBodyEl" aria-live="polite">

      <div class="session-pill">🔒 Encrypted Session · {{ sessionTime }}</div>

      <TransitionGroup name="bubble" tag="div" class="messages-list">

        <template v-for="msg in messages" :key="msg.id">
          <!-- Astrologer bubble -->
          <div v-if="msg.from === 'astrologer'" class="msg-row msg-row--ast">
            <div class="msg-avatar" :class="{ invisible: !msg.showAvatar }">C</div>
            <div class="msg-bubble bubble--ast">
              <p class="msg-text" v-html="md(msg.text)" />
              <span class="msg-ts">{{ msg.ts }}</span>
            </div>
          </div>
          <!-- User bubble -->
          <div v-else class="msg-row msg-row--user">
            <div class="msg-bubble bubble--user">
              <p class="msg-text">{{ msg.text }}</p>
              <span class="msg-ts">{{ msg.ts }} ✓✓</span>
            </div>
          </div>
        </template>

        <!-- Typing indicator -->
        <div v-if="isTyping" key="typing" class="msg-row msg-row--ast">
          <div class="msg-avatar">C</div>
          <div class="msg-bubble bubble--ast bubble--typing" aria-label="Typing…">
            <span class="dot" /><span class="dot" /><span class="dot" />
          </div>
        </div>

        <!-- End-Chat CTA -->
        <div v-if="phase === 'done'" key="end-cta" class="end-cta">
          <p class="end-cta-hint">✨ Prediction ready to seal into your Chronicle</p>
          <button id="btn-end-chat" class="end-cta-btn" @click="endChat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            End Chat &amp; Lock Prediction to Chronicle
          </button>
        </div>

      </TransitionGroup>
      <div ref="anchorEl" style="height:1px" />
    </div>

    <!-- ══════════════════════════════════════════
         QUICK REPLIES (phase = init)
    ══════════════════════════════════════════ -->
    <Transition name="slide-up">
      <div v-if="phase === 'init'" class="quick-replies">
        <p class="quick-label">💬 Choose your question</p>
        <button
          v-for="q in QUICK_REPLIES" :key="q.id"
          class="quick-btn"
          @click="selectQuestion(q)"
        >{{ q.text }}</button>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════
         INPUT BAR  (hidden only when chat is done)
    ══════════════════════════════════════════ -->
    <Transition name="slide-up">
      <div v-if="phase !== 'done'" class="input-bar">
        <!-- Text field -->
        <input
          id="chat-input"
          ref="inputEl"
          v-model="inputText"
          class="chat-input"
          type="text"
          placeholder="Type a message…"
          :disabled="phase === 'responding'"
          maxlength="200"
          autocomplete="off"
          @keydown.enter.prevent="sendText"
        />
        <!-- Mic button -->
        <button
          class="icon-btn mic-btn"
          :class="{ 'mic-btn--listening': isListening }"
          @click="toggleVoice"
          :aria-label="isListening ? 'Stop voice input' : 'Start voice input'"
          :title="!voiceSupported ? 'Voice input not supported in this browser' : ''"
        >
          <svg v-if="!isListening" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="9" y="3" width="6" height="11" rx="3"/>
            <path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
        </button>
        <!-- Send button -->
        <button
          class="icon-btn send-btn"
          :class="{ 'send-btn--active': inputText.trim() }"
          :disabled="!inputText.trim() || phase === 'responding'"
          @click="sendText"
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChronicleStore } from '../stores/chronicle.js'

const router = useRouter()
const store  = useChronicleStore()

// ── Astrologer ────────────────────────────────────────────────────────────
const ASTROLOGER = { name: 'Celeste Nadir', accuracy: 98 }

const sessionTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

// ── Quick replies ─────────────────────────────────────────────────────────
const QUICK_REPLIES = [
  { id: 1, text: '🚀 Will I get promoted this year?'  },
  { id: 2, text: '💑 When will I find my soulmate?'  },
  { id: 3, text: '🏢 Should I start my own business?' },
]

// ── Conversation script ───────────────────────────────────────────────────
const SCRIPT = {
  1: {
    category: 'Career', categoryIcon: '💼',
    bubbles: [
      "I'm looking at your natal chart right now… Saturn in your 10th house of career is a powerful placement — the mark of someone who builds lasting empires, not fleeting wins. 🪐",
      "Jupiter, the great benefic, will transit through your 6th house of daily work from **September to November 2026**. This creates a rare window of professional recognition — the right people will notice you at the right time.",
      "The defining moment arrives at the **Full Moon in Capricorn on October 17th, 2026**. Those who witness you leading between August and October will become your internal champions. Stay visible. Speak up in meetings. The promotion is earned in this window. 🌕",
    ],
    prediction: {
      title:       'Jupiter activates career recognition — promotion window opens',
      description: "Saturn in the 10th house + Jupiter transiting the 6th house of work (Sep–Nov 2026) creates a professional recognition window. The Full Moon in Capricorn on Oct 17th is the defining moment — step into visible leadership and the promotion follows.",
      timeframe:   'Aug – Nov 2026', planet: 'Jupiter / Saturn', rating: 4.9,
    },
  },
  2: {
    category: 'Relationships', categoryIcon: '💫',
    bubbles: [
      "Your 7th house — the sacred chamber of committed partnerships — is lit up right now. 💕 Venus is approaching a rare conjunction with your natal Moon. This only happens every 8 years.",
      "The Rahu–Ketu nodal axis is shifting into Pisces–Virgo in late 2026, activating your 5th house of romance. Someone enters carrying the unmistakable feeling of a past-life bond — karmic completion. 🌙",
      "Watch for the **Solar Eclipse on October 2nd, 2026**. Eclipses on your Moon's nodal axis catalyse sudden, destined meetings. Be open — at a workshop, a gathering of friends, even a digital space. The soul contract is written. The meeting is only the ceremony. ✨",
    ],
    prediction: {
      title:       'Solar Eclipse activates destined soulmate meeting',
      description: "Venus conjunct natal Moon (rare 8-year transit) + Rahu–Ketu shift into Pisces–Virgo activates your 5th house of romance. A karmic, past-life connection manifests around the Solar Eclipse of Oct 2nd, 2026.",
      timeframe:   'Sep – Oct 2026', planet: 'Venus / Rahu', rating: 5.0,
    },
  },
  3: {
    category: 'Abundance', categoryIcon: '🌠',
    bubbles: [
      "Entrepreneurship is written boldly in your chart. 🔥 Mars is in **mutual reception with Jupiter** — the classical Vedic signature of a self-made individual who builds wealth through courage.",
      "However — Mercury, ruling your 2nd house of money, goes **retrograde until September 22nd, 2026**. Any business registration, contract, or funding conversation started before this date carries hidden risk. Wait.",
      "After Mercury direct, with Jupiter simultaneously entering your 11th house of gains and networks, **October 2026 becomes the single most auspicious launch window in the next three years**. File the company. Pitch the investors. Act boldly — but only after Sep 22nd. 🌠",
    ],
    prediction: {
      title:       'Mars–Jupiter mutual aspect: Business launch window — Oct 2026',
      description: "Mars–Jupiter mutual reception confirms strong entrepreneurial energy. Mercury retrograde warns against action before Sep 22nd, 2026. After Mercury direct + Jupiter in the 11th house of networks, October 2026 is the most auspicious business launch window in 3 years.",
      timeframe:   'Oct 2026', planet: 'Mars / Jupiter / Mercury', rating: 4.7,
    },
  },
}

// Generic response for free-text messages
function genericResponse(text) {
  const keywords = text.toLowerCase()
  if (keywords.includes('love') || keywords.includes('partner') || keywords.includes('marriage'))
    return "I sense Venus is strongly placed in your question. 💕 Love is a recurring theme in your chart right now — the 7th house of partnerships is activated. The most significant window approaches in the coming months."
  if (keywords.includes('money') || keywords.includes('finance') || keywords.includes('wealth'))
    return "Jupiter in your 2nd house of finances tells me abundance is building steadily. 🌟 However, Saturn's aspect asks for patience — wealth built methodically during this period will be lasting and unshakeable."
  if (keywords.includes('health') || keywords.includes('body') || keywords.includes('ill'))
    return "The 6th house of health in your chart is under Saturn's watchful eye right now. 🌿 This calls for disciplined routine — sleep, nutrition, and movement. Mars transiting your ascendant in Q4 brings renewed physical energy."
  return "I'm reading the planetary alignments carefully for you. 🔮 Your chart shows a profound shift coming in the next 90 days — multiple planets are converging on your 1st house of self, signalling a transformation of identity and direction. Would you like to explore a specific area of life in detail?"
}

// ── State ─────────────────────────────────────────────────────────────────
const phase    = ref('welcome')  // welcome | init | responding | done
const messages = ref([])
const isTyping = ref(false)
const selectedScript = ref(null)
const inputText = ref('')

// Scroll refs
const chatBodyEl = ref(null)
const anchorEl   = ref(null)
const inputEl    = ref(null)

// Voice state
const isListening   = ref(false)
const voiceSupported = typeof window !== 'undefined' &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition)
let recognition = null

// Timer cleanup
const timers = []

// ── Helpers ───────────────────────────────────────────────────────────────
let _id = 0
function nowTs() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function addAst(text, showAvatar = true) {
  messages.value.push({ id: ++_id, from: 'astrologer', text, ts: nowTs(), showAvatar })
  scrollBottom()
}
function addUser(text) {
  messages.value.push({ id: ++_id, from: 'user', text, ts: nowTs() })
  scrollBottom()
}
async function scrollBottom() {
  await nextTick()
  anchorEl.value?.scrollIntoView({ behavior: 'smooth' })
}

/** **text** → <strong>text</strong> */
function md(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

function showTypingFor(ms) {
  return new Promise(resolve => {
    isTyping.value = true
    scrollBottom()
    timers.push(setTimeout(() => {
      isTyping.value = false
      resolve()
    }, ms))
  })
}

// ── Welcome sequence on mount ─────────────────────────────────────────────
onMounted(() => {
  isTyping.value = true
  scrollBottom()
  timers.push(setTimeout(async () => {
    isTyping.value = false
    addAst('Namaste 🙏 I am Celeste Nadir. Welcome to your live cosmic consultation.', true)

    await new Promise(r => timers.push(setTimeout(r, 500)))
    await showTypingFor(1300)
    addAst('I have your birth chart open before me. The planetary positions are revealing many things about your current cycle. What would you like to know today? ✨', false)

    await new Promise(r => timers.push(setTimeout(r, 400)))
    phase.value = 'init'
  }, 1100))
})

// ── Select quick reply ────────────────────────────────────────────────────
async function selectQuestion(q) {
  if (phase.value !== 'init') return
  phase.value = 'responding'
  selectedScript.value = SCRIPT[q.id]
  inputText.value = ''
  addUser(q.text)
  await runScript(SCRIPT[q.id].bubbles)
}

// ── Send free text ────────────────────────────────────────────────────────
async function sendText() {
  const text = inputText.value.trim()
  if (!text || phase.value === 'responding' || phase.value === 'done') return
  inputText.value = ''
  const wasFresh = phase.value === 'init'
  phase.value = 'responding'
  addUser(text)

  // If user typed their own question (not a scripted one) use generic response
  if (!selectedScript.value) {
    const resp = genericResponse(text)
    await showTypingFor(1400 + resp.length * 4)
    addAst(resp, true)
    // Offer quick replies again if they haven't seen script yet
    await new Promise(r => timers.push(setTimeout(r, 600)))
    if (wasFresh) {
      phase.value = 'init'
    } else {
      phase.value = 'done'
    }
  } else {
    // Already mid-script — generic reply then end
    const resp = genericResponse(text)
    await showTypingFor(1200)
    addAst(resp, true)
    await new Promise(r => timers.push(setTimeout(r, 500)))
    phase.value = 'done'
    scrollBottom()
  }
}

// ── Run the scripted bubble sequence ─────────────────────────────────────
async function runScript(bubbles) {
  for (let i = 0; i < bubbles.length; i++) {
    const len = bubbles[i].length
    await showTypingFor(1500 + len * 5)
    addAst(bubbles[i], i === 0)
    if (i < bubbles.length - 1) {
      await new Promise(r => timers.push(setTimeout(r, 600)))
    }
  }
  await new Promise(r => timers.push(setTimeout(r, 700)))
  phase.value = 'done'
  scrollBottom()
}

// ── End Chat → Pinia → Router ─────────────────────────────────────────────
function endChat() {
  const s = selectedScript.value
  if (!s) {
    router.push('/')
    return
  }
  store.addImportedPredictions([{
    category:         s.category,
    categoryIcon:     s.categoryIcon,
    title:            s.prediction.title,
    description:      s.prediction.description,
    timeframe:        s.prediction.timeframe,
    planet:           s.prediction.planet,
    astrologerName:   ASTROLOGER.name,
    astrologerRating: s.prediction.rating,
  }])
  router.push('/')
}

// ── Voice input ───────────────────────────────────────────────────────────
function toggleVoice() {
  if (!voiceSupported) return

  if (isListening.value) {
    recognition?.stop()
    isListening.value = false
    return
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = true
  recognition.lang = 'en-US'

  recognition.onresult = (e) => {
    inputText.value = Array.from(e.results)
      .map(r => r[0].transcript)
      .join('')
  }
  recognition.onend = () => {
    isListening.value = false
    if (inputText.value.trim()) sendText()
  }
  recognition.onerror = () => { isListening.value = false }

  recognition.start()
  isListening.value = true
}

onUnmounted(() => {
  timers.forEach(clearTimeout)
  recognition?.abort()
})
</script>

<style scoped>
/* ── Shell — full height flex container ───────────────────────────────── */
.chat-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  background: #060d1f;
  position: relative;
}

/* ══════════════════════════════════════════════════════════════════════════
   HEADER (Fixed at top)
══════════════════════════════════════════════════════════════════════════ */
.chat-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 0.9rem;
  background: linear-gradient(180deg, rgba(15,6,30,0.98) 0%, rgba(8,16,36,0.95) 100%);
  border-bottom: 1px solid rgba(139,92,246,0.2);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  flex-shrink: 0;
}

.chat-back {
  width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  color: rgba(232,234,246,0.7);
  transition: background 0.2s, color 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.chat-back:hover { background: rgba(255,255,255,0.1); color: #e8eaf6; }
.chat-back svg   { width: 14px; height: 14px; }

.chat-ast-ring {
  position: relative; width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
  background: conic-gradient(#8b5cf6, #a78bfa, #c4b5fd, #8b5cf6);
  padding: 2px; animation: spin 12s linear infinite;
  box-shadow: 0 0 10px rgba(139,92,246,0.4);
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.chat-ast-avatar {
  width: 100%; height: 100%; border-radius: 50%;
  background: linear-gradient(135deg, #4c1d95 0%, #1e3a8a 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 800; color: #c4b5fd;
}

.chat-ast-online {
  position: absolute; bottom: 1px; right: 1px;
  width: 9px; height: 9px; border-radius: 50%;
  background: #4ade80; border: 2px solid #060d1f;
  animation: pulse-g 2s ease-in-out infinite;
}
@keyframes pulse-g {
  0%,100% { transform: scale(1); }
  50%      { transform: scale(1.3); }
}

.chat-ast-info { flex: 1; min-width: 0; }

.name-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.chat-ast-name {
  font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 700;
  color: #e8eaf6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #3b82f6;
  color: #ffffff;
  font-size: 0.55rem;
  font-weight: 900;
  flex-shrink: 0;
}

.chat-ast-status {
  display: flex; align-items: center; gap: 0.3rem;
  font-size: 0.6rem; color: #4ade80; font-weight: 600;
}
.status-dot {
  width: 5px; height: 5px; border-radius: 50%; background: #4ade80;
  box-shadow: 0 0 4px rgba(74,222,128,0.9);
}

.chat-verified-pill {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  font-size: 0.62rem;
  font-weight: 700;
  color: #60a5fa;
  flex-shrink: 0;
}
.accuracy-val { font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 900; color: #fbbf24; line-height: 1; }
.accuracy-lbl { font-size: 0.45rem; color: rgba(251,191,36,0.5); text-transform: uppercase; letter-spacing: 0.04em; }

/* ══════════════════════════════════════════════════════════════════════════
   MESSAGES AREA
══════════════════════════════════════════════════════════════════════════ */
.chat-body {
  flex: 1; min-height: 0; overflow-y: auto;
  padding: 0.9rem 0.85rem 0.5rem;
  display: flex; flex-direction: column; gap: 0;
  scrollbar-width: none;
}
.chat-body::-webkit-scrollbar { display: none; }

.session-pill {
  margin: 0 auto 0.9rem; padding: 0.18rem 0.7rem;
  border-radius: 999px; border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.03);
  font-size: 0.58rem; color: rgba(232,234,246,0.28); font-weight: 600;
  width: fit-content; white-space: nowrap;
}

.messages-list { display: flex; flex-direction: column; gap: 0.35rem; }

/* ── Message rows ───────────────────────────────────────────────────────── */
.msg-row { display: flex; align-items: flex-end; gap: 0.45rem; }
.msg-row--user { justify-content: flex-end; }

.msg-avatar {
  width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #4c1d95 0%, #1e3a8a 100%);
  border: 1px solid rgba(139,92,246,0.4);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif; font-size: 0.65rem; font-weight: 800; color: #c4b5fd;
  box-shadow: 0 0 6px rgba(109,40,217,0.3);
}
.msg-avatar.invisible {
  background: transparent !important; border-color: transparent !important;
  box-shadow: none !important; color: transparent !important;
}

/* ── Bubbles ────────────────────────────────────────────────────────────── */
.msg-bubble {
  max-width: 80%; padding: 0.6rem 0.8rem; border-radius: 1rem;
  display: flex; flex-direction: column; gap: 0.2rem;
}
.bubble--ast {
  background: linear-gradient(135deg, rgba(48,20,80,0.88) 0%, rgba(12,22,50,0.92) 100%);
  border: 1px solid rgba(139,92,246,0.2); border-bottom-left-radius: 0.2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}
.bubble--user {
  background: linear-gradient(135deg, rgba(109,40,217,0.72) 0%, rgba(79,70,229,0.6) 100%);
  border: 1px solid rgba(139,92,246,0.3); border-bottom-right-radius: 0.2rem;
  box-shadow: 0 2px 10px rgba(109,40,217,0.2);
}
.msg-text { font-size: 0.8rem; line-height: 1.55; color: rgba(232,234,246,0.9); }
.bubble--user .msg-text { color: #e8eaf6; }
.msg-text :deep(strong) { color: #fbbf24; font-weight: 700; }
.msg-ts { font-size: 0.53rem; color: rgba(232,234,246,0.28); align-self: flex-end; }

/* ── Typing indicator ───────────────────────────────────────────────────── */
.bubble--typing { flex-direction: row; gap: 0.28rem; padding: 0.6rem 0.9rem; min-width: 3rem; }
.dot {
  width: 5px; height: 5px; border-radius: 50%; background: rgba(167,139,250,0.7);
  animation: bounce 1.2s ease-in-out infinite;
}
.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.18s; }
.dot:nth-child(3) { animation-delay: 0.36s; }
@keyframes bounce {
  0%,60%,100% { transform: translateY(0); opacity: 0.5; }
  30%          { transform: translateY(-5px); opacity: 1; }
}

/* ── Bubble transition ──────────────────────────────────────────────────── */
.bubble-enter-active { transition: opacity 0.26s ease, transform 0.26s cubic-bezier(0.34,1.56,0.64,1); }
.bubble-leave-active { transition: opacity 0.15s ease; }
.bubble-enter-from   { opacity: 0; transform: translateY(8px) scale(0.97); }
.bubble-leave-to     { opacity: 0; }

/* ══════════════════════════════════════════════════════════════════════════
   END-CHAT CTA
══════════════════════════════════════════════════════════════════════════ */
.end-cta {
  margin-top: 0.75rem; padding: 1rem; border-radius: 1.1rem;
  background: linear-gradient(135deg, rgba(109,40,217,0.12) 0%, rgba(30,58,138,0.08) 100%);
  border: 1px solid rgba(251,191,36,0.22);
  display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
  box-shadow: 0 0 24px rgba(251,191,36,0.07);
}
.end-cta-hint { font-size: 0.72rem; color: rgba(232,234,246,0.45); text-align: center; }
.end-cta-btn {
  display: flex; align-items: center; gap: 0.5rem;
  width: 100%; justify-content: center;
  padding: 0.85rem 1rem; border-radius: 0.8rem; border: none; cursor: pointer;
  font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 700; color: #030712;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 60%, #d97706 100%);
  box-shadow: 0 0 20px rgba(251,191,36,0.4);
  animation: glow 3s ease-in-out infinite;
  -webkit-tap-highlight-color: transparent; transition: transform 0.2s;
}
@keyframes glow {
  0%,100% { box-shadow: 0 0 20px rgba(251,191,36,0.35); }
  50%      { box-shadow: 0 0 36px rgba(251,191,36,0.6); }
}
.end-cta-btn svg    { width: 15px; height: 15px; }
.end-cta-btn:hover  { transform: translateY(-2px); animation: none; }
.end-cta-btn:active { transform: scale(0.97); }

/* ══════════════════════════════════════════════════════════════════════════
   QUICK REPLIES
══════════════════════════════════════════════════════════════════════════ */
.quick-replies {
  flex-shrink: 0; padding: 0.6rem 0.85rem 0;
  border-top: 1px solid rgba(139,92,246,0.1);
  display: flex; flex-direction: column; gap: 0.4rem;
}
.quick-label { font-size: 0.62rem; font-weight: 600; color: rgba(232,234,246,0.3); text-transform: uppercase; letter-spacing: 0.06em; }
.quick-btn {
  width: 100%; padding: 0.6rem 0.85rem; border-radius: 0.8rem;
  border: 1px solid rgba(139,92,246,0.22); background: rgba(109,40,217,0.08);
  color: #c4b5fd; font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 600;
  text-align: left; cursor: pointer; transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}
.quick-btn:hover { background: rgba(109,40,217,0.2); border-color: rgba(139,92,246,0.45); color: #e8eaf6; transform: translateX(3px); }
.quick-btn:active { transform: scale(0.97); }

/* ══════════════════════════════════════════════════════════════════════════
   INPUT BAR
══════════════════════════════════════════════════════════════════════════ */
.input-bar {
  position: sticky;
  bottom: 0;
  z-index: 20;
  display: flex; align-items: center; gap: 0.45rem;
  padding: 0.55rem 0.85rem 0.65rem;
  background: rgba(6,13,31,0.98);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(139,92,246,0.2);
  flex-shrink: 0;
}

.chat-input {
  flex: 1; min-width: 0;
  padding: 0.6rem 0.85rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(139,92,246,0.2);
  background: rgba(255,255,255,0.05);
  color: #e8eaf6; font-family: 'Inter', sans-serif; font-size: 0.82rem;
  outline: none; transition: border-color 0.2s, background 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.chat-input::placeholder { color: rgba(232,234,246,0.25); }
.chat-input:focus { border-color: rgba(139,92,246,0.4); background: rgba(255,255,255,0.07); }
.chat-input:disabled { opacity: 0.4; }

.icon-btn {
  width: 36px; height: 36px; border-radius: 50%; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  -webkit-tap-highlight-color: transparent; transition: all 0.2s ease;
}
.icon-btn svg { width: 15px; height: 15px; }

/* Mic button */
.mic-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: rgba(232,234,246,0.5); }
.mic-btn:hover { background: rgba(255,255,255,0.1); color: rgba(232,234,246,0.8); }
.mic-btn--listening {
  background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.4); color: #f87171;
  animation: mic-pulse 1s ease-in-out infinite;
}
@keyframes mic-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
  50%      { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
}

/* Send button */
.send-btn { background: rgba(109,40,217,0.15); border: 1px solid rgba(139,92,246,0.2); color: rgba(139,92,246,0.4); }
.send-btn--active { background: rgba(109,40,217,0.4) !important; border-color: rgba(139,92,246,0.5) !important; color: #c4b5fd !important; }
.send-btn:not(:disabled):hover { background: rgba(109,40,217,0.55) !important; }
.send-btn:disabled { cursor: default; }

/* ── Slide up transition ──────────────────────────────────────────────── */
.slide-up-enter-active { transition: opacity 0.28s ease, transform 0.32s cubic-bezier(0.34,1.56,0.64,1); }
.slide-up-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.slide-up-enter-from   { opacity: 0; transform: translateY(16px); }
.slide-up-leave-to     { opacity: 0; transform: translateY(8px); }
</style>
