# AlgoInspect ⚡

An AI-powered tool that analyzes your solutions gives you time/space complexity, approach breakdown, optimization tips, edge cases, and more.

I originally built this for my own personal use while practicing DSA. I kept copy-pasting my code into ChatGPT just to get complexity analysis and it was getting annoying, so I made this. Figured someone else might find it useful too, so here it is.

---

## What it does

Paste your code, pick your language, hit Analyze you get:

- **Time & Space Complexity** with a plain-English note
- **Efficiency rating** (1–10) with a visual bar
- **Algorithm approach** name + explanation (e.g. Hash Map, Sliding Window, DP)
- **Data structures** used
- **Optimization suggestions** — specific, not generic
- **Edge cases** to watch out for
- **Bug risks** — things that could break at runtime
- **Similar LeetCode problems** for more practice
- **Code quality** rating with a short note

It also saves every analysis to your browser's localStorage so you can go back and review them in the **History** tab. The **Stats** tab shows aggregate data — avg rating, your most-used language, quality breakdown, and more.

---

## Tech stack

- React + Vite
- [Groq API](https://console.groq.com/) — using `llama-3.3-70b-versatile` for fast inference
- Vanilla CSS (no UI library, no Tailwind)
- localStorage for history persistence

---

## Getting started

### 1. Clone the repo

```bash
git clone https://github.com/DAR3D3V1L/AlgoInspect.git
cd AlgoInspect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up your API key

Get a free API key from [console.groq.com](https://console.groq.com/) — it's free and fast.

Create a `.env` file in the root:

```bash
cp .env.example .env
```

Then open `.env` and paste your key:

```
VITE_GROQ_KEY=your_groq_api_key_here
```

### 4. Run it

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Screenshots

> Analyzer tab — paste your code and get instant AI feedback

> History tab — all your past analyses saved locally

> Stats tab — quick overview of how your solutions have been performing

---

## Project structure

```
src/
├── App.jsx              # root layout, tab navigation
├── AnalyzerTab.jsx      # main code input + API call
├── Results.jsx          # all result cards
├── HistoryTab.jsx       # localStorage history browser
├── StatsTab.jsx         # stats dashboard
├── components.jsx       # shared UI components + toast system
├── components/
│   ├── Card.jsx        # reusable card component
│   └── Navbar.jsx      # navigation header
├── utils.js             # constants, helpers, AI prompt
└── index.css            # global styles
```

---

## Notes

- The API key is stored in `.env` — **never commit that file**. The `.gitignore` already excludes it.
- All history data is local to your browser. Nothing is sent to any server except the Groq API for analysis.
- Groq's free tier has rate limits. If you hit one, just wait a few seconds and try again.

---


