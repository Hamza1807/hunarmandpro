import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../utils/auth';
import './SignInModal.css';

const SignInModal = ({ isOpen, onClose }) => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!emailOrUsername || !password) {
      setError('Please enter both email/username and password');
      return;
    }

    try {
      const user = await loginUser(emailOrUsername, password);
      
      if (user) {
        onClose();
        
        // Navigate based on user role
        // Client (buyer) -> /gigs (browse freelancers)
        // Freelancer (seller) -> /dashboard (manage services)
        if (user.role === 'client' || user.userType === 'buyer') {
          navigate('/gigs');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setError(error.message || 'Invalid email/username or password');
    }
  };

  const handleEmailButtonClick = () => {
    setShowEmailForm(true);
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="modal-content">
          {/* Left Section */}
          <div className="modal-left">
            <h2 className="modal-left-title">Welcome back</h2>
            <ul className="modal-features">
              <li className="feature-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.667 5L7.5 14.167 3.333 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Access your projects</span>
              </li>
              <li className="feature-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.667 5L7.5 14.167 3.333 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Manage your orders</span>
              </li>
              <li className="feature-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.667 5L7.5 14.167 3.333 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Connect with freelancers</span>
              </li>
            </ul>
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
            <h2 className="modal-right-title">Sign in to your account</h2>
            <p className="modal-subtitle">
              Don't have an account? <a href="#" className="signin-link" onClick={(e) => { 
                e.preventDefault(); 
                onClose();
                // Trigger signup modal - this will be handled by parent
                window.dispatchEvent(new CustomEvent('openSignupModal'));
              }}>Create a new account</a>
            </p>

            <div className="modal-buttons">
              <button className="social-button google-button">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 0 1-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                  <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0 0 10 20z" fill="#34A853"/>
                  <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 0 0 0 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                  <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {!showEmailForm ? (
                <button className="social-button email-button" onClick={handleEmailButtonClick}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 6.667L10 11.667L17.5 6.667M2.5 6.667H17.5M2.5 6.667V15C2.5 15.442 2.67559 15.866 2.98816 16.1785C3.30072 16.4911 3.72464 16.667 4.167 16.667H15.833C16.2754 16.667 16.6993 16.4911 17.0118 16.1785C17.3244 15.866 17.5 15.442 17.5 15V6.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Continue with email</span>
                </button>
              ) : (
                <form className="email-form" onSubmit={handleEmailSubmit}>
                  <input
                    type="text"
                    placeholder="Enter your email or username"
                    value={emailOrUsername}
                    onChange={(e) => {
                      setEmailOrUsername(e.target.value);
                      setError('');
                    }}
                    className="email-input"
                    required
                    autoFocus
                  />
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      className="email-input"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M2.5 2.5L17.5 17.5M11.767 11.767C11.313 12.221 10.683 12.5 10 12.5C8.619 12.5 7.5 11.381 7.5 10C7.5 9.317 7.779 8.687 8.233 8.233M15.858 13.575C17.05 12.442 18.125 11.008 19 10C17.125 7.5 13.75 5 10 5C9.092 5 8.208 5.142 7.358 5.408M5.833 3.833C4.267 4.75 2.933 6.042 2 7.5C3.875 10 7.25 12.5 11 12.5C12.15 12.5 13.25 12.258 14.25 11.833" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M10 3.333C6.25 3.333 2.875 5.833 1 8.333C2.875 10.833 6.25 13.333 10 13.333C13.75 13.333 17.125 10.833 19 8.333C17.125 5.833 13.75 3.333 10 3.333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="10" cy="8.333" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {error && <p className="error-message">{error}</p>}
                  <button type="submit" className="email-submit-button">
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="email-back-button"
                  >
                    Back
                  </button>
                </form>
              )}

              <div className="modal-divider">
                <span>OR</span>
              </div>

              <button className="social-button apple-button">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15.5 5.5C15.2 5.8 14.6 6.1 13.9 6.2C13.7 5.5 13.3 4.9 12.7 4.5C12.1 4.1 11.4 3.9 10.6 3.9C10.5 3.9 10.3 3.9 10.1 3.9C9.9 4.1 9.6 4.4 9.3 4.7C8.7 5.3 8 5.7 7.2 5.9C7.1 6.6 7.3 7.3 7.7 7.9C8.1 8.5 8.7 8.9 9.4 9.1C9.3 9.2 9.2 9.3 9.1 9.4C8.5 10.1 8.2 11 8.2 12C8.2 13.1 8.6 14.1 9.3 14.8C9.4 14.9 9.5 15 9.6 15.1C8.9 15.3 8.1 15.4 7.2 15.4C5.8 15.4 4.6 15 3.6 14.2C3.5 14.1 3.4 14 3.3 13.9C3.4 13.8 3.5 13.7 3.6 13.6C4.3 13.1 4.8 12.4 5.1 11.6C5.2 11.3 5.3 11 5.3 10.7C5.3 10.4 5.2 10.1 5 9.9C4.6 9.4 4.3 8.8 4.1 8.1C4 7.7 4 7.3 4 6.9C4 6.2 4.2 5.6 4.6 5.1C5.2 4.4 6 4 6.9 3.8C7.3 3.7 7.7 3.7 8.1 3.7C8.4 3.7 8.7 3.7 9 3.8C9.6 2.9 10.4 2.3 11.4 2C11.8 1.9 12.2 1.9 12.6 2C13.3 2.1 13.9 2.4 14.4 2.8C14.9 3.2 15.3 3.7 15.5 4.3C15.1 4.4 14.7 4.6 14.4 4.9C14.1 5.2 13.9 5.5 13.8 5.9C13.7 6.1 13.6 6.3 13.6 6.5C13.6 6.7 13.7 6.9 13.8 7.1C14 7.4 14.3 7.6 14.6 7.7C14.9 7.8 15.2 7.8 15.5 7.7C15.6 7.1 15.6 6.5 15.5 5.9C15.5 5.7 15.5 5.6 15.5 5.5Z" fill="currentColor"/>
                </svg>
                <span>Apple</span>
              </button>

              <button className="social-button facebook-button">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18.333 10C18.333 5.4 14.6 1.667 10 1.667S1.667 5.4 1.667 10C1.667 13.883 4.467 17.183 8.167 17.883V12.5H6.25V10H8.167V8.083C8.167 6.817 9.05 5.833 10.25 5.833H12.083V8.333H10.833C10.375 8.333 10 8.708 10 9.167V10H12.083V12.5H10V17.883C13.7 17.183 16.5 13.883 16.5 10H18.333Z" fill="currentColor"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>

            <p className="modal-legal">
              By signing in, you agree to the HunarmandPro{' '}
              <a href="#" className="legal-link">Terms of Service</a> and{' '}
              <a href="#" className="legal-link">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default SignInModal;

