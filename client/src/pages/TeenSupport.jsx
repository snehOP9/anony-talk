import '../styles/teen.css';
import Navbar from '../components/Navbar';
import HeroSection from '../components/teen/HeroSection';
import MoodTracker from '../components/teen/MoodTracker';
import QuickCalmTools from '../components/teen/QuickCalmTools';
import TeenSupportChat from '../components/teen/TeenSupportChat';
import AnonymousJournal from '../components/teen/AnonymousJournal';
import StoryConfession from '../components/teen/StoryConfession';
import NotAloneStories from '../components/teen/NotAloneStories';
import KindMessagesWall from '../components/teen/KindMessagesWall';

export default function TeenSupport() {
  return (
    <div className="ts-page">
      <Navbar />
      <div className="ts-content">
        <HeroSection />
        <div className="ts-grid-2">
          <MoodTracker />
          <QuickCalmTools />
        </div>
        <TeenSupportChat />
        <div className="ts-grid-2">
          <AnonymousJournal />
          <StoryConfession />
        </div>
        <NotAloneStories />
        <KindMessagesWall />
      </div>
    </div>
  );
}
