# Study Guide - Areas to Improve

## Critical (Fix Before Interview)

### 1. TypeScript Migration
**Why**: The AI response structure is complex. Easy to break with typos.

**Study**:
```typescript
// Define the shape of AI response
interface AnalysisResult {
  time_complexity: string;
  time_complexity_note: string;
  space_complexity: string;
  space_complexity_note: string;
  efficiency_rating: number;
  approach_name: string;
  approach_explanation: string;
  data_structures: string[];
  algorithm_paradigm: string;
  optimizations: string[];
  can_be_optimal: boolean;
  optimal_tc: string;
  edge_cases: string[];
  code_quality: "Good" | "Acceptable" | "Needs Improvement";
  code_quality_notes: string;
  bug_risks: string[];
  similar_problems: string[];
}
```

**Practice**: Convert one file (utils.js) to TypeScript first.

### 2. Testing
**Why**: Shows you care about code quality.

**Study**:
- Jest for unit tests
- React Testing Library for components
- What to test: pure functions in utils.js

**Example test**:
```javascript
test('getRatingColor returns green for 8+', () => {
  expect(getRatingColor(9)).toBe('#3fb950');
  expect(getRatingColor(5)).toBe('#d29922');
  expect(getRatingColor(3)).toBe('#f85149');
});
```

**Practice**: Write 3-5 tests for utils.js

### 3. Error Boundaries
**Why**: If Results component crashes on bad data, whole app dies.

**Study**:
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. <button onClick={this.retry}>Retry</button></div>;
    }
    return this.props.children;
  }
}
```

**Practice**: Wrap Results component in error boundary.

---

## Important (Nice to Have)

### 4. React Hooks Deep Dive
**Current gap**: You're using useState, useRef. Need to know useEffect cleanup, custom hooks.

**Study**:
- useEffect cleanup function (for that interval)
- Custom hook for localStorage (useLocalStorage)
- useMemo for expensive calculations

**Practice**: Write a `useLocalStorage` hook.

### 5. CSS Architecture
**Current issue**: Mix of inline styles and CSS classes. Inconsistent.

**Study**:
- CSS Modules vs styled-components
- When to use each approach
- CSS custom properties (variables)

**Practice**: Pick one approach, refactor Results.jsx to use it consistently.

### 6. API Error Handling
**Current gap**: Basic try/catch. No retry, no exponential backoff.

**Study**:
```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fetch(url, options);
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // exponential backoff
    }
  }
}
```

**Practice**: Implement retry with exponential backoff.

---

## Bonus Points (Stand Out)

### 7. Accessibility (a11y)
**Current gap**: No ARIA labels, poor keyboard navigation.

**Study**:
- Semantic HTML (button vs div with onClick)
- ARIA labels for screen readers
- Keyboard navigation (tabindex, focus management)
- Color contrast ratios

**Practice**: Run Lighthouse accessibility audit, fix issues.

### 8. Performance Optimization
**Current gap**: No optimization (which is fine at this scale, but know the concepts).

**Study**:
- React.memo and when to use it
- useMemo vs useCallback
- Code splitting (React.lazy)
- Debouncing expensive operations

**Practice**: Add React.memo to Results component, explain why/why not.

### 9. State Management
**Current gap**: Only useState. No Context, no Redux.

**Study**:
- When Context is needed (prop drilling > 2 levels)
- Redux Toolkit basics (for larger apps)
- Zustand (lightweight alternative)

**Practice**: Refactor history state to use Context if both HistoryTab and StatsTab need it.

### 10. Security
**Current gap**: API key in frontend.

**Study**:
- Backend proxy pattern
- Environment variables
- CORS
- XSS prevention (sanitize user input before rendering)

**Practice**: Explain how you'd add a backend to protect the API key.

---

## Common Interview Traps

### "How would you scale this?"
**Bad answer**: "Add Redux, TypeScript, testing, CI/CD..."

**Good answer**: "First understand the bottleneck. Is it UI performance or API limits? For UI, virtualize long lists. For API, add caching. Start with measurements, not assumptions."

### "Why didn't you use X?"
**Bad answer**: "Didn't think of it" or "Didn't have time"

**Good answer**: "Considered it, but for a portfolio project showing feature implementation, I prioritized working code over architecture. In production with a team, I'd add X because [specific reason]."

### "This code has a bug..."
**Don't defend it**. Say: "Good catch. I'd fix it by..." or "I hadn't considered that edge case. I'd handle it by..."

---

## Quick Wins (Do These Now)

1. [ ] Add PropTypes to components
2. [ ] Fix the mixed inline/CSS style approach (pick one)
3. [ ] Add loading skeleton for better UX
4. [ ] Add "no analyses yet" empty states
5. [ ] Run ESLint, fix warnings
6. [ ] Add README with screenshots
7. [ ] Deploy to Vercel/Netlify

---

## Deep Dive Topics (If Interviewing at Big Tech)

### Browser Rendering Pipeline
- Critical Rendering Path
- Layout, Paint, Composite
- How to optimize each

### React Internals
- Virtual DOM diffing
- Fiber architecture
- Concurrent features (React 18+)

### Web Performance
- Core Web Vitals (LCP, FID, CLS)
- Performance budgets
- Measuring with Lighthouse

### Design Patterns
- Container/Presentational components
- Compound components
- Render props vs HOC vs hooks

---

## Questions You Should Be Able to Answer

1. What happens when you type a URL and press enter? (Classic)
2. Explain event delegation
3. What's the difference between == and ===? (Trick question: == coerces types)
4. How does React's Virtual DOM work?
5. What are closures? Give a practical example.
6. Explain CSS specificity
7. What's CORS and how do you handle it?
8. How do you prevent memory leaks in React?
9. What's the event loop in JavaScript?
10. Explain prototype inheritance

---

## Mock Interview Exercise

**Scenario**: "The AI analysis is taking 10+ seconds. Users are confused. Fix it."

**Your approach**:
1. Add loading states (already done, good!)
2. Show progress indicator (already done)
3. Add timeout handling
4. Consider streaming response for progressive display
5. Add cancel button for impatient users

**Code to write**:
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

fetch(url, { ...options, signal: controller.signal })
  .finally(() => clearTimeout(timeoutId));
```

---

## Final Checklist

Before presenting this project, ensure you can:

- [ ] Explain every file's purpose in 1 sentence
- [ ] Walk through the data flow (user input → API → display)
- [ ] Defend every technical decision (or admit it's a shortcut)
- [ ] Identify 3 things you'd improve
- [ ] Answer "why not X?" for common patterns you didn't use
- [ ] Show you understand the weak areas
- [ ] Deploy it and have a live demo ready
