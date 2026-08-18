# 🌌 AstroLive Chronicle — Next-Gen Cosmic Intelligence Platform

A high-performance, mobile-first Web Application built with **Vue 3**, **Vite**, **Pinia**, and **Vanilla CSS**. **AstroLive Chronicle** bridges ancient Vedic Astrology with cutting-edge AI features, featuring a **5-Angle Futuristic AI Palm Scanner**, **Interactive Vedic Kundali Creator with PDF Generation**, **Astro Live Interactive Voice Mode**, and **My Chronicle Manifestation Timeline**.

---

## 📱 Mobile Frame Architecture

The application is engineered inside a realistic **iPhone 17 Pro Max Mobile Frame Container** (`#phone-screen` in `index.html`):
- **Hardware Integration**: Includes an interactive status bar, Dynamic Island notch, and home indicator bar.
- **Coordinate Scoping**: All modals, bottom sheets, and full-screen overlays use Vue 3 Teleport targeted to `#phone-screen` (`<Teleport to="#phone-screen">`). This guarantees that every popup, voice overlay, and bottom-sheet is strictly confined within the mobile viewport coordinate space without spilling out onto the desktop browser body.

---

## ✨ Key Features & Product Modules

### 1. 🏠 Dashboard (Cosmic Command Base)
- **Cosmic Streak Tracker**: Tracks 7-day user engagement with gold glow nodes, progress connectors, and free prediction unlock rewards.
- **Interactive Visual Kundali Widget**: Displays an interactive diamond birth chart with planet details and a `+ Create Kundali` button.
- **Quick Actions Grid**: One-tap shortcuts to **Astro AI**, **AI Palm Scanner**, **Kundali Creator**, and **AI Importer**.
- **Activity & Accuracy Feed**: Real-time user stats, accuracy scores (87%), and recent cosmic transit logs.

---

### 2. 🤚 5-Angle Futuristic AI Palm Scanner (`/palm-scanner`)
- **Multi-Angle Capture Flow**: Captures 5 distinct real human open palm angles with viewfinder guides:
  1. *Primary Palm View* (Heart, Head & Life Lines)
  2. *Side Palm Edge* (Marriage & Relationship Markings)
  3. *Mount of Venus & Thumb* (Willpower & Vitality)
  4. *Mount of Sun & Saturn* (Career & Destiny Traces)
  5. *Non-Dominant Hand* (Latent Karma Comparison)
- **Cyan Neural Network Laser Scanner**: Features a cyan laser sweep (`#00f2fe`) and connected cyan SVG neural network nodes over the palm.
- **Auto-Scan Trigger**: Automatically launches the scan sequence upon taking the 5th photo.
- **Bottom-to-Top Pop-up Sheet**: iOS-style bottom sheet (`sheet-slide` transition) with a top drag handle, backdrop click dismiss, and an explicit close button (`✕`) that reverts back to the Dashboard.
- **Dual Choice Path**:
  - 🤖 *Consult Astro AI*: Loads the 5-angle palm vector report into Astro AI chat.
  - 🔮 *Book Certified Palmist*: Opens live 1-on-1 consultation booking with a master Palmist.

---

### 3. 🪐 Interactive Vedic Kundali Creator (`KundaliCreatorModal.vue`)
- **Smart History Management**: Clicking *Kundali* opens your **Saved Kundalis List** displaying all previous charts with name, relation, Lagna, Moon sign, and creation date.
- **Delete (`🗑️`) & View Options**: Delete any saved Kundali chart anytime (synced with `localStorage`) or preview its chart.
- **Birth Details Intake**: Form to enter Name, Relation (Self, Spouse, Child, Friend, Parent), DOB, TOB, POB, and Gender.
- **Dual Generation Engine**:
  - ⚡ *Instant AI Kundali* (Free / 0 Coins) — Instant sidereal D1 & D9 Navamsha chart calculation.
  - 🔮 *Handcrafted Certified Astrologer Kundali* (Paid ₹199 / 199 Coins) — Verified by Pandit Rameshwar Shastri.
- **Vedic Diamond Chart & PDF Export**: Displays the classic diamond Kundali chart with house numbers and planetary positions, plus a **`[📥 Download Kundali PDF]`** button.

---

### 4. 🤖 Astro AI 2.0 & Astro Live Voice Mode (`/astro-ai`)
- **Conversational Astro Engine**: Answers horoscopes, planetary transits, remedies, and gemstone queries with Markdown rendering and Text-To-Speech (TTS) read-aloud support.
- **Save Prediction to Chronicle**: One-tap button to pin any AI prediction directly to your personal Chronicle timeline.
- **Astro Live Voice Mode**: Full-screen interactive voice session featuring:
  - Dynamic audio visualization orb (`listening`, `thinking`, `speaking` states).
  - Real-time user & AI speech transcripts.
  - Mute/unmute microphone and session end controls.

---

### 5. 📜 My Chronicle — Manifestation Timeline (`/chronicle`)
- **Manifestation Score Gauge**: Dynamic circular SVG progress ring calculating the percentage of fulfilled predictions.
- **Prediction Cards**: Categorized by Career, Love, Finance, Health, Travel, Creativity, and Spirituality.
- **Filter Tabs**: Filter by *All*, *Fulfilled*, *Locked*, or specific category chips.
- **Verification Flow**: Mark locked predictions as fulfilled once their arrival timeframe arrives.

