import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import GigCard from '../components/GigCard/GigCard';
import { getCurrentUser } from '../utils/auth';
import { getFavoriteGigs, clearAllFavorites } from '../utils/favorites';
import './FavoritesPage.css';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadFavorites();
  }, [navigate]);

  const loadFavorites = () => {
    const saved = getFavoriteGigs();
    setFavorites(saved);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);

    let sorted = [...favorites];
    switch (value) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'delivery':
        sorted.sort((a, b) => a.deliveryTime - b.deliveryTime);
        break;
      default:
        break;
    }
    setFavorites(sorted);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all saved services?')) {
      clearAllFavorites();
      setFavorites([]);
    }
  };

  const handleRemove = () => {
    // Reload favorites after removal
    loadFavorites();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="favorites-page">
      <Header />
      
      <div className="favorites-container">
        <div className="favorites-header">
          <div className="header-left">
            <h1 className="favorites-title">Saved Services</h1>
            <p className="favorites-subtitle">
              {favorites.length} {favorites.length === 1 ? 'service' : 'services'} saved
            </p>
          </div>
          <div className="header-right">
            {favorites.length > 0 && (
              <>
                <div className="sort-controls">
                  <label>Sort by:</label>
                  <select value={sortBy} onChange={handleSortChange}>
                    <option value="recent">Recently Saved</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="delivery">Fastest Delivery</option>
                  </select>
                </div>
                <button className="clear-all-btn" onClick={handleClearAll}>
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="#E8F4F8"/>
              <path
                d="M60 85L52.75 78.5C33 61 24 52.5 24 42.5C24 34 30 28 37.5 28C42 28 46.5 30 50 33.5C53.5 30 58 28 62.5 28C70 28 76 34 76 42.5C76 52.5 67 61 47.25 78.5L60 85Z"
                stroke="#1DA1F2"
                strokeWidth="3"
                fill="none"
              />
            </svg>
            <h2>No Saved Services Yet</h2>
            <p>Start saving services you're interested in to easily find them later</p>
            <button className="browse-btn" onClick={() => navigate('/gigs')}>
              Browse Services
            </button>
          </div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((gig) => (
              <GigCard key={gig._id} gig={gig} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;