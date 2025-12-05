import React, { useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const popularServices = [
    'website development',
    'architecture & interior design',
    'UGC videos',
    'video editing',
    'vibe coding'
  ];

  const trustedBy = [
    'Meta',
    'Google',
    'NETFLIX',
    'P&G',
    'PayPal',
    'Payoneer'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  // Background image path - place your image in public folder as hero-background.jpg
  const backgroundImageStyle = {
    backgroundImage: "url('/hero-background.jpg')"
  };

  return (
    <section className="hero-section" style={backgroundImageStyle}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-headline">Our freelancers will take it from here</h1>
        
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search for any service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 19L14.65 14.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>

        <div className="popular-services">
          {popularServices.map((service, index) => (
            <button key={index} className="service-tag">
              {service}
              {service === 'vibe coding' && <span className="new-badge">NEW</span>}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        
      </div>
    </section>
  );
};

export default Hero;

