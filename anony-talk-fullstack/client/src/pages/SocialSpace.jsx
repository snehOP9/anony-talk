import { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/social-space.css';

const TABS = [
  { id: 'chat', label: 'Real-time Chat', icon: 'fas fa-comments' },
  { id: 'discussions', label: 'Community Discussions', icon: 'fas fa-comment-dots' },
  { id: 'connections', label: 'User Connections', icon: 'fas fa-users' },
  { id: 'announcements', label: 'Announcements', icon: 'fas fa-bullhorn' }
];

export default function SocialSpace() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="social-page">
      <Navbar />

      <div className="social-container">
        <h1>AnonyTalk Communication</h1>

        {/* Tab Navigation */}
        <div className="social-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`social-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon}></i> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="social-content">
          {/* Chat */}
          {activeTab === 'chat' && (
            <div className="social-tab-content">
              <div className="social-card-grid">
                <div className="social-card">
                  <h3>General Chat</h3>
                  <p>Connect with others in real-time.</p>
                  <button className="social-btn">Join Now</button>
                </div>
                <div className="social-card">
                  <h3>Support Room</h3>
                  <p>Get help from the community.</p>
                  <button className="social-btn">Join Now</button>
                </div>
              </div>
            </div>
          )}

          {/* Discussions */}
          {activeTab === 'discussions' && (
            <div className="social-tab-content">
              <div className="social-card">
                <h3>Topic: Platform Updates</h3>
                <p>What do you think of the new features?</p>
                <button className="social-link-btn">View Thread</button>
              </div>
            </div>
          )}

          {/* Connections */}
          {activeTab === 'connections' && (
            <div className="social-tab-content">
              <div className="social-card-grid">
                <div className="social-card user-card">
                  <div className="social-avatar"></div>
                  <div className="user-info">
                    <h3>User123</h3>
                    <p className="online">Online</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Announcements */}
          {activeTab === 'announcements' && (
            <div className="social-tab-content">
              <div className="social-card">
                <h3>Welcome to AnonyTalk!</h3>
                <p>We're live as of March 27, 2025.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
