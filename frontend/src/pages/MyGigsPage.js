import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { getCurrentUser } from '../utils/auth';
import './MyGigsPage.css';

const MyGigsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, draft, paused

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    if (currentUser.userType !== 'seller') {
      navigate('/gigs');
      return;
    }
    setUser(currentUser);
    fetchMyGigs(currentUser.id);
  }, [navigate]);

  const fetchMyGigs = async (sellerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/gigs/seller/${sellerId}`);
      const data = await response.json();
      
      if (data.gigs) {
        setGigs(data.gigs);
      }
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (gigId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const response = await fetch(`http://localhost:5000/api/gigs/${gigId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, isActive: newStatus === 'active' }),
      });

      const data = await response.json();

      if (data.success) {
        fetchMyGigs(user.id);
      }
    } catch (error) {
      console.error('Error updating gig status:', error);
    }
  };

  const handleDeleteGig = async (gigId) => {
    if (window.confirm('Are you sure you want to delete this gig?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/gigs/${gigId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          fetchMyGigs(user.id);
        }
      } catch (error) {
        console.error('Error deleting gig:', error);
      }
    }
  };

  const filteredGigs = gigs.filter(gig => {
    if (filter === 'all') return true;
    if (filter === 'active') return gig.status === 'active';
    if (filter === 'draft') return gig.status === 'draft';
    if (filter === 'paused') return gig.status === 'paused';
    return true;
  });

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: 'Active', class: 'status-active' },
      draft: { text: 'Draft', class: 'status-draft' },
      paused: { text: 'Paused', class: 'status-paused' },
      denied: { text: 'Denied', class: 'status-denied' }
    };
    return badges[status] || badges.draft;
  };

  if (loading) {
    return (
      <div className="my-gigs-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your gigs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-gigs-page">
      <Header />
      
      <div className="my-gigs-container">
        <div className="page-header">
          <div>
            <h1>My Gigs</h1>
            <p className="subtitle">Manage all your services</p>
          </div>
          <button className="create-gig-btn" onClick={() => navigate('/create-gig')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Create New Gig
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({gigs.length})
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active ({gigs.filter(g => g.status === 'active').length})
          </button>
          <button 
            className={filter === 'draft' ? 'active' : ''}
            onClick={() => setFilter('draft')}
          >
            Drafts ({gigs.filter(g => g.status === 'draft').length})
          </button>
          <button 
            className={filter === 'paused' ? 'active' : ''}
            onClick={() => setFilter('paused')}
          >
            Paused ({gigs.filter(g => g.status === 'paused').length})
          </button>
        </div>

        {/* Gigs List */}
        {filteredGigs.length === 0 ? (
          <div className="empty-state">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" fill="#E8F4F8"/>
              <rect x="40" y="40" width="40" height="40" rx="4" stroke="#1DA1F2" strokeWidth="3"/>
              <path d="M60 50v20M50 60h20" stroke="#1DA1F2" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <h2>No gigs found</h2>
            <p>Start creating gigs to offer your services</p>
            <button className="create-gig-btn" onClick={() => navigate('/create-gig')}>
              Create Your First Gig
            </button>
          </div>
        ) : (
          <div className="gigs-grid">
            {filteredGigs.map((gig) => (
              <div key={gig._id} className="gig-item">
                <div className="gig-item-image">
                  {gig.images && gig.images.length > 0 ? (
                    <img src={`http://localhost:5000${gig.images[0]}`} alt={gig.title} />
                  ) : (
                    <div className="placeholder-image">
                      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                        <rect width="80" height="80" fill="#E8F4F8"/>
                        <path d="M30 35L40 45L50 35" stroke="#1DA1F2" strokeWidth="3"/>
                      </svg>
                    </div>
                  )}
                  <span className={`status-badge ${getStatusBadge(gig.status).class}`}>
                    {getStatusBadge(gig.status).text}
                  </span>
                </div>

                <div className="gig-item-content">
                  <h3>{gig.title}</h3>
                  <div className="gig-meta">
                    <span className="price">From PKR {gig.price?.toLocaleString()}</span>
                    <span className="delivery">{gig.deliveryTime} days</span>
                  </div>

                  {/* Analytics Summary */}
                  <div className="analytics-summary">
                    <div className="stat">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 2C4.7 2 2 4.7 2 8s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zm0 10.5c-2.5 0-4.5-2-4.5-4.5S5.5 3.5 8 3.5s4.5 2 4.5 4.5-2 4.5-4.5 4.5z" fill="#666"/>
                        <circle cx="8" cy="8" r="2" fill="#666"/>
                      </svg>
                      <span>{gig.analytics?.impressions || 0} views</span>
                    </div>
                    <div className="stat">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l3 3 7-7" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span>{gig.analytics?.orders || 0} orders</span>
                    </div>
                    <div className="stat">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14L6.5 12.7C3.4 10 2 8.5 2 6.5C2 4.8 3 4 4.5 4C5.5 4 6.5 4.5 7 5.2C7.5 4.5 8.5 4 9.5 4C11 4 12 4.8 12 6.5C12 8.5 10.6 10 7.5 12.7L8 14Z" fill="#ff4757"/>
                      </svg>
                      <span>{gig.analytics?.saves || 0} saves</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="gig-actions">
                    <button 
                      className="action-btn"
                      onClick={() => navigate(`/gig/${gig._id}`)}
                      title="View"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 3C5 3 1.7 5.6 1 9c.7 3.4 4 6 8 6s7.3-2.6 8-6c-.7-3.4-4-6-8-6z" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => navigate(`/edit-gig/${gig._id}`)}
                      title="Edit"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M13 2l3 3-9 9H4v-3l9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => navigate(`/gig-analytics/${gig._id}`)}
                      title="Analytics"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="2" y="10" width="3" height="6" stroke="currentColor" strokeWidth="1.5"/>
                        <rect x="7" y="6" width="3" height="10" stroke="currentColor" strokeWidth="1.5"/>
                        <rect x="12" y="2" width="3" height="14" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </button>
                    <button 
                      className={`action-btn ${gig.status === 'paused' ? 'pause-active' : ''}`}
                      onClick={() => handleStatusToggle(gig._id, gig.status)}
                      title={gig.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {gig.status === 'active' ? (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <rect x="5" y="3" width="3" height="12" fill="currentColor"/>
                          <rect x="10" y="3" width="3" height="12" fill="currentColor"/>
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M6 3l9 6-9 6V3z" fill="currentColor"/>
                        </svg>
                      )}
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteGig(gig._id)}
                      title="Delete"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M3 5h12M7 5V3h4v2M6 5v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigsPage;