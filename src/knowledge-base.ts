// Simple Knowledge Base for RAG
export const KNOWLEDGE_BASE = [
  {
    id: "react-basics",
    title: "React Basics",
    content: `React is a JavaScript library for building user interfaces with reusable components.
    Key concepts: Components are functions that return JSX. State is managed with useState hook.
    Props are used to pass data between components. useEffect handles side effects and cleanup.
    Component lifecycle: mounting → updating → unmounting. Always use keys in lists for proper reconciliation.
    Best practice: Keep components small and focused on a single responsibility.`,
    keywords: ["react", "component", "jsx", "usestate", "useeffect", "props", "hooks"]
  },
  {
    id: "typescript-guide",
    title: "TypeScript Guide",
    content: `TypeScript is a superset of JavaScript that adds static typing and compile-time checking.
    Benefits: Type safety prevents runtime errors, better IDE support with autocomplete, easier refactoring.
    Basic types: string, number, boolean, any, unknown, void, never. 
    Complex types: Interfaces define object shapes, Types are similar but more flexible.
    Generics: function<T>(arg: T): T allows reusable code with type variables.
    Advanced: Union types (A | B), Intersection types (A & B), Conditional types (T extends U ? A : B).`,
    keywords: ["typescript", "types", "interface", "generic", "static typing", "union", "intersection"]
  },
  {
    id: "tailwind-css",
    title: "Tailwind CSS",
    content: `Tailwind CSS is a utility-first CSS framework for rapidly building designs without writing CSS.
    Use classes like "bg-blue-600", "text-white", "rounded-lg", "p-4", "shadow-lg", "hover:scale-105".
    Responsive design: sm:, md:, lg:, xl: prefixes for breakpoints. Dark mode with dark: prefix.
    Layout utilities: flex, grid, gap, justify-center, items-center, w-full, h-screen.
    State variants: hover:, focus:, active:, disabled:, group-hover:, first:, last:.
    Animations: transition-all, animate-spin, animate-bounce. Transform utilities: scale, rotate, translate.`,
    keywords: ["tailwind", "css", "utility", "responsive", "dark mode", "animation", "flex", "grid"]
  },
  {
    id: "web-api",
    title: "Modern Web APIs",
    content: `Fetch API: async function to HTTP requests. Example: fetch(url).then(r => r.json()).
    localStorage: window.localStorage.setItem(key, value) and getItem(key) for persistent storage.
    UUID: crypto.randomUUID() generates unique identifiers.
    Clipboard: navigator.clipboard.writeText(text) for copy operations.
    File handling: Blob for binary data, URL.createObjectURL() for download links, File API for uploads.
    Event handling: addEventListener(event, callback), removeEventListener, event.preventDefault().
    Async patterns: Promises, async/await, Promise.all() for parallel operations.`,
    keywords: ["fetch", "localstorage", "api", "clipboard", "blob", "url", "async", "promise"]
  },
  {
    id: "groq-api",
    title: "Groq API Integration",
    content: `Groq API provides fast LLM inference with low latency. 
    Endpoint: https://api.groq.com/openai/v1/chat/completions (OpenAI compatible).
    Models: llama-3.1-8b (fast, general), mixtral-8x7b (expert, reasoning), gemma-7b (lightweight).
    Authentication: Send API key in Authorization header: "Bearer YOUR_API_KEY".
    Request format: Send JSON with messages array containing {role, content}. Roles: "system", "user", "assistant".
    Response: Contains choices array with [0].message.content and finish_reason.
    Parameters: temperature (0-2, higher = more creative), max_tokens, top_p (nucleus sampling).`,
    keywords: ["groq", "api", "llama", "llm", "chat", "completion", "model", "streaming"]
  },
  {
    id: "git-basics",
    title: "Git Version Control",
    content: `Git is a distributed version control system for tracking code changes.
    Basic workflow: git add files, git commit -m "message", git push to remote, git pull to fetch.
    Branches: git branch to list, git checkout -b name to create, git merge name to combine.
    Remote: git remote add origin url, git clone url to download repository.
    Undoing: git reset HEAD file to unstage, git revert commit to undo, git stash to save WIP.
    Collaboration: Pull requests (PRs) for code review before merging. Always write descriptive commit messages.`,
    keywords: ["git", "version control", "commit", "branch", "merge", "push", "pull", "github"]
  },
  {
    id: "performance",
    title: "Performance Optimization",
    content: `React performance: React.memo() for component memoization, useCallback for stable function references.
    useMemo for expensive computations. Code splitting with React.lazy and Suspense for faster load times.
    Image optimization: Set width/height, use modern formats (WebP), lazy load below fold.
    Bundle analysis: Use webpack-bundle-analyzer to find large dependencies.
    Metrics: Measure with Lighthouse, Web Vitals (LCP, FID, CLS), React Profiler.
    Caching: Implement HTTP caching headers, service workers for offline support.`,
    keywords: ["performance", "optimization", "memo", "usecallback", "usememo", "lazy", "bundle"]
  },
  {
    id: "security",
    title: "Web Security Best Practices",
    content: `Input validation: Always validate and sanitize user input on both client and server to prevent XSS attacks.
    HTTPS: Use HTTPS for all data transmission to prevent man-in-the-middle attacks.
    API keys: Never expose API keys in client code—use environment variables and server-side proxies.
    CORS: Implement Cross-Origin Resource Sharing properly to allow trusted origins only.
    Authentication: Use secure tokens (JWT), httpOnly cookies, and proper session management.
    Content Security Policy (CSP): Set CSP headers to restrict resource loading.
    Dependencies: Keep npm packages updated, audit with npm audit for vulnerabilities.`,
    keywords: ["security", "xss", "cors", "api key", "https", "validation", "jwt", "csp"]
  },
  {
    id: "rag-knowledge",
    title: "RAG - Retrieval Augmented Generation",
    content: `RAG combines document retrieval with LLM generation for accurate, context-aware responses.
    How it works: 1) User asks question, 2) System retrieves relevant documents, 3) LLM uses docs as context.
    Benefits: Answers grounded in knowledge base, reduced hallucinations, easy to update knowledge.
    Implementation: Create knowledge base with documents, embed user query, find similar docs (keyword or semantic).
    System prompt: Inject retrieved context at beginning of system message or user prompt.
    Scaling: For large systems, use vector databases (Pinecone, Weaviate) for semantic search.`,
    keywords: ["rag", "retrieval", "augmented", "generation", "knowledge base", "context", "embedding"]
  }
];

// Simple similarity search function
export function retrieveRelevantDocs(query: string, topK: number = 2): string {
  const queryLower = query.toLowerCase();
  
  // Score each doc based on keyword matches
  const scored = KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    doc.keywords.forEach(keyword => {
      if (queryLower.includes(keyword)) score += 2;
    });
    // Also check title and content
    if (queryLower.includes(doc.title.toLowerCase())) score += 3;
    if (doc.content.toLowerCase().includes(queryLower)) score += 1;
    
    return { doc, score };
  });

  // Sort by score and get top K
  const relevant = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => `[${item.doc.title}]\n${item.doc.content}`);

  // If no match found, return empty (API can answer freely)
  return relevant.length > 0 
    ? `\n\nRELEVANT KNOWLEDGE BASE:\n${relevant.join("\n\n")}`
    : "";
}
