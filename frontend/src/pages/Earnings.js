import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import { getCurrentUser } from '../utils/auth';
import './Earnings.css';

const Earnings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactions, setTransactions] = useState([
    {
      date: '9/10/2025',
      activity: 'Withdrawal',
      description: 'Transferred successfully',
      order: '-',
      amount: '-$40.00'
    },
    {
      date: '9/10/2025',
      activity: 'Withdrawal',
      description: 'Transferred successfully',
      order: '-',
      amount: '-$40.00'
    }
  ]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/');
      return;
    }
    if (currentUser.userType === 'buyer' || currentUser.role === 'client') {
      navigate('/gigs');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  const handleCancelWithdraw = () => {
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setSelectedAccount('');
  };

  const handleConfirmWithdraw = () => {
    if (!withdrawAmount || !selectedAccount) {
      alert('Please enter amount and select an account');
      return;
    }
    
    // Add new transaction
    const newTransaction = {
      date: new Date().toLocaleDateString('en-US'),
      activity: 'Withdrawal',
      description: 'Transferred successfully',
      order: '-',
      amount: `-$${withdrawAmount}`
    };
    
    setTransactions([newTransaction, ...transactions]);
    setShowWithdrawModal(false);
    setShowSuccessModal(true);
    setWithdrawAmount('');
    setSelectedAccount('');
  };

  const handleDashboardClick = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="earnings-page">
      <Header />
      
      <div className="earnings-container">
        <div className="earnings-content">
          <h1 className="earnings-title">Overview</h1>
          
          <div className="earnings-cards">
            {/* Available Funds Card */}
            <div className="earnings-card available-funds">
              <h3 className="card-label">Available funds</h3>
              <p className="card-sublabel">Balance available for use</p>
              <div className="card-amount">$0.00</div>
              <p className="card-sublabel-gray">Withdrawn to date:</p>
              <div className="card-amount-gray">$1,479.20</div>
              <button className="withdraw-btn" onClick={handleWithdrawClick}>
                Withdraw
              </button>
            </div>

            {/* Future Payments Card */}
            <div className="earnings-card future-payments">
              <h3 className="card-label">Future payments</h3>
              
              <div className="payment-item">
                <span className="payment-label">Payments being cleared</span>
                <span className="payment-amount">$0.00</span>
              </div>
              
              <div className="payment-item">
                <span className="payment-label">Payments for active orders</span>
                <span className="payment-amount">$0.00</span>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="transactions-table">
            <div className="table-header">
              <div className="table-cell">Date</div>
              <div className="table-cell">Activity</div>
              <div className="table-cell">Description</div>
              <div className="table-cell">Order</div>
              <div className="table-cell">Amount</div>
            </div>
            
            {transactions.map((transaction, index) => (
              <div className="table-row" key={index}>
                <div className="table-cell">{transaction.date}</div>
                <div className="table-cell">{transaction.activity}</div>
                <div className="table-cell">{transaction.description}</div>
                <div className="table-cell">{transaction.order}</div>
                <div className="table-cell">{transaction.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal-content withdraw-modal">
            <h2 className="modal-title">Withdraw balance</h2>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-input"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="$0.00"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Transfer to</label>
                <div className="account-options">
                  <label className="account-option">
                    <input
                      type="radio"
                      name="account"
                      value="easypaisa"
                      checked={selectedAccount === 'easypaisa'}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                    />
                    <span>Easy Paisa Account</span>
                  </label>
                  
                  <label className="account-option">
                    <input
                      type="radio"
                      name="account"
                      value="jazzcash"
                      checked={selectedAccount === 'jazzcash'}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                    />
                    <span>Jazz cash Account</span>
                  </label>
                  
                  <label className="account-option">
                    <input
                      type="radio"
                      name="account"
                      value="payoneer"
                      checked={selectedAccount === 'payoneer'}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                    />
                    <span>Payoneer Account</span>
                  </label>
                  
                  <label className="account-option">
                    <input
                      type="radio"
                      name="account"
                      value="bank"
                      checked={selectedAccount === 'bank'}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                    />
                    <span>Bank Account</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCancelWithdraw}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleConfirmWithdraw}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content success-modal">
            <div className="success-message">
              <h2 className="success-title">Payment transferred</h2>
              <p className="success-subtitle">Successfully</p>
            </div>
            
            <div className="modal-footer">
              <button className="btn-dashboard" onClick={handleDashboardClick}>
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;