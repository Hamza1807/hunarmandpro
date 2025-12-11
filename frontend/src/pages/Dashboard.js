import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { getConversations } from '../utils/messages';
import { uploadProfilePicture, getUserProfile } from '../utils/messages';
import './Dashboard.css';
import { Check, X, ArrowLeft, ArrowRight, Info } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showLevelOverview, setShowLevelOverview] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    // Check if user is actually a freelancer/seller
    if (currentUser.userType === 'buyer' || currentUser.role === 'client') {
      navigate('/gigs');
      return;
    }
    setUser(currentUser);
    loadUserData(currentUser.id);
    loadConversations(currentUser.id);
  }, [navigate]);

  const metrics = {
    successScore: {
      title: 'Success Score',
      value: 6,
      scale: [0, 10],
      current: 6,
      target: 8,
      status: 'In progress',
      description: 'This metric analyzes each of your Gigs and every order tied to the order process and your relationship with clients, relative to other freelancers. Your overall success score considers your individual Gig scores, with more weight given to Gigs with more orders earning.',
      statusMessage: 'Maintain current level: 6',
      nextLevel: 'Qualify for next level expected: 8',
      qualified: false
    },
    rating: {
      title: 'Rating',
      value: 4.6,
      scale: [0, 5],
      current: 4.6,
      target: 4.8,
      status: 'Qualifies for next level',
      description: 'This metric reflects the average of ratings provided by clients you\'ve worked with.',
      statusMessage: 'Maintain current level: 4.6',
      nextLevel: 'Qualify for next level expected: 4.8',
      qualified: true,
      advice: 'Fantastic! Check your other metrics to see how close you are to moving up.'
    },
    responseRate: {
      title: 'Response rate',
      value: '100%',
      scale: [0, 100],
      current: 100,
      target: 95,
      status: 'Qualifies for next level',
      description: 'This metric reflects the percentage of responses to new messages that are sent within 24 hours, for the last 90 days.',
      statusMessage: 'Maintain current level: 90',
      nextLevel: 'Qualify for next level expected: 95',
      qualified: true,
      advice: 'Fantastic! Check your other metrics to see how close you are to moving up.'
    }
  };

  const openMetricDetail = (metricKey) => {
    setSelectedMetric(metricKey);
  };

  const closeMetricDetail = () => {
    setSelectedMetric(null);
  };

  const loadUserData = async (userId) => {
    try {
      const userData = await getUserProfile(userId);
      // Update local storage with fresh data
      const currentUser = getCurrentUser();
      const updatedUser = {
        ...currentUser,
        profile: userData.profile,
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadConversations = async (userId) => {
    try {
      const data = await getConversations(userId);
      setConversations((data.conversations || []).slice(0, 5)); // Show only first 5
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadProfilePicture(user.id, file);
      
      // Update user state and localStorage
      const updatedUser = {
        ...user,
        profile: {
          ...user.profile,
          profilePicture: result.profilePicture,
        },
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      alert(error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffWeeks = Math.floor(diffMs / 604800000);
    
    if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''}`;
    
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    
    const diffHours = Math.floor(diffMs / 3600000);
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  // Metric Detail Sidebar Component
  const MetricDetailSidebar = ({ metricKey }) => {
    if (!metricKey) return null;
    
    const metric = metrics[metricKey];
    const metricKeys = Object.keys(metrics).filter(k => metrics[k].scale);
    const currentIndex = metricKeys.indexOf(metricKey);
    
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
          onClick={closeMetricDetail}
        ></div>
        <div style={{
          position: 'relative',
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '28rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {metric.title}
              </h2>
              <button 
                onClick={closeMetricDetail}
                style={{
                  color: '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                color: '#4B5563',
                fontSize: '0.875rem',
                marginBottom: '1.5rem'
              }}>
                {metric.description}
              </p>

              <div style={{
                backgroundColor: '#F9FAFB',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {metric.title}
                  </span>
                  <span style={{
                    fontSize: '1.875rem',
                    fontWeight: 'bold',
                    color: '#111827'
                  }}>
                    {metric.value}
                  </span>
                </div>
                
                <div style={{ position: 'relative', marginTop: '1rem' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginBottom: '0.5rem'
                  }}>
                    <span>{metric.scale[0]}</span>
                    <span>{metric.scale[1]}</span>
                  </div>
                  <div style={{
                    height: '0.5rem',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '9999px',
                    position: 'relative'
                  }}>
                    <div 
                      style={{
                        height: '0.5rem',
                        backgroundColor: '#2563EB',
                        borderRadius: '9999px',
                        width: `${(metric.current / metric.scale[1]) * 100}%`,
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        right: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '1rem',
                        height: '1rem',
                        backgroundColor: '#2563EB',
                        borderRadius: '9999px',
                        border: '2px solid white'
                      }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                    {metric.statusMessage}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {metric.nextLevel}
                  </p>
                </div>

                {metric.qualified ? (
                  <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    backgroundColor: '#F0FDF4',
                    padding: '0.75rem',
                    borderRadius: '0.25rem'
                  }}>
                    <Check style={{ color: '#16A34A', flexShrink: 0, marginTop: '0.125rem' }} size={16} />
                    <span style={{ fontSize: '0.875rem', color: '#15803D' }}>
                      Qualifies for next level
                    </span>
                  </div>
                ) : (
                  <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    backgroundColor: '#FFF7ED',
                    padding: '0.75rem',
                    borderRadius: '0.25rem'
                  }}>
                    <div style={{
                      width: '1rem',
                      height: '1rem',
                      backgroundColor: '#FB923C',
                      borderRadius: '9999px',
                      flexShrink: 0,
                      marginTop: '0.125rem'
                    }}></div>
                    <span style={{ fontSize: '0.875rem', color: '#C2410C' }}>
                      In progress
                    </span>
                  </div>
                )}

                {metric.advice && (
                  <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#4B5563' }}>
                    {metric.advice}
                  </p>
                )}
              </div>

              <p style={{ fontSize: '0.875rem', color: '#4B5563', fontStyle: 'italic' }}>
                {metric.qualified 
                  ? "You're on your way to qualifying for the next level. Keep up the good work!"
                  : "Keep working on this metric to qualify for the next level."}
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '1rem',
              borderTop: '1px solid #E5E7EB'
            }}>
              <button
                onClick={() => {
                  if (currentIndex > 0) {
                    setSelectedMetric(metricKeys[currentIndex - 1]);
                  }
                }}
                disabled={currentIndex === 0}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: currentIndex === 0 ? '#9CA3AF' : '#374151',
                  background: 'none',
                  border: 'none',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  padding: '0.5rem'
                }}
              >
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>
              
              <button
                onClick={() => {
                  if (currentIndex < metricKeys.length - 1) {
                    setSelectedMetric(metricKeys[currentIndex + 1]);
                  }
                }}
                disabled={currentIndex === metricKeys.length - 1}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: currentIndex === metricKeys.length - 1 ? '#9CA3AF' : '#374151',
                  background: 'none',
                  border: 'none',
                  cursor: currentIndex === metricKeys.length - 1 ? 'not-allowed' : 'pointer',
                  padding: '0.5rem'
                }}
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Level Overview Page Component
  const LevelOverviewPage = () => (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
            Level Overview
          </h1>
          <button 
            onClick={() => setShowLevelOverview(false)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563EB',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Back to Dashboard
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {/* Left Sidebar - Profile */}
          <div style={{ gridColumn: '1' }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              padding: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '8rem',
                  height: '8rem',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  marginBottom: '1rem',
                  backgroundColor: '#E5E7EB'
                }}>
                  <svg width="128" height="128" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="64" fill="#3B82F6"/>
                    <circle cx="64" cy="52" r="20" fill="white"/>
                    <path d="M32 96 C32 80, 45 70, 64 70 C83 70, 96 80, 96 96" fill="white"/>
                  </svg>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    backgroundColor: '#D1D5DB',
                    borderRadius: '9999px'
                  }}></div>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: '#2563EB',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}>1</span>
                  </div>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    backgroundColor: '#D1D5DB',
                    borderRadius: '9999px'
                  }}></div>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    backgroundColor: '#D1D5DB',
                    borderRadius: '9999px'
                  }}></div>
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>Level 1</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                  Progress tracker
                </h3>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    backgroundColor: '#10B981',
                    borderRadius: '9999px'
                  }}></div>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    backgroundColor: '#10B981',
                    borderRadius: '9999px'
                  }}></div>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    backgroundColor: '#10B981',
                    borderRadius: '9999px'
                  }}></div>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '500' }}>
                  The next level is in sight!
                </p>
              </div>
            </div>
          </div>

          {/* Main Content - Metrics */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              padding: '1.5rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                My performance metrics
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#4B5563', marginBottom: '1.5rem' }}>
                Keep an eye on these stats to monitor your progress in the level system.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {/* Success Score */}
                <div 
                  onClick={() => openMetricDetail('successScore')}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                      Success score
                    </span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                    6
                  </div>
                  <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: '#9CA3AF',
                      marginBottom: '0.25rem'
                    }}>
                      <span>0</span>
                      <span>10</span>
                    </div>
                    <div style={{
                      height: '0.375rem',
                      backgroundColor: '#E5E7EB',
                      borderRadius: '9999px'
                    }}>
                      <div style={{
                        height: '0.375rem',
                        backgroundColor: '#2563EB',
                        borderRadius: '9999px',
                        width: '60%'
                      }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: '#FB923C',
                      borderRadius: '9999px'
                    }}></div>
                    <span style={{ color: '#4B5563' }}>In progress</span>
                  </div>
                </div>

                {/* Rating */}
                <div 
                  onClick={() => openMetricDetail('rating')}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                      Rating
                    </span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                    4.6
                  </div>
                  <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: '#9CA3AF',
                      marginBottom: '0.25rem'
                    }}>
                      <span>0</span>
                      <span>5</span>
                    </div>
                    <div style={{
                      height: '0.375rem',
                      backgroundColor: '#E5E7EB',
                      borderRadius: '9999px'
                    }}>
                      <div style={{
                        height: '0.375rem',
                        backgroundColor: '#2563EB',
                        borderRadius: '9999px',
                        width: '92%'
                      }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <Check style={{ color: '#16A34A' }} size={12} />
                    <span style={{ color: '#16A34A' }}>Qualifies for next level</span>
                  </div>
                </div>

                {/* Response Rate */}
                <div 
                  onClick={() => openMetricDetail('responseRate')}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                      Response rate
                    </span>
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                    100%
                  </div>
                  <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: '#9CA3AF',
                      marginBottom: '0.25rem'
                    }}>
                      <span>0</span>
                      <span>100</span>
                    </div>
                    <div style={{
                      height: '0.375rem',
                      backgroundColor: '#E5E7EB',
                      borderRadius: '9999px'
                    }}>
                      <div style={{
                        height: '0.375rem',
                        backgroundColor: '#2563EB',
                        borderRadius: '9999px',
                        width: '100%'
                      }}></div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <Check style={{ color: '#16A34A' }} size={12} />
                    <span style={{ color: '#16A34A' }}>Qualifies for next level</span>
                  </div>
                </div>

                {/* Orders */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                      Orders
                    </span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>
                      47/20
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    marginTop: '1rem'
                  }}>
                    <Check style={{ color: '#16A34A' }} size={12} />
                    <span style={{ color: '#16A34A' }}>Qualifies for next level</span>
                  </div>
                </div>

                {/* Unique Clients */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                      Unique clients
                    </span>
                    <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>
                      34/10
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    marginTop: '1rem'
                  }}>
                    <Check style={{ color: '#16A34A' }} size={12} />
                    <span style={{ color: '#16A34A' }}>Qualifies for next level</span>
                  </div>
                </div>

                {/* Earnings */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                      Earnings
                    </span>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.75rem',
                    marginTop: '1rem'
                  }}>
                    <div style={{
                      width: '0.5rem',
                      height: '0.5rem',
                      backgroundColor: '#FB923C',
                      borderRadius: '9999px'
                    }}></div>
                    <span style={{ color: '#4B5563' }}>In progress</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MetricDetailSidebar metricKey={selectedMetric} />
    </div>
  );

  // Main Dashboard View
  if (showLevelOverview) {
    return <LevelOverviewPage />;
  }

  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          {/* Profile Section */}
          <div className="sidebar-section profile-section">
            <div className="profile-picture" onClick={handleProfilePictureClick}>
              <div className="profile-avatar">
                {user.profile?.profilePicture ? (
                  <img 
                    src={`http://localhost:5000${user.profile.profilePicture}`} 
                    alt={user.username}
                    className="profile-avatar-img"
                  />
                ) : (
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="40" r="40" fill="#1DA1F2"/>
                    <circle cx="40" cy="32" r="12" fill="white"/>
                    <path d="M20 60 C20 50, 28 44, 40 44 C52 44, 60 50, 60 60" fill="white"/>
                  </svg>
                )}
                <div className="profile-avatar-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="white"/>
                    <path d="M20 5h-3.2L15 3H9L7.2 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 14H4V7h4.05l1.83-2h4.24l1.83 2H20v12z" fill="white"/>
                  </svg>
                  <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                style={{ display: 'none' }}
              />
            </div>
            <h3 className="profile-name">{user.username}</h3>
            <button className="sidebar-button">View Profile</button>
          </div>

          {/* Level Overview Section */}
          <div className="sidebar-section">
            <h4 className="section-title">Level overview</h4>
            <div className="level-details">
              <div className="detail-item">
                <span className="detail-label">My level</span>
                <span className="detail-value">Level 1</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Success score</span>
                <span className="detail-value">6</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rating</span>
                <span className="detail-value">4.6</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Response rate</span>
                <span className="detail-value">100%</span>
              </div>
            </div>
            <button 
              className="sidebar-button"
              onClick={() => setShowLevelOverview(true)}
            >
              View Progress
            </button>
          </div>

          {/* Availability Section */}
          <div className="sidebar-section">
            <h4 className="section-title">Availability</h4>
            <p className="availability-text">
              While unavailable, your Gigs are hidden and you will not receive new orders.
            </p>
            <button className="sidebar-button">Set Availability</button>
          </div>

          {/* Earnings Section */}
          <div 
            className="sidebar-section earnings-section" 
            onClick={() => navigate('/earnings')}
            style={{ cursor: 'pointer' }}
          >
            <h4 className="section-title">Earned in December</h4>
            <div className="earnings-amount">$0</div>
          </div>

          {/* Inbox Section */}
          <div className="sidebar-section">
            <div className="inbox-header">
              <h4 className="section-title">Inbox</h4>
              <button 
                className="view-all-link"
                onClick={() => navigate('/messages')}
              >
                View All
              </button>
            </div>
            <div className="inbox-list">
              {conversations.length === 0 ? (
                <div className="inbox-empty">No messages yet</div>
              ) : (
                conversations.map((conv) => (
                  <div 
                    key={conv.conversationId}
                    className="inbox-item"
                    onClick={() => navigate(`/messages?conversation=${conv.conversationId}`)}
                  >
                    <div className="inbox-item-header">
                      <span className="inbox-username">{conv.otherUser.username}</span>
                      <span className="inbox-time">{formatTime(conv.lastMessage.timestamp)}</span>
                    </div>
                    <div className="inbox-preview">
                      {conv.lastMessage.message.substring(0, 30)}
                      {conv.lastMessage.message.length > 30 ? '...' : ''}
                      {conv.unreadCount > 0 && (
                        <span className="inbox-unread">{conv.unreadCount}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-main">
          <div className="dashboard-content">
            <h1 className="welcome-title">Welcome, {user.username}</h1>
            <p className="welcome-subtitle">
              Find important messages, tips, and links to helpful resources here:
            </p>

            {/* Action Cards */}
            <div className="action-cards">
              {/* Grow your business card */}
              <div className="action-card">
                <h3 className="card-title">Grow your business with Seller Plus</h3>
                <p className="card-text">
                  Check out all the tools and benefits that can help you scale your success
                </p>
              </div>

              {/* Set up inbox auto replies card */}
              <div className="action-card">
                <h3 className="card-title">Set up inbox auto replies</h3>
                <p className="card-text">
                  Greet new potential buyers with an auto reply to their first message.
                </p>
                <a href="#" className="card-link">Set up inbox auto replies</a>
              </div>

              {/* Reach more potential clients card */}
              <div className="action-card">
                <h3 className="card-title">Reach more potential clients</h3>
                <p className="card-text">
                  One or more of your offerings can be promoted through Fiverr Ads.
                </p>
              </div>
              
   <button onClick={() => navigate('/my-gigs')}>
     My Gigs
   </button>
   <button onClick={() => navigate('/create-gig')}>
     Create New Gig
   </button>
              {/* Active orders card */}
              <div 
                className="action-card active-orders-card" 
                onClick={() => navigate('/orders')}
                style={{ cursor: 'pointer' }}
              >
                <div className="active-orders-content">
                  <h3 className="card-title">Active orders</h3>
                  <p className="card-text">Active orders - 0 ($0)</p>
                </div>
                <div className="active-orders-box">
                  <p className="card-text">Active orders - 0 ($0)</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
