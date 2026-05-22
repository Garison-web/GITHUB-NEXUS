<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=GitHub%20Nexus&fontSize=70&fontColor=00d4ff&fontAlignY=38&desc=Cinematic%20GitHub%20Analytics%20Dashboard&descAlignY=60&descColor=a78bfa&animation=fadeIn" width="100%"/>
</p>

<p align="center">
  <a href="https://github-dashboard-tau-five.vercel.app">
    <img src="https://img.shields.io/badge/Live%20Demo-%E2%96%BA%20Open%20App-00d4ff?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  &nbsp;
  <img src="https://img.shields.io/badge/Built%20With-React%20%2B%20TypeScript-a78bfa?style=for-the-badge&logo=react&logoColor=white" />
  &nbsp;
  <img src="https://img.shields.io/badge/Deployed%20On-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Orbitron&size=18&duration=3000&pause=800&color=00D4FF&center=true&vCenter=true&multiline=true&width=600&height=80&lines=Search+any+GitHub+user+instantly;Compare+two+developers+side-by-side;Explore+languages%2C+stars+%26+activity" alt="Typing SVG" />
</p>

---

## What is GitHub Nexus?

**GitHub Nexus** is a cinematic, space-themed GitHub analytics dashboard. Drop in any GitHub username and get a stunning visual breakdown of their repositories, programming languages, star counts, and recent activity — all rendered against an animated starfield with glassmorphism cards.

---

## Features

| Feature | Description |
|---|---|
| **Cinematic UI** | Animated starfield, shooting stars, drift orbs, and a dark-space aesthetic |
| **Instant Search** | Look up any GitHub profile by username in real time |
| **Language Breakdown** | Donut chart of top programming languages across all repos |
| **Activity Timeline** | Bar chart of recent GitHub push activity |
| **Head-to-Head Compare** | Search two users and compare stats side by side |
| **Tweaks Panel** | Toggle constellations, grid, orbs, and star density live |
| **Authenticated Requests** | Supports a GitHub PAT for 5,000 req/hr (vs 60 unauthenticated) |

---

## Live Demo

> **[github-dashboard-tau-five.vercel.app](https://github-dashboard-tau-five.vercel.app)**

Try searching for any GitHub username — `torvalds`, `gaearon`, `sindresorhus` — and see the dashboard come alive.

---

## Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Recharts-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" />
</p>

- **Frontend**: React 18 (CDN/Babel) + TypeScript
- **Styling**: Glassmorphism CSS, custom canvas animations
- **Charts**: Recharts (DonutChart, BarChart) with CountUp animations
- **Fonts**: Orbitron · Space Grotesk · JetBrains Mono
- **API**: GitHub REST API v3
- **Hosting**: Vercel (static, zero-config)

---

## Run Locally

```bash
# Clone
git clone https://github.com/Garison-web/GITHUB-NEXUS.git
cd GITHUB-NEXUS

# Install deps (for dev server only)
npm install

# Add your GitHub token (optional, but recommended)
cp .env.example .env
# Edit .env → VITE_GITHUB_TOKEN=your_token_here

# Start dev server
npm run dev
```

Then open `http://localhost:5173` — the Nexus dashboard loads at the root.

### GitHub Token (optional)

Without a token you get **60 requests/hour**. With one you get **5,000/hour**.

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Generate a classic token with `read:user` and `public_repo` scopes
3. Paste it into `.env` as `VITE_GITHUB_TOKEN=ghp_...`

---

## Project Structure

```
GITHUB-NEXUS/
├── public/
│   └── nexus/
│       ├── GitHub Nexus.html   # Entry point
│       ├── app.jsx             # Main app & mode toggle
│       ├── background.jsx      # Canvas starfield animation
│       ├── charts.jsx          # DonutChart, BarChart, CountUp
│       ├── compare.jsx         # Side-by-side user comparison
│       ├── data.jsx            # GitHub API layer
│       ├── profile.jsx         # Profile card component
│       ├── tweaks-panel.jsx    # Live visual settings panel
│       └── styles.css          # Glassmorphism & space theme
├── scripts/
│   └── build-nexus.cjs        # Build script (copies nexus → dist)
└── vercel.json                 # Vercel deployment config
```

---

## Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Garison-web/GITHUB-NEXUS)

One click — Vercel detects the `vercel.json` and runs the build script automatically.

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=120&section=footer&text=Made%20with%20%E2%9C%A8%20by%20Garison&fontSize=20&fontColor=a78bfa&fontAlignY=65&animation=fadeIn" width="100%" />
</p>
