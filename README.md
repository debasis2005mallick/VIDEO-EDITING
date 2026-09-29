# ⚡ ReelCraft AI — 3–4hr Podcast to 30–90s Viral Reels Studio

An AI-powered video processing platform that takes 3–4+ hour long-form videos or podcasts (2GB–10GB+) and auto-extracts 30–90s viral shorts with high-context storytelling hooks, 9:16 vertical re-framing, and kinetic karaoke subtitles.

---

## 🚀 Quick Start (Local Setup)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Create a `.env` file from `.env.example`:
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```
*(You can also set your Gemini API key directly in the web UI).*

### 3. Run Dev Server
```bash
npm run dev
```
- **Web App:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 🛠️ Key Features
- **Large File Ingestion (2GB–10GB+):** Instant zero-lag browser streaming using object URLs.
- **Gemini 2.0 / 1.5 Flash Intelligence:** 1M+ token context window analyzes 4-hour podcasts in a single prompt for retention hooks, virality scores (1–100), and quotes.
- **9:16 Smartphone Simulator Studio:** Auto face-tracking, podcast split-screen, and cinematic blur layouts.
- **Kinetic Karaoke Subtitles (Hormozi Style):** Word-by-word highlights and animation.
- **Export Capabilities:** Render 9:16 MP4 via FFmpeg, export `.SRT` subtitles, and generate TikTok/Reels post packs.

---

## 📁 Repository Structure
```
├── src/                # Frontend React + TypeScript application
│   ├── components/     # UI components (Studio, Upload, Clips, Navbar)
│   ├── data/           # Sample podcast datasets
│   └── utils/          # Helper utilities
├── server/             # Express API + FFmpeg video rendering pipeline
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```
