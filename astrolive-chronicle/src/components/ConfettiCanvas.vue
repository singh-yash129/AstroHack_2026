<template>
  <canvas
    ref="canvasRef"
    class="confetti-canvas"
    aria-hidden="true"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['done'])
const canvasRef = ref(null)

// ── Confetti palette (cosmic: gold, purple, white, pink, cyan) ──────────
const COLORS = [
  '#fbbf24', '#f59e0b', '#d97706',   // golds
  '#8b5cf6', '#a78bfa', '#c4b5fd',   // purples
  '#ffffff', '#e8eaf6',               // whites
  '#f472b6', '#fb7185',               // pinks
  '#67e8f9', '#38bdf8',               // cyans
]

let particles = []
let rafId = null
let ctx = null
let W = 0
let H = 0

// ── Particle factory ────────────────────────────────────────────────────
function makeParticle(x, y, power) {
  const angle = Math.random() * Math.PI * 2
  const speed = power * (0.4 + Math.random() * 0.6)
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - power * 0.6,  // bias upward
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    w: 7 + Math.random() * 8,
    h: 4 + Math.random() * 5,
    opacity: 1,
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }
}

// ── Burst helper — fires N particles from a point ───────────────────────
function burst(x, y, count, power) {
  for (let i = 0; i < count; i++) {
    particles.push(makeParticle(x, y, power))
  }
}

// ── Animation loop ──────────────────────────────────────────────────────
function tick() {
  ctx.clearRect(0, 0, W, H)

  particles = particles.filter((p) => p.opacity > 0.02)

  for (const p of particles) {
    p.vy += 0.28          // gravity
    p.vx *= 0.995         // air drag
    p.x += p.vx
    p.y += p.vy
    p.rotation += p.rotSpeed
    p.opacity -= 0.011    // slow fade

    ctx.save()
    ctx.globalAlpha = Math.max(0, p.opacity)
    ctx.translate(p.x, p.y)
    ctx.rotate((p.rotation * Math.PI) / 180)
    ctx.fillStyle = p.color

    if (p.shape === 'circle') {
      ctx.beginPath()
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
    }
    ctx.restore()
  }

  if (particles.length > 0) {
    rafId = requestAnimationFrame(tick)
  } else {
    emit('done')
  }
}

// ── Resize handler ──────────────────────────────────────────────────────
function resize() {
  W = canvasRef.value.width  = window.innerWidth
  H = canvasRef.value.height = window.innerHeight
}

// ── Mount: initialise canvas, schedule three bursts ─────────────────────
onMounted(() => {
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')
  resize()
  window.addEventListener('resize', resize)

  // Centre burst (immediate)
  burst(W / 2, H * 0.6, 80, 16)

  // Left cannon after 200ms
  setTimeout(() => burst(W * 0.1, H * 0.7, 60, 18), 200)

  // Right cannon after 400ms
  setTimeout(() => burst(W * 0.9, H * 0.7, 60, 18), 400)

  // Extra gold rain from top after 600ms
  setTimeout(() => {
    for (let i = 0; i < 40; i++) {
      const p = makeParticle(Math.random() * W, -10, 6)
      p.vy = 2 + Math.random() * 3       // downward drift
      p.vx = (Math.random() - 0.5) * 4
      p.color = COLORS[Math.floor(Math.random() * 3)]  // gold only
      p.opacity = 0.9
      particles.push(p)
    }
  }, 600)

  rafId = requestAnimationFrame(tick)
})

// ── Cleanup ─────────────────────────────────────────────────────────────
onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.confetti-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9000;
}
</style>
