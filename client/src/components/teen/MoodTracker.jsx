import { useState } from 'react';
import TeenCard from './TeenCard';

const moods = [
  { emoji: '😊', label: 'Happy',    support: 'Glad you are feeling light today. Keep doing what helps.' },
  { emoji: '😐', label: 'Okay',     support: 'It is okay to feel in-between. You still deserve support.' },
  { emoji: '😔', label: 'Sad',      support: 'You are not alone. Your feelings are valid and heard here.' },
  { emoji: '😡', label: 'Angry',    support: 'Your anger matters. Let it out safely, one breath at a time.' },
  { emoji: '😰', label: 'Stressed', support: 'Pause and breathe. Small calm steps can help right now.' },
];

export default function MoodTracker() {
  const [selected, setSelected] = useState(null);

  return (
    <TeenCard title="How are you feeling?" icon="🌡️" accent="ts-card-mood">
      <div className="ts-mood-grid">
        {moods.map((mood) => (
          <button
            key={mood.label}
            type="button"
            className={'ts-mood-btn' + (selected?.label === mood.label ? ' active' : '')}
            onClick={() => setSelected(mood)}
            aria-label={mood.label}
          >
            {mood.emoji}
            <span className="ts-mood-label">{mood.label}</span>
          </button>
        ))}
      </div>
      <p className="ts-mood-status">
        {selected ? `Feeling ${selected.label} today` : 'Tap to log your mood'}
      </p>
      {selected && <p className="ts-mood-message">{selected.support}</p>}
    </TeenCard>
  );
}
