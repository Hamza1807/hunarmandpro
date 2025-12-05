import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { checkUsernameAvailability } from '../../utils/auth';
import './UsernameModal.css';

const UsernameModal = ({ isOpen, onClose, onNext, email, password }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Generate a default username from email
      if (email) {
        const defaultUsername = email.split('@')[0] + '_' + Math.floor(Math.random() * 10000);
        setUsername(defaultUsername);
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, email]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setIsChecking(true);
    try {
      // Check if username is available via API
      const isAvailable = await checkUsernameAvailability(username);
      
      if (!isAvailable) {
        setError('Username already taken. Please choose another.');
        setIsChecking(false);
        return;
      }

      setError('');
      setIsChecking(false);
      onNext(username);
    } catch (error) {
      console.error('Check username error:', error);
      setError('Failed to check username availability. Please try again.');
      setIsChecking(false);
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="modal-content username-modal">
          {/* Left Section */}
          <div className="modal-left">
            <h2 className="modal-left-title">Get your profile started</h2>
            <div className="profile-examples">
              <div className="profile-example">
                <div className="profile-avatar">F</div>
                <span>Faith</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0L9.8 5.5L16 6.2L11.8 10.1L13 16L8 13L3 16L4.2 10.1L0 6.2L6.2 5.5L8 0Z" fill="#10B981"/>
                </svg>
              </div>
              <div className="profile-example">
                <div className="profile-avatar">J</div>
                <span>Jonthan_coleman</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0L9.8 5.5L16 6.2L11.8 10.1L13 16L8 13L3 16L4.2 10.1L0 6.2L6.2 5.5L8 0Z" fill="#10B981"/>
                </svg>
              </div>
            </div>
            <div className="modal-image-placeholder">
              <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                <rect width="200" height="200" fill="rgba(255, 255, 255, 0.1)"/>
                <circle cx="100" cy="80" r="30" fill="white" opacity="0.8"/>
                <path d="M60 140 Q100 120 140 140" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
                <rect x="70" y="150" width="60" height="40" rx="4" fill="white" opacity="0.6"/>
              </svg>
            </div>
          </div>

          {/* Right Section */}
          <div className="modal-right">
            <h2 className="modal-right-title">Get your profile started</h2>
            <p className="username-instruction">
              Add a username that's unique to you, this is how you'll appear to others. You can't change your username, so choose wisely.
            </p>

            <form className="username-form" onSubmit={handleSubmit}>
              <label className="username-label">Choose a username</label>
              <input
                type="text"
                className="username-input"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="john_smith"
                required
                autoFocus
              />
              {error && <p className="error-message">{error}</p>}
              <p className="username-helper">
                Build trust by using your full name or business name.
              </p>

              <button type="submit" className="username-submit-button" disabled={isChecking}>
                {isChecking ? 'Checking...' : 'Create my account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default UsernameModal;

