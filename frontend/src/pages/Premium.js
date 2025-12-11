import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import NavCategories from '../components/NavCategories/NavCategories';
import './Premium.css';
import { ChevronLeft, Check } from 'lucide-react';

const HunarmandProPremium = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('landing');

  const [formData, setFormData] = useState({
    email: 'hunarmandpro@gmail.com',
    paymentMethod: 'easypaisa',
    saveInfo: false
  });

  const features = [
    'Vetted freelancer talent',
    'Money-back guarantee',
    'Personalized freelancer shortlisting services',
    'Earn points on orders with our rewards program'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubscribe = () => {
    alert('Subscription processed successfully!');
  };

  const handleBackToGigs = () => {
    navigate('/gigs');
  };

  // -------------------------------
  // LANDING PAGE
  // -------------------------------
  const LandingPage = () => (
    <div className="premium-wrapper">
      <Header />
      <NavCategories />

      <div className="premium-container">
        <button 
          onClick={handleBackToGigs}
          className="premium-back-btn"
        >
          <ChevronLeft size={20} />
          <span>Get the <span className="premium-highlight">HunarmandPro Premium</span></span>
        </button>

        <div className="premium-card">
          <h1 className="premium-title">
            <span className="premium-highlight">HunarmandPro Premium</span> Essential
          </h1>
          <p className="premium-subtitle">Team account with unlimited members</p>

          <div className="premium-info-box">
            <p className="premium-info-title">You're eligible for access</p>
            <p className="premium-info-desc">Maintain access with $1000+ in annual orders</p>
          </div>

          <div className="premium-features-section">
            <p className="premium-features-heading">Everything on HunarmandPro, plus:</p>

            <div className="premium-feature-list">
              {features.map((feature, idx) => (
                <div key={idx} className="premium-feature-item">
                  <div className="premium-check-circle">
                    <Check size={14} />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="premium-buttons">
            <button className="premium-outline-btn">View all features</button>

            <button 
              className="premium-black-btn"
              onClick={() => setCurrentPage('checkout')}
            >
              Upgrade to HunarmandPro Premium →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------
  // CHECKOUT PAGE
  // -------------------------------
  const CheckoutPage = () => (
    <div className="premium-wrapper">
      <Header />
      <NavCategories />

      <div className="premium-container">
        <button 
          onClick={() => setCurrentPage('landing')}
          className="premium-back-btn"
        >
          <ChevronLeft size={20} />
          <span>Get the <span className="premium-highlight">HunarmandPro Premium</span></span>
        </button>

        <div className="checkout-grid">
          {/* LEFT SIDE */}
          <div className="checkout-box">
            <h2 className="checkout-title">Subscribe to Premium</h2>

            <div className="checkout-price">
              <div className="price-value">$220.00</div>
              <div className="price-year">per year</div>
              <div className="price-details">Billed annually at $220.00 per year</div>
            </div>

            <div className="checkout-section">
              <div className="checkout-item">
                <div>
                  <p className="checkout-item-title">Creator</p>
                  <p className="checkout-item-sub">Qty 1, Billed annually</p>
                </div>
                <div className="checkout-item-right">
                  <p className="checkout-item-title">$220.00</p>
                  <p className="checkout-item-sub">$220.00 per subscription</p>
                </div>
              </div>

              <div className="checkout-credit-box">
                <p className="checkout-credit-title">Flexible Credit Usage</p>
                <p className="checkout-credit-sub">Billed annually based on usage</p>
                <p className="checkout-credit-sub">Flat free</p>

                <div className="checkout-credit-right">
                  <p className="checkout-item-title">Price varies</p>
                  <p className="checkout-credit-sub">$0.0003 per credits</p>
                  <p className="checkout-credit-sub">$0.00</p>
                </div>
              </div>
            </div>

            <div className="checkout-total-box">
              <div className="checkout-total-line">
                <span className="checkout-item-title">Subtotal</span>
                <span className="checkout-item-title">$220.00</span>
              </div>

              <button className="checkout-promo-btn">Add promotion code</button>

              <div className="checkout-total-line">
                <span className="checkout-total-sub">Tax</span>
                <span className="checkout-total-sub">$0.00</span>
              </div>

              <div className="checkout-grandtotal">
                <span>Total due today</span>
                <span>$220.00</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="checkout-right">
            <div className="checkout-box">
              <h3 className="checkout-title">Contact information</h3>

              <label className="checkout-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="checkout-input"
              />

              <h3 className="checkout-title" style={{ marginTop: '25px' }}>Payment method</h3>

              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="easypaisa"
                    checked={formData.paymentMethod === 'easypaisa'}
                    onChange={handleInputChange}
                  />
                  <div className="payment-logo green-logo">E</div>
                  <span>Easypaisa</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="jazzcash"
                    checked={formData.paymentMethod === 'jazzcash'}
                    onChange={handleInputChange}
                  />
                  <div className="payment-logo orange-logo">J</div>
                  <span>JazzCash</span>
                </label>
              </div>

              <label className="save-info-box">
                <input
                  type="checkbox"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                />
                <div>
                  <p className="save-info-title">Save my information for faster checkout</p>
                  <p className="save-info-sub">Pay securely at HunarmandPro and everywhere Link is accepted</p>
                </div>
              </label>

              <button 
                onClick={handleSubscribe}
                className="premium-black-btn full-width"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return currentPage === 'landing' ? <LandingPage /> : <CheckoutPage />;
};

export default HunarmandProPremium;