---

### 6. 🔮 Astrologers Marketplace & Live Chat (`/astrologers` & `/live-chat`)
- **Ranked Astrologer Directory**: List of verified Vedic astrologers ranked by Manifestation Accuracy Score (e.g. Celeste Nadir 5.0★, Aria Moonwhisper 4.9★).
- **Specialty Filters**: Filter by *Palmistry*, *Kundli*, *Tarot*, *Numerology*, and *Vastu*.
- **Surge Pricing Badges**: Real-time surge pricing indicators during peak planetary transits.
- **Live 1-on-1 Chat (`LiveConsultation.vue`)**: Real-time chat interface with astrologer profile banner, audio/video call shortcuts, and session timer.

---

### 7. 📥 AI Prediction Importer (`/importer`)
- **Multi-Source Import**: Upload text notes, screenshots, or voice recordings of predictions from any astrologer or app.
- **Optical Scan Simulation**: Simulates cosmic optical character recognition (OCR) and auto-tags category, timeframe, and planet.

---

### 8. 👤 Profile & Persistent Storage (`/profile`)
- **Saved Kundalis & Palm Scans**: Manages all saved birth charts and 5-angle palm scans with full deletion support (`🗑️`).
- **LocalStorage Sync**: Persistent storage across browser sessions via Pinia store (`useChronicleStore`).

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Vue 3 (Composition API `<script setup>`) |
| **Build Tool** | Vite 8 |
| **State Management** | Pinia 4 (with `localStorage` persistence) |
| **Routing** | Vue Router 4 |
| **Styling** | Vanilla CSS3 (Custom design system, HSL color tokens, glassmorphism, responsive flex/grid) |
| **Container Frame** | HTML5 / CSS3 Scoped iPhone 17 Pro Max Frame with Teleport target `#phone-screen` |

---

## 📂 Repository Directory Structure

```
astrolive-chronicle/
├── index.html                   # Root HTML with iPhone 17 Pro Max container frame & status bar
├── package.json                 # Project dependencies & scripts
├── vite.config.js               # Vite configuration
├── src/
│   ├── main.js                  # Application entry point
│   ├── App.vue                  # Main application shell with navbar router navigation
│   ├── style.css                # Global design system tokens, typography, and base utility classes
│   ├── router/
│   │   └── index.js             # Vue Router configuration (Routes: /, /chronicle, /importer, /astrologers, /astro-ai, /live-chat, /profile, /palm-scanner)
│   ├── stores/
│   │   └── chronicle.js         # Pinia store managing predictions, saved Kundalis, and saved Palm scans
│   ├── components/
│   │   ├── VisualKundali.vue            # Interactive diamond Kundali chart widget
│   │   ├── KundaliCreatorModal.vue      # Form, generator selector, calculation animation & PDF export
│   │   ├── ConsultationBottomSheet.vue  # Live consultation booking sheet modal
│   │   ├── PredictionCard.vue           # Chronicle timeline prediction card component
│   │   ├── ManifestationScore.vue       # Circular SVG manifestation accuracy score gauge
│   │   ├── ManifestationCardModal.vue   # Fulfilled prediction detail modal
│   │   ├── GratitudeTipModal.vue        # Gratitude tip / donation sheet modal
│   │   ├── ToastNotification.vue        # Global floating toast alert component
│   │   └── ConfettiCanvas.vue           # Celebration confetti canvas particle animation
│   └── views/
│       ├── Dashboard.vue        # Home base view with streak tracker, quick actions & activity feed
│       ├── PalmScannerView.vue  # 5-angle human palm photo capture, cyan neural scanner & bottom sheet modal
│       ├── AstroAiView.vue      # Astro AI chat & Astro Live voice session overlay
│       ├── ChronicleView.vue    # My Chronicle prediction timeline view
│       ├── AstrologersView.vue  # Ranked astrologer marketplace directory
│       ├── LiveConsultation.vue # 1-on-1 live chat view with astrologer
│       ├── ImporterView.vue     # AI Prediction Importer scanning view
│       └── ProfileView.vue      # User profile, saved Kundalis & saved Palm scans manager
└── dist/                        # Production build output directory
```

---

## ⚙️ Getting Started & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/singh-yash129/AstroHack_2026.git
   cd AstroHack_2026/astrolive-chronicle
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

4. **Build for Production**:
   ```bash
   npm run build
   ```
   The compiled bundle will be output to the `dist/` directory.

5. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🎨 Design Philosophy

- **Cosmic Dark Mode & Glassmorphism**: Tailored HSL color palette using deep cosmic indigos (`#060311`, `#0d061e`), radiant golds (`#fbbf24`, `#f59e0b`), and vibrant cyan accents (`#06b6d4`, `#00f2fe`).
- **Smooth Micro-Animations**: Subtle hover scale transitions, glowing status pulses, and spring bottom-sheet transitions.
- **Mobile-First UX**: Responsive touch hit targets, fixed top/bottom bars, and clean vertical flex scroll areas.

---

## 📄 License

This project is open-source and available under the **MIT License**.
