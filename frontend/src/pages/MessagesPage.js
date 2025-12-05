import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import GigSelectionModal from '../components/Modal/GigSelectionModal';
import { getCurrentUser } from '../utils/auth';
import { getConversations, getMessages, sendMessage, markAsRead, getAllFreelancers } from '../utils/messages';
import './MessagesPage.css';

const MessagesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState('conversations'); // 'conversations' or 'freelancers'
  const [isGigModalOpen, setIsGigModalOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadConversations(currentUser.id);
    
    // If user is a client, load freelancers list
    if (currentUser.userType === 'buyer' || currentUser.role === 'client') {
      loadFreelancers();
    }
  }, [navigate]);

  const loadFreelancers = async () => {
    try {
      const data = await getAllFreelancers();
      setFreelancers(data || []);
    } catch (error) {
      console.error('Failed to load freelancers:', error);
    }
  };

  useEffect(() => {
    // Check if there's a conversation ID in URL
    const convId = searchParams.get('conversation');
    if (convId && conversations.length > 0) {
      const conv = conversations.find(c => c.conversationId === convId);
      if (conv) {
        handleSelectConversation(conv);
      }
    }
  }, [searchParams, conversations]);

  const loadConversations = async (userId) => {
    try {
      setLoading(true);
      const data = await getConversations(userId);
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setSelectedFreelancer(null); // Clear freelancer selection
    try {
      const data = await getMessages(conversation.conversationId, user.id);
      setMessages(data.messages || []);
      
      // Mark as read
      await markAsRead(conversation.conversationId, user.id);
      
      // Update unread count in local state
      setConversations(prevConvs =>
        prevConvs.map(c =>
          c.conversationId === conversation.conversationId
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSelectFreelancer = async (freelancer) => {
    setSelectedFreelancer(freelancer);
    setSelectedConversation(null); // Clear conversation selection
    
    // Check if conversation already exists
    const existingConv = conversations.find(conv => 
      conv.otherUser.id === freelancer._id
    );
    
    if (existingConv) {
      // Load existing conversation
      handleSelectConversation(existingConv);
    } else {
      // Start new conversation - clear messages
      setMessages([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Determine receiver ID
    let receiverId;
    if (selectedConversation) {
      receiverId = selectedConversation.otherUser.id;
    } else if (selectedFreelancer) {
      receiverId = selectedFreelancer._id;
    } else {
      return;
    }

    try {
      setSending(true);
      const messageData = {
        senderId: user.id,
        receiverId: receiverId,
        message: newMessage.trim(),
      };

      const result = await sendMessage(messageData);
      
      // Add message to list
      setMessages(prev => [...prev, result.data]);
      setNewMessage('');
      
      // Refresh conversations to update last message
      loadConversations(user.id);
      
      // If this was a new conversation with a freelancer, switch to conversations tab
      if (selectedFreelancer && !selectedConversation) {
        setActiveTab('conversations');
        setSelectedFreelancer(null);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffMs / 604800000);
    const diffMonths = Math.floor(diffMs / 2629800000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''}`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''}`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!user) return null;

  return (
    <div className="messages-page">
      <Header />
      <div className="messages-container">
        {/* Left Sidebar - Conversations List */}
        <aside className="messages-sidebar">
          <div className="messages-header">
            <div className="messages-filter">
              <span className="filter-label">
                {(user?.userType === 'buyer' || user?.role === 'client') ? 'Messages' : 'All messages'}
              </span>
              {!(user?.userType === 'buyer' || user?.role === 'client') && (
                <select className="filter-dropdown">
                  <option>All messages</option>
                  <option>Unread</option>
                  <option>Archived</option>
                </select>
              )}
            </div>
            <button className="search-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Tabs for Clients */}
          {(user?.userType === 'buyer' || user?.role === 'client') && (
            <div className="messages-tabs">
              <button 
                className={`tab-btn ${activeTab === 'conversations' ? 'active' : ''}`}
                onClick={() => setActiveTab('conversations')}
              >
                Conversations
              </button>
              <button 
                className={`tab-btn ${activeTab === 'freelancers' ? 'active' : ''}`}
                onClick={() => setActiveTab('freelancers')}
              >
                Freelancers
              </button>
            </div>
          )}

          <div className="conversations-list">
            {activeTab === 'conversations' ? (
              loading ? (
                <div className="loading-state">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="empty-state">
                  <p>No messages yet</p>
                  <p className="empty-subtitle">
                    {(user?.userType === 'buyer' || user?.role === 'client') 
                      ? 'Click on Freelancers tab to start a conversation' 
                      : 'Start a conversation with a client'}
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.conversationId}
                    className={`conversation-item ${selectedConversation?.conversationId === conv.conversationId ? 'active' : ''}`}
                    onClick={() => handleSelectConversation(conv)}
                  >
                    <div className="conversation-avatar">
                      {conv.otherUser.profilePicture ? (
                        <img 
                          src={`http://localhost:5000${conv.otherUser.profilePicture}`} 
                          alt={conv.otherUser.username}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {conv.otherUser.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {conv.unreadCount > 0 && <span className="online-indicator"></span>}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <span className="conversation-username">{conv.otherUser.username}</span>
                        <span className="conversation-time">{formatTime(conv.lastMessage.timestamp)}</span>
                      </div>
                      <div className="conversation-preview">
                        <span className={`preview-text ${conv.unreadCount > 0 ? 'unread' : ''}`}>
                          {conv.lastMessage.senderId === user.id ? 'Me: ' : ''}
                          {conv.lastMessage.message}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="unread-badge">{conv.unreadCount}</span>
                        )}
                      </div>
                    </div>
                    <button className="conversation-star">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5l2-5z" stroke="#999" strokeWidth="1.5" fill="none"/>
                      </svg>
                    </button>
                  </div>
                ))
              )
            ) : (
              // Freelancers list
              loading ? (
                <div className="loading-state">Loading freelancers...</div>
              ) : freelancers.length === 0 ? (
                <div className="empty-state">
                  <p>No freelancers found</p>
                </div>
              ) : (
                freelancers.map((freelancer) => (
                  <div
                    key={freelancer._id}
                    className={`conversation-item ${selectedFreelancer?._id === freelancer._id ? 'active' : ''}`}
                    onClick={() => handleSelectFreelancer(freelancer)}
                  >
                    <div className="conversation-avatar">
                      {freelancer.profile?.profilePicture ? (
                        <img 
                          src={`http://localhost:5000${freelancer.profile.profilePicture}`} 
                          alt={freelancer.username}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {freelancer.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-header">
                        <span className="conversation-username">{freelancer.username}</span>
                        {freelancer.sellerProfile?.level && (
                          <span className="freelancer-level">Level {freelancer.sellerProfile.level}</span>
                        )}
                      </div>
                      <div className="conversation-preview">
                        <span className="preview-text">
                          {freelancer.profile?.bio ? 
                            freelancer.profile.bio.substring(0, 40) + '...' : 
                            'Available for work'}
                        </span>
                        {freelancer.sellerProfile?.rating > 0 && (
                          <span className="freelancer-rating">
                            ⭐ {freelancer.sellerProfile.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button className="conversation-star">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 2L8 6L4 2" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 14L8 10L12 14" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ))
              )
            )}
          </div>
        </aside>

        {/* Main Message Area */}
        <main className="messages-main">
          {(selectedConversation || selectedFreelancer) ? (
            <>
              <div className="message-header">
                <div className="header-user-info">
                  <div className="header-avatar">
                    {(selectedConversation?.otherUser.profilePicture || selectedFreelancer?.profile?.profilePicture) ? (
                      <img 
                        src={`http://localhost:5000${selectedConversation?.otherUser.profilePicture || selectedFreelancer?.profile?.profilePicture}`}
                        alt={selectedConversation?.otherUser.username || selectedFreelancer?.username}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        {(selectedConversation?.otherUser.username || selectedFreelancer?.username)?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="header-username">
                    {selectedConversation?.otherUser.username || selectedFreelancer?.username}
                  </span>
                </div>
                <div className="header-actions">
                  <button className="header-action-btn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                  <button className="header-action-btn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
                      <circle cx="10" cy="4" r="1.5" fill="currentColor"/>
                      <circle cx="10" cy="16" r="1.5" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="safety-banner">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1l6 2v5c0 3.5-2.5 6.5-6 7-3.5-.5-6-3.5-6-7V3l6-2z" stroke="#16A34A" strokeWidth="1.5" fill="none"/>
                  <path d="M6 8l1.5 1.5L11 6" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="safety-text">WE HAVE YOUR BACK</span>
                <p className="safety-description">
                  For added safety and your protection, keep payments and communications within HunarmandPro.
                  <a href="#" className="learn-more">Learn more</a>
                </p>
              </div>

              <div className="messages-content">
                {messages.length === 0 && selectedFreelancer ? (
                  <div className="new-conversation-prompt">
                    <p>Start a conversation with {selectedFreelancer.username}</p>
                    <p className="new-conversation-subtitle">Send a message to begin chatting</p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderId._id === user.id || msg.senderId === user.id;
                    const otherUser = selectedConversation?.otherUser || selectedFreelancer;
                    return (
                      <div key={msg._id || index} className={`message-bubble-wrapper ${isMe ? 'me' : 'other'}`}>
                        <div className="message-bubble">
                          <div className="message-avatar">
                            {isMe ? (
                              <div className="avatar-placeholder small me">Me</div>
                            ) : otherUser?.profilePicture || otherUser?.profile?.profilePicture ? (
                              <img 
                                src={`http://localhost:5000${otherUser?.profilePicture || otherUser?.profile?.profilePicture}`}
                                alt={otherUser?.username}
                              />
                            ) : (
                              <div className="avatar-placeholder small">
                                {otherUser?.username?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="message-content">
                            <div className="message-text">{msg.message}</div>
                            <div className="message-time">{formatMessageTime(msg.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form className="message-input-form" onSubmit={handleSendMessage}>
                <textarea
                  className="message-input"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  rows="1"
                />
                <div className="message-actions">
                  <div className="message-tools">
                    <button type="button" className="tool-btn" title="Emoji">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="7" cy="8" r="1" fill="currentColor"/>
                        <circle cx="13" cy="8" r="1" fill="currentColor"/>
                        <path d="M6 12c1 2 3 3 4 3s3-1 4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button type="button" className="tool-btn" title="Attach file">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <button 
                    type="button" 
                    className="create-offer-btn"
                    onClick={() => setIsGigModalOpen(true)}
                  >
                    Create an offer
                  </button>
                  <button 
                    type="submit" 
                    className="send-btn"
                    disabled={sending || !newMessage.trim()}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M18 2L9 11M18 2l-6 16-3-7-7-3 16-6z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="empty-conversation">
              <div className="empty-illustration">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="60" fill="#E8F4F8"/>
                  <path d="M70 90h60M70 110h40" stroke="#1DA1F2" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="empty-title">Pick up where you left off</h2>
              <p className="empty-subtitle">Select a conversation and chat away.</p>
            </div>
          )}
        </main>

        {/* Right Sidebar - User Info (if conversation or freelancer selected) */}
        {(selectedConversation || selectedFreelancer) && (
          <aside className="message-sidebar-right">
            <div className="sidebar-user-card">
              <h3 className="sidebar-title">
                About {selectedConversation?.otherUser.username || selectedFreelancer?.username}
              </h3>
              <div className="sidebar-user-info">
                <div className="sidebar-avatar-large">
                  {(selectedConversation?.otherUser.profilePicture || selectedFreelancer?.profile?.profilePicture) ? (
                    <img 
                      src={`http://localhost:5000${selectedConversation?.otherUser.profilePicture || selectedFreelancer?.profile?.profilePicture}`}
                      alt={selectedConversation?.otherUser.username || selectedFreelancer?.username}
                    />
                  ) : (
                    <div className="avatar-placeholder large">
                      {(selectedConversation?.otherUser.username || selectedFreelancer?.username)?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="sidebar-username">
                  {selectedConversation?.otherUser.username || selectedFreelancer?.username}
                </p>
                <p className="sidebar-usertype">
                  {(selectedConversation?.otherUser.userType === 'seller' || selectedFreelancer) ? 'Freelancer' : 'Client'}
                </p>
              </div>

              <div className="sidebar-stats">
                <div className="stat-item">
                  <span className="stat-label">Completed orders</span>
                  <span className="stat-value">-</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average rating given</span>
                  <span className="stat-value">-</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average order price</span>
                  <span className="stat-value">-</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tip frequency</span>
                  <span className="stat-value">-</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Gig Selection Modal */}
      <GigSelectionModal
        isOpen={isGigModalOpen}
        onClose={() => setIsGigModalOpen(false)}
        freelancerId={selectedConversation?.otherUser.id || selectedFreelancer?._id}
        freelancerName={selectedConversation?.otherUser.username || selectedFreelancer?.username}
      />
    </div>
  );
};

export default MessagesPage;

