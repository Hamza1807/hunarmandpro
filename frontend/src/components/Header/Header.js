import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo';
import SignupModal from '../Modal/SignupModal';
import SignInModal from '../Modal/SignInModal';
import { getCurrentUser, logoutUser } from '../../utils/auth';
import { getUnreadCount } from '../../utils/messages';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/dashboard';
  const isGigsPage = location.pathname === '/gigs';
  const isMessagesPage = location.pathname === '/messages';
  const isOrdersPage = location.pathname === '/orders';
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOpenSignup = () => {
      setIsSignInModalOpen(false);
      setIsSignupModalOpen(true);
    };
    
    window.addEventListener('openSignupModal', handleOpenSignup);
    return () => window.removeEventListener('openSignupModal', handleOpenSignup);
  }, []);

  useEffect(() => {
    // Load user data
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Load unread message count if user is logged in
    if (currentUser) {
      loadUnreadCount(currentUser.id);

      // Poll for unread messages every 30 seconds
      const interval = setInterval(() => {
        loadUnreadCount(currentUser.id);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isSignInModalOpen, isSignupModalOpen]);

  const loadUnreadCount = async (userId) => {
    try {
      const count = await getUnreadCount(userId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  // Determine logo link based on user role
  const getLogoLink = () => {
    if (!user) return '/';
    // Freelancer/Seller goes to dashboard
    if (user.userType === 'seller' || user.role === 'freelancer') {
      return '/dashboard';
    }
    // Client/Buyer goes to gigs
    if (user.userType === 'buyer' || user.role === 'client') {
      return '/gigs';
    }
    return '/';
  };

  return (
    <header className={`header ${isGigsPage || isMessagesPage || isOrdersPage ? 'gigs-header' : ''}`}>
      <div className="header-container">
        <Link to={getLogoLink()} className="logo-link">
          <Logo />
        </Link>
        {isGigsPage && (
          <div className="header-search-container">
            <input
              type="text"
              className="header-search-input"
              placeholder="What service are you looking for today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="header-search-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
        <nav className="header-nav">
          {isDashboard || isGigsPage || isMessagesPage || isOrdersPage ? (
            <>
              {/* Dashboard Header Icons */}
              <button className="header-icon-btn" aria-label="Notifications">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C8.9 2 8 2.9 8 4V5.5C6.2 6.2 5 7.9 5 10V15H4V17H16V15H15V10C15 7.9 13.8 6.2 12 5.5V4C12 2.9 11.1 2 10 2ZM10 3C10.6 3 11 3.4 11 4V5H9V4C9 3.4 9.4 3 10 3ZM7 10C7 8.3 8.3 7 10 7C11.7 7 13 8.3 13 10V15H7V10ZM9 18C9 18.6 9.4 19 10 19C10.6 19 11 18.6 11 18H9Z" fill="currentColor"/>
                </svg>
              </button>
              <button 
                className="header-icon-btn" 
                aria-label="Messages"
                onClick={() => navigate('/messages')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 4H18V14H4L2 16V4ZM3 5V13.59L3.59 13H17V5H3ZM6 8H14V9H6V8ZM6 10H12V11H6V10Z" fill="currentColor"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>
              <button className="header-icon-btn" aria-label="Favorites">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 17L8.55 15.7C4.4 12.2 2 10.1 2 7.5C2 5.4 3.4 4 5.5 4C6.8 4 8.1 4.6 9 5.5C9.9 4.6 11.2 4 12.5 4C14.6 4 16 5.4 16 7.5C16 10.1 13.6 12.2 9.45 15.7L10 17Z" fill="currentColor"/>
                </svg>
              </button>
              <Link to="/orders" className="nav-link">Orders</Link>
              <div className="profile-dropdown-container" ref={dropdownRef}>
                <button 
                  className="header-icon-btn profile-icon" 
                  aria-label="Profile"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  {user && user.username ? (
                    <div className="profile-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ borderRadius: '50%' }}>
                      <circle cx="18" cy="18" r="18" fill="#1DA1F2"/>
                      <circle cx="18" cy="13.5" r="6" fill="white"/>
                      <path d="M9 30C9 24 13.05 19.5 18 19.5C22.95 19.5 27 24 27 30" fill="white"/>
                    </svg>
                  )}
                </button>
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    {user && (
                      <div className="profile-dropdown-header">
                        <div className="profile-dropdown-avatar">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-dropdown-info">
                          <div className="profile-dropdown-name">{user.username}</div>
                          <div className="profile-dropdown-email">{user.email}</div>
                        </div>
                      </div>
                    )}
                    <div className="profile-dropdown-divider"></div>
                    <button 
                      className="profile-dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M7 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V14C2 14.5304 2.21071 15.0391 2.58579 15.4142C2.96086 15.7893 3.46957 16 4 16H7M12 13L16 9M16 9L12 5M16 9H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/explore" className="nav-link">Explore</Link>
              <div className="nav-link dropdown">
                <span>English</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <Link to="/become-seller" className="nav-link">Become a Seller</Link>
              <button onClick={() => setIsSignInModalOpen(true)} className="nav-link">Sign In</button>
              <button onClick={() => setIsSignupModalOpen(true)} className="nav-link join-btn">Join</button>
            </>
          )}
        </nav>
      </div>
      <SignupModal isOpen={isSignupModalOpen} onClose={() => setIsSignupModalOpen(false)} />
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </header>
  );
};

export default Header;

