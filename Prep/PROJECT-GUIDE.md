# AlgoInspect - Project Guide

A LeetCode solution analyzer that uses AI to review code and provide feedback on complexity, approach, and optimizations.

## Project Structure

```
src/
├── App.jsx              # Main app component - handles routing between tabs
├── AnalyzerTab.jsx      # Main feature: code input + AI analysis
├── HistoryTab.jsx       # Shows past analyses from localStorage
├── StatsTab.jsx         # Analytics dashboard
├── Results.jsx          # Displays AI analysis results
├── components.jsx       # Shared UI components (toast, badge, spinner, etc.)
├── components/
│   ├── Card.jsx        # Reusable card component
│   └── Navbar.jsx      # Navigation header
├── utils.js            # Helper functions and constants
└── index.css           # All styles in one file
```

## Module Explanations

### App.jsx
The entry point. Manages which tab is active and renders the navbar. Background effects are here too.

**Why this approach**: Simple state management with useState. No router needed for just 3 tabs.

### AnalyzerTab.jsx
The core feature. Has:
- Form inputs for code and problem description
- API call to Groq AI
- Loading state with animated messages
- Error handling

**Key decisions**:
- Used useRef for the loading interval so we can clean it up properly
- Added API key check before making request
- Inline button instead of separate component (simpler for this scale)

### utils.js
Pure functions and constants. No React dependencies.

**Exports**:
- `SUPPORTED_LANGUAGES` - array of programming languages
- `GROQ_API_KEY`, `GROQ_API_URL` - API configuration
- Color helpers for ratings
- LocalStorage functions for history
- `buildPrompt()` - formats the AI prompt
- `SYSTEM_PROMPT` - the instructions we send to AI

### components.jsx
Shared UI primitives. These are presentational components with inline styles.

**Why inline styles here?**: These are small, reusable pieces. Keeping styles inline makes them portable. Larger components use CSS classes.

### Card.jsx
Simple wrapper for the glass-morphism card style used in the analyzer form.

### Results.jsx
Renders the AI response. Has:
- Metric cards for time/space complexity
- Efficiency rating with visual bar
- Lists for optimizations, edge cases, etc.
- Copy-to-clipboard functionality

**Note**: Uses inline styles heavily because the layout is very specific and not reused elsewhere.

### HistoryTab.jsx
Shows past analyses from localStorage. Can view details or clear history.

**Edge case handling**: Falls back to old `entry.lang` property for backward compatibility with previously saved data.

### StatsTab.jsx
Calculates and displays stats from history data. Simple data aggregation.

## Technical Decisions

### Why no state management library?
Only 3 tabs and some form state. useState is sufficient and keeps bundle size down.

### Why single CSS file?
For a project this size, splitting CSS into modules adds overhead. One file is easier to maintain until you hit ~500+ lines.

### Why inline styles in some places?
- Small components that are truly reusable → inline styles make them self-contained
- Large, one-off layouts (Results.jsx) → inline styles are faster to write and don't need class names

### Error handling approach
- Try/catch around localStorage (can fail in private mode)
- API errors shown to user with toast notifications
- Input validation before API call (empty code check)

### API integration
Uses Groq's fast LLM API. Response is parsed as JSON, with markdown code block cleanup.

## Weak Areas (Study These!)

1. **No TypeScript** - Add types for the analysis response object
2. **No tests** - Would need unit tests for utils and component tests
3. **No error boundaries** - React could crash if Results component gets bad data
4. **localStorage size limit** - History could hit 5MB limit with many large code snippets
5. **No rate limiting** - Users can spam the API
6. **API key in env** - Good, but no runtime validation
7. **No retry logic** - Network failures just show error
8. **Accessibility** - Missing ARIA labels, focus management
9. **Mobile responsiveness** - Could be better on small screens
10. **No debouncing** - Textarea updates on every keystroke (fine for this scale)

## Likely Interview Questions

### Q: Why did you use useRef for the loading interval?
**A**: To properly clean up the interval when component unmounts or analysis completes. Without the ref, we couldn't access the interval ID in the finally block.

### Q: How would you handle API rate limiting?
**A**: Add a cooldown state (disabled button for 5 seconds), track requests per minute in state, show countdown to user.

### Q: The Results component is huge. Would you split it?
**A**: Yes, into smaller components: MetricCard, RatingBar, SectionList. But for a portfolio project, keeping related rendering logic together is acceptable.

### Q: How do you handle API errors?
**A**: Check response.ok, throw with error message, catch in try/catch, show toast notification. Could add retry button for network errors.

### Q: Why not use CSS modules?
**A**: For a small project, one CSS file is simpler. If it grew past 10+ components with unique styles, I'd split it.

### Q: How would you add TypeScript?
**A**: Define interfaces for AnalysisResult, HistoryEntry, etc. Type the API response with Zod for runtime validation too.

### Q: What about security? The API key is in the frontend?
**A**: Good catch - in production, proxy requests through a backend. Current setup works for demo/portfolio but not production.

## Running the Project

```bash
npm install
# Add .env with VITE_GROQ_KEY=your_key_here
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/` folder.
