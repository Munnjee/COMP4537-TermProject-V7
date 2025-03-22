import React, { useEffect, useState } from 'react';

const AccessDeniedAlert = ({ onClose, redirectTimeout = 3 }) => {
  const [countdown, setCountdown] = useState(redirectTimeout);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose, redirectTimeout]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <h2 style={{ color: '#ef4444' }}>Access Denied</h2>
        <p>You do not have administrator privileges to view this page.</p>
        <p>You will be redirected to the homepage in {countdown} seconds.</p>
        <div className="modal-buttons">
          <button onClick={onClose}>Go to Homepage Now</button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedAlert;