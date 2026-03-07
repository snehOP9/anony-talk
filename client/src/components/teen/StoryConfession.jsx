import { useState } from "react";
import TeenCard from "./TeenCard";

export default function StoryConfession() {
  const [story, setStory] = useState("");
  const [status, setStatus] = useState("");

  const handlePost = () => {
    if (!story.trim()) {
      setStatus("Please share a few words before posting.");
      return;
    }
    setStatus("Your confession was posted anonymously.");
    setStory("");
  };

  return (
    <TeenCard title="Share Your Story">
      <p className="mb-3 text-sm text-white/80">
        Talk about harassment, bullying, or emotional struggles. Your identity stays private.
      </p>
      <textarea
        value={story}
        onChange={(event) => setStory(event.target.value)}
        placeholder="Write what you are going through..."
        className="min-h-36 w-full rounded-2xl border border-white/20 bg-slate-950/35 p-3 text-sm text-white placeholder:text-white/50 focus:border-cyan-300 focus:outline-none"
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handlePost}
          className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:brightness-110"
        >
          Post Anonymously
        </button>
        {status ? <span className="text-xs text-white/75">{status}</span> : null}
      </div>
    </TeenCard>
  );
}
