// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Header/Header';
// import NavCategories from '../components/NavCategories/NavCategories';
// import { getCurrentUser, logoutUser } from '../utils/auth';
// import './GigsDashboard.css';

// const GigsDashboard = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [gigs, setGigs] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('User Generated Content (UGC)');

//   useEffect(() => {
//     const currentUser = getCurrentUser();
//     if (!currentUser) {
//       navigate('/');
//       return;
//     }
//     setUser(currentUser);
//     loadGigs();
//   }, [navigate]);

//   const loadGigs = () => {
//     // TODO: Load real gigs from API when gig posting feature is implemented
//     setGigs([]);
//   };

//   const handleLogout = () => {
//     logoutUser();
//     navigate('/');
//   };

//   if (!user) {
//     return null;
//   }

//   const categories = [
//     { name: 'User Generated Content (UGC)', icon: '👤' },
//     { name: 'Logo Design', icon: '🎨' },
//     { name: 'Website Development', icon: '💻' },
//     { name: 'Social Media Marketing', icon: '📱' }
//   ];

//   const filteredGigs = gigs;

//   return (
//     <div className="gigs-dashboard">
//       <Header />
//       <NavCategories />
//       <div className="dashboard-content-wrapper">
//         <div className="dashboard-header">
//           <h1 className="welcome-title">Welcome to HunarmandPro, {user.username}!</h1>
//         </div>


//         <div className="recommended-section">
//           <h2 className="section-title">RECOMMENDED FOR YOU</h2>
//           <div className="recommended-cards">
//             <div className="recommended-card">
//               <div className="card-icon-wrapper">
//                 <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//                   <rect x="8" y="8" width="24" height="24" rx="2" stroke="#1DA1F2" strokeWidth="2" fill="none"/>
//                   <path d="M14 16L20 22L26 16" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M12 24H28" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round"/>
//                 </svg>
//               </div>
//               <h3>Post a project brief</h3>
//               <p>Get tailored offers for your needs.</p>
//             </div>
//             <div className="recommended-card">
//               <div className="card-icon-wrapper">
//                 <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//                   <rect x="8" y="4" width="24" height="32" rx="4" stroke="#1DA1F2" strokeWidth="2" fill="none"/>
//                   <rect x="12" y="8" width="16" height="20" rx="2" stroke="#1DA1F2" strokeWidth="2" fill="none"/>
//                   <path d="M16 32H24" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round"/>
//                 </svg>
//               </div>
//               <h3>Download the HunarmandPro app</h3>
//               <p>Stay productive, anywhere you go.</p>
//             </div>
//             <div className="recommended-card profile-progress">
//               <div className="profile-progress-header">
//                 <span className="profile-progress-label">PROFILE PROGRESS</span>
//               </div>
//               <div className="card-icon-wrapper">
//                 <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
//                   <rect x="8" y="8" width="24" height="24" rx="2" stroke="#1DA1F2" strokeWidth="2" fill="none"/>
//                   <path d="M16 20L20 24L24 20" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <circle cx="20" cy="28" r="2" fill="#1DA1F2"/>
//                 </svg>
//               </div>
//               <h3>Tailor HunarmandPro to your needs</h3>
//               <p>Complete your profile.</p>
//             </div>
//           </div>
//         </div>

