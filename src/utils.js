// Constants and utilities for the code analyzer
// NOTE: In production, API keys should be in environment variables

export const SUPPORTED_LANGUAGES = [
  "Python", "Java", "C++", "JavaScript", "TypeScript", 
  "Go", "Rust", "C", "C#", "Swift", "Kotlin", "Ruby", "PHP"
];

// API configuration - uses env var if available
export const GROQ_API_KEY = import.meta.env.VITE_GROQ_KEY || "";
export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Simple color mapping for ratings (1-10 scale)
export function getRatingColor(rating) {
  if (rating >= 8) return "#3fb950"; // green
  if (rating >= 5) return "#d29922"; // yellow
  return "#f85149"; // red
}

export function getRatingLabel(rating) {
  if (rating >= 8) return "Optimal";
  if (rating >= 5) return "Good";
  return "Suboptimal";
}

export function getQualityColor(quality) {
  const colors = { Good: "#3fb950", Acceptable: "#d29922", "Needs Improvement": "#f85149" };
  return colors[quality] || "#7d8590";
}

export function getQualityBg(quality) {
  const bgs = { Good: "#0f2a17", Acceptable: "#2a1f00", "Needs Improvement": "#2a0f0f" };
  return bgs[quality] || "#21262d";
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", { 
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" 
  });
}

// LocalStorage helpers with error handling
const HISTORY_KEY = "algo_inspect_history";
const MAX_HISTORY_ITEMS = 50;

export function saveToHistory(entry) {
  try {
    const existing = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    existing.unshift({ ...entry, id: Date.now() });
    
    // Keep only recent items
    if (existing.length > MAX_HISTORY_ITEMS) {
      existing.pop();
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(existing));
  } catch (err) {
    console.warn("Failed to save history:", err);
  }
}

export function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function buildPrompt(lang, problem, code) {
  const problemSection = problem ? `Problem: ${problem}\n` : "";
  return `Language: ${lang}\n${problemSection}Code:\n\`\`\`${lang}\n${code}\n\`\`\``;
}

// Prompt for the AI model - kept simple and focused
export const SYSTEM_PROMPT = `You are an expert competitive programmer. Analyze the given solution and return ONLY valid JSON:
{
  "time_complexity": "O(...)",
  "time_complexity_note": "brief explanation",
  "space_complexity": "O(...)",
  "space_complexity_note": "brief explanation",
  "efficiency_rating": 1-10,
  "approach_name": "e.g. Hash Map, Sliding Window",
  "approach_explanation": "2-3 sentences",
  "data_structures": ["array"],
  "algorithm_paradigm": "e.g. Greedy, DP",
  "optimizations": ["suggestion 1", "suggestion 2"],
  "can_be_optimal": true/false,
  "optimal_tc": "O(...) if better possible",
  "edge_cases": ["case 1", "case 2"],
  "code_quality": "Good/Acceptable/Needs Improvement",
  "code_quality_notes": "brief note",
  "bug_risks": ["risk 1"],
  "similar_problems": ["Problem Name"]
}`;
