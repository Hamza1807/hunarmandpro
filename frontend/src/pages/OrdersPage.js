import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { getCurrentUser } from '../utils/auth';
import './OrdersPage.css';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [deliveryFiles, setDeliveryFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    setUser(currentUser);
    fetchOrders(currentUser.id);
  }, [navigate]);

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/seller/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => {
      if (activeTab === 'active') return order.status === 'active';
      if (activeTab === 'in_revision') return order.status === 'in_revision';
      if (activeTab === 'completed') return order.status === 'completed';
      if (activeTab === 'cancelled') return order.status === 'cancelled';
      return true;
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'status-badge status-active';
      case 'in_revision':
        return 'status-badge status-revision';
      case 'completed':
        return 'status-badge status-completed';
      case 'cancelled':
        return 'status-badge status-cancelled';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'in_revision':
        return 'In Revision';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setDeliveryFiles(files);
  };

  const handleSubmitWork = async (orderId) => {
    if (!deliveryMessage.trim()) {
      alert('Please enter a delivery message');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('message', deliveryMessage);
      
      deliveryFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/submit`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Work submitted successfully!');
        setSelectedOrder(null);
        setDeliveryMessage('');
        setDeliveryFiles([]);
        fetchOrders(user.id);
      } else {
        alert(data.message || 'Failed to submit work');
      }
    } catch (error) {
      console.error('Error submitting work:', error);
      alert('Failed to submit work');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredOrders = filterOrders();

  if (loading) {
    return (
      <div className="orders-page">
        <Header />
        <div className="orders-loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Header />
      
      <div className="orders-container">
        <div className="orders-header">
          <h1 className="orders-title">Order Management</h1>
          <p className="orders-subtitle">Manage all your orders in one place</p>
        </div>

        {/* Tabs */}
        <div className="orders-tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active ({orders.filter(o => o.status === 'active').length})
          </button>
          <button
            className={`tab ${activeTab === 'in_revision' ? 'active' : ''}`}
            onClick={() => setActiveTab('in_revision')}
          >
            In Revision ({orders.filter(o => o.status === 'in_revision').length})
          </button>
          <button
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({orders.filter(o => o.status === 'completed').length})
          </button>
          <button
            className={`tab ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled ({orders.filter(o => o.status === 'cancelled').length})
          </button>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="orders-empty">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="35" stroke="#E0E0E0" strokeWidth="2"/>
                <path d="M25 40h30M40 25v30" stroke="#E0E0E0" strokeWidth="2"/>
              </svg>
              <h3>No orders found</h3>
              <p>You don't have any orders in this category yet.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h3 className="order-gig-title">{order.gigTitle}</h3>
                    <p className="order-id">Order ID: {order.orderId}</p>
                  </div>
                  <div className="order-meta">
                    <span className={getStatusBadgeClass(order.status)}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-details">
                    <div className="detail-item">
                      <span className="detail-label">Buyer:</span>
                      <span className="detail-value">{order.buyer.username}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Package:</span>
                      <span className="detail-value">{order.package}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Price:</span>
                      <span className="detail-value">${order.price}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Ordered:</span>
                      <span className="detail-value">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Due Date:</span>
                      <span className="detail-value">
                        {formatDate(order.dueDate)}
                        {order.status === 'active' && (
                          <span className="days-remaining">
                            {' '}({getDaysRemaining(order.dueDate)} days remaining)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {order.description && (
                    <div className="order-description">
                      <strong>Description:</strong>
                      <p>{order.description}</p>
                    </div>
                  )}

                  {order.requirements && (
                    <div className="order-requirements">
                      <strong>Requirements:</strong>
                      <p>{order.requirements}</p>
                    </div>
                  )}

                  {/* Deliverables */}
                  {order.deliverables && order.deliverables.length > 0 && (
                    <div className="order-deliverables">
                      <strong>Deliverables:</strong>
                      {order.deliverables.map((deliverable, index) => (
                        <div key={index} className="deliverable-item">
                          <p>{deliverable.message}</p>
                          <span className="deliverable-date">
                            Submitted: {formatDate(deliverable.submittedAt)}
                          </span>
                          {deliverable.files && deliverable.files.length > 0 && (
                            <div className="deliverable-files">
                              {deliverable.files.map((file, fileIndex) => (
                                <a
                                  key={fileIndex}
                                  href={`http://localhost:5000${file}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="file-link"
                                >
                                  📎 File {fileIndex + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Revision Requests */}
                  {order.revisionRequests && order.revisionRequests.length > 0 && (
                    <div className="order-revisions">
                      <strong>Revision Requests:</strong>
                      {order.revisionRequests.map((revision, index) => (
                        <div key={index} className="revision-item">
                          <p>{revision.message}</p>
                          <span className="revision-date">
                            Requested: {formatDate(revision.requestedAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                {(order.status === 'active' || order.status === 'in_revision') && (
                  <div className="order-card-footer">
                    {selectedOrder === order.orderId ? (
                      <div className="delivery-form">
                        <textarea
                          className="delivery-textarea"
                          placeholder="Enter your delivery message..."
                          value={deliveryMessage}
                          onChange={(e) => setDeliveryMessage(e.target.value)}
                          rows="4"
                        />
                        <div className="delivery-file-input">
                          <label htmlFor={`file-upload-${order.orderId}`} className="file-label">
                            📎 Attach Files (optional)
                          </label>
                          <input
                            id={`file-upload-${order.orderId}`}
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="file-input"
                          />
                          {deliveryFiles.length > 0 && (
                            <span className="file-count">
                              {deliveryFiles.length} file(s) selected
                            </span>
                          )}
                        </div>
                        <div className="delivery-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleSubmitWork(order.orderId)}
                            disabled={submitting}
                          >
                            {submitting ? 'Submitting...' : 'Submit Work'}
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setSelectedOrder(null);
                              setDeliveryMessage('');
                              setDeliveryFiles([]);
                            }}
                            disabled={submitting}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => setSelectedOrder(order.orderId)}
                      >
                        Deliver Work
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;

