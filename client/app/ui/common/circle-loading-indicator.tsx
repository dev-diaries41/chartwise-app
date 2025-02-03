import React from 'react';

const LoadingIndicator = ({ color = '#ffffff', size = 24 }) => {
  return (
    <div
      className="circle-loading-indicator"
      style={{
        color: color,          // Dynamically set color
        width: `${size}px`,     // Adjust size
        height: `${size}px`,
        borderWidth: `${size / 8}px`, // Border width scales with size
      }}
    />
  );
};

export default LoadingIndicator;
