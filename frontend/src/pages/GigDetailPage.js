import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { getCurrentUser } from '../utils/auth';
import { saveFavoriteGig, removeFavoriteGig, isFavorite } from '../utils/favorites';
import './GigDetailPage.css';

const GigDetailPage = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderRequirements, setOrderRequirements] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    fetchGigDetails();
  }, [gigId]);

  const fetchGigDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/gigs/${gigId}`);
      const data = await response.json();
      
      if (data.success) {
        // const updatedGig = {
        //     ...data.gig,
        //     images: data.gig.images.map(img => `/images/${img}`)
        // };
        // setGig(updatedGig);
        setGig(data.gig);
        setFavorite(isFavorite(data.gig._id));
      }
    } catch (error) {
      console.error('Error fetching gig details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFavoriteGig(gig._id);
      setFavorite(false);
    } else {
      saveFavoriteGig(gig);
      setFavorite(true);
    }
  };

  const handleOrder = async () => {
    if (!orderRequirements.trim()) {
      alert('Please provide order requirements');
      return;
    }

    const packagePrices = {
      basic: gig.price,
      standard: gig.price * 1.5,
      premium: gig.price * 2
    };

    const packageDelivery = {
      basic: gig.deliveryTime,
      standard: Math.ceil(gig.deliveryTime * 1.2),
      premium: Math.ceil(gig.deliveryTime * 1.5)
    };

    const orderData = {
      gigId: gig._id,
      gigTitle: gig.title,
      seller: {
        id: gig.sellerId._id,
        username: gig.sellerId.username
      },
      buyer: {
        id: user.id,
        username: user.username
      },
      package: selectedPackage,
      price: packagePrices[selectedPackage],
      deliveryTime: packageDelivery[selectedPackage],
      description: gig.description,
      requirements: orderRequirements
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Order placed successfully!');
        navigate('/orders');
      } else {
        alert(data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  const handleContactSeller = () => {
    navigate(`/messages?userId=${gig.sellerId._id}`);
  };

  if (loading) {
    return (
      <div className="gig-detail-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading gig details...</p>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="gig-detail-page">
        <Header />
        <div className="error-container">
          <h2>Gig not found</h2>
          <button onClick={() => navigate('/gigs')}>Back to Browse</button>
        </div>
      </div>
    );
  }console.log('Gig images:', gig.images);
// const packages = gig.packages && Array.isArray(gig.packages);
// const packagesArray = packages ? Object.values(packages) : [];
// packages object from DB
// const packages = gig.packages || {};

// // convert to array for mapping
// const packagesArray = Object.values(packages);
 const packages = gig.packages || {};
  const availablePackages = ['basic', 'standard', 'premium'].filter(
    key => packages[key] && packages[key].price
  );



//   const packages = {
//     basic: {
//       name: 'Basic',
//       price: gig.price,
//       delivery: gig.deliveryTime,
//       description: 'Essential features to get started',
//       features: gig.features?.slice(0, 3) || []
//     },
//     standard: {
//       name: 'Standard',
//       price: Math.round(gig.price * 1.5),
//       delivery: Math.ceil(gig.deliveryTime - 1),
//       description: 'Most popular package with more features',
//       features: gig.features?.slice(0, 5) || []
//     },
//     premium: {
//       name: 'Premium',
//       price: Math.round(gig.price * 2),
//       delivery: Math.ceil(gig.deliveryTime - 2),
//       description: 'Complete package with all features',
//       features: gig.features || []
//     }
//   };

  return (
    <div className="gig-detail-page">
      <Header />
      
      <div className="gig-detail-container">
        <div className="gig-detail-content">
          {/* Left Column - Gig Details */}
          <div className="gig-main-content">
            {/* Breadcrumb */}
            <div className="breadcrumb">
              <span onClick={() => navigate('/gigs')}>Home</span>
              <span className="separator">/</span>
              <span onClick={() => navigate(`/search?category=${gig.category}`)}>
                {gig.category}
              </span>
              <span className="separator">/</span>
              <span className="current">{gig.title}</span>
            </div>

            {/* Title and Favorite */}
            <div className="gig-header">
              <h1 className="gig-detail-title">{gig.title}</h1>
              <button
                className={`favorite-btn ${favorite ? 'active' : ''}`}
                onClick={handleFavoriteToggle}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21L10.55 19.7C6.4 16.2 4 14.1 4 11.5C4 9.4 5.4 8 7.5 8C8.8 8 10.1 8.6 11 9.5C11.9 8.6 13.2 8 14.5 8C16.6 8 18 9.4 18 11.5C18 14.1 15.6 16.2 11.45 19.7L12 21Z"
                    fill={favorite ? '#ff4757' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
                {favorite ? 'Saved' : 'Save'}
              </button>
            </div>

            {/* Seller Info */}
            <div className="seller-info-card">
              <div className="seller-avatar-large">
                {gig.sellerId?.profile?.profilePicture ? (
                  <img
                    src={`http://localhost:5000${gig.sellerId.profile.profilePicture}`}
                    alt={gig.sellerId.username}
                  />
                ) : (
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="30" fill="#1DA1F2"/>
                    <circle cx="30" cy="24" r="10" fill="white"/>
                    <path d="M14 44C14 36 18 32 30 32C42 32 46 36 46 44" fill="white"/>
                  </svg>
                )}
              </div>
              <div className="seller-info-details">
                <h3>{gig.sellerId?.username}</h3>
                <div className="seller-stats">
                  <span className="stat">
                    ★ {gig.sellerId?.sellerProfile?.rating?.toFixed(1) || '0.0'}
                  </span>
                  <span className="stat">
                    Level {gig.sellerId?.sellerProfile?.level || 1}
                  </span>
                  <span className="stat">
                    {gig.sellerId?.sellerProfile?.responseRate || 0}% Response Rate
                  </span>
                </div>
                {gig.sellerId?.profile?.bio && (
                  <p className="seller-bio">{gig.sellerId.profile.bio}</p>
                )}
              </div>
              <button className="contact-seller-btn" onClick={handleContactSeller}>
                Contact Seller
              </button>
            </div>

            {/* Image Gallery */}
            {/* Image Gallery */}
