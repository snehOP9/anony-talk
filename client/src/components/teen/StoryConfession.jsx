import { useState } from 'react';
import TeenCard from './TeenCard';

export default function StoryConfession() {
  const [story, setStory] = useState('');
  const [status, setStatus] = useState('');

  const handlePost = () => {
    if (!story.trim()) { setStatus('Please share a few words before posting.'); return; }
    setStatus('Your confession was posted anonymously.');
    setStory('');
  };

  return (
    <TeenCard title="Share Your Story" icon="🗣️" accent="ts-card-confession">
      <p className="ts-confession-desc">
        Talk about harassment, bullying, or emotional struggles. Your identity stays private.
      </p>
      <textarea
        className="ts-journal-textarea"
        value={story}
        onChange={(e) => setStory(e.target.value)}
        placeholder="Write what you are going through..."
      />
      <div className="ts-journal-footer">
        <button type="button" className="ts-post-btn" onClick={handlePost}>Post Anonymously</button>
        {status && <span className="ts-status-msg">{status}</span>}
      </div>
    </TeenCard>
  );
}
