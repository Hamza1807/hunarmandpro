import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { getConversations } from '../utils/messages';
import { uploadProfilePicture, getUserProfile } from '../utils/messages';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    // Check if user is actually a freelancer/seller
    if (currentUser.userType === 'buyer' || currentUser.role === 'client') {
      navigate('/gigs');
      return;
    }
    setUser(currentUser);
    loadUserData(currentUser.id);
    loadConversations(currentUser.id);
  }, [navigate]);

  const loadUserData = async (userId) => {
    try {
      const userData = await getUserProfile(userId);
      // Update local storage with fresh data
      const currentUser = getCurrentUser();
      const updatedUser = {
        ...currentUser,
        profile: userData.profile,
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadConversations = async (userId) => {
    try {
      const data = await getConversations(userId);
      setConversations((data.conversations || []).slice(0, 5)); // Show only first 5
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadProfilePicture(user.id, file);
      
      // Update user state and localStorage
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          profilePicture: result.profilePicture,
        },
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      alert(error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffWeeks = Math.floor(diffMs / 604800000);
    
    if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''}`;
    
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    
    const diffHours = Math.floor(diffMs / 3600000);
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          {/* Profile Section */}
          <div className="sidebar-section profile-section">
            <div className="profile-picture" onClick={handleProfilePictureClick}>
              <div className="profile-avatar">
                {user.profile?.profilePicture ? (
                  <img 
                    src={`http://localhost:5000${user.profile.profilePicture}`} 
                    alt={user.username}
                    className="profile-avatar-img"
                  />
                ) : (
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="40" fill="#1DA1F2"/>
                    <circle cx="40" cy="32" r="12" fill="white"/>
                    <path d="M20 60 C20 50, 28 44, 40 44 C52 44, 60 50, 60 60" fill="white"/>
                  </svg>
                )}
                <div className="profile-avatar-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="white"/>
                    <path d="M20 5h-3.2L15 3H9L7.2 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 14H4V7h4.05l1.83-2h4.24l1.83 2H20v12z" fill="white"/>
                  </svg>
                  <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: 'none' }}
              />
            </div>
            <h3 className="profile-name">{user.username}</h3>
            <button className="sidebar-button">View Profile</button>
          </div>

          {/* Level Overview Section */}
          <div className="sidebar-section">
            <h4 className="section-title">Level overview</h4>
            <div className="level-details">
              <div className="detail-item">
                <span className="detail-label">My level</span>
                <span className="detail-value">Level 1</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Success score</span>
                <span className="detail-value">6</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rating</span>
                <span className="detail-value">4.6</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Response rate</span>
                <span className="detail-value">100%</span>
              </div>
            </div>
            <button className="sidebar-button">View Progress</button>
          </div>

          {/* Availability Section */}
          <div className="sidebar-section">
            <h4 className="section-title">Availability</h4>
            <p className="availability-text">
              While unavailable, your Gigs are hidden and you will not receive new orders.
            </p>
            <button className="sidebar-button">Set Availability</button>
          </div>

          {/* Earnings Section */}
          <div className="sidebar-section">
            <h4 className="section-title">Earned in December</h4>
            <div className="earnings-amount">$0</div>
          </div>

          {/* Inbox Section */}
          <div className="sidebar-section">
            <div className="inbox-header">
              <h4 className="section-title">Inbox</h4>
              <button 
                className="view-all-link"
                onClick={() => navigate('/messages')}
              >
                View All
              </button>
            </div>
            <div className="inbox-list">
              {conversations.length === 0 ? (
                <div className="inbox-empty">No messages yet</div>
              ) : (
                conversations.map((conv) => (
                  <div 
                    key={conv.conversationId}
                    className="inbox-item"
                    onClick={() => navigate(`/messages?conversation=${conv.conversationId}`)}
                  >
                    <div className="inbox-item-header">
                      <span className="inbox-username">{conv.otherUser.username}</span>
                      <span className="inbox-time">{formatTime(conv.lastMessage.timestamp)}</span>
                    </div>
                    <div className="inbox-preview">
                      {conv.lastMessage.message.substring(0, 30)}
                      {conv.lastMessage.message.length > 30 ? '...' : ''}
                      {conv.unreadCount > 0 && (
                        <span className="inbox-unread">{conv.unreadCount}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          <div className="dashboard-content">
            <h1 className="welcome-title">Welcome, {user.username}</h1>
            <p className="welcome-subtitle">
              Find important messages, tips, and links to helpful resources here:
            </p>

            {/* Action Cards */}
            <div className="action-cards">
              {/* Grow your business card */}
              <div className="action-card">
                <h3 className="card-title">Grow your business with Seller Plus</h3>
                <p className="card-text">
                  Check out all the tools and benefits that can help you scale your success
                </p>
              </div>

              {/* Set up inbox auto replies card */}
              <div className="action-card">
                <h3 className="card-title">Set up inbox auto replies</h3>
                <p className="card-text">
                  Greet new potential buyers with an auto reply to their first message.
                </p>
                <a href="#" className="card-link">Set up inbox auto replies</a>
              </div>

              {/* Reach more potential clients card */}
              <div className="action-card">
                <h3 className="card-title">Reach more potential clients</h3>
                <p className="card-text">
                  One or more of your offerings can be promoted through Fiverr Ads.
                </p>
              </div>

              {/* Active orders card */}
              <div 
                className="action-card active-orders-card" 
                onClick={() => navigate('/orders')}
                style={{ cursor: 'pointer' }}
              >
                <div className="active-orders-content">
                  <h3 className="card-title">Active orders</h3>
                  <p className="card-text">Active orders - 0 ($0)</p>
                </div>
                <div className="active-orders-box">
                  <p className="card-text">Active orders - 0 ($0)</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

