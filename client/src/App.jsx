import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Intro from './pages/Intro';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import ViewProfile from './pages/ViewProfile';
import Bot from './pages/Bot';
import Explore from './pages/Explore';
import Motivation from './pages/Motivation';
import Exercise from './pages/Exercise';
import Stories from './pages/Stories';
import Games from './pages/Games';
import Anxiety from './pages/Anxiety';
import Depression from './pages/Depression';
import Relationship from './pages/Relationship';
import Community from './pages/Community';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import SocialSpace from './pages/SocialSpace';

// ── Protected Route ───────────────────────────────────────────────────────────
// Checks localStorage for token — if not logged in, redirects to /auth
function Protected({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>

      {/* Opening the website → shows auth page first */}
      <Route path="/"      element={<AuthPage />} />
      <Route path="/auth"  element={<AuthPage />} />
      <Route path="/login" element={<AuthPage />} />

      {/* All pages below are protected — login required */}
      <Route path="/intro"             element={<Protected><Intro /></Protected>} />
      <Route path="/dashboard"         element={<Protected><Dashboard /></Protected>} />
      <Route path="/profile/edit"      element={<Protected><EditProfile /></Protected>} />
      <Route path="/profile"           element={<Protected><ViewProfile /></Protected>} />
      <Route path="/bot"               element={<Protected><Bot /></Protected>} />
      <Route path="/explore"           element={<Protected><Explore /></Protected>} />
      <Route path="/motivation"        element={<Protected><Motivation /></Protected>} />
      <Route path="/exercise"          element={<Protected><Exercise /></Protected>} />
      <Route path="/stories"           element={<Protected><Stories /></Protected>} />
      <Route path="/games"             element={<Protected><Games /></Protected>} />
      <Route path="/anxiety"           element={<Protected><Anxiety /></Protected>} />
      <Route path="/depression"        element={<Protected><Depression /></Protected>} />
      <Route path="/relationship"      element={<Protected><Relationship /></Protected>} />
      <Route path="/community"         element={<Protected><Community /></Protected>} />
      <Route path="/feed"              element={<Protected><Feed /></Protected>} />
      <Route path="/create-post"       element={<Protected><CreatePost /></Protected>} />
      <Route path="/social"            element={<Protected><SocialSpace /></Protected>} />

      {/* Age-based redirect after login — both go to Dashboard for now */}
      <Route path="/teen-space"        element={<Protected><Dashboard /></Protected>} />
      <Route path="/young-adult-space" element={<Protected><Dashboard /></Protected>} />

    </Routes>
  );
}
