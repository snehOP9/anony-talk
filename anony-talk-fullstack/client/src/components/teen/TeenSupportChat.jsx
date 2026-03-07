import { useMemo, useRef, useState } from "react";
import TeenCard from "./TeenCard";

const replies = [
  "I'm here to listen. Tell me more about what you're feeling.",
  "Thank you for sharing that. You are safe here.",
  "That sounds really hard. We can take this one step at a time.",
  "You matter, and your feelings are valid.",
];

export default function TeenSupportChat() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", text: "Hi, this is a safe anonymous space. You can talk freely here." },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const handleSend = (event) => {
    event.preventDefault();
    if (!canSend) return;

    const userText = input.trim();
    const next = [
      ...messages, 
      { id: Date.now(), role: "user", text: userText },
      { id: Date.now() + 1, role: "assistant", text: replies[Math.floor(Math.random() * replies.length)] },
    ];
    setMessages(next);
    setInput("");
    scrollToBottom();
  };

  return (
    <TeenCard title="Anonymous Chat Support">
      <p className="mb-3 text-sm text-white/80">Talk with a supportive agent in a judgment-free space.</p>
      <div className="h-[320px] overflow-y-auto rounded-2xl border border-white/20 bg-slate-900/30 p-4 md:h-[400px]">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-md ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                    : "bg-sky-100/90 text-slate-800"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Share what's on your mind… this is your safe space."
          className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/60 focus:border-cyan-300 focus:outline-none"
        />
        <button
          type="submit" 
          disabled={!canSend}
          aria-label="Send message"
          className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span aria-hidden="true">➤</span>
        </button>
      </form>
    </TeenCard>
  );
}
