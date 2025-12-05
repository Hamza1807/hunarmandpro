import React from 'react';
import './NavCategories.css';

const NavCategories = () => {
  const categories = [
    { name: 'Trending', icon: '🔥' },
    { name: 'Graphics & Design', icon: null },
    { name: 'Programming & Tech', icon: null },
    { name: 'Digital Marketing', icon: null },
    { name: 'Video & Animation', icon: null },
    { name: 'Writing & Translation', icon: null },
    { name: 'Music & Audio', icon: null },
    { name: 'Business', icon: null },
    { name: 'Finance', icon: null },
    { name: 'AI Services', icon: null }
  ];

  return (
    <div className="nav-categories">
      {categories.map((category, index) => (
        <div key={index} className={`nav-category-item ${index === 0 ? 'active' : ''}`}>
          {category.icon && <span>{category.icon}</span>}
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default NavCategories;

