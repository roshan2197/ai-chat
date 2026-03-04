import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { retrieveRelevantDocs } from "../knowledge-base";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  error?: string;
}

type Theme = "light" | "dark";

const QUICK_PROMPTS = [
  "Explain quantum computing",
  "Write a Python hello world",
  "What is machine learning?",
  "Tell me a joke",
  "How does AI work?",
  "Best practices for React",
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("chat-theme");
    return (saved as Theme) || "dark";
  });
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    localStorage.setItem("chat-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Focus input when loading completes
    if (!loading) {
      // Try focusing immediately
      inputRef.current?.focus();
      
      // Also try with a tiny delay as fallback
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
      return () => clearTimeout(focusTimer);
    }
  }, [loading]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const updateInput = (text: string) => {
    setInput(text);
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure? This cannot be undone.")) {
      setMessages([]);
      setError(null);
    }
  };

  const exportChat = () => {
    const chatText = messages
      .map((m) => `[${m.role.toUpperCase()}] ${m.content}`)
      .join("\n\n");
    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredMessages = messages.filter((m) =>
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Retrieve relevant docs from knowledge base
      const relevantDocs = retrieveRelevantDocs(input);

      // Build conversation history for context
      const conversationHistory = updatedMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch("http://localhost:4000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: conversationHistory,
          context: relevantDocs
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.answer || "No response received",
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to get response";
      setError(errorMessage);
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
      // Focus input after response completes
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-screen transition-colors ${
      theme === "dark"
        ? "bg-slate-900"
        : "bg-gray-50"
    }`}>
      {/* Header - Minimal */}
      <div className={`${
        theme === "dark"
          ? "bg-slate-800 text-white"
          : "bg-white text-slate-900"
      } px-6 py-3 border-b border-gray-200 dark:border-slate-700`}>
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-lg font-bold">AI Chat</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Toggle theme">
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536l1.414 1.414a1 1 0 001.414-1.414l-1.414-1.414a1 1 0 00-1.414 1.414zm2.121-10.071l1.414-1.414a1 1 0 00-1.414-1.414l-1.414 1.414a1 1 0 001.414 1.414zM5.464 5.464l1.414-1.414a1 1 0 00-1.414-1.414L4.05 4.05a1 1 0 001.414 1.414zM5.464 14.536l-1.414 1.414a1 1 0 001.414 1.414l1.414-1.414a1 1 0 00-1.414-1.414zM17 11a1 1 0 100-2h-2a1 1 0 100 2h2zM3 11a1 1 0 100-2H1a1 1 0 100 2h2z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Settings">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowSettings(false)}>
          <div className={`${
            theme === "dark"
              ? "bg-slate-800 border border-slate-700 text-white"
              : "bg-white border border-gray-200 text-gray-900"
          } rounded-2xl shadow-2xl max-w-sm w-full mx-4 max-h-96 overflow-y-auto`} onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Settings</h2>

              <div className="space-y-2">
                <label className="block text-sm font-semibold">Search Messages</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={`w-full px-3 py-2 rounded-lg text-sm ${
                      theme === "dark"
                        ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                        : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500"
                    } border focus:outline-none focus:ring-2 focus:ring-purple-500`} />
                </div>
                {searchQuery && (
                  <p className="text-xs opacity-70">Found {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""}</p>
                )}
              </div>

              <div className="pt-2 space-y-2 border-t border-gray-600/30">
                <button
                  onClick={exportChat}
                  disabled={messages.length === 0}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all">
                  📥 Export
                </button>
                <button
                  onClick={clearHistory}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all">
                  🗑️ Clear
                </button>
              </div>

              <div className={`p-3 rounded-lg text-xs font-medium ${
                theme === "dark" ? "bg-slate-700" : "bg-gray-100"
              }`}>
                💬 {messages.length} msgs | ~{messages.reduce((acc, m) => acc + m.content.length, 0)} tokens
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Container - MAIN */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
        {filteredMessages.length === 0 && !loading && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              <svg className={`w-16 h-16 mx-auto mb-4 opacity-50`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-semibold">Start a Conversation</p>
              <p className={`text-sm mt-2 ${theme === "dark" ? "text-gray-500" : "text-gray-600"}`}>Try one of these prompts or ask anything!</p>

              {/* Quick Suggestions */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setInput(prompt);
                    }}
                    className={`p-3 text-sm rounded-lg transition-all hover:shadow-md ${
                      theme === "dark"
                        ? "bg-indigo-800 hover:bg-indigo-700 text-indigo-100"
                        : "bg-indigo-100 hover:bg-indigo-200 text-indigo-900"
                    }`}>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {filteredMessages.length === 0 && searchQuery && (
          <div className={`text-center p-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            <p>No messages found matching "{searchQuery}"</p>
          </div>
        )}

        {filteredMessages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 ${msg.role === "user" ? "order-last" : ""}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                msg.role === "user" ? "bg-indigo-600" : "bg-blue-600"
              }`}>
                {msg.role === "user" ? "U" : "AI"}
              </div>
            </div>

            {/* Message */}
            <div className={`flex flex-col gap-1 max-w-md ${msg.role === "user" ? "order-last" : ""}`}>
              <div className={`px-4 py-3 rounded-lg shadow-md ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : theme === "dark"
                  ? "bg-slate-700 text-slate-50 rounded-bl-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none"
              }`}>
                <div className="break-words text-sm prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="ml-2" {...props} />,
                      code: ({node, inline, ...props}) => 
                        inline ? (
                          <code className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                            msg.role === "user" ? "bg-indigo-700/50" : theme === "dark" ? "bg-slate-600/50" : "bg-gray-200/50"
                          }`} {...props} />
                        ) : (
                          <code {...props} />
                        ),
                      pre: ({node, children, ...props}) => {
                        // Extract code content from react-markdown's code component
                        let codeContent = '';
                        let language = 'plaintext';
                        
                        // children is the <code> element
                        if (children && Array.isArray(children)) {
                          const codeElement = children[0];
                          if (codeElement?.props?.children) {
                            codeContent = codeElement.props.children;
                          }
                          // Extract language from class name
                          if (codeElement?.props?.className) {
                            const match = codeElement.props.className.match(/language-(\w+)/);
                            language = match ? match[1] : 'plaintext';
                          }
                        } else if (children?.props?.children) {
                          codeContent = children.props.children;
                          if (children.props.className) {
                            const match = children.props.className.match(/language-(\w+)/);
                            language = match ? match[1] : 'plaintext';
                          }
                        }
                        
                        return (
                          <div className={`rounded-lg overflow-hidden my-2 border ${
                            msg.role === "user" 
                              ? "border-indigo-600 bg-indigo-800/20" 
                              : theme === "dark" 
                              ? "border-slate-600 bg-slate-800/50" 
                              : "border-gray-300 bg-gray-100"
                          }`}>
                            <div className={`flex items-center justify-between px-4 py-2 text-xs font-mono ${
                              msg.role === "user"
                                ? "bg-indigo-700/40 text-indigo-100"
                                : theme === "dark"
                                ? "bg-slate-700/50 text-slate-300"
                                : "bg-gray-200 text-gray-700"
                            }`}>
                              <span className="font-semibold capitalize">{language}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(codeContent || '');
                                  setCopiedId(`code-${msg.id}`);
                                  setTimeout(() => setCopiedId(null), 2000);
                                }}
                                className="hover:opacity-70 transition-opacity text-xs">
                                {copiedId === `code-${msg.id}` ? '✓ Copied' : 'Copy'}
                              </button>
                            </div>
                            <pre className={`p-4 overflow-x-auto text-xs font-mono leading-relaxed whitespace-pre-wrap break-words ${
                              msg.role === "user" 
                                ? "text-indigo-50" 
                                : theme === "dark" 
                                ? "text-slate-50" 
                                : "text-gray-900"
                            }`}>
                              {codeContent || 'No code'}
                            </pre>
                          </div>
                        );
                      },
                      a: ({node, ...props}) => <a className="underline hover:opacity-80 font-semibold" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                      em: ({node, ...props}) => <em className="italic" {...props} />,
                      blockquote: ({node, ...props}) => (
                        <blockquote className={`border-l-4 pl-3 my-2 font-normal italic ${
                          msg.role === "user" ? "border-indigo-700 opacity-80" : theme === "dark" ? "border-slate-500 opacity-75" : "border-gray-400 opacity-80"
                        }`} {...props} />
                      ),
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 mt-3" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 mt-3" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1 mt-2" {...props} />,
                      hr: () => <hr className={`my-3 ${msg.role === "user" ? "border-indigo-600" : theme === "dark" ? "border-slate-600" : "border-gray-300"}`} />,
                    }}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Message Footer */}
              <div className={`flex items-center gap-3 px-4 text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              } ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <span>{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                <button
                  onClick={() => copyToClipboard(msg.content, msg.id)}
                  className={`hover:${theme === "dark" ? "text-gray-300" : "text-gray-700"} transition-colors flex items-center gap-1`}
                  title="Copy message">
                  {copiedId === msg.id ? (
                    <>
                      <span>✓</span>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Loading State */}
        {loading && (
          <div className="flex gap-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-blue-600`}>
              AI
            </div>
            <div className={`flex items-end gap-2 px-4 py-3 rounded-lg rounded-bl-none animate-pulse ${
              theme === "dark" ? "bg-slate-700" : "bg-gray-100"
            }`}>
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  theme === "dark" ? "bg-cyan-400" : "bg-indigo-600"
                }`}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  theme === "dark" ? "bg-cyan-400" : "bg-indigo-600"
                }`} style={{ animationDelay: "0.1s" }}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  theme === "dark" ? "bg-cyan-400" : "bg-indigo-600"
                }`} style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex gap-4 justify-start">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold">!</div>
            </div>
            <div className={`px-4 py-3 rounded-lg rounded-bl-none ${
              theme === "dark"
                ? "bg-rose-900 border border-rose-700 text-rose-100"
                : "bg-rose-100 border border-rose-300 text-rose-900"
            }`}>
              <p className="font-semibold">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - FOOTER */}
      <div className={`border-t ${
        theme === "dark"
          ? "bg-slate-900 border-slate-800"
          : "bg-white border-gray-200"
      } px-4 py-4`}>
        <div className="max-w-6xl mx-auto flex gap-3">
        <div className="flex-1 relative rounded-lg p-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => updateInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {}}
            placeholder="Type a message... (Shift+Enter for new line)"
            disabled={loading}
            className={`w-full px-4 py-2.5 rounded-md resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm focus:outline-none ${
              theme === "dark"
                ? "bg-slate-800 text-white placeholder-slate-500"
                : "bg-gray-50 text-gray-900 placeholder-gray-500"
            }`}
            rows={1} />
        </div>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all hover:shadow-lg flex items-center gap-2 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white`}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8l-6-4m6 4l6-4" />
                </svg>
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
