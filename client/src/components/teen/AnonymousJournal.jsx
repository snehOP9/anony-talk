import { useState } from 'react';
import TeenCard from './TeenCard';

const STORAGE_KEY = 'teen_support_journal_entry';

export default function AnonymousJournal() {
  const [entry, setEntry] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = () => {
    if (!entry.trim()) { setStatus('Write something before saving.'); return; }
    localStorage.setItem(STORAGE_KEY, entry);
    setStatus('Saved privately on this device ✓');
  };

  return (
    <TeenCard title="Anonymous Journal" icon="📝" accent="ts-card-journal">
      <p className="ts-desc">No names, no pressure. Just your thoughts — saved only on your device.</p>
      <textarea
        className="ts-journal-textarea"
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write whatever is on your mind..."
      />
      <div className="ts-journal-footer">
        <button type="button" className="ts-save-btn" onClick={handleSave}>Save Reflection</button>
        {status && <span className="ts-status-msg">{status}</span>}
      </div>
    </TeenCard>
  );
}
