# Interview Questions & Answers

## Architecture & Design

### Q: Walk me through the project structure. Why did you organize it this way?

**A**: I kept it flat and simple. `components/` folder only has components used in multiple places (Card, Navbar). Feature-specific components (Results, AnalyzerTab) are at root level. Utils and shared UI are separate files.

**Trade-off**: At 5-6 components, folders add navigation overhead. If this grew to 20+ components, I'd organize by feature (analyzer/, history/, stats/).

### Q: Why did you choose inline styles in some places and CSS classes in others?

**A**: Two reasons:
1. **Small reusable components** (Badge, Spinner): Inline styles make them self-contained. You can copy-paste to another project.
2. **Complex layouts** (Results): One-off styles that aren't reused. Writing CSS classes for every margin and color is tedious for unique layouts.

**The messy middle**: When a style is used 2-3 times, that's the gray area. I tend to inline until it clearly needs a class.

### Q: How would you make this codebase more maintainable?

**A**: 
1. Add TypeScript - the analysis JSON structure is complex and easy to break
2. Add tests for the utility functions (especially the color/rating helpers)
3. Split Results.jsx into smaller components
4. Add PropTypes if staying with JS
5. Document the expected AI response format

### Q: What would you change for production?

**A**:
1. **Backend proxy** - Hide API key, add rate limiting
2. **Error boundaries** - Catch React errors gracefully
3. **Retry logic** - For failed API calls with exponential backoff
4. **Analytics** - Track which features users actually use
5. **Accessibility** - ARIA labels, keyboard navigation, screen reader support
6. **Mobile** - Better responsive design

---

## State Management

### Q: Why useState instead of Context or Redux?

**A**: Only 3 tabs with simple state. useState is:
- Less boilerplate
- No provider wrapper needed
- Easier to debug

**When I'd switch**: If multiple components need the same state (like history data in both HistoryTab and StatsTab). Currently, StatsTab just calls loadHistory() directly.

### Q: The loading animation uses setInterval. Any issues with that?

**A**: Yes - potential memory leak if component unmounts during loading. I use useRef to store the interval ID and clear it in finally block. Could also use useEffect cleanup.

**Better approach**: useEffect with cleanup return function. Current code works but isn't the React-idiomatic pattern.

---

## API Integration

### Q: How do you handle the AI response?

**A**: 
1. Send formatted prompt to Groq API
2. Get text response
3. Strip markdown code blocks (```json)
4. Parse as JSON
5. Render with Results component

**Error cases handled**:
- API errors (non-200 status)
- Invalid JSON (malformed AI response)
- Network failures

### Q: What if the AI returns invalid JSON?

**A**: JSON.parse throws, caught in catch block, shows error toast. In production, I'd add:
- Retry with "fix your JSON" prompt
- Fallback to text display instead of structured data
- Logging to track how often this happens

### Q: The API key is in the frontend. Is that secure?

**A**: No. For a portfolio/demo it's fine. Production needs:
- Backend proxy that holds the key
- User authentication
- Rate limiting per user

---

## Performance

### Q: Any performance optimizations?

**A**: Honestly, not many needed for this scale:
- Results component could use React.memo if re-rendering is slow
- Code textarea could debounce the onChange (but not necessary here)
- Images are tiny (logo only)

**Real optimization needed**: The API call itself is the bottleneck, not the UI.

### Q: Why no useMemo or useCallback?

**A**: Premature optimization. The calculations (line count, date formatting) are trivial. Adding memoization adds code complexity with no measurable benefit.

**When I'd add it**: If StatsTab calculations became heavy with 1000+ history items.

---

## Error Handling

### Q: How do you handle localStorage errors?

**A**: Wrapped in try/catch. Private browsing mode can block localStorage. Falls back to empty array on error.

**Not handled**: localStorage quota exceeded (5MB limit). Could trim oldest entries proactively.

### Q: What happens if the API is down?

**A**: fetch throws, caught in catch, shows error toast. User can retry. No automatic retry currently.

---

## Code Quality

### Q: Why are some functions in utils.js and others inline?

**A**: 
- **Utils**: Pure functions used in multiple places, no React dependencies
- **Inline**: Component-specific logic, uses hooks or props

The line is blurry. `buildPrompt` could be in AnalyzerTab, but it's pure and testable so I put it in utils.

### Q: The Results component is 170 lines. Would you refactor?

**A**: Yes, into:
- `MetricCard.jsx`
- `RatingBar.jsx` 
- `SectionCard.jsx` (exists but could be reused more)

But for a portfolio project showing I can build features, one file is acceptable. In a team/production setting, I'd split it.

### Q: Any code you're not happy with?

**A**: 
1. The inline styles in Results.jsx - hard to maintain
2. HistoryTab has inline styles mixed with CSS classes
3. No consistent error message format
4. The `a` prop name in Results was lazy (now fixed to `analysis`)

---

## Behavioral Questions

### Q: Tell me about a challenge you faced.

**A**: The AI doesn't always return valid JSON. Initially crashed the app. Added try/catch and error handling. Then added markdown stripping (AI sometimes wraps JSON in code blocks). Learned to expect and handle AI unpredictability.

### Q: How would you add a new feature, like comparing two solutions?

**A**:
1. Add new tab "Compare"
2. Reuse Card component for two code inputs
3. Modify prompt to ask AI for comparison
4. New component CompareResults for side-by-side view
5. Add to history with comparison flag

### Q: How do you approach debugging?

**A**: 
1. Console.log the AI response first (usually the issue)
2. Check network tab for API errors
3. Use React DevTools to verify state
4. Add error boundaries to catch render crashes
5. Write down expected vs actual behavior

---

## Questions to Ask the Interviewer

1. "What's the typical team size and seniority mix?"
2. "How do you handle code review - async or sync?"
3. "What's your testing strategy - unit, integration, E2E?"
4. "How do you prioritize tech debt vs new features?"
5. "What metrics do you track for frontend performance?"
