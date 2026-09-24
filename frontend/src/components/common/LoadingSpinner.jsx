import React from 'react';

const LoadingSpinner = ({ text = 'Loading data...' }) => (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p>{text}</p>
  </div>
);

export default LoadingSpinner;
