import { useMemo, useState, useEffect } from 'react';
import { getPosts, createPost, upvotePost } from '../utils/api';
import Navbar from '../components/Navbar';
import '../styles/feed.css';

const COMMUNITY_TOPICS = ['Relationship', 'Sexual Harassment', 'Anxiety', 'Healing', 'Motivation', 'General'];
const EMOJI_SUGGESTIONS = ['🙂', '😢', '💙', '🌿', '😞', '😌', '🔥', '✨', '🤍'];

const starterPosts = [
  {
    id: 'seed-1',
    title: 'Trying to rebuild trust',
    emoji: '💙',
    category: 'Relationship',
    content: 'Taking one honest conversation at a time. Small steps are still progress.',
    createdAt: '2026-03-06T08:20:00.000Z',
    author: 'Unknown',
    relates: 6,
    comments: 2
  },
  {
    id: 'seed-2',
    title: 'Breathing helped today',
    emoji: '🌿',
    category: 'Anxiety',
    content: 'I paused before reacting, did a 3-minute breathing cycle, and it grounded me.',
    createdAt: '2026-03-05T21:55:00.000Z',
    author: 'Anonymous',
    relates: 11,
    comments: 4
  }
];

export default function Feed() {
  const [serverPosts, setServerPosts] = useState([]);
  const [localRelates, setLocalRelates] = useState({});
  const [localSupports, setLocalSupports] = useState({});
  const [localComments, setLocalComments] = useState({});
  const [draftComments, setDraftComments] = useState({});
  const [selectedTopic, setSelectedTopic] = useState('Relationship');
  const [topic, setTopic] = useState('Relationship');
  const [emoji, setEmoji] = useState('');
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const apiPosts = await getPosts();
        setServerPosts(Array.isArray(apiPosts) ? apiPosts : []);
      } catch {
        setServerPosts([]);
      }
    })();
  }, []);

  const allPosts = useMemo(() => {
    const mappedApiPosts = serverPosts.map((post) => {
      const content = post.content || '';
      const splitContent = content.split('\n\n');
      const headline = splitContent[0] || '';
      const guessedTitle = headline.replace(/^[^a-zA-Z0-9]+/, '').slice(0, 50);

      return {
        id: post.id,
        title: post.title || guessedTitle || 'Shared Story',
        emoji: post.emoji || (headline.match(/^[^a-zA-Z0-9]+/)?.[0] || '🙂').trim(),
        category: post.category ? String(post.category) : 'General',
        content,
        createdAt: post.created_at || new Date().toISOString(),
        author: 'Unknown',
        relates: post.upvotes || 0,
        comments: 0
      };
    });

    return [...starterPosts, ...mappedApiPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [serverPosts]);

  const filteredPosts = allPosts.filter((post) => {
    if (selectedTopic === 'General') return true;
    return String(post.category).toLowerCase() === selectedTopic.toLowerCase();
  });

  const getPostId = (post) => String(post.id);

  const getRelateCount = (post) => (post.relates || 0) + (localRelates[getPostId(post)] || 0);

  const getSupportCount = (post) => localSupports[getPostId(post)] || 0;

  const getCommentCount = (post) => (post.comments || 0) + (localComments[getPostId(post)]?.length || 0);

  const handleMediaUpload = (event) => {
    const file = event.target.files?.[0];
    setMediaName(file ? file.name : '');
  };

  const refreshPosts = async () => {
    try {
      const apiPosts = await getPosts();
      setServerPosts(Array.isArray(apiPosts) ? apiPosts : []);
    } catch {
      setServerPosts([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedStory = story.trim();
    const trimmedTitle = title.trim();
    if (!trimmedStory || trimmedStory.length < 10 || !topic) {
      alert('Please add a topic and at least 10 characters for your story.');
      return;
    }

    setPosting(true);
    try {
      await createPost({
        category: topic,
        content: `${emoji ? `${emoji} ` : ''}${trimmedTitle ? `${trimmedTitle}\n\n` : ''}${trimmedStory}`,
      });
      setEmoji('');
      setTitle('');
      setStory('');
      setMediaName('');
      setSelectedTopic(topic);
      await refreshPosts();
    } catch (err) {
      alert(err.message || 'Unable to post right now.');
    } finally {
      setPosting(false);
    }
  };

  const handleRelate = async (post) => {
    const id = getPostId(post);
    if (typeof post.id === 'number') {
      try {
        await upvotePost(post.id);
        await refreshPosts();
        return;
      } catch {
        // Fall through to local optimistic increment.
      }
    }

    setLocalRelates((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleSupport = (post) => {
    const id = getPostId(post);
    setLocalSupports((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const handleCommentChange = (post, value) => {
    const id = getPostId(post);
    setDraftComments((prev) => ({ ...prev, [id]: value }));
  };

  const handleCommentSubmit = (post) => {
    const id = getPostId(post);
    const content = (draftComments[id] || '').trim();
    if (!content) return;
    setLocalComments((prev) => ({ ...prev, [id]: [...(prev[id] || []), content] }));
    setDraftComments((prev) => ({ ...prev, [id]: '' }));
  };

  const getTimeLabel = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'now';
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="story-feed-page">
      <Navbar />

      <main className="story-layout">
        <aside className="communities-panel">
          <h3>Communities</h3>
          <div className="community-list">
            {COMMUNITY_TOPICS.map((item) => (
              <button
                key={item}
                className={`community-item ${selectedTopic === item ? 'active' : ''}`}
                onClick={() => {
                  setSelectedTopic(item);
                  setTopic(item);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        <section className="story-column">
          <header className="story-header">
            <h1>Share Your Story</h1>
            <p>Post anonymously, find people who relate, and keep the conversation safe.</p>
          </header>

          <form className="story-composer" onSubmit={handleSubmit}>
            <div className="row two">
              <label>
                Topic
                <select value={topic} onChange={(event) => setTopic(event.target.value)}>
                  {COMMUNITY_TOPICS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                Emoji
                <div className="emoji-field">
                  <input
                    type="text"
                    placeholder="Type or paste any emoji"
                    value={emoji}
                    onChange={(event) => setEmoji(event.target.value)}
                  />
                  <div className="emoji-chip-row">
                    {EMOJI_SUGGESTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        className={`emoji-chip ${emoji === item ? 'active' : ''}`}
                        onClick={() => setEmoji(item)}
                        aria-label={`Use emoji ${item}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </label>
            </div>

            <label>
              Title (optional)
              <input
                type="text"
                placeholder="Give your story a short heading"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </label>

            <label>
              Share what is on your mind
              <textarea
                value={story}
                onChange={(event) => setStory(event.target.value)}
                placeholder="Share your feelings or what happened today..."
                rows={5}
              />
            </label>

            <label className="upload-label">
              Images/Video (filename only for now)
              <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} />
              {mediaName && <span className="file-pill">{mediaName}</span>}
            </label>

            <button type="submit" className="post-btn" disabled={posting}>
              {posting ? 'Posting...' : 'Post'}
            </button>
          </form>

          <div className="story-feed">
            {filteredPosts.length === 0 && (
              <div className="story-card empty">
                No stories in this topic yet. Be the first to share.
              </div>
            )}

            {filteredPosts.map((post) => (
              <article key={post.id} className="story-card">
                <div className="story-author-row">
                  <span className="badge-author">{post.author}</span>
                  <span className="badge-topic">{post.category}</span>
                </div>
                <h3>{post.emoji ? `${post.emoji} ` : ''}{post.title}</h3>
                <p>{post.content}</p>
                <div className="story-actions">
                  <button type="button" onClick={() => handleRelate(post)}>Relate ({getRelateCount(post)})</button>
                  <button type="button" className="support-btn" onClick={() => handleSupport(post)}>
                    We Are Here ({getSupportCount(post)})
                  </button>
                  <button type="button">Comment ({getCommentCount(post)})</button>
                  <small>{getTimeLabel(post.createdAt)}</small>
                </div>

                <div className="comment-box">
                  <input
                    type="text"
                    placeholder="Leave a kind comment..."
                    value={draftComments[getPostId(post)] || ''}
                    onChange={(event) => handleCommentChange(post, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleCommentSubmit(post);
                      }
                    }}
                  />
                  <button type="button" onClick={() => handleCommentSubmit(post)}>Send</button>
                </div>

                {(localComments[getPostId(post)] || []).length > 0 && (
                  <div className="comment-list">
                    {(localComments[getPostId(post)] || []).slice(-3).map((comment, index) => (
                      <p key={`${getPostId(post)}-${index}`}>Anon: {comment}</p>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
