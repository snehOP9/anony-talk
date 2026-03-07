import Navbar from '../components/Navbar';
import HeroSection from '../components/teen/HeroSection';
import MoodTracker from '../components/teen/MoodTracker';
import QuickCalmTools from '../components/teen/QuickCalmTools';
import TeenSupportChat from '../components/teen/TeenSupportChat';
import AnonymousJournal from '../components/teen/AnonymousJournal';
import NotAloneStories from '../components/teen/NotAloneStories';
import KindMessagesWall from '../components/teen/KindMessagesWall';

export default function TeenSupport() {
  return (
    <div className="page">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <HeroSection />
          <MoodTracker />
          <QuickCalmTools />
          <TeenSupportChat />
          <AnonymousJournal />
          <NotAloneStories />
          <KindMessagesWall />
        </div>
      </div>
    </div>
  );
}
