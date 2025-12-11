import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import SearchBar from '../components/SearchBar/SearchBar';
import GigCard from '../components/GigCard/GigCard';
import { getCurrentUser } from '../utils/auth';
import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    searchGigs();
  }, [searchParams]);

  const searchGigs = async () => {
    setLoading(true);
    try {
      const query = searchParams.get('query') || '';
      const category = searchParams.get('category') || '';
      const minPrice = searchParams.get('minPrice') || '';
      const maxPrice = searchParams.get('maxPrice') || '';
      const deliveryTime = searchParams.get('deliveryTime') || '';
      const sellerLevel = searchParams.get('sellerLevel') || '';

      const params = new URLSearchParams();
      if (query) params.append('search', query);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (deliveryTime) params.append('deliveryTime', deliveryTime);
      if (sellerLevel) params.append('sellerLevel', sellerLevel);

      const response = await fetch(`http://localhost:5000/api/gigs?${params.toString()}`);
      const data = await response.json();

      setGigs(data.gigs || []);
    } catch (error) {
      console.error('Error searching gigs:', error);
      setGigs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchParams) => {
    const params = new URLSearchParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key]) {
        params.append(key, searchParams[key]);
      }
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Sort gigs based on selection
    let sortedGigs = [...gigs];
    switch (e.target.value) {
      case 'price-low':
        sortedGigs.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sortedGigs.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedGigs.sort((a, b) => (b.sellerId?.sellerProfile?.rating || 0) - (a.sellerId?.sellerProfile?.rating || 0));
        break;
      case 'newest':
        sortedGigs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }
    setGigs(sortedGigs);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="search-results-page">
      <Header />
      
      <div className="search-results-container">
        <SearchBar onSearch={handleSearch} showFilters={true} />

        <div className="results-header">
          <h1 className="results-title">
            {searchParams.get('query') 
              ? `Results for "${searchParams.get('query')}"`
              : searchParams.get('category')
              ? `${searchParams.get('category')} Services`
              : 'All Services'}
          </h1>
          <div className="results-controls">
            <span className="results-count">
              {gigs.length} {gigs.length === 1 ? 'service' : 'services'} available
            </span>
            <div className="sort-controls">
              <label>Sort by:</label>
              <select value={sortBy} onChange={handleSortChange}>
                <option value="relevance">Relevance</option>
                <option value="rating">Best Rating</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Searching for services...</p>
          </div>
        ) : gigs.length === 0 ? (
          <div className="empty-state">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="#E8F4F8"/>
              <path d="M50 70A10 10 0 1 0 50 50a10 10 0 0 0 0 20zM85 85l-15-15" stroke="#1DA1F2" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <h2>No services found</h2>
            <p>Try adjusting your search or filters to find what you're looking for</p>
          </div>
        ) : (
          <div className="gigs-grid">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;