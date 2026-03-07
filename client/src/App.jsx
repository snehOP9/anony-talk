import { Routes, Route } from 'react-router-dom';
import Intro from './pages/Intro';
import Login from './pages/Login';
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/profile" element={<ViewProfile />} />
      <Route path="/bot" element={<Bot />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/motivation" element={<Motivation />} />
      <Route path="/exercise" element={<Exercise />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/games" element={<Games />} />
      <Route path="/anxiety" element={<Anxiety />} />
      <Route path="/depression" element={<Depression />} />
      <Route path="/relationship" element={<Relationship />} />
      <Route path="/community" element={<Community />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/social" element={<SocialSpace />} />
    </Routes>
  );
}
