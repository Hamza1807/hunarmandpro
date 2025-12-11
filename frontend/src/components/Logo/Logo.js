import React from 'react';
import './Logo.css';

const Logo = () => {
  return (
    <div className="logo-container">
      <div className="logo-icon">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="4" fill="#1DA1F2"/>
          <path d="M20 12C18.5 12 17 12.5 16 13.5C15 14.5 14.5 16 14.5 17.5V22.5C14.5 24 15 25.5 16 26.5C17 27.5 18.5 28 20 28C21.5 28 23 27.5 24 26.5C25 25.5 25.5 24 25.5 22.5V17.5C25.5 16 25 14.5 24 13.5C23 12.5 21.5 12 20 12ZM20 14C21 14 21.8 14.3 22.4 14.9C23 15.5 23.3 16.3 23.3 17.3V22.7C23.3 23.7 23 24.5 22.4 25.1C21.8 25.7 21 26 20 26C19 26 18.2 25.7 17.6 25.1C17 24.5 16.7 23.7 16.7 22.7V17.3C16.7 16.3 17 15.5 17.6 14.9C18.2 14.3 19 14 20 14Z" fill="white"/>
          <rect x="15" y="28" width="10" height="2" rx="1" fill="white"/>
          <rect x="17" y="30" width="6" height="2" rx="1" fill="white"/>
        </svg>
      </div>
      <span className="logo-text">HunarmandPro</span>
    </div>
  );
};

export default Logo;

