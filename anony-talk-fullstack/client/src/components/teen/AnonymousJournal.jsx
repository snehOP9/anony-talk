import { useState } from "react";
import TeenCard from "./TeenCard";

const STORAGE_KEY = "teen_support_journal_entry";

export default function AnonymousJournal() {
  const [entry, setEntry] = useState("");
  const [status, setStatus] = useState("");

  const handleSave = () => {
    if (!entry.trim()) {
      setStatus("Write something before saving.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, entry);
    setStatus("Entry saved privately on this device.");
  };

  return (
    <TeenCard title="Express Yourself (Anonymous Journal)">
      <p className="mb-3 text-sm text-white/80">No names, no pressure. Just your thoughts and feelings.</p>
      <textarea
        value={entry}
        onChange={(event) => setEntry(event.target.value)}
        placeholder="Write whatever is on your mind..."
        className="min-h-40 w-full rounded-2xl border border-white/20 bg-slate-950/35 p-3 text-sm text-white placeholder:text-white/50 focus:border-cyan-300 focus:outline-none"
      />
      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:brightness-110"
        >
          Save Reflection
        </button>
        {status ? <span className="text-xs text-white/75">{status}</span> : null}
      </div>
    </TeenCard>
  );
}