<div className="gig-gallery">
  <div className="main-image">
    {gig.images && gig.images.length > 0 ? (
      <img
        src={`http://localhost:5000${gig.images[selectedImageIndex]}`}
        alt={gig.title}
      />
    ) : (
      <div className="placeholder-image">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <rect width="200" height="200" fill="#E8F4F8" />
          <path d="M80 90L100 110L120 90" stroke="#1DA1F2" strokeWidth="4" />
        </svg>
      </div>
    )}
  </div>

  {/* Thumbnails */}
  {gig.images && gig.images.length > 1 && (
    <div className="image-thumbnails">
      {gig.images.map((image, index) => (
        <div
          key={index}
          className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
          onClick={() => setSelectedImageIndex(index)}
        >
          <img
            src={`http://localhost:5000${image}`}
            alt={`Thumbnail ${index + 1}`}
          />
        </div>
      ))}
    </div>
  )}
</div>


            {/* Description */}
            <div className="gig-section">
              <h2>About This Gig</h2>
              <p className="gig-description">{gig.description}</p>
            </div>

            {gig.addOns && gig.addOns.length > 0 && (
              <div className="gig-section">
                <h2>Available Add-ons</h2>
                <div className="addons-list">
                  {gig.addOns.map((addon, index) => (
                    <div key={index} className="addon-item">
                      <div className="addon-header">
                        <h4>{addon.name}</h4>
                        <span className="addon-price">+PKR {addon.price.toLocaleString()}</span>
                      </div>
                      <p className="addon-description">{addon.description}</p>
                      {addon.deliveryTime !== 0 && (
                        <span className="addon-delivery">
                          {addon.deliveryTime > 0 ? `+${addon.deliveryTime}` : addon.deliveryTime} day(s)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs Section */}
            {gig.faqs && gig.faqs.length > 0 && (
              <div className="gig-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faqs-list">
                  {gig.faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                      <h4 className="faq-question">{faq.question}</h4>
                      <p className="faq-answer">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Tags */}
            {gig.tags && gig.tags.length > 0 && (
              <div className="gig-section">
                <h3>Tags</h3>
                <div className="gig-tags">
                  {gig.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

         {/* Right Column - Packages */}
          <div className="gig-sidebar">
            <div className="packages-card sticky-card">
              <div className="package-tabs">
                {availablePackages.map((key) => (
                  <button
                    key={key}
                    className={`package-tab ${selectedPackage === key ? "active" : ""}`}
                    onClick={() => setSelectedPackage(key)}
                  >
                    {packages[key].name}
                  </button>
                ))}
              </div>

              <div className="package-content">
                {packages[selectedPackage] && (
                  <>
                    <div className="package-header">
                      <h3>{packages[selectedPackage].name}</h3>
                      <div className="package-price">
                        PKR {packages[selectedPackage].price.toLocaleString()}
                      </div>
                    </div>

                    <p className="package-description">
                      {packages[selectedPackage].description}
                    </p>

                    <div className="package-delivery">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 18A8 8 0 1 0 10 2a8 8 0 0 0 0 16z"
                          stroke="#1DA1F2"
                          strokeWidth="2"
                          fill="none" />
                        <path d="M10 6v4l3 2"
                          stroke="#1DA1F2"
                          strokeWidth="2"
                          strokeLinecap="round" />
                      </svg>
                      <span>{packages[selectedPackage].deliveryTime} days delivery</span>
                    </div>

                    {packages[selectedPackage].revisions !== undefined && (
                      <div className="package-revisions">
                        {/* <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M4 10a6 6 0 1 1 12 0" stroke="#1DA1F2" strokeWidth="2" fill="none"/>
                          <path d="M4 10l2-2M4 10l2 2" stroke="#1DA1F2" strokeWidth="2"/>
                        </svg> */}
                        <span>{packages[selectedPackage].revisions} Revision(s)</span>
                      </div>
                    )}

                    {packages[selectedPackage].features?.length > 0 && (
                      <div className="package-features">
                        <h4>What's Included:</h4>
                        <ul>
                          {packages[selectedPackage].features.map((feature, i) => (
                            feature && (
                              <li key={i}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M3 8l3 3 7-7"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round" />
                                </svg>
                                {feature}
                              </li>
                            )
                          ))}
                        </ul>
                      </div>
                    )}

                        <button
                            className="order-now-btn"
                            onClick={() => setShowOrderModal(true)}
                        >
                            Continue (PKR {packages[selectedPackage].price.toLocaleString()})
                        </button>

                        <button className="compare-packages-btn">
                            Compare Packages
                        </button>
                        </>
                    )}
                    </div>
                    </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Requirements</h2>
              <button className="close-modal" onClick={() => setShowOrderModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Please provide details about your requirements:</p>
              <textarea
                className="requirements-textarea"
                placeholder="Describe what you need for this order..."
                value={orderRequirements}
                onChange={(e) => setOrderRequirements(e.target.value)}
                rows="6"
              />
              <div className="order-summary">
                <div className="summary-row">
                  <span>Package:</span>
                  <span>{packages[selectedPackage]?.name}</span>

                </div>
                <div className="summary-row">
                  <span>Delivery Time:</span>
                  <span>{packages[selectedPackage]?.delivery} days</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                 <span>PKR {packages[selectedPackage]?.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowOrderModal(false)}>
                Cancel
              </button>
              <button className="confirm-order-btn" onClick={handleOrder}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigDetailPage;