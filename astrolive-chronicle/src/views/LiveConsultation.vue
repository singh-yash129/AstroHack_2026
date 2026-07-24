<template>
  <!-- Full-screen chat shell — no bottom nav on this route -->
  <div class="chat-shell">

    <!-- ════════════════════════════════════════════════════════════════════
         HEADER
    ════════════════════════════════════════════════════════════════════ -->
    <header class="chat-header">
      <!-- Back arrow -->
      <button class="chat-back" @click="router.push('/astrologers')" aria-label="Go back to Astrologers">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>

      <!-- Avatar -->
      <div class="chat-header-ring">
        <div class="chat-header-avatar">C</div>
        <span class="chat-header-online" aria-label="Online" />
      </div>

      <!-- Name + status -->
      <div class="chat-header-info">
        <p class="chat-header-name">{{ ASTROLOGER.name }}</p>
        <div class="chat-header-status">
          <span class="status-dot" aria-hidden="true" />
          <span class="status-text">Live Chat · Online</span>
        </div>
      </div>

      <!-- Accuracy badge -->
      <div class="chat-accuracy" aria-label="98% manifestation accuracy">
        <span class="chat-accuracy-val">{{ ASTROLOGER.accuracy }}%</span>
        <span class="chat-accuracy-lbl">Accuracy</span>
      </div>
    </header>

    <!-- ════════════════════════════════════════════════════════════════════
         MESSAGES AREA
    ════════════════════════════════════════════════════════════════════ -->
    <div class="chat-messages" ref="messagesEl" aria-live="polite" aria-label="Chat messages">

      <!-- Session start pill -->
      <div class="session-pill">
        🔒 Encrypted Session · {{ sessionStartTime }}
      </div>

      <!-- Message bubbles -->
      <TransitionGroup name="bubble" tag="div" class="bubbles-wrap">

        <template v-for="msg in messages" :key="msg.id">
          <!-- Astrologer message -->
          <div v-if="msg.from === 'astrologer'" class="msg-row msg-row--ast">
            <div class="msg-ast-avatar" :class="{ 'avatar-hidden': !msg.showAvatar }" aria-hidden="true">
              {{ msg.showAvatar ? 'C' : '' }}
            </div>
            <div class="msg-bubble bubble--ast">
              <!-- Render **bold** markdown manually -->
              <p class="msg-text" v-html="renderMarkdown(msg.text)" />
              <span class="msg-time">{{ msg.time }}</span>
            </div>
          </div>

          <!-- User message -->
          <div v-else class="msg-row msg-row--user">
            <div class="msg-bubble bubble--user">
              <p class="msg-text">{{ msg.text }}</p>
              <span class="msg-time">{{ msg.time }} ✓✓</span>
            </div>
          </div>
        </template>

        <!-- Typing indicator -->
        <div v-if="isTyping" key="typing" class="msg-row msg-row--ast">
          <div class="msg-ast-avatar" aria-hidden="true">C</div>
          <div class="msg-bubble bubble--ast bubble--typing" role="status" aria-label="Astrologer is typing">
            <span class="typing-dot" /><span class="typing-dot" /><span class="typing-dot" />
          </div>
        </div>

        <!-- End Chat CTA (appears after script completes) -->
        <div v-if="phase === 'done'" key="end-cta" class="end-cta-wrap">
          <div class="end-cta-card">
            <div class="end-cta-icon" aria-hidden="true">🔮</div>
            <p class="end-cta-hint">
              Your prediction is ready to be sealed into your Chronicle
            </p>
            <button id="btn-end-chat" class="end-cta-btn" @click="endChat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              End Chat &amp; Lock Prediction to Chronicle
            </button>
          </div>
        </div>

      </TransitionGroup>

      <!-- Scroll anchor -->
      <div ref="bottomAnchor" style="height: 8px" />
    </div>

    <!-- ════════════════════════════════════════════════════════════════════
         QUICK REPLIES (shown in 'init' phase)
    ════════════════════════════════════════════════════════════════════ -->
    <Transition name="slide-up">
      <div v-if="phase === 'init'" class="quick-replies" aria-label="Quick reply options">
        <p class="quick-label">💬 Choose your question</p>
        <div class="quick-btns">
          <button
            v-for="q in QUICK_REPLIES"
            :key="q.id"
            class="quick-btn"
            @click="selectQuestion(q)"
          >
            {{ q.text }}
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChronicleStore } from '../stores/chronicle.js'

const router = useRouter()
const store  = useChronicleStore()

// ── Astrologer ────────────────────────────────────────────────────────────
const ASTROLOGER = {
  name:      'Celeste Nadir',
  specialty: 'Karmic Saturn & Past-Life Readings',
  accuracy:  98,
}

// ── Session metadata ──────────────────────────────────────────────────────
const sessionStartTime = new Date().toLocaleTimeString('en-GB', {
  hour: '2-digit', minute: '2-digit',
})

// ── Quick reply options ───────────────────────────────────────────────────
const QUICK_REPLIES = [
  { id: 1, text: '🚀 Will I get promoted this year?'  },
  { id: 2, text: '💑 When will I find my soulmate?'  },
  { id: 3, text: '🏢 Should I start my own business?' },
]

// ── Conversation script ───────────────────────────────────────────────────
// Each response is an array of bubble texts (staged with small delays)
const RESPONSES = {
  1: {
    category:     'Career',
    categoryIcon: '💼',
    bubbles: [
      "I'm looking at your natal chart right now... ✨ Saturn is positioned in your 10th house of career — a powerful placement that rewards discipline and long-term vision over shortcuts. This is the mark of someone who builds lasting empires, not fleeting wins. 🪐",
      "Jupiter, the great benefic, will transit through your 6th house of daily work and service from **September to November 2026**. This creates a rare window of professional recognition — the kind where the right people notice you at the right time.",
      "The critical turning point arrives at the **Full Moon in Capricorn on October 17th, 2026**. Your chart shows that those who witness you leading between August and October will become your champions internally. Stay visible. Speak in meetings. Write proposals. The promotion is *earned* in this window — and the universe is already aligning the stage. 🌕",
    ],
    prediction: {
      title:         'Jupiter activates career recognition — promotion window opens',
      description:   "Saturn in the 10th house + Jupiter transiting the 6th house of work (Sep–Nov 2026) creates a rare professional recognition window. The Full Moon in Capricorn on Oct 17th is the defining moment — step into visible leadership now and the promotion follows naturally before year end.",
      timeframe:     'Aug – Nov 2026',
      planet:        'Jupiter / Saturn',
      astrologerRating: 4.9,
    },
  },
  2: {
    category:     'Relationships',
    categoryIcon: '💫',
    bubbles: [
      "Your 7th house — the sacred chamber of committed partnerships — is lit up right now. 💕 Venus, the planet of love and attraction, is approaching a rare conjunction with your natal Moon over the coming months. This transit only happens every 8 years, and it's happening *now* in your chart.",
      "The Rahu–Ketu nodal axis is shifting into Pisces–Virgo in late 2026, directly activating your 5th house of romance and creative self-expression. This brings someone into your life who carries the unmistakable feeling of a past-life connection — a soul you've loved before, returning to complete an unfinished karmic contract. 🌙",
      "Watch for the **Solar Eclipse on October 2nd, 2026**. Eclipses aligned with your Moon's nodal axis catalyse sudden, destined meetings. Be open in unexpected spaces — a workshop, a gathering of mutual friends, or even a digital encounter. The soul contract is already written. The meeting is only the ceremony. ✨",
    ],
    prediction: {
      title:         'Solar Eclipse activates destined soulmate meeting',
      description:   "Venus conjunct natal Moon (rare 8-year transit) combined with Rahu–Ketu shifting into Pisces–Virgo activates your 5th house of romance. A karmic, past-life connection will manifest around the Solar Eclipse of Oct 2nd, 2026 — expect a destined meeting in an unexpected setting.",
      timeframe:     'Sep – Oct 2026',
      planet:        'Venus / Rahu',
      astrologerRating: 5.0,
    },
  },
  3: {
    category:     'Abundance',
    categoryIcon: '🌠',
    bubbles: [
      "Entrepreneurship is written into your chart in bold letters. 🔥 Mars, your planet of ambition and action, is in **mutual reception with Jupiter** — this is the classical Vedic signature of a self-made individual who builds wealth through courage. The entrepreneurial fire is undeniably there.",
      "However — and this is critical — Mercury, which rules your 2nd house of money and business communication, goes **retrograde on September 1st and doesn't turn direct until September 22nd, 2026**. Any business registration, contract signing, or funding conversation started before September 22nd carries hidden landmines. Wait. The stars are emphatic on this.",
      "After Mercury direct, with Jupiter entering your 11th house of gains and networks simultaneously, **October 2026 becomes the single most auspicious business launch window in the next three years**. File the company, pitch the investors, launch the product, and sign the partnership — but only after September 22nd. Bold action in October is cosmically supported. 🌠",
    ],
    prediction: {
      title:         'Mars–Jupiter mutual aspect: Business launch window — Oct 2026',
      description:   "Mars–Jupiter mutual reception confirms strong entrepreneurial potential. Mercury retrograde until Sep 22nd, 2026 warns against premature contracts or launches. After Mercury direct + Jupiter entering the 11th house of networks, October 2026 is the most auspicious business launch window in the next 3 years. Act boldly then.",
      timeframe:     'Oct 2026',
      planet:        'Mars / Jupiter / Mercury',
      astrologerRating: 4.7,
    },
  },
}

// ── State ─────────────────────────────────────────────────────────────────
// phase: 'welcome' | 'init' | 'responding' | 'done'
const phase    = ref('welcome')
const messages = ref([])
const isTyping = ref(false)
const selectedResponse = ref(null)

// Scroll refs
const messagesEl  = ref(null)
const bottomAnchor = ref(null)

// ── Helpers ───────────────────────────────────────────────────────────────
let msgCounter = 0

function nowTime() {
  return new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function addAstMsg(text, showAvatar = true) {
  messages.value.push({
    id:         ++msgCounter,
    from:       'astrologer',
    text,
    time:       nowTime(),
    showAvatar,
  })
  scrollToBottom()
}

function addUserMsg(text) {
  messages.value.push({
    id:   ++msgCounter,
    from: 'user',
    text,
    time: nowTime(),
  })
  scrollToBottom()
}

async function scrollToBottom() {
  await nextTick()
  bottomAnchor.value?.scrollIntoView({ behavior: 'smooth' })
}

/** Very basic **bold** markdown → <strong> */
function renderMarkdown(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

// ── Typing simulation ─────────────────────────────────────────────────────
function showTypingThen(delayMs, callback) {
  isTyping.value = true
  scrollToBottom()
  return setTimeout(() => {
    isTyping.value = false
    callback()
  }, delayMs)
}

// ── Sequence: welcome messages on mount ───────────────────────────────────
const timers = []

onMounted(() => {
  // Step 1: show typing immediately
  isTyping.value = true
  scrollToBottom()

  // Step 2 (1.2s): first welcome bubble
  timers.push(setTimeout(() => {
    isTyping.value = false
    addAstMsg(`Namaste 🙏 I am ${ASTROLOGER.name}. Welcome to your live cosmic consultation.`, true)

    // Step 3 (0.6s later): second welcome bubble (no avatar repeat)
    timers.push(setTimeout(() => {
      timers.push(showTypingThen(1400, () => {
        addAstMsg('I have your birth chart open before me. The planetary positions are revealing many things about your current cycle. What would you like to know today? ✨', false)

        // Step 4: show quick replies
        timers.push(setTimeout(() => {
          phase.value = 'init'
        }, 400))
      }))
    }, 600))
  }, 1200))
})

// ── User selects a question ───────────────────────────────────────────────
function selectQuestion(q) {
  if (phase.value !== 'init') return

  phase.value = 'responding'
  selectedResponse.value = RESPONSES[q.id]

  // Add user bubble
  addUserMsg(q.text)

  const bubbles = RESPONSES[q.id].bubbles

  // Stage each astrologer bubble with typing delays
  let delay = 800
  bubbles.forEach((text, i) => {
    const typingDuration = 1600 + text.length * 6  // longer texts = longer typing
    timers.push(setTimeout(() => {
      timers.push(showTypingThen(typingDuration, () => {
        addAstMsg(text, i === 0)
        // After last bubble, reveal End Chat button
        if (i === bubbles.length - 1) {
          timers.push(setTimeout(() => {
            phase.value = 'done'
            scrollToBottom()
          }, 700))
        }
      }))
    }, delay))
    delay += typingDuration + 900
  })
}

// ── End Chat: lock prediction to Chronicle & navigate home ────────────────
function endChat() {
  if (!selectedResponse.value) return

  const resp = selectedResponse.value
  store.addImportedPredictions([{
    category:      resp.category,
    categoryIcon:  resp.categoryIcon,
    title:         resp.prediction.title,
    description:   resp.prediction.description,
    timeframe:     resp.prediction.timeframe,
    planet:        resp.prediction.planet,
    astrologerName:    ASTROLOGER.name,
    astrologerRating:  resp.prediction.astrologerRating,
  }])

  store.setFilter('all')
  router.push('/')
}

// Cleanup timers on unmount
import { onUnmounted } from 'vue'
onUnmounted(() => timers.forEach(clearTimeout))
</script>

<style scoped>
/* ── Shell: full screen, no bottom padding needed (nav is hidden) ─────── */
.chat-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-width: 480px;
  margin: 0 auto;
  background: #060d1f;
  position: relative;
  overflow: hidden;
}

/* ════════════════════════════════════════════════════════════════════════
   HEADER
════════════════════════════════════════════════════════════════════════ */
.chat-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(180deg, rgba(18,7,35,0.98) 0%, rgba(11,18,38,0.95) 100%);
  border-bottom: 1px solid rgba(139,92,246,0.2);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  flex-shrink: 0;
  z-index: 10;
}

/* Back button */
.chat-back {
  width: 2rem; height: 2rem;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
  color: rgba(232,234,246,0.7);
  transition: background 0.2s, color 0.2s;
}
.chat-back:hover { background: rgba(255,255,255,0.1); color: #e8eaf6; }
.chat-back svg   { width: 0.9rem; height: 0.9rem; }

/* Avatar ring */
.chat-header-ring {
  position: relative;
  width: 40px; height: 40px;
  border-radius: 50%;
  background: conic-gradient(#8b5cf6, #a78bfa, #c4b5fd, #8b5cf6);
  padding: 2px;
  animation: spin-ring 12s linear infinite;
  flex-shrink: 0;
  box-shadow: 0 0 12px rgba(139,92,246,0.4);
}

@keyframes spin-ring {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.chat-header-avatar {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #4c1d95 0%, #1e3a8a 100%);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem; font-weight: 800;
  color: #c4b5fd;
}

.chat-header-online {
  position: absolute;
  bottom: 1px; right: 1px;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #4ade80;
  border: 2px solid #060d1f;
  box-shadow: 0 0 6px rgba(74,222,128,0.8);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.25); opacity: 0.7; }
}

/* Name + status */
.chat-header-info { flex: 1; min-width: 0; }

.chat-header-name {
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  color: #e8eaf6;
  line-height: 1.2;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.chat-header-status {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.1rem;
}

.status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 5px rgba(74,222,128,0.9);
  flex-shrink: 0;
}

.status-text {
  font-size: 0.62rem;
  color: #4ade80;
  font-weight: 600;
}

/* Accuracy badge */
.chat-accuracy {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.3rem 0.55rem;
  border-radius: 0.6rem;
  background: rgba(251,191,36,0.1);
  border: 1px solid rgba(251,191,36,0.25);
  flex-shrink: 0;
}

.chat-accuracy-val {
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem; font-weight: 900;
  color: #fbbf24;
  line-height: 1;
}

.chat-accuracy-lbl {
  font-size: 0.5rem;
  color: rgba(251,191,36,0.5);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}

/* ════════════════════════════════════════════════════════════════════════
   MESSAGES AREA
════════════════════════════════════════════════════════════════════════ */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0.875rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  scrollbar-width: none;
}
.chat-messages::-webkit-scrollbar { display: none; }

/* Session pill */
.session-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: rgba(232,234,246,0.3);
  font-weight: 600;
  padding: 0.2rem 0.75rem;
  border-radius: 999px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  margin: 0 auto 1rem;
  width: fit-content;
}

/* Bubbles wrap */
.bubbles-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

/* ── Message row ────────────────────────────────────────────────────── */
.msg-row {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.msg-row--user {
  justify-content: flex-end;
}

.msg-row--ast {
  justify-content: flex-start;
}

/* ── Astrologer avatar ─────────────────────────────────────────────── */
.msg-ast-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4c1d95 0%, #1e3a8a 100%);
  border: 1px solid rgba(139,92,246,0.4);
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem; font-weight: 800;
  color: #c4b5fd;
  box-shadow: 0 0 8px rgba(109,40,217,0.3);
}

.avatar-hidden {
  background: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
  color: transparent !important;
}

