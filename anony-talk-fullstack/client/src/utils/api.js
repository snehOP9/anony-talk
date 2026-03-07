const API_BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Auth
export const register = (anonymousId, encryptionKey) =>
  request('/auth/register', { method: 'POST', body: JSON.stringify({ anonymousId, encryptionKey }) });

export const login = (anonymousId, encryptionKey) =>
  request('/auth/login', { method: 'POST', body: JSON.stringify({ anonymousId, encryptionKey }) });

// Posts
export const getPosts = (category) =>
  request(`/posts${category ? `?category=${category}` : ''}`);

export const createPost = (post) =>
  request('/posts', { method: 'POST', body: JSON.stringify(post) });

export const upvotePost = (id) =>
  request(`/posts/${id}/upvote`, { method: 'PATCH' });

// Profiles
export const getProfile = (userId) => request(`/profiles/${userId}`);

export const saveProfile = (userId, profile) =>
  request(`/profiles/${userId}`, { method: 'PUT', body: JSON.stringify(profile) });

// Mood
export const getMoodLogs = (userId) => request(`/mood/${userId}`);

export const logMood = (userId, mood, date) =>
  request('/mood', { method: 'POST', body: JSON.stringify({ userId, mood, date }) });

export const getChallenges = (userId, page) =>
  request(`/mood/${userId}/challenges?page=${page}`);

export const updateChallenge = (userId, challengeId, page, completed) =>
  request('/mood/challenges', { method: 'POST', body: JSON.stringify({ userId, challengeId, page, completed }) });

// Chat
export const sendChatMessage = (message) =>
  request('/chat', { method: 'POST', body: JSON.stringify({ message }) });