//         <div className="gigs-section">
//           <div className="gigs-section-header">
//             <h2 className="section-title">Explore popular categories on HunarmandPro</h2>
//             <div className="gigs-header-controls">
//               <button className="show-all-link">Show All</button>
//               <div className="navigation-arrows">
//                 <button className="nav-arrow" aria-label="Previous">
//                   <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                     <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </button>
//                 <button className="nav-arrow" aria-label="Next">
//                   <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                     <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//           <div className="gigs-content-wrapper">
//             <div className="categories-sidebar">
//               {categories.map((category, index) => (
//                 <div
//                   key={index}
//                   className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
//                   onClick={() => setSelectedCategory(category.name)}
//                 >
//                   <span className="category-icon">{category.icon}</span>
//                   <span>{category.name}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="gigs-scroll-container">
//               {filteredGigs.length === 0 ? (
//                 <div className="empty-gigs-state">
//                   <div className="empty-gigs-icon">
//                     <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
//                       <circle cx="60" cy="60" r="50" fill="#E8F4F8"/>
//                       <path d="M40 50h40M40 60h30M40 70h35" stroke="#1DA1F2" strokeWidth="3" strokeLinecap="round"/>
//                     </svg>
//                   </div>
//                   <h3 className="empty-gigs-title">No Gigs Available Yet</h3>
//                   <p className="empty-gigs-subtitle">
//                     Freelancers haven't posted any gigs yet. Check back soon!
//                   </p>
//                   <p className="empty-gigs-hint">
//                     In the meantime, you can browse freelancers and contact them directly from the Messages section.
//                   </p>
//                   <button 
//                     className="browse-freelancers-btn"
//                     onClick={() => navigate('/messages')}
//                   >
//                     Browse Freelancers
//                   </button>
//                 </div>
//               ) : (
//                 <div className="gigs-grid">
//                   {filteredGigs.map((gig) => (
//                     <div key={gig.id} className="gig-card">
//                       <div className="gig-image">
//                         <img src={gig.image} alt={gig.title} />
//                         <div className="gig-image-overlay">
//                           <button className="play-button">
//                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//                               <path d="M8 5V19L19 12L8 5Z" fill="white"/>
//                             </svg>
//                           </button>
//                           <button className="heart-button">
//                             <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
//                               <path d="M10 17L8.55 15.7C4.4 12.2 2 10.1 2 7.5C2 5.4 3.4 4 5.5 4C6.8 4 8.1 4.6 9 5.5C9.9 4.6 11.2 4 12.5 4C14.6 4 16 5.4 16 7.5C16 10.1 13.6 12.2 9.45 15.7L10 17Z" fill="white" opacity="0.9"/>
//                             </svg>
//                           </button>
//                         </div>
//                         {gig.offersVideoConsultation && (
//                           <span className="consultation-badge">Offers video consultations</span>
//                         )}
//                       </div>
//                       <div className="gig-info">
//                         <div className="gig-seller">
//                           <span className="seller-name">{gig.seller}</span>
//                           {gig.badge === 'Top Rated' && (
//                             <span className="seller-badge top-rated">
//                               <span className="badge-icon">◆</span>
//                               <span className="badge-icon">◆</span>
//                               <span className="badge-icon">◆</span>
//                               Top Rated
//                             </span>
//                           )}
//                           {gig.badge === 'Vetted Pro' && (
//                             <span className="seller-badge vetted">Vetted Pro</span>
//                           )}
//                           {gig.badge === 'Level 2' && (
//                             <span className="seller-badge level">
//                               <span className="badge-icon">◆</span>
//                               Level 2
//                             </span>
//                           )}
//                           {gig.badge === 'Level 1' && (
//                             <span className="seller-badge level">Level 1</span>
//                           )}
//                         </div>
//                         <p className="gig-title">{gig.title}</p>
//                         <div className="gig-rating">
//                           <span className="stars">★</span>
//                           <span className="rating-value">{gig.rating}</span>
//                           <span className="reviews">({gig.reviews > 999 ? `${Math.floor(gig.reviews / 1000)}k+` : gig.reviews} reviews)</span>
//                         </div>
//                         <div className="gig-footer">
//                           <span className="gig-price">From PKR {gig.price.toLocaleString()}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GigsDashboard;



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import NavCategories from '../components/NavCategories/NavCategories';
import { getCurrentUser, logoutUser } from '../utils/auth';
import './GigsDashboard.css';

const GigsDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('User Generated Content (UGC)');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    loadGigs();
  }, [navigate]);

  const loadGigs = () => {
    // TODO: Load real gigs from API when gig posting feature is implemented
    setGigs([]);
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const categories = [
    { name: 'User Generated Content (UGC)', icon: '👤' },
    { name: 'Logo Design', icon: '🎨' },
    { name: 'Website Development', icon: '💻' },
    { name: 'Social Media Marketing', icon: '📱' }
  ];

  const filteredGigs = gigs;

  return (
    <div className="gigs-dashboard">
      <Header />
      <NavCategories />
      <div className="dashboard-content-wrapper">
        <div className="dashboard-header">
          <h1 className="welcome-title">Welcome to HunarmandPro, {user.username}!</h1>
          <button 
            className="premium-btn"
            onClick={() => navigate('/premium')}
          >
            Get the <span className="premium-highlight">HunarmandPro Premium</span>
          </button>
        </div>


        <div className="recommended-section">
          <h2 className="section-title">RECOMMENDED FOR YOU</h2>
          <div className="recommended-cards">
            <div className="recommended-card">
              <div className="card-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="8" y="8" width="24" height="24" rx="2" stroke="#1DA1F2" strokeWidth="2" fill="none"/>
                  <path d="M14 16L20 22L26 16" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 24H28" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Post a project brief</h3>
              <p>Get tailored offers for your needs.</p>
            </div>
            <div className="recommended-card">
              <div className="card-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="8" y="4" width="24" height="32" rx="4" stroke="#1DA1F2" strokeWidth="2" fill="none"/>
                  <rect x="12" y="8" width="16" height="20" rx="2" stroke="#1DA1F2" strokeWidth="2" fill="none"/>
                  <path d="M16 32H24" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Download the HunarmandPro app</h3>
              <p>Stay productive, anywhere you go.</p>
            </div>
            <div className="recommended-card profile-progress">
              <div className="profile-progress-header">
                <span className="profile-progress-label">PROFILE PROGRESS</span>
              </div>
              <div className="card-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="8" y="8" width="24" height="24" rx="2" stroke="#1DA1F2" strokeWidth="2" fill="none"/>
                  <path d="M16 20L20 24L24 20" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="20" cy="28" r="2" fill="#1DA1F2"/>
                </svg>
              </div>
              <h3>Tailor HunarmandPro to your needs</h3>
              <p>Complete your profile.</p>
            </div>
          </div>
        </div>

        <div className="gigs-section">
          <div className="gigs-section-header">
            <h2 className="section-title">Explore popular categories on HunarmandPro</h2>
            <div className="gigs-header-controls">
              <button className="show-all-link">Show All</button>
              <div className="navigation-arrows">
                <button className="nav-arrow" aria-label="Previous">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button className="nav-arrow" aria-label="Next">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="gigs-content-wrapper">
            <div className="categories-sidebar">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
            <div className="gigs-scroll-container">
              {filteredGigs.length === 0 ? (
                <div className="empty-gigs-state">
                  <div className="empty-gigs-icon">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                      <circle cx="60" cy="60" r="50" fill="#E8F4F8"/>
                      <path d="M40 50h40M40 60h30M40 70h35" stroke="#1DA1F2" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h3 className="empty-gigs-title">No Gigs Available Yet</h3>
                  <p className="empty-gigs-subtitle">
                    Freelancers haven't posted any gigs yet. Check back soon!
                  </p>
                  <p className="empty-gigs-hint">
                    In the meantime, you can browse freelancers and contact them directly from the Messages section.
                  </p>
                  <button 
                    className="browse-freelancers-btn"
                    onClick={() => navigate('/messages')}
                  >
                    Browse Freelancers
                  </button>
                </div>
              ) : (
                <div className="gigs-grid">
                  {filteredGigs.map((gig) => (
                    <div key={gig.id} className="gig-card">
                      <div className="gig-image">
                        <img src={gig.image} alt={gig.title} />
                        <div className="gig-image-overlay">
                          <button className="play-button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                            </svg>
                          </button>
                          <button className="heart-button">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M10 17L8.55 15.7C4.4 12.2 2 10.1 2 7.5C2 5.4 3.4 4 5.5 4C6.8 4 8.1 4.6 9 5.5C9.9 4.6 11.2 4 12.5 4C14.6 4 16 5.4 16 7.5C16 10.1 13.6 12.2 9.45 15.7L10 17Z" fill="white" opacity="0.9"/>
                            </svg>
                          </button>
                        </div>
                        {gig.offersVideoConsultation && (
                          <span className="consultation-badge">Offers video consultations</span>
                        )}
                      </div>
                      <div className="gig-info">
                        <div className="gig-seller">
                          <span className="seller-name">{gig.seller}</span>
                          {gig.badge === 'Top Rated' && (
                            <span className="seller-badge top-rated">
                              <span className="badge-icon">◆</span>
                              <span className="badge-icon">◆</span>
                              <span className="badge-icon">◆</span>
                              Top Rated
                            </span>
                          )}
                          {gig.badge === 'Vetted Pro' && (
                            <span className="seller-badge vetted">Vetted Pro</span>
                          )}
                          {gig.badge === 'Level 2' && (
                            <span className="seller-badge level">
                              <span className="badge-icon">◆</span>
                              Level 2
                            </span>
                          )}
                          {gig.badge === 'Level 1' && (
                            <span className="seller-badge level">Level 1</span>
                          )}
                        </div>
                        <p className="gig-title">{gig.title}</p>
                        <div className="gig-rating">
                          <span className="stars">★</span>
                          <span className="rating-value">{gig.rating}</span>
                          <span className="reviews">({gig.reviews > 999 ? `${Math.floor(gig.reviews / 1000)}k+` : gig.reviews} reviews)</span>
                        </div>
                        <div className="gig-footer">
                          <span className="gig-price">From PKR {gig.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigsDashboard;