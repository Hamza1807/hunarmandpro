import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './GigSelectionModal.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const GigSelectionModal = ({ isOpen, onClose, freelancerId, freelancerName }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && freelancerId) {
      loadFreelancerGigs();
    }
  }, [isOpen, freelancerId]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const loadFreelancerGigs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/gigs/seller/${freelancerId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load gigs');
      }

      setGigs(data.gigs || []);
    } catch (err) {
      console.error('Failed to load gigs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="gig-modal-overlay" onClick={onClose}>
      <div className="gig-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="gig-modal-header">
          <h2 className="gig-modal-title">
            {freelancerName}'s Services
          </h2>
          <button className="gig-modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="gig-modal-content">
          {loading ? (
            <div className="gig-modal-loading">
              <div className="spinner"></div>
              <p>Loading services...</p>
            </div>
          ) : error ? (
            <div className="gig-modal-error">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="#DC2626" strokeWidth="2"/>
                <path d="M24 16v8M24 28v2" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p className="error-text">{error}</p>
              <button onClick={loadFreelancerGigs} className="retry-btn">Try Again</button>
            </div>
          ) : gigs.length === 0 ? (
            <div className="gig-modal-empty">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="35" fill="#E8F4F8"/>
                <path d="M30 35h20M30 40h15M30 45h18" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3>No Services Yet</h3>
              <p>{freelancerName} hasn't posted any services yet.</p>
              <p className="empty-hint">You can still send them a message to discuss your project!</p>
            </div>
          ) : (
            <div className="gigs-list">
              {gigs.map((gig) => (
                <div key={gig._id} className="gig-item">
                  <div className="gig-item-content">
                    <h3 className="gig-item-title">{gig.title || 'Untitled Service'}</h3>
                    <p className="gig-item-description">
                      {gig.description && gig.description.length > 100 
                        ? gig.description.substring(0, 100) + '...' 
                        : gig.description || 'No description available'}
                    </p>
                    <div className="gig-item-meta">
                      <span className="gig-price">
                        PKR {gig.price ? gig.price.toLocaleString() : '0'}
                      </span>
                      {gig.deliveryTime && (
                        <span className="gig-delivery">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          {gig.deliveryTime} {gig.deliveryTime === 1 ? 'day' : 'days'} delivery
                        </span>
                      )}
                    </div>
                    {gig.features && gig.features.length > 0 && (
                      <div className="gig-features">
                        {gig.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="gig-feature">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M10 3L4.5 8.5L2 6" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="gig-item-actions">
                    <button className="select-gig-btn" onClick={() => handleSelectGig(gig)}>
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="gig-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const handleSelectGig = (gig) => {
    // For now, just show an alert. This can be extended to create actual offers
    const price = gig.price ? gig.price.toLocaleString() : '0';
    alert(`Selected: ${gig.title || 'Untitled Service'}\n\nThis will create an offer for PKR ${price}`);
    // TODO: Implement offer creation functionality
  };

  return createPortal(modalContent, document.body);
};

export default GigSelectionModal;