/* ── Bubbles ────────────────────────────────────────────────────────── */
.msg-bubble {
  max-width: 78%;
  padding: 0.65rem 0.85rem;
  border-radius: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Astrologer bubble */
.bubble--ast {
  background: linear-gradient(135deg, rgba(55,25,94,0.85) 0%, rgba(15,25,55,0.9) 100%);
  border: 1px solid rgba(139,92,246,0.2);
  border-bottom-left-radius: 0.2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.3);
}

/* User bubble */
.bubble--user {
  background: linear-gradient(135deg, rgba(109,40,217,0.7) 0%, rgba(79,70,229,0.6) 100%);
  border: 1px solid rgba(139,92,246,0.3);
  border-bottom-right-radius: 0.2rem;
  box-shadow: 0 2px 12px rgba(109,40,217,0.2);
}

/* Message text */
.msg-text {
  font-size: 0.82rem;
  line-height: 1.55;
  color: rgba(232,234,246,0.9);
}

.msg-text :deep(strong) {
  color: #fbbf24;
  font-weight: 700;
}

.bubble--user .msg-text { color: #e8eaf6; }

/* Timestamp */
.msg-time {
  font-size: 0.55rem;
  color: rgba(232,234,246,0.3);
  align-self: flex-end;
  white-space: nowrap;
}

.bubble--user .msg-time { color: rgba(232,234,246,0.45); }

/* ── Typing indicator bubble ─────────────────────────────────────────── */
.bubble--typing {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.3rem;
  padding: 0.65rem 1rem;
  min-width: 3.5rem;
}

.typing-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: rgba(167,139,250,0.7);
  animation: typing-bounce 1.2s ease-in-out infinite;
  flex-shrink: 0;
}

.typing-dot:nth-child(1) { animation-delay: 0s; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.6; }
  30%            { transform: translateY(-5px); opacity: 1; }
}

/* ── Bubble enter transition ─────────────────────────────────────────── */
.bubble-enter-active {
  transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bubble-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.bubble-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.96);
}
.bubble-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.96);
}

/* ════════════════════════════════════════════════════════════════════════
   END CHAT CTA
════════════════════════════════════════════════════════════════════════ */
.end-cta-wrap {
  padding: 1rem 0;
}

.end-cta-card {
  background: linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(30,58,138,0.1) 100%);
  border: 1px solid rgba(251,191,36,0.25);
  border-radius: 1.25rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  box-shadow: 0 0 30px rgba(251,191,36,0.08);
}

.end-cta-icon { font-size: 2rem; }

.end-cta-hint {
  font-size: 0.78rem;
  color: rgba(232,234,246,0.55);
  text-align: center;
  line-height: 1.5;
}

.end-cta-btn {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  justify-content: center;
  padding: 0.9rem 1.25rem;
  border-radius: 0.875rem;
  border: none;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  color: #030712;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #d97706 100%);
  box-shadow: 0 0 24px rgba(251,191,36,0.4), 0 4px 16px rgba(0,0,0,0.4);
  animation: cta-glow 3s ease-in-out infinite;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.2s ease;
}

@keyframes cta-glow {
  0%, 100% { box-shadow: 0 0 24px rgba(251,191,36,0.4), 0 4px 16px rgba(0,0,0,0.4); }
  50%       { box-shadow: 0 0 40px rgba(251,191,36,0.6), 0 4px 20px rgba(0,0,0,0.5); }
}

.end-cta-btn svg { width: 1rem; height: 1rem; flex-shrink: 0; }
.end-cta-btn:hover { transform: translateY(-2px); animation: none; }
.end-cta-btn:active { transform: scale(0.97); }

/* ════════════════════════════════════════════════════════════════════════
   QUICK REPLIES
════════════════════════════════════════════════════════════════════════ */
.quick-replies {
  flex-shrink: 0;
  padding: 0.75rem 0.875rem 1rem;
  background: linear-gradient(180deg, transparent 0%, rgba(6,13,31,0.95) 100%);
  border-top: 1px solid rgba(139,92,246,0.12);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-label {
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(232,234,246,0.35);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.quick-btns {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.quick-btn {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border-radius: 0.875rem;
  border: 1px solid rgba(139,92,246,0.25);
  background: rgba(109,40,217,0.1);
  color: #c4b5fd;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem; font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.quick-btn:hover {
  background: rgba(109,40,217,0.22);
  border-color: rgba(139,92,246,0.5);
  color: #e8eaf6;
  transform: translateX(3px);
}

.quick-btn:active { transform: scale(0.97); }

/* Quick replies slide-up animation */
.slide-up-enter-active {
  transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.slide-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
