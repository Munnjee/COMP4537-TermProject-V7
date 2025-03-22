import React, { useEffect, useState } from 'react';
import messages from '../../utils/messages'

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
        <h2 style={{ color: '#ef4444' }}>{messages.ACCESS_DENIED}</h2>
        <p>{messages.ADMIN_ONLY}</p>
        <p>{messages.RETURN_HOME} in {countdown} seconds.</p>
        <div className="modal-buttons">
          <button onClick={onClose}>{messages.RETURN_HOME}</button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedAlert;