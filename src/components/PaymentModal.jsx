// components/PaymentModal.jsx
import React from 'react';

const PaymentModal = ({ isOpen, onClose, paymentUrl }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          width: '90%',
          maxWidth: '600px',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            float: 'right',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        <iframe
          src={paymentUrl}
          style={{
            width: '100%',
            height: '500px',
            border: 'none',
            borderRadius: '8px',
          }}
          title="Stripe Payment"
        />
      </div>
    </div>
  );
};

export default PaymentModal;
