import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Particles from '../components/Particles';
import { useAuth } from '../context/AuthContext';
import * as api from '../utils/api';
import '../styles/community.css';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('All');
  const { user } = useAuth();

  const loadPosts = async () => {
    try {
      const data = await api.getPosts(filter !== 'All' ? filter : undefined);
      setPosts(data);
    } catch {
      setPosts([]);
    }
  };

  useEffect(() => { loadPosts(); }, [filter]);

  const handlePost = async () => {
    const content = input.trim();
    if (content.length < 10) {
      alert('Minimum 10 characters required');
      return;
    }
    try {
      await api.createPost({ userId: user?.userId, content, category: 'General' });
      setInput('');
      loadPosts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await api.upvotePost(id);
      loadPosts();
    } catch {}
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="page">
      <Navbar />
      <Particles count={30} />

      <div className="page-content">
        <section className="hero" style={{ minHeight: '20vh' }}>
          <h1>🌐 Community Hub</h1>
          <p>Share thoughts anonymously and connect with others</p>
        </section>

        {/* Post Input */}
        <div className="card community-input" style={{ marginBottom: 24 }}>
          <textarea
            className="input-field"
            placeholder="Share your thoughts anonymously... (minimum 10 characters)"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePost(); } }}
          />
          <button className="btn btn-glow" onClick={handlePost} style={{ marginTop: 12 }}>Post</button>
        </div>

        {/* Filters */}
        <div className="category-filters" style={{ marginBottom: 24 }}>
          {['All', 'General', 'Support', 'Tech'].map(cat => (
            <button
              key={cat}
              className={`tab ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="posts-container">
          {posts.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No posts yet. Be the first to share!</p>}
          {posts.map(post => (
            <div key={post.id} className="post">
              <div className="post-header">
                <div>
                  <span className="post-author">Anonymous</span>
                  <span className="post-time">{formatTime(post.created_at)}</span>
                </div>
                <button className="upvote-btn" onClick={() => handleUpvote(post.id)}>
                  ▲ {post.upvotes}
                </button>
              </div>
              {post.title && <h3>{post.emoji} {post.title}</h3>}
              <p className="post-content">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
