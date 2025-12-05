import React from 'react';
import './Categories.css';

const Categories = () => {
  const categories = [
    {
      name: 'Programming & Tech',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M24 8L28 16L36 18L28 20L24 28L20 20L12 18L20 16L24 8Z" stroke="#1DA1F2" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M24 28L28 36L36 38L28 40L24 48L20 40L12 38L20 36L24 28Z" stroke="#1DA1F2" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Graphics & Design',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="12" y="12" width="24" height="24" stroke="#1DA1F2" strokeWidth="2.5" fill="none" rx="2"/>
          <rect x="18" y="18" width="12" height="12" stroke="#1DA1F2" strokeWidth="2.5" fill="none" rx="1"/>
          <path d="M12 12L18 18M30 18L36 12M30 30L36 36M18 30L12 36" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Digital Marketing',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="20" width="32" height="20" stroke="#1DA1F2" strokeWidth="2.5" fill="none" rx="2"/>
          <path d="M8 20L24 8L40 20" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="28" x2="16" y2="36" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="24" y1="24" x2="24" y2="36" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="32" y1="28" x2="32" y2="36" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Writing & Translation',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M12 12L36 12" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M12 20L28 20" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M12 28L36 28" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M12 36L24 36" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M32 20L36 24L32 28" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Video & Animation',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="12" y="12" width="24" height="24" rx="4" stroke="#1DA1F2" strokeWidth="2.5" fill="none"/>
          <path d="M20 18L28 24L20 30V18Z" fill="#1DA1F2"/>
        </svg>
      )
    },
    {
      name: 'AI Services',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="16" stroke="#1DA1F2" strokeWidth="2.5" fill="none"/>
          <circle cx="18" cy="20" r="2.5" fill="#1DA1F2"/>
          <circle cx="30" cy="20" r="2.5" fill="#1DA1F2"/>
          <path d="M18 30Q24 26 30 30" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Music & Audio',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M16 12V36C16 38.2091 17.7909 40 20 40C22.2091 40 24 38.2091 24 36C24 33.7909 22.2091 32 20 32" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M24 12V8L36 6V10" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M24 12L36 10V30C36 32.2091 34.2091 34 32 34C29.7909 34 28 32.2091 28 30C28 27.7909 29.7909 26 32 26" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Business',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="16" cy="20" r="4" stroke="#1DA1F2" strokeWidth="2.5" fill="none"/>
          <circle cx="32" cy="20" r="4" stroke="#1DA1F2" strokeWidth="2.5" fill="none"/>
          <path d="M12 32C12 28 14 24 20 24H28C34 24 36 28 36 32" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M24 12V24" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      name: 'Consulting',
      icon: (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="12" y="12" width="24" height="24" rx="2" stroke="#1DA1F2" strokeWidth="2.5" fill="none"/>
          <path d="M18 20L22 24L18 28" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M30 20L26 24L30 28" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="20" y1="30" x2="28" y2="30" stroke="#1DA1F2" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="categories-section">
      <div className="categories-container">
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">{category.icon}</div>
              <h3 className="category-name">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

