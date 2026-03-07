import { useState } from "react";
import TeenCard from "./TeenCard";

const moods = [
  { emoji: "😊", label: "Happy", support: "Glad you are feeling light today. Keep doing what helps." },
  { emoji: "😐", label: "Okay", support: "It is okay to feel in-between. You still deserve support." },
  { emoji: "😔", label: "Sad", support: "You are not alone. Your feelings are valid and heard here." },
  { emoji: "😡", label: "Angry", support: "Your anger matters. Let it out safely, one breath at a time." },
  { emoji: "😰", label: "Stressed", support: "Pause and breathe. Small calm steps can help right now." },
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <TeenCard title="How are you feeling today?">
      <p className="mb-3 text-sm text-white/80">Tap an emoji and get a short supportive check-in message.</p>
      <div className="grid grid-cols-5 gap-2">
        {moods.map((mood) => {
          const isActive = selectedMood?.label === mood.label;
          return (
            <button
              type="button"
              key={mood.label}
              onClick={() => setSelectedMood(mood)}
              aria-label={mood.label}
              className={`rounded-2xl border p-2 text-2xl transition hover:scale-105 ${
                isActive
                  ? "border-cyan-200 bg-cyan-400/20 shadow-md shadow-cyan-400/30"
                  : "border-white/20 bg-black/20 hover:bg-white/10"
              }`}
            >
              {mood.emoji}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-white/75">Selected mood: {selectedMood?.label || "Not selected yet"}</p>
      {selectedMood ? <p className="mt-2 text-sm text-cyan-100">{selectedMood.support}</p> : null}
    </TeenCard>
  );
}
