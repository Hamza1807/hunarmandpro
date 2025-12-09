import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveFavoriteGig, removeFavoriteGig, isFavorite } from '../../utils/favorites';
import './GigCard.css';

const GigCard = ({ gig }) => {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(isFavorite(gig._id));

  const handleCardClick = () => {
    navigate(`/gig/${gig._id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (favorite) {
      removeFavoriteGig(gig._id);
      setFavorite(false);
    } else {
      saveFavoriteGig(gig);
      setFavorite(true);
    }
  };

  const getSellerLevel = () => {
    const level = gig.sellerId?.sellerProfile?.level;
    if (!level) return null;
    
    if (level >= 2) {
      return (
        <span className="seller-badge level">
          <span className="badge-icon">◆</span>
          <span className="badge-icon">◆</span>
          Level {level}
        </span>
      );
    } else {
      return (
        <span className="seller-badge level">
          <span className="badge-icon">◆</span>
          Level {level}
        </span>
      );
    }
  };

  return (
    <div className="gig-card" onClick={handleCardClick}>
      <div className="gig-card-image">
        {gig.images && gig.images.length > 0 ? (
          <img src={`http://localhost:5000${gig.images[0]}`} alt={gig.title} />
        ) : (
          <div className="gig-placeholder-image">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect width="80" height="80" fill="#E8F4F8"/>
              <path d="M30 35L40 45L50 35M40 45V20" stroke="#1DA1F2" strokeWidth="3" strokeLinecap="round"/>
              <rect x="20" y="50" width="40" height="3" fill="#1DA1F2"/>
            </svg>
          </div>
        )}
        <button
          className={`favorite-button ${favorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 17L8.55 15.7C4.4 12.2 2 10.1 2 7.5C2 5.4 3.4 4 5.5 4C6.8 4 8.1 4.6 9 5.5C9.9 4.6 11.2 4 12.5 4C14.6 4 16 5.4 16 7.5C16 10.1 13.6 12.2 9.45 15.7L10 17Z"
              fill={favorite ? '#ff4757' : 'white'}
              opacity={favorite ? '1' : '0.9'}
            />
          </svg>
        </button>
      </div>

      <div className="gig-card-content">
        <div className="gig-seller-info">
          <div className="seller-avatar">
            {gig.sellerId?.profile?.profilePicture ? (
              <img
                src={`http://localhost:5000${gig.sellerId.profile.profilePicture}`}
                alt={gig.sellerId.username}
              />
            ) : (
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="15" r="15" fill="#1DA1F2"/>
                <circle cx="15" cy="12" r="5" fill="white"/>
                <path d="M7 22C7 18 9 16 15 16C21 16 23 18 23 22" fill="white"/>
              </svg>
            )}
          </div>
          <div className="seller-details">
            <span className="seller-name">{gig.sellerId?.username || 'Unknown'}</span>
            {getSellerLevel()}
          </div>
        </div>

        <h3 className="gig-title">{gig.title}</h3>
        
        <div className="gig-rating">
          <span className="stars">★</span>
          <span className="rating-value">
            {gig.sellerId?.sellerProfile?.rating?.toFixed(1) || '0.0'}
          </span>
        </div>

        <div className="gig-footer">
          <div className="gig-delivery">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" stroke="#666" strokeWidth="1.5" fill="none"/>
              <path d="M8 4v4l3 2" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>{gig.deliveryTime} day delivery</span>
          </div>
          <span className="gig-price">From PKR {gig.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default GigCard;