# 🌌 Aether Core AI v110 — Fusion Command Station

Aether Core AI v110 is a premium, cyberpunk-inspired AI dashboard and command station. It combines advanced multi-mode AI reasoning (Synthesis, Research, Architect, and Titan Fusion), file upload parsing, an offline fallback engine, and a 12-node simulated failover mesh.

Originally built as part of the Velocity Master Coder portfolio, this repository extracts Aether Core AI into a standalone, secure, and production-ready app. It features a high-performance **Vanilla HTML/CSS/JS** frontend and a **Node.js Serverless Backend** optimized for Vercel.

---

## 🌟 Key Features

1. **Simulated 12-Node Failover Mesh**:
   - Routes requests through a pool of Google Gemini and xAI Grok keys.
   - Automatically rotates keys on rate-limits (HTTP 429) or failures, and cooling down affected keys.
   
2. **Multi-Mode Reasoning Layers**:
   - ⚡ **Synthesis** (v2.5 logic): Balanced reasoning, clean structure, direct answers.
   - 🔍 **Research** (v104 analysis): In-depth breakdown, comparisons, and evidence-based analysis.
   - 🛠️ **Architect** (v55 operator): Systems thinking, debugging plans, and build steps.
   - 🧬 **Titan Fusion** (v110 fusion): High-density, multi-step output with premium reasoning.

3. **Smart File Parser**:
   - Directly inject context into the prompt using plain text (`.txt`, `.md`, `.json`, `.csv`, `.js`, `.html`, `.css`).
   - Extracts presentation slide texts from PowerPoint (`.pptx`) archives completely client-side using `jszip`.

4. **Zero-Latency Cyber-Fallback Engine**:
   - If no API keys are loaded (or all nodes fail), Aether triggers its local fallback systems.
   - **Local Math Solver**: Detects mathematical expressions (e.g. `(25/5)+2`) and solves them locally.
   - **Krylo Companion Bot**: Randomly generates responses or outputs cheatsheets for hud stats/diagnostics/commands.

5. **Premium Cybermatic UI**:
   - Neon glow accents, asymmetrical layouts, dynamic interactive states, and glassmorphic designs.
   - Built-in prompt history retrieval using local storage (recall using **ArrowUp/ArrowDown/Tab**).

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS Variables, ES6 JavaScript, and responsive layout.
- **CDN Scripts**: `marked` (Markdown parsing), `DOMPurify` (HTML sanitization), and `JSZip` (PowerPoint parsing).
- **Backend**: Vercel Node.js Serverless Functions (`/api/aether/chat`, `/api/agent/status`, `/api/usage/track`).
- **Dependencies**: **Zero** npm dependencies. Serves using native fetch requests, keeping deployment extremely lightweight and fast.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Vercel CLI](https://vercel.com/cli) (for local testing/deployment)

### 2. Local Setup
1. Clone this repository to your local system.
2. Duplicate `.env.example` and rename it to `.env`:
   ```bash
   copy .env.example .env
   ```
3. Add your Gemini API key (from Google AI Studio) or Grok API key (from xAI):
   ```env
   GOOGLE_API_KEY=your_actual_gemini_api_key
   XAI_API_KEY=your_actual_xai_grok_key
   ```
4. Run the Vercel development server locally:
   ```bash
   npx vercel dev
   ```
5. Open `http://localhost:3000` in your web browser.

---

## ⚡ Deployment

### Deploy to GitHub
Initialize git and push to your GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit of standalone Aether Core AI"
git branch -M master
git remote add origin https://github.com/Krylo-60/Aether-core-v110.git
git push -u origin master
```

### Deploy to Vercel
Deploy directly using Vercel CLI:
```bash
npx vercel --prod
```
Alternatively, import the repository on the [Vercel Dashboard](https://vercel.com).

#### Required Environment Variables on Vercel:
Configure the following keys in your Vercel Project Settings -> **Environment Variables**:

| Variable | Description | Example |
|---|---|---|
| `GOOGLE_API_KEY` | Primary Gemini API Key | `AIzaSy...` |
| `GOOGLE_API_KEYS` | (Optional) Comma-separated Gemini Keys for Failover | `key1,key2` |
| `GOOGLE_MODEL` | (Optional) Gemini model override | `gemini-2.5-flash` |
| `XAI_API_KEY` | (Optional) xAI Grok API Key | `xai-...` |
| `XAI_MODEL` | (Optional) Grok model override | `grok-2` |
| `FIREBASE_DB_URL` | (Optional) Firebase Database URL for status badge | `https://project.firebaseio.com` |

---

## 🤝 Contributing
Feel free to fork this project, open issues, or submit pull requests. Let's build the ultimate cybernetic AI workspace!

*"Built to inspire. Built to dominate."*
