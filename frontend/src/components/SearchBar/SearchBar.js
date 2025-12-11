import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ onSearch, showFilters = false }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    deliveryTime: '',
    sellerLevel: '',
    language: '',
    country: ''
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const categories = [
    'Programming & Tech',
    'Graphics & Design',
    'Digital Marketing',
    'Writing & Translation',
    'Video & Animation',
    'AI services',
    'Music & Audio',
    'Business',
    'Consulting'
  ];

  const deliveryTimeOptions = [
    { value: '1', label: 'Express 24H' },
    { value: '3', label: 'Up to 3 days' },
    { value: '7', label: 'Up to 7 days' },
    { value: '14', label: 'Anytime' }
  ];

  const sellerLevelOptions = [
    { value: '1', label: 'Level 1' },
    { value: '2', label: 'Level 2' },
    { value: 'top', label: 'Top Rated' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const searchParams = {
      query: searchQuery,
      ...filters
    };
    
    if (onSearch) {
      onSearch(searchParams);
    } else {
      const params = new URLSearchParams();
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key]) {
          params.append(key, searchParams[key]);
        }
      });
      navigate(`/search?${params.toString()}`);
    }
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Generate suggestions based on input
    if (value.length > 2) {
      const filteredSuggestions = categories.filter(cat => 
        cat.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      deliveryTime: '',
      sellerLevel: '',
      language: '',
      country: ''
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar-wrapper" ref={searchRef}>
        <div className="search-input-group">
          <input
            type="text"
            className="search-input"
            placeholder="Search for any service..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          <button className="search-button" onClick={handleSearch}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Search
          </button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => {
                  setSearchQuery(suggestion);
                  setShowSuggestions(false);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M7 14A7 7 0 1 0 7 0a7 7 0 0 0 0 14zM15 15l-3.5-3.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {showFilters && (
        <div className="search-filters-section">
          <button 
            className="filters-toggle"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 6h12M6 10h8M8 14h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {showAdvancedFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showAdvancedFilters && (
            <div className="advanced-filters">
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Min Price (PKR)</label>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Max Price (PKR)</label>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Delivery Time</label>
                  <select
                    value={filters.deliveryTime}
                    onChange={(e) => handleFilterChange('deliveryTime', e.target.value)}
                  >
                    <option value="">Any Time</option>
                    {deliveryTimeOptions.map((option, idx) => (
                      <option key={idx} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Seller Level</label>
                  <select
                    value={filters.sellerLevel}
                    onChange={(e) => handleFilterChange('sellerLevel', e.target.value)}
                  >
                    <option value="">All Levels</option>
                    {sellerLevelOptions.map((option, idx) => (
                      <option key={idx} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>Language</label>
                  <input
                    type="text"
                    placeholder="e.g. English, Urdu"
                    value={filters.language}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                  />
                </div>

                <div className="filter-group">
                  <label>Country</label>
                  <input
                    type="text"
                    placeholder="e.g. Pakistan"
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                  />
                </div>
              </div>

              <div className="filters-actions">
                <button className="clear-filters-btn" onClick={clearFilters}>
                  Clear All Filters
                </button>
                <button className="apply-filters-btn" onClick={handleSearch}>
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;