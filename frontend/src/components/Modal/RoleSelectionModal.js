import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './RoleSelectionModal.css';

const RoleSelectionModal = ({ isOpen, onClose, onSelect, username }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleNext = () => {
    if (selectedRole) {
      onSelect(selectedRole);
    }
  };

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container role-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="modal-content role-modal-content">
          <div className="role-modal-header">
            <h2 className="role-modal-title">
              {username}, your account has been created! What brings you to HunarmandPro?
            </h2>
            <p className="role-modal-subtitle">
              We'll tailor your experience to fit your needs.
            </p>
          </div>

          <div className="role-options-container">
            <div className="role-options">
              <div
                className={`role-option ${selectedRole === 'client' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('client')}
              >
                <div className="role-icon">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <rect x="8" y="12" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                    <path d="M20 20L28 28L40 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 36L20 40L24 40L24 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M20 40L20 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="role-option-title">I am a client</h3>
                {selectedRole === 'client' && (
                  <div className="role-checkbox checked">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.667 5L7.5 14.167 3.333 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>

              <div
                className={`role-option ${selectedRole === 'freelancer' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('freelancer')}
              >
                <div className="role-icon">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                    <rect x="8" y="12" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                    <path d="M20 20L28 28L40 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 36L20 40L24 40L24 36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M20 40L20 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="role-option-title">I'm a freelancer</h3>
                {selectedRole === 'freelancer' && (
                  <div className="role-checkbox checked">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.667 5L7.5 14.167 3.333 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <button
              className="role-next-button"
              onClick={handleNext}
              disabled={!selectedRole}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default RoleSelectionModal;

