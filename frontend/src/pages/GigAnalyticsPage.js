import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { getCurrentUser } from '../utils/auth';
import './GigAnalyticsPage.css';

const GigAnalyticsPage = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days'); // 7days, 30days, all

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
    fetchGigAnalytics();
  }, [gigId]);

  const fetchGigAnalytics = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/gigs/${gigId}`);
      const data = await response.json();
      
      if (data.success) {
        setGig(data.gig);
      }
    } catch (error) {
      console.error('Error fetching gig analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getViewsForTimeRange = () => {
    if (!gig?.analytics?.views) return [];
    
    const now = new Date();
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 365;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return gig.analytics.views.filter(v => new Date(v.date) >= startDate);
  };

  const getTotalViews = () => {
    const views = getViewsForTimeRange();
    return views.reduce((sum, v) => sum + v.count, 0);
  };

  const getClickThroughRate = () => {
    const impressions = gig?.analytics?.impressions || 0;
    const clicks = gig?.analytics?.clicks || 0;
    
    if (impressions === 0) return 0;
    return ((clicks / impressions) * 100).toFixed(2);
  };

  const getConversionRate = () => {
    const clicks = gig?.analytics?.clicks || 0;
    const orders = gig?.analytics?.orders || 0;
    
    if (clicks === 0) return 0;
    return ((orders / clicks) * 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="analytics-page">
        <Header />
        <div className="error-container">
          <h2>Gig not found</h2>
          <button onClick={() => navigate('/my-gigs')}>Back to My Gigs</button>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <Header />
      
      <div className="analytics-container">
        {/* Header */}
        <div className="analytics-header">
          <div>
            <button className="back-btn" onClick={() => navigate('/my-gigs')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4L6 10l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Back
            </button>
            <h1>Gig Analytics</h1>
            <p className="gig-title">{gig.title}</p>
          </div>
          
          <div className="time-range-selector">
            <button 
              className={timeRange === '7days' ? 'active' : ''}
              onClick={() => setTimeRange('7days')}
            >
              7 Days
            </button>
            <button 
              className={timeRange === '30days' ? 'active' : ''}
              onClick={() => setTimeRange('30days')}
            >
              30 Days
            </button>
            <button 
              className={timeRange === 'all' ? 'active' : ''}
              onClick={() => setTimeRange('all')}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon impressions">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 7C11 7 6.7 10.1 5 14.5c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5C25.3 10.1 21 7 16 7z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="16" cy="14.5" r="3.5" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="metric-info">
              <h3>Impressions</h3>
              <p className="metric-value">{gig.analytics?.impressions || 0}</p>
              <span className="metric-label">Times your gig was shown</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon clicks">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M10 8l6 6-6 6M16 14h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <rect x="6" y="6" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div className="metric-info">
              <h3>Clicks</h3>
              <p className="metric-value">{gig.analytics?.clicks || 0}</p>
              <span className="metric-label">Gig page views</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon orders">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="6" y="8" width="20" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 14h20" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="metric-info">
              <h3>Orders</h3>
              <p className="metric-value">{gig.analytics?.orders || 0}</p>
              <span className="metric-label">Total orders received</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon saves">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 27L13.4 24.6C7.6 19.4 4 16.1 4 12c0-3.3 2.7-6 6-6 1.8 0 3.5.8 4.6 2.1C15.7 6.8 17.4 6 19.2 6c3.3 0 6 2.7 6 6 0 4.1-3.6 7.4-9.4 12.6L16 27z" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <div className="metric-info">
              <h3>Saves</h3>
              <p className="metric-value">{gig.analytics?.saves || 0}</p>
              <span className="metric-label">Times saved to favorites</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="performance-section">
          <h2>Performance Metrics</h2>
          <div className="performance-grid">
            <div className="performance-card">
              <div className="performance-label">Click-Through Rate (CTR)</div>
              <div className="performance-value">{getClickThroughRate()}%</div>
              <div className="performance-subtext">
                {gig.analytics?.clicks || 0} clicks / {gig.analytics?.impressions || 0} impressions
              </div>
            </div>

            <div className="performance-card">
              <div className="performance-label">Conversion Rate</div>
              <div className="performance-value">{getConversionRate()}%</div>
              <div className="performance-subtext">
                {gig.analytics?.orders || 0} orders / {gig.analytics?.clicks || 0} clicks
              </div>
            </div>

            <div className="performance-card">
              <div className="performance-label">Save Rate</div>
              <div className="performance-value">
                {gig.analytics?.clicks > 0 
                  ? ((gig.analytics.saves / gig.analytics.clicks) * 100).toFixed(2)
                  : 0}%
              </div>
              <div className="performance-subtext">
                {gig.analytics?.saves || 0} saves / {gig.analytics?.clicks || 0} clicks
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="sources-section">
          <h2>Traffic Sources</h2>
          <div className="sources-grid">
            <div className="source-card">
              <div className="source-name">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#1DA1F2" strokeWidth="2"/>
                  <path d="M12 7v10M7 12h10" stroke="#1DA1F2" strokeWidth="2"/>
                </svg>
                Search
              </div>
              <div className="source-value">{gig.analytics?.clicksBySource?.search || 0}</div>
              <div className="source-bar">
                <div 
                  className="source-fill search"
                  style={{
                    width: `${(gig.analytics?.clicksBySource?.search || 0) / (gig.analytics?.clicks || 1) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="source-card">
              <div className="source-name">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="3" stroke="#10b981" strokeWidth="2"/>
                  <path d="M5 20c0-3 2.7-5 7-5s7 2 7 5" stroke="#10b981" strokeWidth="2"/>
                </svg>
                Profile
              </div>
              <div className="source-value">{gig.analytics?.clicksBySource?.profile || 0}</div>
              <div className="source-bar">
                <div 
                  className="source-fill profile"
                  style={{
                    width: `${(gig.analytics?.clicksBySource?.profile || 0) / (gig.analytics?.clicks || 1) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="source-card">
              <div className="source-name">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10 13a5 5 0 0 0 7.5 4.3L21 21l-3.5-3.5A5 5 0 1 0 10 13z" stroke="#f59e0b" strokeWidth="2"/>
                </svg>
                Direct
              </div>
              <div className="source-value">{gig.analytics?.clicksBySource?.direct || 0}</div>
              <div className="source-bar">
                <div 
                  className="source-fill direct"
                  style={{
                    width: `${(gig.analytics?.clicksBySource?.direct || 0) / (gig.analytics?.clicks || 1) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="source-card">
              <div className="source-name">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#6b7280" strokeWidth="2"/>
                  <path d="M12 7v5l3 3" stroke="#6b7280" strokeWidth="2"/>
                </svg>
                Other
              </div>
              <div className="source-value">{gig.analytics?.clicksBySource?.other || 0}</div>
              <div className="source-bar">
                <div 
                  className="source-fill other"
                  style={{
                    width: `${(gig.analytics?.clicksBySource?.other || 0) / (gig.analytics?.clicks || 1) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Views Chart */}
        <div className="chart-section">
          <h2>Daily Views</h2>
          <div className="chart-container">
            {getViewsForTimeRange().length > 0 ? (
              <div className="simple-chart">
                {getViewsForTimeRange().map((view, index) => (
                  <div key={index} className="chart-bar">
                    <div 
                      className="bar-fill"
                      style={{
                        height: `${(view.count / Math.max(...getViewsForTimeRange().map(v => v.count))) * 100}%`
                      }}
                    >
                      <span className="bar-value">{view.count}</span>
                    </div>
                    <div className="bar-label">
                      {new Date(view.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>No view data available for this time range</p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-section">
          <h2>Recommendations</h2>
          <div className="recommendations-list">
            {getClickThroughRate() < 5 && (
              <div className="recommendation-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>
                  <strong>Improve your CTR</strong>
                  <p>Your click-through rate is below average. Consider updating your gig title and main image to make it more appealing.</p>
                </div>
              </div>
            )}

            {getConversionRate() < 10 && gig.analytics?.clicks > 10 && (
              <div className="recommendation-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>
                  <strong>Boost your conversion rate</strong>
                  <p>Many people are viewing your gig but not ordering. Review your pricing, packages, and description to make your offering more compelling.</p>
                </div>
              </div>
            )}

            {gig.analytics?.impressions < 50 && (
              <div className="recommendation-item">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#1DA1F2" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div>
                  <strong>Increase visibility</strong>
                  <p>Your gig has low impressions. Add more relevant keywords and tags to help buyers find your service.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigAnalyticsPage;